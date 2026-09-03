import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, CheckCircle, Loader2, StopCircle } from 'lucide-react';

const JobProgress = ({ status, onStop }) => {
  const steps = ['queued', 'scraping', 'done'];
  const currentIndex = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Stepper */}
      <div className="flex items-center justify-between w-full mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -z-10 -translate-y-1/2 transition-all duration-700 ease-in-out"
          style={{ width: `${(currentIndex / 2) * 100}%` }}
        ></div>

        {/* Queued Step */}
        <div className="flex flex-col items-center gap-3 bg-white px-3 relative">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-500 ${
            currentIndex >= 0 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100 text-slate-400'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <span className={`text-sm font-semibold tracking-wide ${currentIndex >= 0 ? 'text-slate-800' : 'text-slate-400'}`}>Queued</span>
        </div>

        {/* Scraping Step */}
        <div className="flex flex-col items-center gap-3 bg-white px-3 relative">
          {status === 'scraping' && (
             <motion.div 
               className="absolute top-0 w-14 h-14 rounded-full border-2 border-indigo-400"
               animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
             />
          )}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-500 z-10 ${
            currentIndex >= 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100 text-slate-400'
          }`}>
            <Search className="w-6 h-6" />
          </div>
          <span className={`text-sm font-semibold tracking-wide ${currentIndex >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Scraping</span>
        </div>

        {/* Done Step */}
        <div className="flex flex-col items-center gap-3 bg-white px-3 relative">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-500 z-10 ${
            currentIndex >= 2 ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-100 text-slate-400'
          }`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <span className={`text-sm font-semibold tracking-wide ${currentIndex >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Done</span>
        </div>
      </div>

      {/* Dynamic Content area */}
      <div className="h-40 flex flex-col items-center justify-center relative w-full">
        <AnimatePresence mode="wait">
          {status === 'queued' && (
            <motion.div 
              key="queued"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex space-x-1.5 mb-2">
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <p className="text-xl font-medium text-slate-700">Your job is in the queue...</p>
            </motion.div>
          )}

          {status === 'scraping' && (
            <motion.div 
              key="scraping"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xl font-medium text-slate-800">Scanning Google Maps</p>
                <motion.div className="flex space-x-0.5 w-6">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>.</motion.span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div 
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              <p className="text-xl font-medium text-slate-800">Scraping Complete!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: info text + stop button */}
      {(status === 'queued' || status === 'scraping') && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-full">
            This typically takes 30-60 seconds
          </p>
          {onStop && (
            <motion.button
              onClick={onStop}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-medium text-sm transition-colors"
            >
              <StopCircle className="w-4 h-4" />
              Stop Scraping
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobProgress;
