'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Search, Clock, Leaf, Coins, Train, Bus,
  Bike, Footprints, RotateCcw, Loader2, Bookmark, ArrowLeft,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { formatDuration, formatDistance, formatCarbon, formatPrice, getModeLabel } from '@/lib/utils';
import { TransportMode, Route } from '@/lib/types';
import Map from '@/components/Map';

const DEMO_ROUTES: Route[] = [
  {
    id: 1, origin_name: 'Casa-Voyageurs', origin_lat: 33.5892, origin_lng: -7.5891,
    destination_name: 'Morocco Mall', destination_lat: 33.5731, destination_lng: -7.6609,
    distance_meters: 8500, duration_seconds: 1800, carbon_grams: 22, cost_cents: 600,
    modes: ['walk', 'tram', 'walk'],
    steps: [
      { mode: 'walk', duration: 180, instruction: 'Marcher jusqu\'à la station Tramway T1' },
      { mode: 'tram', duration: 1380, instruction: 'Tramway T1 → Ain Diab' },
      { mode: 'walk', duration: 240, instruction: 'Marcher jusqu\'à Morocco Mall' },
    ],
  },
  {
    id: 2, origin_name: 'Casa-Voyageurs', origin_lat: 33.5892, origin_lng: -7.5891,
    destination_name: 'Morocco Mall', destination_lat: 33.5731, destination_lng: -7.6609,
    distance_meters: 8500, duration_seconds: 2400, carbon_grams: 0, cost_cents: 300,
    modes: ['walk', 'bike', 'walk'],
    steps: [
      { mode: 'walk', duration: 120, instruction: 'Marcher vers station Medina Bike' },
      { mode: 'bike', duration: 2100, instruction: 'Vélo → Corniche Ain Diab' },
      { mode: 'walk', duration: 180, instruction: 'Marcher à destination' },
    ],
  },
  {
    id: 3, origin_name: 'Casa-Voyageurs', origin_lat: 33.5892, origin_lng: -7.5891,
    destination_name: 'Morocco Mall', destination_lat: 33.5731, destination_lng: -7.6609,
    distance_meters: 8500, duration_seconds: 1620, carbon_grams: 55, cost_cents: 600,
    modes: ['walk', 'tram', 'bus', 'walk'],
    steps: [
      { mode: 'walk', duration: 120, instruction: 'Marcher à la station T1' },
      { mode: 'tram', duration: 900, instruction: 'Tramway T1 → Bd Zerktouni' },
      { mode: 'bus', duration: 480, instruction: 'Bus L35 → Ain Diab' },
      { mode: 'walk', duration: 120, instruction: 'Marcher à Morocco Mall' },
    ],
  },
];

