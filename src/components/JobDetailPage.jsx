import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Search,
  Copy,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Users,
  UserPlus,
  CopyCheck,
  MapPin,
  Tag,
  Globe,
  Calendar,
  SearchX,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCountUp } from '../hooks/useCountUp';
import { exportLeadsToXLSX } from '../utils/xlsx';
import { exportLeadsToCSV } from '../utils/csv';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

/* ───── Stat Card ───── */
function StatCard({ icon: Icon, label, value, color }) {
  const animated = useCountUp(value, 1200);
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between"
    >
      <div>
        <div className="text-3xl font-bold text-slate-900">{animated}</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{label}</div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
    </motion.div>
  );
}

/* ───── Info Pill ───── */
function InfoPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-lg">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      {children}
    </span>
  );
}

/* ───── Main Component ───── */
export default function JobDetailPage({ job, onBack, onDelete }) {
  const { id: jobId, formData, stats, leads: initialLeads = [], completedAt } = job;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // If initialLeads is passed or empty, maintain leads list state
  const leads = useMemo(() => {
    return Array.isArray(initialLeads) ? initialLeads : [];
  }, [initialLeads]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.businessName?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.address?.toLowerCase().includes(q)
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [leads, searchQuery, sortConfig]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDownloadXLSX = () => {
    if (!leads.length) {
      toast.error('No leads available to export in this job');
      return;
    }
    try {
      exportLeadsToXLSX(leads, formData);
      toast.success('XLSX downloaded successfully!');
    } catch (err) {
      toast.error('Failed to export XLSX: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDownloadCSV = () => {
    if (!leads.length) {
      toast.error('No leads available to export in this job');
      return;
    }
    try {
      const sanitize = (str) =>
        (str || 'unknown')
          .toString()
          .trim()
          .replace(/[^a-zA-Z0-9 _-]/g, '')
          .replace(/\s+/g, '_')
          .toLowerCase();
      const filename = `${sanitize(formData?.niche)}_${sanitize(formData?.keyword)}_${sanitize(formData?.country)}.csv`;
      exportLeadsToCSV(leads, filename);
      toast.success('CSV downloaded successfully!');
    } catch (err) {
      toast.error('Failed to export CSV: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteCurrent = () => {
    if (onDelete && jobId) {
      onDelete(jobId);
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="inline ml-0.5 text-indigo-600" />
    ) : (
      <ChevronDown size={14} className="inline ml-0.5 text-indigo-600" />
    );
  };

  const columns = [
    { key: 'businessName', label: 'Business Name' },
    { key: 'category', label: 'Category' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'zipCode', label: 'Zip Code' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ───── Header ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Job Details & Analytics</p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {formData?.keyword || 'Scrape Job Results'}
            </h1>
          </div>
        </div>

        {/* Action Buttons (Download XLSX & CSV & Delete) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <motion.button
            onClick={handleDownloadCSV}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            CSV
          </motion.button>
          <motion.button
            onClick={handleDownloadXLSX}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download XLSX
          </motion.button>
          {onDelete && (
            <motion.button
              onClick={handleDeleteCurrent}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              title="Delete this job from history"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ───── Job Meta Pills ───── */}
      <div className="flex flex-wrap gap-2">
        <InfoPill icon={Tag}>{formData?.niche || 'Niche'}</InfoPill>
        <InfoPill icon={MapPin}>
          {[formData?.city, formData?.state].filter(Boolean).join(', ') || 'Location'}
        </InfoPill>
        <InfoPill icon={Globe}>{formData?.country || 'Country'}</InfoPill>
        <InfoPill icon={Calendar}>
          {completedAt
            ? new Date(completedAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recent'}
        </InfoPill>
      </div>

      {/* ───── 3 Analytics Cards (Total Found, New Leads, Duplicates) ───── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <StatCard icon={Users} label="Total Found" value={stats?.totalFound || leads.length || 0} color="indigo" />
        <StatCard icon={UserPlus} label="New Leads" value={stats?.newLeads || leads.length || 0} color="emerald" />
        <StatCard icon={CopyCheck} label="Duplicates" value={stats?.duplicates || 0} color="amber" />
      </motion.div>

      {/* ───── Leads Table & Controls ───── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads by name, category, email, phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'} Displayed
            </span>
          </div>
        </div>

        {/* Leads Table Content */}
        {leads.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-500">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No leads records returned by webhook</h3>
            <p className="text-sm text-slate-500 max-w-md">
              The scraper finished with {stats?.totalFound || 0} items identified in n8n, but the webhook returned an empty leads list. Check your n8n workflow output node to ensure full lead objects are attached to the <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">leads</code> array.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No results match your search query "{searchQuery}"
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="text-left py-3.5 px-4 text-xs uppercase text-slate-500 font-semibold cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap transition-colors"
                      >
                        {col.label}
                        <SortIcon columnKey={col.key} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.placeId || lead.businessName || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(index * 0.02, 0.4) }}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Business Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {lead.businessName || '—'}
                          </span>
                          {lead.businessName && (
                            <button
                              onClick={() => handleCopy(lead.businessName)}
                              className="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-1"
                              title="Copy Name"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {lead.category ? (
                          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {lead.category}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-slate-700">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="hover:text-indigo-600 hover:underline transition-colors"
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Website */}
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {lead.website ? (
                          <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            Visit <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td
                        className="py-3 px-4 text-sm text-slate-600 max-w-[200px] truncate"
                        title={lead.address}
                      >
                        {lead.address || '—'}
                      </td>

                      {/* Zip Code */}
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-slate-600">
                        {lead.zipCode || '—'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
