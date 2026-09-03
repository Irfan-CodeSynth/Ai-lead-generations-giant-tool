import React from 'react';

const ShimmerStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    .animate-shimmer-custom {
      animation: shimmer 2.5s infinite linear;
      background: linear-gradient(to right, #f1f5f9 4%, #e2e8f0 25%, #f1f5f9 36%);
      background-size: 1000px 100%;
    }
  `}} />
);

export const SkeletonRow = () => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <ShimmerStyles />
        <div className="h-4 w-6 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-48 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-32 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-40 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-20 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-16 bg-slate-200 rounded animate-shimmer-custom"></div>
      </td>
    </tr>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 overflow-hidden relative">
      <ShimmerStyles />
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full animate-shimmer-custom bg-slate-200"></div>
          <div className="h-5 w-24 rounded animate-shimmer-custom bg-slate-200"></div>
        </div>
        <div className="h-10 w-20 rounded animate-shimmer-custom bg-slate-200"></div>
      </div>
    </div>
  );
};
