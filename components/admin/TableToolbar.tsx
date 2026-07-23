"use client";

import { Filter, X } from "lucide-react";
import { Search } from "lucide-react";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  onFilterClose: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filterContent: React.ReactNode;
}

export default function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  isFilterOpen,
  onFilterToggle,
  onFilterClose,
  hasActiveFilters,
  onClearFilters,
  filterContent,
}: TableToolbarProps) {
  return (
    <div className="p-4 border-b border-zinc-200/60 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-50/50">
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-400 transition-colors"
        />
      </div>

      {/* Filter Button + Popover */}
      <div className="relative">
        <button
          onClick={onFilterToggle}
          className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors cursor-pointer ${
            hasActiveFilters
              ? "bg-black text-white border-black"
              : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <Filter size={14} /> Filter
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        {isFilterOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onFilterClose} />
            <div
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-zinc-200/80 shadow-xl p-4 z-20 space-y-4"
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="font-semibold text-zinc-950 text-sm">Filters & Sorting</span>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={onClearFilters}
                      className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onFilterClose}
                    className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Page-specific filter content */}
              <div className="space-y-3">{filterContent}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
