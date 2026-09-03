import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, Clock } from 'lucide-react';

const Sidebar = ({ activeView, onNavigate, jobCount = 0 }) => {
  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col shadow-xl z-20">
      {/* Top branding */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-md opacity-50 rounded-full"></div>
          <Zap className="w-8 h-8 text-indigo-400 relative z-10 fill-indigo-500/20" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
          LeadGen Giant
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 text-sm font-medium">
        <motion.button
          onClick={() => onNavigate('new-job')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-r-lg transition-colors ${
            activeView === 'new-job'
              ? 'bg-slate-800 border-l-2 border-indigo-500 text-white'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent'
          }`}
        >
          <Rocket className={`w-5 h-5 ${activeView === 'new-job' ? 'text-indigo-400' : 'text-slate-400'}`} />
          New Job
        </motion.button>

        <motion.button
          onClick={() => onNavigate('history')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-r-lg transition-colors ${
            activeView === 'history'
              ? 'bg-slate-800 border-l-2 border-indigo-500 text-white'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 ${activeView === 'history' ? 'text-indigo-400' : 'text-slate-400'}`} />
            Job History
          </div>
          {jobCount > 0 && (
            <span className="bg-indigo-500/20 text-indigo-300 py-0.5 px-2.5 rounded-full text-xs font-bold">
              {jobCount}
            </span>
          )}
        </motion.button>
      </nav>

      {/* Bottom */}
      <div className="p-6 opacity-70 hover:opacity-100 transition-opacity">
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Powered by n8n
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
