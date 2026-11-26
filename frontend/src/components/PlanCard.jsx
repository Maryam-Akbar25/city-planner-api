import { motion } from 'framer-motion';
import { Sun, CloudRain, Cloud, Snowflake, MapPin, Calendar, Trash2 } from 'lucide-react';

function getWeatherTheme(summary = '', temp = 22) {
  const text = summary.toLowerCase();
  if (text.includes('rain') || text.includes('drizzle') || text.includes('storm')) {
    return {
      gradient: 'from-slate-800/90 via-blue-950/80 to-indigo-950/90',
      border: 'border-blue-400/30',
      icon: <CloudRain className="w-9 h-9 text-blue-300" />,
      badge: 'bg-blue-500/20 text-blue-200',
    };
  }
  if (text.includes('snow') || temp <= 5) {
    return {
      gradient: 'from-cyan-950/90 via-slate-900/80 to-sky-950/90',
      border: 'border-cyan-300/30',
      icon: <Snowflake className="w-9 h-9 text-cyan-200" />,
      badge: 'bg-cyan-500/20 text-cyan-100',
    };
  }
  if (text.includes('cloud') || text.includes('overcast')) {
    return {
      gradient: 'from-slate-800/90 via-slate-900/80 to-zinc-900/90',
      border: 'border-slate-400/30',
      icon: <Cloud className="w-9 h-9 text-slate-300" />,
      badge: 'bg-slate-500/25 text-slate-200',
    };
  }
  return {
    gradient: 'from-sky-900/80 via-indigo-950/80 to-slate-900/90',
    border: 'border-amber-300/30',
    icon: <Sun className="w-9 h-9 text-amber-300" />,
    badge: 'bg-amber-400/20 text-amber-200',
  };
}

export default function PlanCard({ plan, onDelete }) {
  const summary = plan.weather_summary || 'Clear Sky';
  const temp = plan.temperature_c ?? '--';
  const theme = getWeatherTheme(summary, Number(temp));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -5 }}
      className={`relative backdrop-blur-xl bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-shadow hover:shadow-2xl`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              {plan.city}
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {plan.title}
            </h3>
          </div>
          <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10">
            {theme.icon}
          </div>
        </div>

        {/* Temperature & Condition Pill */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl font-extrabold text-white flex items-center">
            {temp !== '--' ? `${Math.round(temp)}°C` : 'Live'}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${theme.badge}`}>
            {summary}
          </span>
        </div>

        {plan.notes && (
          <p className="mt-4 text-sm text-slate-300/90 line-clamp-2 leading-relaxed">
            {plan.notes}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          {plan.plan_date}
        </span>

        <button
          onClick={() => onDelete(plan.id)}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          title="Delete Plan"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}