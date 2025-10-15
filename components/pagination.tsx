"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("…");
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("…");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 bg-gray-200 p-2 sm:p-3 rounded-md shadow w-full max-w-xs sm:max-w-md mx-auto">
        {/* Previous Button */}
        <Button
          variant="outline"
          className="bg-white text-black border-gray-300 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3 py-1 h-8 sm:h-9"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="hidden xs:inline">Prev</span>
          <span className="xs:hidden">‹</span>
        </Button>

        {/* Page Numbers */}
        {getPages().map((page, idx) =>
          page === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 sm:px-2 text-black text-xs sm:text-sm"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              className={
                page === currentPage
                  ? "bg-blue-500 text-white hover:bg-blue-600 text-xs sm:text-sm px-2 sm:px-3 py-1 h-8 sm:h-9 min-w-[32px] sm:min-w-[40px]"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3 py-1 h-8 sm:h-9 min-w-[32px] sm:min-w-[40px]"
              }
              onClick={() => onPageChange(Number(page))}
            >
              {page}
            </Button>
          )
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          className="bg-white text-black border-gray-300 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3 py-1 h-8 sm:h-9"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden xs:inline">Next</span>
          <span className="xs:hidden">›</span>
        </Button>
      </div>
    </div>
  );
}
