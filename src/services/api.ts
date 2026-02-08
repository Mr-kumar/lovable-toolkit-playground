/**
 * API Service
 * Centralized API configuration with Axios-like interceptors pattern
 */

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Request/Response types
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

// Request interceptor - add auth headers, etc.
const requestInterceptor = (config: RequestInit): RequestInit => {
  const token = localStorage.getItem('auth_token');
  
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config.headers,
    },
  };
};

// Response interceptor - handle errors, transform data
const responseInterceptor = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.detail || errorData.message || 'An error occurred',
      details: errorData,
    } as ApiError;
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
    message: 'Success',
  };
};

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = requestInterceptor(options);
  
  const response = await fetch(url, config);
  return responseInterceptor<T>(response);
}

// API methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
    
  // File upload with multipart form data
  upload: async <T>(endpoint: string, files: File[], additionalData?: Record<string, string>): Promise<ApiResponse<T>> => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`file${index > 0 ? index : ''}`, file);
    });
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    return responseInterceptor<T>(response);
  },
};

// PDF Tool specific endpoints
export const pdfApi = {
  // Organize
  mergePdf: (files: File[], options?: { order?: string }) =>
    api.upload('/pdf/organize/merge', files, options as Record<string, string>),
    
  splitPdf: (file: File, options: { method: string; pages?: string }) =>
    api.upload('/pdf/organize/split', [file], options as Record<string, string>),
    
  // Optimize
  compressPdf: (file: File, options: { level: string; dpi?: string; quality?: string }) =>
    api.upload('/pdf/optimize/compress', [file], options as Record<string, string>),
    
  repairPdf: (file: File) =>
    api.upload('/pdf/optimize/repair', [file]),
    
  ocrPdf: (file: File, options: { language: string }) =>
    api.upload('/pdf/optimize/ocr', [file], options as Record<string, string>),
    
  // Security
  protectPdf: (file: File, options: { password: string }) =>
    api.upload('/pdf/security/protect', [file], options),
    
  unlockPdf: (file: File, options: { password: string }) =>
    api.upload('/pdf/security/unlock', [file], options),
    
  comparePdf: (files: File[]) =>
    api.upload('/pdf/security/compare', files),
    
  // Edit
  rotatePdf: (file: File, options: { angle: string }) =>
    api.upload('/pdf/edit/rotate', [file], options),
    
  watermarkPdf: (file: File, options: { text: string; opacity: string; position: string }) =>
    api.upload('/pdf/edit/watermark', [file], options),
    
  // Convert
  pdfToWord: (file: File) =>
    api.upload('/pdf/convert/to-word', [file]),
    
  pdfToJpg: (file: File, options: { format: string; quality: string }) =>
    api.upload('/pdf/convert/to-image', [file], options),
    
  wordToPdf: (file: File) =>
    api.upload('/pdf/convert/from-word', [file]),
    
  jpgToPdf: (files: File[], options: { pageSize: string; orientation: string }) =>
    api.upload('/pdf/convert/from-image', files, options),
};

export default api;
