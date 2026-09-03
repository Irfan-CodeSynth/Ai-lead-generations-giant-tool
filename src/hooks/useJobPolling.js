import { useState, useRef, useCallback, useEffect } from 'react';
import { startScrapeJob, fetchJobStatus } from '../utils/api';

export function useJobPolling({ onJobComplete } = {}) {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null); // null | 'queued' | 'scraping' | 'done' | 'stopped'
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ totalFound: 0, newLeads: 0, duplicates: 0 });
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [formData, setFormData] = useState(null);

  const intervalRef = useRef(null);
  const currentFormDataRef = useRef(null);
  const onJobCompleteRef = useRef(onJobComplete);

  useEffect(() => {
    onJobCompleteRef.current = onJobComplete;
  }, [onJobComplete]);

  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pollJob = useCallback((id) => {
    clearPollingInterval();
    setIsPolling(true);
    
    intervalRef.current = setInterval(async () => {
      try {
        const data = await fetchJobStatus(id);
        
        if (data.status === 'done') {
          clearPollingInterval();
          setIsPolling(false);
          
          // Filter valid leads (handle stray empty objects or items missing businessName)
          const rawLeads = Array.isArray(data.leads) ? data.leads : [];
          const validLeads = rawLeads.filter(lead => lead && (lead.businessName || lead.category || lead.phone || lead.website || lead.address));
          
          const finalStats = {
            totalFound: data.totalFound ?? validLeads.length ?? 0,
            newLeads: data.newLeads ?? validLeads.length ?? 0,
            duplicates: data.duplicates ?? 0
          };

          setLeads(validLeads);
          setStats(finalStats);
          setStatus('done');

          if (onJobCompleteRef.current) {
            onJobCompleteRef.current({
              jobId: id,
              formData: currentFormDataRef.current,
              stats: finalStats,
              leads: validLeads,
              completedAt: new Date()
            });
          }
        } else {
          setStatus(data.status);
        }
      } catch (err) {
        clearPollingInterval();
        setError(err.message || 'Error fetching job status');
        setIsPolling(false);
      }
    }, 5000);
  }, [clearPollingInterval]);

  const startJob = useCallback(async (data) => {
    setJobId(null);
    setStatus(null);
    setLeads([]);
    setStats({ totalFound: 0, newLeads: 0, duplicates: 0 });
    setError(null);
    setIsPolling(false);
    setFormData(data);
    currentFormDataRef.current = data;

    try {
      const response = await startScrapeJob(data);
      if (response && response.jobId) {
        setJobId(response.jobId);
        setStatus('queued');
        pollJob(response.jobId);
      } else {
        throw new Error('No jobId returned from start job endpoint');
      }
    } catch (err) {
      setError(err.message || 'Error starting job');
      setIsPolling(false);
    }
  }, [pollJob]);

  const retry = useCallback(() => {
    if (jobId && !isPolling) {
      setError(null);
      pollJob(jobId);
    }
  }, [jobId, isPolling, pollJob]);

  const reset = useCallback(() => {
    clearPollingInterval();
    setJobId(null);
    setStatus(null);
    setLeads([]);
    setStats({ totalFound: 0, newLeads: 0, duplicates: 0 });
    setError(null);
    setIsPolling(false);
    setFormData(null);
    currentFormDataRef.current = null;
  }, [clearPollingInterval]);

  const stopJob = useCallback(() => {
    clearPollingInterval();
    setStatus('stopped');
    setIsPolling(false);
  }, [clearPollingInterval]);

  useEffect(() => {
    return () => {
      clearPollingInterval();
    };
  }, [clearPollingInterval]);

  return {
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
  };
}
