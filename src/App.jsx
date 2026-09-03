import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import Sidebar from './components/Sidebar';
import JobConfigForm from './components/JobConfigForm';
import JobProgress from './components/JobProgress';
import JobHistoryPanel from './components/JobHistoryPanel';
import JobDetailPage from './components/JobDetailPage';
import { useJobPolling } from './hooks/useJobPolling';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } }
};

export default function App() {
  const [activeView, setActiveView] = useState('new-job');
  const [jobHistory, setJobHistory] = useState([]);
  const [selectedHistoryJob, setSelectedHistoryJob] = useState(null);

  // Callback whenever a job finishes successfully in polling
  const handleJobComplete = useCallback((completedJob) => {
    toast.success(`✅ Found ${completedJob.stats.totalFound} leads!`, { duration: 5000 });
    setJobHistory((prev) => [
      {
        id: completedJob.jobId || Date.now().toString(),
        formData: completedJob.formData,
        stats: completedJob.stats,
        leads: completedJob.leads,
        completedAt: completedJob.completedAt || new Date(),
      },
      ...prev,
    ]);
  }, []);

  const {
    jobId,
    status,
    leads,
    stats,
    error,
    isPolling,
    formData,
    startJob,
    retry,
    reset,
    stopJob
  } = useJobPolling({ onJobComplete: handleJobComplete });

  const prevStatusRef = useRef(null);

  useEffect(() => {
    if (prevStatusRef.current !== 'queued' && status === 'queued') {
      toast('🚀 Scrape job started!', { icon: '🔍', duration: 3000 });
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleStartJob = useCallback(async (data) => {
    setSelectedHistoryJob(null);
    await startJob(data);
  }, [startJob]);

  const handleSelectHistoryJob = useCallback((job) => {
    setSelectedHistoryJob(job);
    setActiveView('new-job');
  }, []);

  const handleDeleteJob = useCallback((idToDelete) => {
    setJobHistory((prev) => prev.filter((job) => job.id !== idToDelete));
    if (selectedHistoryJob && selectedHistoryJob.id === idToDelete) {
      setSelectedHistoryJob(null);
      setActiveView('history');
    }
    toast.success('Job deleted from history');
  }, [selectedHistoryJob]);

  const handleNewJob = useCallback(() => {
    setSelectedHistoryJob(null);
    reset();
  }, [reset]);

  const handleStopJob = useCallback(() => {
    stopJob();
    toast('⏹ Scraping stopped', { duration: 3000 });
  }, [stopJob]);

  // Determine what to show in the main content area
  const renderMainContent = () => {
    // If viewing a historical job — show full detail page
    if (selectedHistoryJob) {
      return (
        <motion.div
          key="history-detail"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <JobDetailPage
            job={selectedHistoryJob}
            onBack={() => {
              setSelectedHistoryJob(null);
              setActiveView('history');
            }}
            onDelete={handleDeleteJob}
          />
        </motion.div>
      );
    }

    // If there's an error
    if (error) {
      return (
        <motion.div
          key="error"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={retry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </motion.button>
              <motion.button
                onClick={handleNewJob}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors"
              >
                Start Over
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    }

    // Job is done — show full detail page for the active job
    if (status === 'done') {
      return (
        <motion.div
          key="results"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <JobDetailPage
            job={{
              id: jobId,
              formData,
              stats,
              leads,
              completedAt: new Date(),
            }}
            onBack={handleNewJob}
          />
        </motion.div>
      );
    }

    // Job is in progress
    if (status === 'queued' || status === 'scraping') {
      return (
        <motion.div
          key="progress"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center min-h-[400px]"
        >
          <JobProgress status={status} onStop={handleStopJob} />
        </motion.div>
      );
    }

    // Job was stopped — show notification + form
    if (status === 'stopped') {
      return (
        <motion.div
          key="stopped"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
        >
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <span>⏹</span> Scraping was stopped. You can start a new job below.
          </div>
          <JobConfigForm onStartJob={handleStartJob} isDisabled={false} />
        </motion.div>
      );
    }

    // Default: show the form
    return (
      <motion.div
        key="form"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <JobConfigForm onStartJob={handleStartJob} isDisabled={isPolling} />
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15), 0 4px 6px -4px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#f1f5f9',
            },
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'new-job') {
            setSelectedHistoryJob(null);
          }
        }}
        jobCount={jobHistory.length}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <AnimatePresence mode="wait">
            {activeView === 'history' ? (
              <motion.div
                key="history"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <JobHistoryPanel
                  jobs={jobHistory}
                  onSelectJob={handleSelectHistoryJob}
                  onDeleteJob={handleDeleteJob}
                />
              </motion.div>
            ) : (
              renderMainContent()
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
