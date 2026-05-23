// ─── User ──────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  preferences: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  mode_priority: 'balanced' | 'eco' | 'fast' | 'cheap';
  avoid_modes: string[];
  max_walking_minutes: number;
  accessibility: boolean;
  notifications: boolean;
  dark_mode: boolean;
  language: 'fr' | 'en';
}

// ─── Route ─────────────────────────────────────
export interface Route {
  id: number;
  origin_name: string;
  origin_lat: number;
  origin_lng: number;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  distance_meters: number;
  duration_seconds: number;
  carbon_grams: number;
  cost_cents: number;
  modes: TransportMode[];
  steps: RouteStep[];
  duration_formatted?: string;
  distance_formatted?: string;
  carbon_formatted?: string;
}

export interface RouteStep {
  mode: TransportMode;
  duration: number;
  instruction: string;
  line?: string;
}

// ─── Transit ───────────────────────────────────
export interface TransitLine {
  id: number;
  name: string;
  short_name: string;
  type: TransitType;
  color: string;
  text_color: string;
  operator: string;
  is_active: boolean;
  stops_count?: number;
}

export interface TransitStop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: TransitType;
  accessibility: boolean;
  lines?: TransitLine[];
  distance?: number;
}

// ─── Crowd Prediction ──────────────────────────
export interface CrowdPrediction {
  predicted_level: CrowdLevel;
  confidence: number;
  label: string;
  stop_id?: number;
  line_id?: number;
  stop?: { id: number; name: string };
  line?: { id: number; short_name: string; color: string };
}

// ─── Alert ─────────────────────────────────────
export interface Alert {
  id: number;
  line_id: number | null;
  type: 'delay' | 'disruption' | 'maintenance' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  active_from: string;
  active_until: string | null;
  is_active: boolean;
  line?: TransitLine;
}

// ─── Bike Station ──────────────────────────────
export interface BikeStation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  available_bikes: number;
  available_docks: number;
  has_electric: boolean;
  is_active: boolean;
  distance?: number;
}

// ─── Trip ──────────────────────────────────────
export interface Trip {
  id: number;
  user_id: number;
  route_id: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  modes_used: TransportMode[];
  started_at: string | null;
  ended_at: string | null;
  actual_duration_seconds: number | null;
  carbon_saved: number;
  rating: number | null;
  route?: Route;
}

// ─── Stats ─────────────────────────────────────
export interface DashboardStats {
  recent_trips: Trip[];
  month_stats: {
    trips: number;
    carbon_saved_kg: number;
    distance_km: number;
  };
  week_stats: {
    trips: number;
    carbon_saved_kg: number;
  };
  preferences: UserPreferences;
}

export interface CarbonStats {
  total_carbon_saved_grams: number;
  total_carbon_saved_kg: number;
  trees_equivalent: number;
  car_km_avoided: number;
}

// ─── Enums ─────────────────────────────────────
export type TransportMode = 'metro' | 'bus' | 'tram' | 'rer' | 'train' | 'bike' | 'walk' | 'carpool';
export type TransitType = 'metro' | 'bus' | 'tram' | 'rer' | 'train';
export type CrowdLevel = 1 | 2 | 3 | 4 | 5;

// ─── API Response ──────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
