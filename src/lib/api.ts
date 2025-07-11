import axios from 'axios';

// Use relative URL when in development (proxy will handle it)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'http://localhost:3002');

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // This is important for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  cloudinaryId: string;
  url: string;
  width: number;
  height: number;
  category: 'model' | 'dress' | 'result';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TryOnSession {
  _id: string;
  userId: string;
  sessionId: string;
  modelImageId: string | Image;
  dressImageId: string | Image;
  resultImageId?: string | Image;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingStartedAt?: string;
  processingCompletedAt?: string;
  errorMessage?: string;
  metadata: {
    modelImageUrl: string;
    dressImageUrl: string;
    resultImageUrl?: string;
    processingTime?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Auth API
export const authApi = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials),
  
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  
  getProfile: () => api.get<ApiResponse<{ user: User }>>('/auth/profile'),
  
  updateProfile: (updates: { username?: string; email?: string }) =>
    api.put<ApiResponse<{ user: User }>>('/auth/profile', updates),
};

// Upload API
export const uploadApi = {
  uploadImage: (file: File, category: 'model' | 'dress', tags?: string[]) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    if (tags) {
      formData.append('tags', tags.join(','));
    }
    return api.post<ApiResponse<{ image: Image }>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getUserImages: (params?: { category?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Image>>('/upload', { params }),
  
  getImageById: (id: string) => api.get<ApiResponse<{ image: Image }>>(`/upload/${id}`),
  
  deleteImage: (id: string) => api.delete<ApiResponse<null>>(`/upload/${id}`),
};

// Try-On API
export const tryOnApi = {
  createSession: (data: { modelImageId: string; dressImageId: string }) =>
    api.post<ApiResponse<{ session: TryOnSession }>>('/tryOn', data),
  
  getSessions: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<TryOnSession>>('/tryOn', { params }),
  
  getSessionById: (sessionId: string) =>
    api.get<ApiResponse<{ session: TryOnSession }>>(`/tryOn/${sessionId}`),
  
  updateSessionStatus: (sessionId: string, data: { status: string; errorMessage?: string; resultImageId?: string }) =>
    api.put<ApiResponse<{ session: TryOnSession }>>(`/tryOn/${sessionId}/status`, data),
  
  deleteSession: (sessionId: string) =>
    api.delete<ApiResponse<null>>(`/tryOn/${sessionId}`),
  
  downloadResultImage: (sessionId: string) =>
    api.get(`/tryOn/${sessionId}/download`, { responseType: 'blob' }),
  
  getResultImageUrl: (sessionId: string) => 
    `${API_BASE_URL}/api/tryOn/${sessionId}/download`,
  
  getDownloadUrl: (sessionId: string) => 
    `${API_BASE_URL}/api/tryOn/${sessionId}/download`,
};

// User API
export const userApi = {
  getStats: () => api.get<ApiResponse<{ stats: any }>>('/user/stats'),
  
  getActivity: (limit?: number) =>
    api.get<ApiResponse<{ recentImages: Image[]; recentSessions: TryOnSession[] }>>('/user/activity', {
      params: { limit },
    }),
};

export default api; 