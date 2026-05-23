import axios from 'axios';
import type {
  ApiResponse, User, Route, TransitLine, TransitStop,
  Alert, BikeStation, CrowdPrediction, Trip, DashboardStats, CarbonStats,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

// Interceptor: attach auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// ─── User ──────────────────────────────────────
export const userApi = {
  profile: () => api.get<ApiResponse<{ user: User; stats: any }>>('/user/profile'),
  updateProfile: (data: Partial<User>) => api.put<ApiResponse<{ user: User }>>('/user/profile', data),
  updatePreferences: (data: Record<string, any>) => api.put('/user/preferences', data),
};

// ─── Transit ───────────────────────────────────
export const transitApi = {
  lines: (type?: string) => api.get<ApiResponse<TransitLine[]>>('/transit/lines', { params: { type } }),
  stops: (lineId?: number) => api.get<ApiResponse<TransitStop[]>>('/transit/stops', { params: { line_id: lineId } }),
  nearbyStops: (lat: number, lng: number, radius?: number) =>
    api.get<ApiResponse<TransitStop[]>>('/transit/stops/nearby', { params: { lat, lng, radius } }),
  alerts: (lineId?: number) => api.get<ApiResponse<Alert[]>>('/transit/alerts', { params: { line_id: lineId } }),
};

// ─── Routes ────────────────────────────────────
export const routeApi = {
  plan: (data: {
    origin_lat: number; origin_lng: number; origin_name?: string;
    destination_lat: number; destination_lng: number; destination_name?: string;
    mode_priority?: string;
  }) => api.post<ApiResponse<{ routes: Route[] }>>('/routes/plan', data),
  saved: () => api.get<ApiResponse<Route[]>>('/routes/saved'),
  toggleSave: (routeId: number) => api.post(`/routes/${routeId}/save`),
};

// ─── Bikes ─────────────────────────────────────
export const bikeApi = {
  stations: () => api.get<ApiResponse<BikeStation[]>>('/bikes/stations'),
  nearby: (lat: number, lng: number, radius?: number) =>
    api.get<ApiResponse<BikeStation[]>>('/bikes/stations/nearby', { params: { lat, lng, radius } }),
};

// ─── Crowd ─────────────────────────────────────
export const crowdApi = {
  predict: (params: { stop_id?: number; line_id?: number; datetime?: string }) =>
    api.get<ApiResponse<{ predictions: CrowdPrediction[] }>>('/crowd/predict', { params }),
};

// ─── Trips ─────────────────────────────────────
export const tripApi = {
  list: () => api.get<ApiResponse<{ data: Trip[] }>>('/trips'),
  create: (data: { route_id: number; modes_used?: string[] }) =>
    api.post<ApiResponse<Trip>>('/trips', data),
  update: (id: number, data: { status?: string; rating?: number; feedback?: string }) =>
    api.put<ApiResponse<Trip>>(`/trips/${id}`, data),
  stats: (period?: string) => api.get<ApiResponse<any>>('/trips/stats', { params: { period } }),
};

// ─── Stats ─────────────────────────────────────
export const statsApi = {
  carbon: () => api.get<ApiResponse<CarbonStats>>('/stats/carbon'),
  dashboard: () => api.get<ApiResponse<DashboardStats>>('/stats/dashboard'),
};

export default api;
