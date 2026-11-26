import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, FileText, Sparkles, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function CreatePlanModal({ isOpen, onClose, onPlanCreated }) {
  const [formData, setFormData] = useState({
    city: '',
    title: '',
    plan_date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosClient.post('/plans', formData);
      onPlanCreated(data.plan);
      setFormData({ city: '', title: '', plan_date: '', notes: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not create plan. Check city name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md backdrop-blur-2xl bg-slate-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl z-10"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                Plan a City Visit
              </h2>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-sky-200 mb-1 block">City Name (Fetches Live Weather)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Lahore, Tokyo, London"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-sky-200 mb-1 block">Activity / Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rooftop Dinner & Walk"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-xs text-sky-200 mb-1 block">Target Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    value={formData.plan_date}
                    onChange={(e) => setFormData({ ...formData, plan_date: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-sky-200 mb-1 block">Notes (Optional)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <textarea
                    rows="2"
                    placeholder="Pack an umbrella or sunglasses..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-300 bg-rose-500/10 p-2.5 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch Weather & Save Plan'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}