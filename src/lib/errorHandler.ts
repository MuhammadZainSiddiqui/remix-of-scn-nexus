import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): string => {
  const axiosError = error as { response?: { data?: { message?: string; details?: Record<string, string[]> }; status?: number }; message?: string };
  
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }
  
  if (axiosError.response?.status === 400) {
    return 'Invalid request. Please check your input.';
  }
  
  if (axiosError.response?.status === 401) {
    return 'Session expired. Please login again.';
  }
  
  if (axiosError.response?.status === 403) {
    return 'You do not have permission to access this resource.';
  }
  
  if (axiosError.response?.status === 404) {
    return 'Resource not found.';
  }
  
  if (axiosError.response?.status === 422) {
    const details = axiosError.response.data?.details;
    if (details) {
      const firstError = Object.values(details)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }
    return 'Validation error. Please check your input.';
  }
  
  if (axiosError.response?.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  if (axiosError.response?.status === 503) {
    return 'Service temporarily unavailable. Please try again later.';
  }
  
  if (axiosError.message) {
    if (axiosError.message.includes('Network Error')) {
      return 'Unable to connect to server. Please check your connection.';
    }
    return axiosError.message;
  }
  
  return 'An unexpected error occurred.';
};

export const showErrorToast = (error: unknown, title: string = 'Error') => {
  const message = handleApiError(error);
  toast.error(title, {
    description: message,
  });
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};

export const showWarningToast = (message: string) => {
  toast.warning(message);
};
