import Cookies from 'js-cookie';

const baseURL: string = process.env.NEXT_PUBLIC_API_URL || '';
const timeout: number = 10000;

interface RequestOptions {
  requireAuth?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

const buildHeaders = (
  customHeaders: Record<string, string> = {},
  requireAuth: boolean = false
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (requireAuth) {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Token is required');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const buildURL = (
  url: string,
  params: Record<string, string | number> | null = null
): string => {
  const fullURL = url.startsWith('https') ? url : `${baseURL}${url}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    return `${fullURL}?${searchParams.toString()}`;
  }

  return fullURL;
};

const request = async <T>(
  method: string,
  url: string,
  data: any = null,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    requireAuth = false,
    headers: customHeaders = {},
    params = null,
    signal,
  } = options;

  try {
    const headers = buildHeaders(customHeaders, requireAuth);
    const fullURL = buildURL(url, method === 'GET' ? params : null);

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal,
    };

    if (method !== 'GET' && data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });

    const response = await Promise.race([
      fetch(fullURL, fetchOptions),
      timeoutPromise,
    ]);

    if (!response || !(response instanceof Response)) {
      throw new Error('No response from server');
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {}

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    let responseData: any;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      data: responseData,
      status: response.status,
      ok: response.ok,
    };
  } catch (error: any) {
    if (
      error.message.includes('401') ||
      error.message.includes('Unauthorized')
    ) {
      Cookies.remove('token');
      window.location.href = '/login';
    }

    console.error('API Error:', error.message);
    throw error;
  }
};

const api = {
  get: <T>(url: string, options: RequestOptions = {}) =>
    request<T>('GET', url, null, options),
  post: <T>(url: string, data: any, options: RequestOptions = {}) =>
    request<T>('POST', url, data, options),
  put: <T>(url: string, data: any, options: RequestOptions = {}) =>
    request<T>('PUT', url, data, options),
  patch: <T>(url: string, data: any, options: RequestOptions = {}) =>
    request<T>('PATCH', url, data, options),
  delete: <T>(url: string, options: RequestOptions = {}) =>
    request<T>('DELETE', url, null, options),
};

export default api;
