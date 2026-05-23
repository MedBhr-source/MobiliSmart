'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  markers?: Array<{ lng: number; lat: number; label?: string; color?: string }>;
  route?: [number, number][]; 
  className?: string;
}

export default function Map({ 
  center = [-7.5898, 33.5731], 
  zoom = 12, 
  markers = [], 
  route = [],
  className = '' 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerObjects = useRef<mapboxgl.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // 1. Initialize Map
  useEffect(() => {
    if (!token || token.includes('YOUR_MAPBOX_TOKEN')) {
      setTokenError(true);
      return;
    }

    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = token;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    m.on('load', () => {
      map.current = m;
      setIsMapReady(true);
    });

    m.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markerObjects.current.forEach(marker => marker.remove());
      m.remove();
      map.current = null;
      setIsMapReady(false);
    };
  }, [token]);

  // 2. Update Markers safely
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Remove old markers
    markerObjects.current.forEach(m => m.remove());
    markerObjects.current = [];

    // Add new markers
    markers.forEach(m => {
      try {
        const marker = new mapboxgl.Marker({ color: m.color || '#3b82f6' })
          .setLngLat([m.lng, m.lat]);
        
        if (m.label) {
          marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${m.label}</b>`));
        }
        
        marker.addTo(map.current!);
        markerObjects.current.push(marker);
      } catch (err) {
        console.error("Error adding marker:", err);
      }
    });

    // Auto-zoom to fit markers
    if (markers.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(m => bounds.extend([m.lng, m.lat]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
    }
  }, [markers, isMapReady]);

  if (tokenError) {
    return (
      <div className="flex items-center justify-center h-full bg-surface-900 text-surface-400 p-6 text-center">
        <div>
          <p className="font-bold text-red-400 mb-2">Configuration Mapbox manquante</p>
          <p className="text-xs">Veuillez vérifier votre token dans le fichier .env</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={`w-full h-full min-h-[300px] ${className}`} />;
}
