import Cookies from 'js-cookie';

const baseURL: string = process.env.NEXT_PUBLIC_API_URL || '';
const defaultTimeout: number = 30000; // Increase to 30 seconds

interface RequestOptions {
  requireAuth?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  signal?: AbortSignal;
  timeout?: number; // ms
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
  // If absolute URL, use as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return params && Object.keys(params).length > 0
      ? `${url}?${new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString()}`
      : url;
  }

  // Allow calling Next.js API routes directly without prefixing baseURL
  const isLocalApiRoute = url.startsWith('/api/');
  const fullURL = isLocalApiRoute ? url : `${baseURL}${url}`;

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
      // If sending FormData, let the browser set the correct Content-Type with boundary
      if (typeof FormData !== 'undefined' && data instanceof FormData) {
        // Remove any preset Content-Type so the browser can set it correctly
        if ('Content-Type' in headers) {
          delete (headers as any)['Content-Type'];
        }
        fetchOptions.body = data as BodyInit;
      } else {
        // Set Content-Type for JSON data
        headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(data);
      }
    }

    // Determine timeout: allow override, and give FormData more time by default
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const effectiveTimeout = options.timeout ?? (isFormData ? 60000 : defaultTimeout);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), effectiveTimeout);
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
      let errorData = null;

      try {
        errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {}

      // Create error object with both message and full error data
      const error = new Error(errorMessage);
      if (errorData) {
        (error as any).data = errorData;
      }
      throw error;
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
