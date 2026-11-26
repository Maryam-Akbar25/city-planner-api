//Displays your saved plans in a responsive animated grid, with a search filter and smooth card entry/exit transitions.
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CloudOff, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import PlanCard from '../components/PlanCard';
import CreatePlanModal from '../components/CreatePlanModal';

export default function Dashboard({ onLogout }) {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await axiosClient.get('/plans');
      setPlans(Array.isArray(data) ? data : data.plans || []);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialPlans = async () => {
      try {
        const { data } = await axiosClient.get('/plans');
        if (isMounted) {
          setPlans(Array.isArray(data) ? data : data.plans || []);
        }
      } catch (err) {
        if (isMounted && err.response?.status === 401) onLogout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialPlans();
    return () => {
      isMounted = false;
    };
  }, [onLogout]);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete plan', err);
    }
  };

  const filteredPlans = plans.filter((p) =>
    `${p.city} ${p.title || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-sky-950/60 to-slate-950">
      <Navbar onOpenModal={() => setIsModalOpen(true)} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Weather Forecasts & Plans</h1>
            <p className="text-sky-200/70 text-sm mt-1">
              Real-time conditions paired with your upcoming city itineraries
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by city or activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl"
          >
            <CloudOff className="w-12 h-12 text-sky-400/60 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No city plans yet</h3>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Click "New City Plan" to check live weather and schedule your first trip.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl transition"
            >
              + Create First Plan
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlanCreated={(newPlan) => {
          if (newPlan?.id) setPlans((prev) => [newPlan, ...prev]);
          else fetchPlans();
        }}
      />
    </div>
  );
}