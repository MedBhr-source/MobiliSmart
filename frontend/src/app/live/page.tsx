'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Navigation, Zap, AlertTriangle, Info, Clock,
  Train, Bus, Bike, MapPin, RefreshCw, Bell, Wifi, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const DEMO_ALERTS = [
  { id: 1, type: 'disruption', severity: 'high', title: 'Interruption Tramway T1', message: 'Trafic interrompu entre Sidi Moumen et Hay Hassani suite à un incident technique. Bus de remplacement.', line: { short_name: 'T1', color: '#E2231A' }, time: 'Il y a 2h' },
  { id: 2, type: 'delay', severity: 'medium', title: 'Ralentissement Bus L35', message: 'Embouteillage Bd Zerktouni. Temps d\'attente +10 min.', line: { short_name: '35', color: '#00A85A' }, time: 'Il y a 45 min' },
  { id: 3, type: 'info', severity: 'low', title: 'Tramway T2 — Service normal', message: 'Le trafic est fluide sur l\'ensemble de la ligne Ain Diab – Sidi Bernoussi.', line: { short_name: 'T2', color: '#007DC5' }, time: 'Maintenant' },
  { id: 4, type: 'maintenance', severity: 'medium', title: 'Travaux Al Boraq', message: 'Travaux de maintenance entre Casa-Voyageurs et Kénitra. Service réduit ce week-end.', line: { short_name: 'AB', color: '#C60C30' }, time: 'Il y a 5h' },
];

const DEMO_LINES = [
  { id: 1, name: 'Tramway T1', short_name: 'T1', type: 'tram', color: '#E2231A', textColor: '#FFF', status: 'perturbé', crowd: 4, terminus_a: 'Sidi Moumen', terminus_b: 'Lissasfa', wait_a: 5, wait_b: 8 },
  { id: 2, name: 'Tramway T2', short_name: 'T2', type: 'tram', color: '#007DC5', textColor: '#FFF', status: 'normal', crowd: 3, terminus_a: 'Ain Diab', terminus_b: 'Sidi Bernoussi', wait_a: 3, wait_b: 4 },
  { id: 3, name: 'Al Boraq', short_name: 'AB', type: 'train', color: '#C60C30', textColor: '#FFF', status: 'normal', crowd: 2, terminus_a: 'Casa-Voyageurs', terminus_b: 'Tanger-Ville', wait_a: 45, wait_b: 50 },
  { id: 4, name: 'Train ONCF', short_name: 'TN', type: 'train', color: '#1D4289', textColor: '#FFF', status: 'normal', crowd: 3, terminus_a: 'Casa-Voyageurs', terminus_b: 'Marrakech', wait_a: 30, wait_b: 35 },
  { id: 5, name: 'Bus L33', short_name: '33', type: 'bus', color: '#00A85A', textColor: '#FFF', status: 'normal', crowd: 3, terminus_a: 'Hay Hassani', terminus_b: 'Ain Sebaa', wait_a: 8, wait_b: 12 },
  { id: 6, name: 'Bus L35', short_name: '35', type: 'bus', color: '#FF7E2E', textColor: '#FFF', status: 'perturbé', crowd: 5, terminus_a: 'Bd Zerktouni', terminus_b: 'Derb Sultan', wait_a: 15, wait_b: '--' },
  { id: 7, name: 'Bus L90', short_name: '90', type: 'bus', color: '#6ECA97', textColor: '#000', status: 'normal', crowd: 2, terminus_a: 'Gare Routière', terminus_b: 'Aéroport Mohammed V', wait_a: 20, wait_b: 25 },
  { id: 8, name: 'Tramway T3', short_name: 'T3', type: 'tram', color: '#62259D', textColor: '#FFF', status: 'normal', crowd: 2, terminus_a: 'Bernoussi', terminus_b: 'Hay Hassani', wait_a: 6, wait_b: 7 },
];

const DEMO_BIKES = [
  { id: 1, name: 'Corniche Ain Diab', available: 15, capacity: 40, electric: 5 },
  { id: 2, name: 'Place Mohammed V', available: 8, capacity: 30, electric: 3 },
  { id: 3, name: 'Gare Casa-Voyageurs', available: 22, capacity: 50, electric: 10 },
  { id: 4, name: 'Morocco Mall', available: 18, capacity: 35, electric: 6 },
  { id: 5, name: 'Habous - Quartier des Habous', available: 10, capacity: 25, electric: 2 },
];

