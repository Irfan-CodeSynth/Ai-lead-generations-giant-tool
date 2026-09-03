import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Copy } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

const Confetti = () => {
  const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
  const pieces = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {pieces.map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isCircle = Math.random() > 0.5;
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity - 100;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 0.5 + 0.5, 
              x, 
              y: y + 200, 
              rotate: Math.random() * 360 
            }}
            transition={{ duration: 1.5 + Math.random() * 0.5, ease: "easeOut" }}
            className={`absolute w-3 h-3 ${color} ${isCircle ? 'rounded-full' : ''}`}
          />
        );
      })}
    </div>
  );
};

export default function ResultsSummary({ stats }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const totalFound = useCountUp(stats?.totalFound || 0, 1500);
  const newLeads = useCountUp(stats?.newLeads || 0, 1500);
  const duplicates = useCountUp(stats?.duplicates || 0, 1500);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <>
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={item} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-slate-900">{totalFound}</div>
            <div className="text-sm text-slate-500 mt-1">Total Found</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users size={24} />
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-slate-900">{newLeads}</div>
            <div className="text-sm text-slate-500 mt-1">New Leads</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserPlus size={24} />
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-slate-900">{duplicates}</div>
            <div className="text-sm text-slate-500 mt-1">Duplicates</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Copy size={24} />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
