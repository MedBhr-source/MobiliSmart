'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Settings, Bell, Moon, Globe, Shield,
  Leaf, Clock, Bike, Train, Bus, Footprints, Save, LogOut, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function ProfilePage() {
  const [prefs, setPrefs] = useState({
    mode_priority: 'eco',
    max_walking: 15,
    notifications: true,
    dark_mode: true,
    language: 'fr',
    accessibility: false,
    avoid_modes: [] as string[],
  });

  const toggleAvoid = (mode: string) => {
    setPrefs(p => ({
      ...p,
      avoid_modes: p.avoid_modes.includes(mode)
        ? p.avoid_modes.filter(m => m !== mode)
        : [...p.avoid_modes, mode],
    }));
  };

  return (
    <div className="min-h-screen bg-[#050a18]">
      <header className="sticky top-0 z-50 bg-[#050a18]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-surface-300" />
          </Link>
          <h1 className="font-display font-bold text-lg text-white">Mon profil</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
          {/* Avatar card */}
          <motion.div variants={fadeUp} className="glass-card p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-bold text-xl shrink-0">
              DU
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg font-bold text-white">Demo User</h2>
              <p className="text-sm text-surface-400 truncate">demo@mobilismart.app</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Éco-citoyen Or</span>
              </div>
            </div>
          </motion.div>

          {/* Priority */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-400" /> Priorité de trajet
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'balanced', label: 'Équilibré', desc: 'Meilleur compromis', icon: <Settings className="w-5 h-5" />, color: 'brand' },
                { key: 'fast', label: 'Rapide', desc: 'Le plus court', icon: <Clock className="w-5 h-5" />, color: 'amber' },
                { key: 'eco', label: 'Écologique', desc: 'Moins de CO₂', icon: <Leaf className="w-5 h-5" />, color: 'emerald' },
                { key: 'cheap', label: 'Économique', desc: 'Moins cher', icon: <Shield className="w-5 h-5" />, color: 'purple' },
              ].map(p => (
                <button key={p.key} onClick={() => setPrefs(pr => ({ ...pr, mode_priority: p.key }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    prefs.mode_priority === p.key
                      ? `bg-${p.color}-500/15 border-${p.color}-500/30 shadow-lg`
                      : 'bg-white/3 border-white/5 hover:bg-white/5'
                  }`}>
                  <div className={`mb-2 ${prefs.mode_priority === p.key ? `text-${p.color}-400` : 'text-surface-400'}`}>{p.icon}</div>
                  <div className="text-sm font-semibold text-white">{p.label}</div>
                  <div className="text-xs text-surface-400">{p.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Avoid modes */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-display font-bold text-white mb-4">Modes à éviter</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'metro', label: 'Métro', icon: <Train className="w-4 h-4" /> },
                { key: 'bus', label: 'Bus', icon: <Bus className="w-4 h-4" /> },
                { key: 'bike', label: 'Vélo', icon: <Bike className="w-4 h-4" /> },
                { key: 'walk', label: 'Marche', icon: <Footprints className="w-4 h-4" /> },
              ].map(m => (
                <button key={m.key} onClick={() => toggleAvoid(m.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    prefs.avoid_modes.includes(m.key)
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30 line-through'
                      : 'bg-white/5 text-surface-300 border border-white/5 hover:bg-white/8'
                  }`}>
                  {m.icon}{m.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Walking distance */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="font-display font-bold text-white mb-4">Distance de marche max</h3>
            <div className="flex items-center gap-4">
              <input type="range" min={5} max={30} step={5} value={prefs.max_walking}
                onChange={e => setPrefs(p => ({ ...p, max_walking: +e.target.value }))}
                className="flex-1 accent-brand-400 h-2" />
              <span className="text-lg font-bold text-brand-400 w-16 text-right">{prefs.max_walking} min</span>
            </div>
            <div className="flex justify-between text-xs text-surface-500 mt-1 px-1">
              <span>5 min</span><span>30 min</span>
            </div>
          </motion.div>

          {/* Toggles */}
          <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold text-white mb-2">Préférences</h3>
            {[
              { key: 'notifications', label: 'Notifications push', desc: 'Alertes et perturbations', icon: <Bell className="w-5 h-5 text-amber-400" /> },
              { key: 'dark_mode', label: 'Mode sombre', desc: 'Interface sombre', icon: <Moon className="w-5 h-5 text-purple-400" /> },
              { key: 'accessibility', label: 'Accessibilité PMR', desc: 'Filtrer arrêts accessibles', icon: <Shield className="w-5 h-5 text-cyan-400" /> },
            ].map(toggle => (
              <div key={toggle.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {toggle.icon}
                  <div>
                    <div className="text-sm font-medium text-white">{toggle.label}</div>
                    <div className="text-xs text-surface-400">{toggle.desc}</div>
                  </div>
                </div>
                <button onClick={() => setPrefs(p => ({ ...p, [toggle.key]: !p[toggle.key as keyof typeof p] }))}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    prefs[toggle.key as keyof typeof prefs] ? 'bg-brand-500' : 'bg-white/10'
                  }`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    prefs[toggle.key as keyof typeof prefs] ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </motion.div>

          {/* Language */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Langue</div>
                  <div className="text-xs text-surface-400">Langue de l&apos;interface</div>
                </div>
              </div>
              <select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-400">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex gap-3">
            <button className="btn-brand flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Sauvegarder
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
