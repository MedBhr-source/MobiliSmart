'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Chrome } from 'lucide-react';
import Link from 'next/link';
import api, { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        if (form.password !== form.password_confirmation) {
          toast.error('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        const res = await authApi.register({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation
        });
        if (res.data?.data?.token) {
          localStorage.setItem('auth_token', res.data.data.token);
          toast.success('Compte créé avec succès !');
          window.location.href = '/dashboard';
        }
      } else {
        const res = await authApi.login({ email: form.email, password: form.password });
        if (res.data?.data?.token) {
          localStorage.setItem('auth_token', res.data.data.token);
          toast.success('Connexion réussie !');
          window.location.href = '/dashboard';
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Une erreur est survenue');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050a18] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-500/6 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white text-center mb-1">
            {isRegister ? 'Créer un compte' : 'Se connecter'}
          </h1>
          <p className="text-sm text-surface-400 text-center mb-6">
            {isRegister ? 'Rejoignez la mobilité intelligente' : 'Accédez à votre espace Mobilismart'}
          </p>

          {/* Google OAuth */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/8 transition-all mb-4">
            <Chrome className="w-5 h-5" />
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-surface-500">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="text" placeholder="Nom complet" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-glass !pl-10" id="register-name" required />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type="email" placeholder="Email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-glass !pl-10" id="login-email" required />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input type={showPass ? 'text' : 'password'} placeholder="Mot de passe"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-glass !pl-10 !pr-10" id="login-password" required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="password" placeholder="Confirmer le mot de passe"
                  value={form.password_confirmation}
                  onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                  className="input-glass !pl-10" id="register-confirm" required />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isRegister ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-sm text-surface-400 text-center mt-5">
            {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button onClick={() => setIsRegister(!isRegister)}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              {isRegister ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
