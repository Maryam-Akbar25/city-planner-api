import { CloudSun, LogOut, Plus } from 'lucide-react';

export default function Navbar({ onOpenModal, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-500/20 rounded-xl border border-sky-400/30">
            <CloudSun className="w-6 h-6 text-amber-300" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SkyPlan</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-sky-200/80">
            {user.name || user.email || 'Explorer'}
          </span>

          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl shadow-lg shadow-sky-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New City Plan
          </button>

          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 text-slate-300 hover:text-rose-300 hover:bg-white/10 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}