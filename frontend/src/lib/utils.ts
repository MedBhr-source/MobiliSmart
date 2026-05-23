import { TransportMode, CrowdLevel } from './types';

/** Format seconds to human-readable duration */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h${remaining.toString().padStart(2, '0')}` : `${hours}h`;
}

/** Format meters to human-readable distance */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Format CO2 grams */
export function formatCarbon(grams: number): string {
  if (grams === 0) return '0 g CO₂';
  if (grams < 1000) return `${grams} g CO₂`;
  return `${(grams / 1000).toFixed(1)} kg CO₂`;
}

/** Format centimes to dirhams (MAD) */
export function formatPrice(cents: number): string {
  if (cents === 0) return 'Gratuit';
  const dh = cents / 100;
  return dh % 1 === 0 ? `${dh} DH` : `${dh.toFixed(2)} DH`;
}

/** Get mode icon name */
export function getModeIcon(mode: TransportMode): string {
  const icons: Record<string, string> = {
    metro: 'Train',
    bus: 'Bus',
    tram: 'Tram',
    rer: 'TrainFront',
    train: 'TrainFront',
    bike: 'Bike',
    walk: 'Footprints',
    carpool: 'Car',
  };
  return icons[mode] || 'MapPin';
}

/** Get mode label in French */
export function getModeLabel(mode: TransportMode): string {
  const labels: Record<string, string> = {
    metro: 'Métro',
    bus: 'Bus',
    tram: 'Tramway',
    rer: 'RER',
    train: 'Train',
    bike: 'Vélo',
    walk: 'Marche',
    carpool: 'Covoiturage',
  };
  return labels[mode] || mode;
}

/** Get mode color class */
export function getModeColor(mode: TransportMode): string {
  const colors: Record<string, string> = {
    metro: 'text-blue-400',
    bus: 'text-emerald-400',
    tram: 'text-pink-400',
    rer: 'text-red-400',
    train: 'text-indigo-400',
    bike: 'text-amber-400',
    walk: 'text-purple-400',
    carpool: 'text-cyan-400',
  };
  return colors[mode] || 'text-surface-400';
}

/** Get crowd level color */
export function getCrowdColor(level: CrowdLevel): string {
  const colors: Record<number, string> = {
    1: 'text-emerald-400',
    2: 'text-green-400',
    3: 'text-yellow-400',
    4: 'text-orange-400',
    5: 'text-red-400',
  };
  return colors[level] || 'text-surface-400';
}

/** Get crowd level label */
export function getCrowdLabel(level: CrowdLevel): string {
  const labels: Record<number, string> = {
    1: 'Vide',
    2: 'Peu fréquenté',
    3: 'Modéré',
    4: 'Fréquenté',
    5: 'Bondé',
  };
  return labels[level] || 'Inconnu';
}

/** Get alert severity color */
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };
  return colors[severity] || '';
}
