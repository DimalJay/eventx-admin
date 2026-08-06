import React, { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';

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
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const reportTypes = [
    "User Activity Report",
    "Event Performance Report",
    "Financial Report"
  ];

  const dateRanges = [
    "All Time",
    "Last 30 Days",
    "Last 3 Months",
    "This Year"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Report Type */}
      <div>
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Report Type</label>
        <div className="relative">
          <button
            onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 bg-white border border-zinc-200 text-zinc-800 text-sm rounded-2xl px-4 py-3 outline-none hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
          >
            <span>{reportType}</span>
            <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${reportDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {reportDropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-20" onClick={() => setReportDropdownOpen(false)} />
              
              {/* Menu */}
              <div className="absolute left-0 mt-2 w-full bg-white border border-zinc-200/60 rounded-2xl shadow-lg z-30 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {reportTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setReportType(type);
                      setReportDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-sm font-semibold cursor-pointer transition-colors ${
                      reportType === type
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Date Range Limit */}
      <div>
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Date Range Limit</label>
        <div className="relative">
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 bg-white border border-zinc-200 text-zinc-800 text-sm rounded-2xl px-4 py-3 outline-none hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
          >
            <span>{dateRange}</span>
            <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${dateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dateDropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-20" onClick={() => setDateDropdownOpen(false)} />
              
              {/* Menu */}
              <div className="absolute left-0 mt-2 w-full bg-white border border-zinc-200/60 rounded-2xl shadow-lg z-30 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {dateRanges.map((range) => (
                  <div
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setDateDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-sm font-semibold cursor-pointer transition-colors ${
                      dateRange === range
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    {range}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex items-end">
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition shadow-xs cursor-pointer h-[46px]"
        >
          <FileText size={14} /> Generate Report
        </button>
      </div>
    </div>
  );
}
