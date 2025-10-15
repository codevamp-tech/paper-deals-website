"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ApiCategory = {
  id: number;
  name: string;
  image: string;
  status: number;
  date: string;
};

type ApiResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: ApiCategory[];
};

export default function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ApiCategory | null>(null);
  const [categoriesData, setCategoriesData] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry?page=${page}&limit=10`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: ApiResponse = await res.json();

        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoriesData(data.categories);
          setActiveCategory(data.categories[0]);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  const handleCategoryHover = (category: ApiCategory) => {
    setActiveCategory(category);
  };

  const handleOpenDropdown = () => {
    setIsOpen(true);
    if (!activeCategory && categoriesData.length > 0) {
      setActiveCategory(categoriesData[0]);
    }
  };

  if (loading) {
    return (
      <button className="px-4 py-4 text-gray-700 font-medium">Loading...</button>
    );
  }

  return (
    <div className="relative">
      {/* Categories Button */}
      <button
        className="flex items-center gap-2 px-4 py-4 text-white font-medium"
        onMouseEnter={handleOpenDropdown}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className="hidden sm:inline">All Categories</span>
        <span className="sm:hidden">Categories</span>
      </button>

      {/* Dropdown */}
      {isOpen && categoriesData.length > 0 && (
        <div
          className="absolute left-0 top-full bg-black text-white shadow-lg z-50 
          w-screen h-screen sm:w-[90vw] sm:h-[80vh] md:w-[85vw] md:h-[75vh] lg:w-[80vw] lg:h-[70vh]
          -ml-4 sm:-ml-8 md:-ml-12 lg:-ml-0"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex flex-col sm:flex-row border-t border-gray-200 h-full">
            {/* Left Categories */}
            <div className="w-full sm:w-64 md:w-72 lg:w-64 bg-black py-2 overflow-y-auto">
              {categoriesData.map((category) => (
                <button
                  key={category.id}
                  className={`flex items-center gap-3 w-full text-left px-3 sm:px-4 py-3 hover:bg-[#333] ${
                    activeCategory?.id === category.id ? "bg-[#333]" : ""
                  }`}
                  onMouseEnter={() => handleCategoryHover(category)}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-xs">
                      {category.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-white text-sm sm:text-base flex-1">
                    {category.name}
                  </span>
                </button>
              ))}

              {/* Pagination */}
              <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-300">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`px-2 py-1 rounded ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#333]"
                  }`}
                >
                  Prev
                </button>
                <span>
                  Page {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-2 py-1 rounded ${
                    page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#333]"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Right Content */}
            {activeCategory && (
              <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-3">
                  {activeCategory.name}
                </h2>
                <p className="text-sm text-gray-300">
                  Status:{" "}
                  {activeCategory.status === 1 ? "Active ✅" : "Inactive ❌"}
                </p>
                <p className="text-sm text-gray-400">
                  Added on:{" "}
                  {new Date(activeCategory.date).toLocaleDateString()}
                </p>
                {activeCategory.image && (
                  <img
                    src={activeCategory.image}
                    alt={activeCategory.name}
                    className="mt-4 w-40 h-40 object-cover rounded-lg shadow"
                  />
                )}

                {/* Example Links */}
                <div className="mt-6 space-y-2">
                  <Link
                    href={`/category/${activeCategory.id}`}
                    onClick={() => setIsOpen(false)} // 👈 close dropdown
                    className="block text-blue-400 hover:underline"
                  >
                    View Products
                  </Link>
                  <Link
                    href={`/category/${activeCategory.id}/sellers`}
                    onClick={() => setIsOpen(false)} // 👈 close dropdown
                    className="block text-blue-400 hover:underline"
                  >
                    Find Sellers
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
