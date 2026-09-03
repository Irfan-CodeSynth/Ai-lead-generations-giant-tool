import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Inbox, MapPin, Users, ArrowRight, Trash2, CalendarDays, X } from 'lucide-react';

export default function JobHistoryPanel({ jobs = [], onSelectJob, onDeleteJob }) {
  const [dateFilter, setDateFilter] = useState('');

  // Get unique dates from jobs for the quick-pick pills
  const uniqueDates = useMemo(() => {
    const dateSet = new Set();
    jobs.forEach((job) => {
      if (job.completedAt) {
        const d = new Date(job.completedAt);
        dateSet.add(d.toISOString().slice(0, 10)); // "YYYY-MM-DD"
      }
    });
    return [...dateSet].sort((a, b) => b.localeCompare(a)); // newest first
  }, [jobs]);

  // Filter jobs by selected date
  const filteredJobs = useMemo(() => {
    if (!dateFilter) return jobs;
    return jobs.filter((job) => {
      if (!job.completedAt) return false;
      const jobDate = new Date(job.completedAt).toISOString().slice(0, 10);
      return jobDate === dateFilter;
    });
  }, [jobs, dateFilter]);

  // Format date for display
  const formatDateLabel = (isoDate) => {
    const d = new Date(isoDate + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (isoDate === todayStr) return 'Today';
    if (isoDate === yesterdayStr) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!jobs.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
          <Inbox className="text-slate-300 w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs yet</h3>
        <p className="text-sm text-slate-500 max-w-sm">Start your first scrape job to see results here. Your session history will appear in this view.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } }
  };

  const handleDelete = (e, jobId) => {
    e.stopPropagation();
    if (onDeleteJob) {
      onDeleteJob(jobId);
    }
  };

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Job History</h2>
            <p className="text-sm text-slate-500">
              {dateFilter
                ? `${filteredJobs.length} of ${jobs.length} job${jobs.length !== 1 ? 's' : ''} on ${formatDateLabel(dateFilter)}`
                : `${jobs.length} completed job${jobs.length !== 1 ? 's' : ''} this session`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Date filter bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium shrink-0">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span>Filter by date:</span>
          </div>

          {/* "All" pill */}
          <button
            onClick={() => setDateFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !dateFilter
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All
          </button>

          {/* Date pills */}
          {uniqueDates.map((d) => {
            const count = jobs.filter((j) => j.completedAt && new Date(j.completedAt).toISOString().slice(0, 10) === d).length;
            return (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  dateFilter === d
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {formatDateLabel(d)}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  dateFilter === d ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Date picker input */}
          <div className="relative ml-auto shrink-0">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:bg-slate-100 transition-colors"
            />
          </div>

          {/* Clear filter button */}
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear date filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Job cards grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <CalendarDays className="text-slate-300 w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No jobs on this date</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            No scraping jobs were completed on {formatDateLabel(dateFilter)}.
          </p>
          <button
            onClick={() => setDateFilter('')}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Show All Jobs
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={item}
                layout
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                onClick={() => onSelectJob && onSelectJob(job)}
                className="group bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Header: niche + date + delete button */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {job.formData?.niche || 'Any Niche'}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      {job.completedAt ? new Date(job.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>

                    {/* Delete Button on top-right corner */}
                    <button
                      onClick={(e) => handleDelete(e, job.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                      title="Delete from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Keyword title */}
                <h3 className="font-bold text-slate-900 text-lg mb-2 truncate">
                  {job.formData?.keyword || 'Any Keyword'}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">
                    {[job.formData?.city, job.formData?.state, job.formData?.country].filter(Boolean).join(', ') || 'Any Location'}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700">
                      {job.stats?.totalFound || 0} leads
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
