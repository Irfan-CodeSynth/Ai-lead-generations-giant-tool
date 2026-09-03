import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Copy, ExternalLink, ChevronUp, ChevronDown, SearchX } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportLeadsToCSV } from '../utils/csv';

export default function ResultsTable({ leads = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.businessName?.toLowerCase().includes(lowerQuery) ||
          lead.category?.toLowerCase().includes(lowerQuery)
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

  const handleExport = () => {
    if (filteredAndSortedLeads.length === 0) {
      toast.error('No leads to export');
      return;
    }
    exportLeadsToCSV(filteredAndSortedLeads);
    toast.success('Export started!');
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="inline ml-1" />
    ) : (
      <ChevronDown size={14} className="inline ml-1" />
    );
  };

  if (!leads.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <SearchX className="text-slate-300 w-16 h-16 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No leads found</h3>
        <p className="text-slate-500 mt-2">Start a new job to gather leads.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by business name or category..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto justify-center"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        {filteredAndSortedLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No results match your search</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['businessName', 'category', 'phone', 'website', 'email', 'address', 'zipCode'].map((key) => {
                  const labels = {
                    businessName: 'Business Name',
                    category: 'Category',
                    phone: 'Phone',
                    website: 'Website',
                    email: 'Email',
                    address: 'Address',
                    zipCode: 'Zip Code'
                  };
                  return (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="text-left py-3 px-4 text-xs uppercase text-slate-500 font-semibold cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap"
                    >
                      {labels[key]} <SortIcon columnKey={key} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="show" className="divide-y divide-slate-100">
              {filteredAndSortedLeads.map((lead, index) => (
                <motion.tr variants={item} key={lead.placeId || index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap flex items-center gap-2">
                    <span className="font-medium text-slate-900">{lead.businessName}</span>
                    <button
                      onClick={() => handleCopy(lead.businessName)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                      title="Copy Name"
                    >
                      <Copy size={14} />
                    </button>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {lead.category && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                        {lead.category}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-700 text-sm">
                    {lead.phone || '—'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm">
                    {lead.website ? (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Visit <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
                        {lead.email}
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 max-w-[200px] truncate" title={lead.address}>
                    {lead.address || '—'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-slate-600">
                    {lead.zipCode || '—'}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        )}
      </div>
    </div>
  );
}
