/**
 * Utility for handling API error responses
 * Based on the API format: { success: false, message: string, errors: Array<{path: string, message: string}> }
 */

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Extract error message from API error response
 * @param error - The error object from catch block
 * @param defaultMessage - Default message if no specific error found
 * @returns User-friendly error message
 */
export const getApiErrorMessage = (error: any, defaultMessage: string = 'Terjadi kesalahan'): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.message) {
        return parsed.message;
      }
    } catch {
      return error.message;
    }
  }

  if (error?.data?.message) {
    return error.data.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return defaultMessage;
};

/**
 * Extract validation errors from API response
 * @param error - The error object from catch block
 * @returns Array of validation error messages or null
 */
export const getApiValidationErrors = (error: any): string[] | null => {
  let errors: Array<{path: string, message: string}> | null = null;

  if (error?.data?.errors) {
    errors = error.data.errors;
  } 
  else if (error?.response?.data?.errors) {
    errors = error.response.data.errors;
  } 
  else if (error?.errors) {
    errors = error.errors;
  } 
  else if (error?.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.errors) {
        errors = parsed.errors;
      }
    } catch {
    }
  }

  if (!errors || !Array.isArray(errors)) {
    return null;
  }

  return errors.map(err => err.message);
};

/**
 * Get the most appropriate error message to display
 * Prioritizes validation errors over general messages
 * @param error - The error object from catch block
 * @param defaultMessage - Default message if no specific error found
 * @returns User-friendly error message
 */
export const getDisplayErrorMessage = (error: any, defaultMessage: string = 'Terjadi kesalahan'): string => {
  
  const validationErrors = getApiValidationErrors(error);
  
  if (validationErrors && validationErrors.length > 0) {
    const result = validationErrors.length === 1 ? validationErrors[0] : validationErrors.join(', ');
    return result;
  }

  const generalMessage = getApiErrorMessage(error, defaultMessage);
  return generalMessage;
};
