import React from 'react';
import { FileText } from 'lucide-react';

interface ReportGeneratorFormProps {
  reportType: string;
  setReportType: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  onGenerate: () => void;
}

export function ReportGeneratorForm({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  onGenerate
}: ReportGeneratorFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-950/20"
        >
          <option>User Activity Report</option>
          <option>Event Performance Report</option>
          <option>Financial Report</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Date Range Limit</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-950/20"
        >
          <option>All Time</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
        </select>
      </div>
      <div className="flex items-end">
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition shadow-xs cursor-pointer"
        >
          <FileText size={14} /> Generate Report
        </button>
      </div>
    </div>
  );
}