const PRIORITIES = [
  { key: 'balanced', label: 'Équilibré', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { key: 'fast', label: 'Rapide', icon: <Clock className="w-4 h-4" /> },
  { key: 'eco', label: 'Écolo', icon: <Leaf className="w-4 h-4" /> },
  { key: 'cheap', label: 'Éco €', icon: <Coins className="w-4 h-4" /> },
];

function modeIcon(m: string) {
  if (m === 'metro' || m === 'rer' || m === 'tram' || m === 'train') return <Train className="w-4 h-4" />;
  if (m === 'bus') return <Bus className="w-4 h-4" />;
  if (m === 'bike') return <Bike className="w-4 h-4" />;
  return <Footprints className="w-4 h-4" />;
}

function badgeCls(m: string) {
  const map: Record<string, string> = {
    metro: 'mode-badge-metro', bus: 'mode-badge-bus', tram: 'mode-badge-tram',
    bike: 'mode-badge-bike', walk: 'mode-badge-walk', train: 'mode-badge-metro',
  };
  return map[m] || 'mode-badge-walk';
}

import { routeApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PlanPage() {
  const [origin, setOrigin] = useState('Casa-Voyageurs');
  const [dest, setDest] = useState('Morocco Mall');
  const [priority, setPriority] = useState('balanced');
  const [routes, setRoutes] = useState<Route[]>(DEMO_ROUTES);
  const [selected, setSelected] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);

  const geocode = async (query: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Casablanca, Maroc')}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch (e) {}
    // Fallback coordinates (Casablanca center)
    return { lat: 33.5731 + (Math.random() - 0.5) * 0.03, lng: -7.5898 + (Math.random() - 0.5) * 0.03 };
  };

  const handleSearch = useCallback(async () => {
    if (!origin || !dest) return toast.error('Veuillez entrer le départ et la destination');
    setLoading(true); setSelected(null);
    try {
      const startCoord = await geocode(origin);
      const endCoord = await geocode(dest);
      
      const res = await routeApi.plan({
        origin_lat: startCoord.lat, origin_lng: startCoord.lng, origin_name: origin,
        destination_lat: endCoord.lat, destination_lng: endCoord.lng, destination_name: dest,
        mode_priority: priority
      });
      if (res.data?.data?.routes?.length > 0) {
        setRoutes(res.data.data.routes);
      } else {
        setRoutes([]);
        toast.error('Aucun itinéraire trouvé');
      }
    } catch (err: any) {
      console.error("API Error:", err.response?.data || err.message);
      setRoutes([]);
      toast.error('Erreur de connexion au serveur API');
    }
    setLoading(false);
  }, [origin, dest, priority]);

  return (
    <div className="min-h-screen bg-[#050a18]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050a18]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-300" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-display font-bold text-lg text-white">Planifier</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Search + Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-5 space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-400 ring-4 ring-brand-400/20" />
                <input value={origin} onChange={e => setOrigin(e.target.value)}
                  placeholder="Point de départ" className="input-glass !pl-10" id="search-origin" />
              </div>
              <div className="flex justify-center">
                <button onClick={() => { setOrigin(dest); setDest(origin); }}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <RotateCcw className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                <input value={dest} onChange={e => setDest(e.target.value)}
                  placeholder="Destination" className="input-glass !pl-10" id="search-dest" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PRIORITIES.map(p => (
                  <button key={p.key} onClick={() => setPriority(p.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      priority === p.key ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                        : 'bg-white/5 text-surface-400 border border-white/5 hover:bg-white/8'
                    }`}>{p.icon}{p.label}</button>
                ))}
              </div>
              <button onClick={handleSearch} disabled={loading}
                className="btn-brand w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {/* Route cards */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card p-5 shimmer h-32" />)}</div>
              ) : (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
                  {routes.map((r, i) => (
                    <motion.div key={r.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                      transition={{delay:i*0.1}} onClick={() => setSelected(r)}
                      className={`glass-card p-5 cursor-pointer transition-all duration-300 ${
                        selected?.id === r.id ? 'border-brand-400/40 shadow-lg shadow-brand-500/10' : 'hover:border-white/15'
                      }`}>
                      {i === 0 && <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mb-3 text-brand-400 bg-brand-500/10 border-brand-500/20">⚡ Le plus rapide</div>}
                      {r.carbon_grams === 0 && i > 0 && <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mb-3 text-emerald-400 bg-emerald-500/10 border-emerald-500/20">🌱 Le plus vert</div>}
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-display font-bold text-white">{formatDuration(r.duration_seconds)}</div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">{formatPrice(r.cost_cents)}</div>
                          <div className="text-xs text-surface-400">{formatDistance(r.distance_meters)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        {[...new Set(r.modes)].map((m, j) => (
                          <span key={j} className={badgeCls(m)}>{modeIcon(m)}{getModeLabel(m as TransportMode)}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Leaf className={`w-3.5 h-3.5 ${r.carbon_grams === 0 ? 'text-emerald-400' : 'text-surface-400'}`} />
                        <span className={r.carbon_grams === 0 ? 'text-emerald-400 font-medium' : 'text-surface-400'}>{formatCarbon(r.carbon_grams)}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Map + Detail */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card overflow-hidden h-[400px] lg:h-[500px] relative">
              <Map 
                markers={selected ? [
                  { lng: selected.origin_lng, lat: selected.origin_lat, label: 'Départ', color: '#3b82f6' },
                  { lng: selected.destination_lng, lat: selected.destination_lat, label: 'Arrivée', color: '#10b981' }
                ] : []}
              />
              {selected && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-card-light p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-brand-400" />
                      <span className="text-sm font-medium text-white">{selected.origin_name} → {selected.destination_name}</span>
                    </div>
                    <span className="text-sm font-bold text-brand-400">{formatDuration(selected.duration_seconds)}</span>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selected && (
                <motion.div key={selected.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
                  className="glass-card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-lg font-bold text-white">Détail de l&apos;itinéraire</h2>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors"><Bookmark className="w-5 h-5 text-surface-400" /></button>
                  </div>
                  <div className="space-y-0">
                    {selected.steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.mode === 'walk' ? 'bg-purple-500/15 text-purple-400' :
                            step.mode === 'metro' ? 'bg-blue-500/15 text-blue-400' :
                            step.mode === 'bus' ? 'bg-emerald-500/15 text-emerald-400' :
                            'bg-amber-500/15 text-amber-400'
                          }`}>{modeIcon(step.mode)}</div>
                          {i < selected.steps.length - 1 && <div className="w-px h-8 bg-white/10 my-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white font-medium">{step.instruction}</p>
                            <span className="text-xs text-surface-400 whitespace-nowrap ml-2">{formatDuration(step.duration)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                    <div><div className="text-xs text-surface-400 mb-1">Durée</div><div className="text-sm font-bold text-white">{formatDuration(selected.duration_seconds)}</div></div>
                    <div><div className="text-xs text-surface-400 mb-1">CO₂</div><div className={`text-sm font-bold ${selected.carbon_grams===0?'text-emerald-400':'text-white'}`}>{formatCarbon(selected.carbon_grams)}</div></div>
                    <div><div className="text-xs text-surface-400 mb-1">Coût</div><div className="text-sm font-bold text-white">{formatPrice(selected.cost_cents)}</div></div>
                  </div>
                  <button 
                    onClick={() => {
                      toast.success('Trajet démarré ! Redirection vers la carte en direct...');
                      setTimeout(() => window.location.href = '/live', 1500);
                    }}
                    className="btn-brand w-full mt-5 flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5" />Démarrer ce trajet
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
