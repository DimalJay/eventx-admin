import React from 'react';
import { Download, CheckCircle } from 'lucide-react';

interface ReportPreviewTableProps {
  generatedReport: {
    headers: string[];
    rows: any[][];
    title: string;
  };
  onDownloadCSV: () => void;
}

export function ReportPreviewTable({ generatedReport, onDownloadCSV }: ReportPreviewTableProps) {
  return (
    <div className="border-t border-zinc-200/60 pt-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 p-4 border border-zinc-200/60 rounded-2xl">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-600" />
            Report Generated Successfully
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Found {generatedReport.rows.length} records matching your query rules.
          </p>
        </div>
        <button
          onClick={onDownloadCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition cursor-pointer"
        >
          <Download size={14} /> Download CSV
        </button>
      </div>

      {/* Table Preview */}
      <div className="overflow-x-auto border border-zinc-200/60 rounded-2xl bg-white">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200/60">
            <tr>
              {generatedReport.headers.map((h, i) => (
                <th key={i} className="px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {generatedReport.rows.slice(0, 10).map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-zinc-50/40">
                {row.map((val, cIdx) => (
                  <td key={cIdx} className="px-5 py-3.5 text-zinc-700 font-medium">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
            {generatedReport.rows.length === 0 && (
              <tr>
                <td
                  colSpan={generatedReport.headers.length}
                  className="px-5 py-8 text-center text-zinc-400 font-medium"
                >
                  No matching results found in this timeframe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {generatedReport.rows.length > 10 && (
          <div className="p-3 bg-zinc-50/50 border-t border-zinc-100 text-center text-[10px] text-zinc-500 font-medium">
            Showing top 10 preview rows. Download CSV to view all {generatedReport.rows.length} rows.
          </div>
        )}
      </div>
    </div>
  );
}
