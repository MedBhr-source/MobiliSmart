'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft, Navigation, Leaf, BarChart3, Clock, Route, TreePine, Car,
  TrendingUp, Calendar, Award, MapPin, ChevronRight, Train, Bike, Bus
} from 'lucide-react';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const RECENT_TRIPS = [
  { id: 1, origin: 'Gare du Nord', dest: 'Tour Eiffel', modes: ['metro', 'walk'], duration: '27 min', carbon: '18g CO₂', date: 'Aujourd\'hui' },
  { id: 2, origin: 'République', dest: 'La Défense', modes: ['metro', 'rer'], duration: '35 min', carbon: '22g CO₂', date: 'Hier' },
  { id: 3, origin: 'Bastille', dest: 'Montmartre', modes: ['bike'], duration: '22 min', carbon: '0g CO₂', date: 'Lun. 28' },
  { id: 4, origin: 'Opéra', dest: 'Bercy', modes: ['bus', 'walk'], duration: '18 min', carbon: '34g CO₂', date: 'Dim. 27' },
];

function tripModeIcon(m: string) {
  if (m === 'metro' || m === 'rer') return <Train className="w-3.5 h-3.5" />;
  if (m === 'bus') return <Bus className="w-3.5 h-3.5" />;
  if (m === 'bike') return <Bike className="w-3.5 h-3.5" />;
  return <MapPin className="w-3.5 h-3.5" />;
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050a18]">
      <header className="sticky top-0 z-50 bg-[#050a18]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors"><ArrowLeft className="w-5 h-5 text-surface-300" /></Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
            <h1 className="font-display font-bold text-lg text-white">Tableau de bord</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Welcome */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="font-display text-2xl font-bold text-white mb-1">Bonjour, Demo 👋</h2>
            <p className="text-surface-400 text-sm">Voici votre impact mobilité cette semaine</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Route className="w-5 h-5" />, value: '24', label: 'Trajets ce mois', color: 'text-brand-400', bg: 'bg-brand-500/10' },
              { icon: <Leaf className="w-5 h-5" />, value: '1.8 kg', label: 'CO₂ économisé', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: <Clock className="w-5 h-5" />, value: '23 min', label: 'Durée moyenne', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { icon: <TrendingUp className="w-5 h-5" />, value: '+12%', label: 'vs mois dernier', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
                <div className="text-2xl font-display font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-surface-400">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carbon Impact */}
            <motion.div variants={fadeUp} className="lg:col-span-1 glass-card p-6">
              <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" /> Impact carbone
              </h3>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-3">
                    <div><div className="text-2xl font-display font-bold text-emerald-400">1.8</div><div className="text-[10px] text-emerald-300">kg CO₂</div></div>
                  </div>
                  <p className="text-xs text-surface-400 mt-2">Économisé ce mois</p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: <TreePine className="w-4 h-4 text-emerald-400" />, value: '0.1', label: 'Arbres équivalents' },
                    { icon: <Car className="w-4 h-4 text-red-400" />, value: '15 km', label: 'Trajet voiture évité' },
                    { icon: <Award className="w-4 h-4 text-amber-400" />, value: 'Or', label: 'Niveau éco-citoyen' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                      {item.icon}
                      <div className="flex-1"><div className="text-xs text-surface-400">{item.label}</div></div>
                      <span className="text-sm font-bold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Trips */}
            <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-400" /> Derniers trajets
                </h3>
                <Link href="/plan" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                  Tout voir <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {RECENT_TRIPS.map((trip, i) => (
                  <motion.div key={trip.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{trip.origin} → {trip.dest}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex gap-1">
                          {trip.modes.map((m, j) => <span key={j} className="text-surface-400">{tripModeIcon(m)}</span>)}
                        </div>
                        <span className="text-xs text-surface-500">·</span>
                        <span className="text-xs text-surface-400">{trip.duration}</span>
                        <span className="text-xs text-surface-500">·</span>
                        <span className="text-xs text-emerald-400">{trip.carbon}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-surface-500">{trip.date}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-surface-300 transition-colors shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* Weekly chart placeholder */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <h4 className="text-xs text-surface-400 mb-3">Trajets cette semaine</h4>
                <div className="flex items-end gap-2 h-20">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
                    const heights = [60, 80, 45, 90, 70, 30, 20];
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-md bg-brand-500/30 transition-all hover:bg-brand-500/50"
                          style={{ height: `${heights[i]}%` }} />
                        <span className="text-[10px] text-surface-500">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
