'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Navigation, Train, Bus, Bike, Footprints, Leaf,
  Clock, Zap, Shield, ArrowRight, ChevronDown, Menu, X,
  BarChart3, Users, Globe, Sparkles
} from 'lucide-react';
import Link from 'next/link';

// ─── Animation variants ────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen">
      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className="fixed top-0 w-full z-50 bg-[#050a18]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Mobili<span className="text-brand-400">smart</span></span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-surface-300 hover:text-white transition-colors">Fonctionnalités</a>
              <a href="#modes" className="text-sm text-surface-300 hover:text-white transition-colors">Modes</a>
              <a href="#stats" className="text-sm text-surface-300 hover:text-white transition-colors">Impact</a>
              <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                <Link href="/login" className="text-sm text-surface-300 hover:text-white transition-colors">Connexion</Link>
                <Link href="/plan" className="btn-brand text-sm !px-5 !py-2">
                  Planifier un trajet
                </Link>
              </div>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050a18]/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-surface-300 hover:text-white">Fonctionnalités</a>
              <a href="#modes" className="block py-2 text-surface-300 hover:text-white">Modes</a>
              <a href="#stats" className="block py-2 text-surface-300 hover:text-white">Impact</a>
              <Link href="/plan" className="btn-brand block text-center text-sm mt-3">Planifier un trajet</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-[80px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300">Propulsé par l&apos;Intelligence Artificielle</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Votre mobilité</span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-emerald-400 bg-clip-text text-transparent">
                réinventée
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Planifiez vos déplacements multimodaux en combinant tramway, bus, vélo et marche.
              Notre IA prédit l&apos;affluence pour optimiser chaque trajet.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/plan" className="btn-brand text-lg !px-8 !py-4 flex items-center gap-2 group">
                <MapPin className="w-5 h-5" />
                Planifier mon trajet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/live" className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Vue en temps réel
              </Link>
            </motion.div>

            {/* Quick Search Card */}
            <motion.div variants={scaleIn} className="max-w-2xl mx-auto">
              <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                    <input
                      type="text"
                      placeholder="D'où partez-vous ?"
                      className="input-glass !pl-10"
                      id="hero-origin"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      type="text"
                      placeholder="Où allez-vous ?"
                      className="input-glass !pl-10"
                      id="hero-destination"
                    />
                  </div>
                  <Link href="/plan" className="btn-brand !px-6 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Navigation className="w-4 h-4" />
                    Go
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-surface-500" />
        </motion.div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Une plateforme <span className="text-brand-400">tout-en-un</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-surface-400 text-lg max-w-xl mx-auto">
              Tout ce dont vous avez besoin pour vous déplacer intelligemment
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Navigation className="w-6 h-6" />,
                title: 'Itinéraires multimodaux',
                desc: 'Combinez tramway, bus, vélo et marche pour le trajet optimal',
                gradient: 'from-brand-500 to-brand-700',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Prédiction d\'affluence',
                desc: 'Notre IA analyse les données historiques pour prédire le taux de remplissage',
                gradient: 'from-purple-500 to-purple-700',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Temps réel',
                desc: 'Retards, perturbations et disponibilité vélos en direct',
                gradient: 'from-amber-500 to-orange-600',
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: 'Empreinte carbone',
                desc: 'Mesurez et réduisez votre impact CO₂ à chaque trajet',
                gradient: 'from-emerald-500 to-emerald-700',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Accessibilité',
                desc: 'Filtrez les itinéraires accessibles PMR et évitez les escaliers',
                gradient: 'from-cyan-500 to-cyan-700',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Personnalisation',
                desc: 'Priorité éco, rapide ou économique selon vos préférences',
                gradient: 'from-pink-500 to-rose-600',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="glass-card p-6 group cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRANSPORT MODES ═══════════ */}
      <section id="modes" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Tous les <span className="text-emerald-400">modes</span> de transport
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-surface-400 text-lg max-w-xl mx-auto">
              Combinez librement pour trouver votre itinéraire idéal
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            {[
              { icon: <Train className="w-8 h-8" />, label: 'Tramway', color: 'border-red-500/30 bg-red-500/8 text-red-400' },
              { icon: <Bus className="w-8 h-8" />, label: 'Bus', color: 'border-emerald-500/30 bg-emerald-500/8 text-emerald-400' },
              { icon: <Train className="w-8 h-8" />, label: 'Train ONCF', color: 'border-blue-500/30 bg-blue-500/8 text-blue-400' },
              { icon: <Train className="w-8 h-8" />, label: 'Al Boraq', color: 'border-pink-500/30 bg-pink-500/8 text-pink-400' },
              { icon: <Bike className="w-8 h-8" />, label: 'Vélo', color: 'border-amber-500/30 bg-amber-500/8 text-amber-400' },
              { icon: <Footprints className="w-8 h-8" />, label: 'Marche', color: 'border-purple-500/30 bg-purple-500/8 text-purple-400' },
            ].map((mode, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.08, y: -4 }}
                className={`flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border ${mode.color} backdrop-blur-sm cursor-default transition-shadow hover:shadow-lg`}
              >
                {mode.icon}
                <span className="text-sm font-semibold">{mode.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section id="stats" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { value: '12.5k', label: 'Trajets planifiés', icon: <BarChart3 className="w-6 h-6 text-brand-400" /> },
              { value: '2.3t', label: 'CO₂ économisé', icon: <Leaf className="w-6 h-6 text-emerald-400" /> },
              { value: '98%', label: 'Prédiction juste', icon: <Sparkles className="w-6 h-6 text-amber-400" /> },
              { value: '3.2k', label: 'Utilisateurs actifs', icon: <Globe className="w-6 h-6 text-purple-400" /> },
            ].map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="glass-card p-6 text-center">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-surface-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 via-brand-800/20 to-emerald-600/20" />
            <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" />
            <div className="relative z-10 text-center py-16 px-8">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                Prêt à transformer vos trajets ?
              </h2>
              <p className="text-surface-300 text-lg mb-8 max-w-lg mx-auto">
                Rejoignez des milliers d&apos;utilisateurs qui optimisent leur mobilité quotidienne
              </p>
              <Link href="/plan" className="btn-brand text-lg !px-10 !py-4 inline-flex items-center gap-2 group">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">Mobili<span className="text-brand-400">smart</span></span>
          </div>
          <p className="text-sm text-surface-500">© 2026 Mobilismart. Mobilité urbaine intelligente.</p>
        </div>
      </footer>
    </div>
  );
}
