"use client";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  onPageChange,
}: TablePaginationProps) {
  return (
    <div className="p-4 border-t border-zinc-200/60 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
      <span>
        Showing {totalItems === 0 ? 0 : startIndex + 1} to{" "}
        {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white disabled:opacity-50 disabled:hover:bg-white transition-colors cursor-pointer"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border border-zinc-200 rounded-lg transition-colors cursor-pointer ${
              currentPage === page
                ? "bg-zinc-950 text-white"
                : "bg-white hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white disabled:opacity-50 disabled:hover:bg-white transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
