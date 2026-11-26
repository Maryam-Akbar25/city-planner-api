import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await axiosClient.post(endpoint, payload);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || { email: formData.email }));
        onAuthSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Authentication failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950 overflow-hidden">
      {/* Ambient floating sky orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-20 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-sky-500/20 border border-sky-400/30 rounded-2xl mb-3">
            <CloudSun className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SkyPlan</h1>
          <p className="text-sky-200/70 text-sm mt-1">Plan every city trip around live weather</p>
        </div>

        {/* Toggle Switch */}
        <div className="grid grid-cols-2 bg-slate-900/60 p-1 rounded-xl mb-6 border border-white/10">
          {['Login', 'Register'].map((tab, idx) => {
            const active = (idx === 0 && isLogin) || (idx === 1 && !isLogin);
            return (
              <button
                key={tab}
                type="button"
                onClick={() => { setIsLogin(idx === 0); setError(''); }}
                className={`py-2 text-sm font-medium rounded-lg transition-all ${
                  active ? 'bg-sky-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="w-4 h-4 text-sky-300 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="w-4 h-4 text-sky-300 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-sky-300 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition"
            />
          </div>

          {error && (
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-lg p-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}