function severityStyle(s: string) {
  if (s === 'critical') return 'border-red-500/30 bg-red-500/8';
  if (s === 'high') return 'border-orange-500/30 bg-orange-500/8';
  if (s === 'medium') return 'border-yellow-500/30 bg-yellow-500/8';
  return 'border-blue-500/30 bg-blue-500/8';
}
function severityIcon(s: string) {
  if (s === 'high' || s === 'critical') return <AlertTriangle className="w-5 h-5 text-orange-400" />;
  if (s === 'medium') return <Clock className="w-5 h-5 text-yellow-400" />;
  return <Info className="w-5 h-5 text-blue-400" />;
}
function crowdBar(level: number) {
  const colors = ['', 'bg-emerald-400', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400'];
  return Array.from({ length: 5 }, (_, i) => (
    <div key={i} className={`h-3 w-2 rounded-sm ${i < level ? colors[level] : 'bg-white/10'}`} />
  ));
}
function statusBadge(s: string) {
  if (s === 'interrompu') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">Interrompu</span>;
  if (s === 'perturbé') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">Perturbé</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Normal</span>;
}

export default function LivePage() {
  const [tab, setTab] = useState<'alerts' | 'lines' | 'bikes'>('lines');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [expandedLine, setExpandedLine] = useState<number | null>(null);

  useEffect(() => {
    setLastUpdate(new Date());
    const interval = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050a18]">
      <header className="sticky top-0 z-50 bg-[#050a18]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors"><ArrowLeft className="w-5 h-5 text-surface-300" /></Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <h1 className="font-display font-bold text-lg text-white">Temps Réel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mis à jour {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
            </div>
            <button onClick={() => setLastUpdate(new Date())} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <RefreshCw className="w-4 h-4 text-surface-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'lines' as const, label: 'Lignes', icon: <Train className="w-4 h-4" />, count: DEMO_LINES.length },
            { key: 'alerts' as const, label: 'Alertes', icon: <Bell className="w-4 h-4" />, count: DEMO_ALERTS.length },
            { key: 'bikes' as const, label: 'Vélos', icon: <Bike className="w-4 h-4" />, count: DEMO_BIKES.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-surface-400 border border-white/5 hover:bg-white/8'
              }`}>
              {t.icon}{t.label}
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Lines Tab */}
        {tab === 'lines' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_LINES.map((line, i) => (
              <motion.div key={line.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="glass-card p-4 group cursor-pointer"
                onClick={() => setExpandedLine(expandedLine === line.id ? null : line.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ backgroundColor: line.color, color: line.textColor }}>
                    {line.short_name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white truncate">{line.name}</span>
                      {statusBadge(line.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-surface-400">Affluence</span>
                      <div className="flex gap-0.5">{crowdBar(line.crowd)}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-surface-500 transition-all shrink-0 ${expandedLine === line.id ? 'rotate-90 text-white' : 'group-hover:text-surface-300'}`} />
                </div>
                {expandedLine === line.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-white/5 space-y-3 overflow-hidden">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-surface-300">Dir. {line.terminus_a}</span>
                      <span className="font-bold text-emerald-400">{line.wait_a} {line.wait_a !== '--' && 'min'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-surface-300">Dir. {line.terminus_b}</span>
                      <span className="font-bold text-brand-400">{line.wait_b} {line.wait_b !== '--' && 'min'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-surface-400 mt-2 bg-white/5 p-2 rounded-lg">
                      <Info className="w-4 h-4 text-brand-400 shrink-0" />
                      Ces données sont des estimations (Mode Démo).
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Alerts Tab */}
        {tab === 'alerts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {DEMO_ALERTS.map((alert, i) => (
              <motion.div key={alert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className={`glass-card p-5 border ${severityStyle(alert.severity)}`}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5">{severityIcon(alert.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: alert.line.color, color: '#fff' }}>
                        {alert.line.short_name}
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{alert.title}</h3>
                    </div>
                    <p className="text-xs text-surface-300 leading-relaxed">{alert.message}</p>
                    <span className="text-[10px] text-surface-500 mt-2 block">{alert.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bikes Tab */}
        {tab === 'bikes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_BIKES.map((station, i) => {
              const pct = Math.round((station.available / station.capacity) * 100);
              return (
                <motion.div key={station.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }} className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{station.name}</h3>
                      <p className="text-xs text-surface-400">{station.capacity} places</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-400">Disponibilité</span>
                      <span className={pct > 30 ? 'text-emerald-400' : pct > 10 ? 'text-yellow-400' : 'text-red-400'}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct > 30 ? 'bg-emerald-400' : pct > 10 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-300"><strong className="text-white">{station.available}</strong> vélos</span>
                    <span className="text-surface-300"><strong className="text-amber-400">⚡ {station.electric}</strong> électriques</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
