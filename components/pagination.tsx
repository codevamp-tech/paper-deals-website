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
  // ❌ Pehle tha: if (totalPages <= 1) return null;
  // ✅ Ab sirf 0 pages pe null return karega
  if (totalPages < 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // how many pages to show around current

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
      <div className="flex flex-wrap items-center justify-center gap-2 bg-gray-200 p-2 rounded-md shadow">
        <Button
          variant="outline"
          className="bg-white text-black border-gray-300 hover:bg-gray-100"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Button>

        {getPages().map((page, idx) =>
          page === "…" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-black">
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              className={
                page === currentPage
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }
              onClick={() => onPageChange(Number(page))}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          className="bg-white text-black border-gray-300 hover:bg-gray-100"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
