import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Rocket, Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const JobConfigForm = ({ onStartJob, isDisabled }) => {
  const [formData, setFormData] = useState({
    niche: '',
    keyword: '',
    country: '',
    state: '',
    city: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = Object.values(formData).every(val => val.trim() !== '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid && !isDisabled) {
      onStartJob(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 w-full max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Configure New Scrape Job</h2>
      </div>

      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="niche" className="block text-sm font-medium text-slate-700">Niche</label>
            <input
              type="text"
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder="e.g. Restaurants"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="keyword" className="block text-sm font-medium text-slate-700">Keyword</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={formData.keyword}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder="e.g. Italian restaurant"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder="e.g. USA"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-slate-700">State / Region</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder="e.g. New York"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isDisabled}
              placeholder="e.g. Brooklyn"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pt-6">
          <motion.button
            type="submit"
            disabled={!isFormValid || isDisabled}
            whileHover={(!isFormValid || isDisabled) ? {} : { scale: 1.01 }}
            whileTap={(!isFormValid || isDisabled) ? {} : { scale: 0.99 }}
            className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
              !isFormValid || isDisabled 
                ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
            }`}
          >
            {isDisabled ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Start Scraping
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default JobConfigForm;
