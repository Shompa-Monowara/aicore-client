"use client";

const getPageNumbers = (page, totalPages) => {
  const pages = [];
  pages.push(1);
  if (page > 3) {
    pages.push("ellipsis");
  }
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) {
    pages.push("ellipsis");
  }
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  return pages;
};

export default function Pagination({ page, totalPages, total, onPageChange }) {
  const startItem = total === 0 ? 0 : (page - 1) * 9 + 1;
  const endItem = Math.min(page * 9, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-12 w-full pt-6 border-t border-purple-950/10">
      <p className="text-zinc-500 text-xs font-medium">
        Showing <span className="text-zinc-300">{startItem}-{endItem}</span> of{" "}
        <span className="text-zinc-300">{total}</span> assets
      </p>

      <div className="flex items-center gap-2 select-none">
        {/* Previous Button */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="px-4 py-2 rounded-xl bg-zinc-900/30 border border-purple-950/30 text-zinc-400 text-xs font-bold hover:text-white hover:border-purple-500/40 disabled:opacity-40 disabled:hover:border-purple-950/30 disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
        >
          &larr; Prev
        </button>

        {/* Page Numbers & Ellipsis */}
        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 py-1 text-zinc-600 font-bold"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                p === page
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 shadow-md shadow-purple-950/20"
                  : "bg-zinc-900/20 border-purple-950/30 text-zinc-400 hover:text-white hover:border-purple-500/40"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="px-4 py-2 rounded-xl bg-zinc-900/30 border border-purple-950/30 text-zinc-400 text-xs font-bold hover:text-white hover:border-purple-500/40 disabled:opacity-40 disabled:hover:border-purple-950/30 disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}