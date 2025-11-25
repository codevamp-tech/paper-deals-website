"use client";

import { useState, useEffect } from "react";
import CategoryCard from "./category-card";
import { useTheme } from "@/hooks/use-theme";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: number | string;
  name: string;
  image: string;
  status: number;
  date: string;
}

interface CategoriesProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function Categories({
  title = "Explore Our Categories",
  description = "Tap to access expertise across supply chains. Get Quotations, Prices, and Latest News Instantly",
}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry?page=${page}&limit=${limit}`
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        const catArray = Array.isArray(data.categories) ? data.categories : [];

        setCategories(catArray);

        if (data.total) {
          setTotalPages(Math.ceil(data.total / limit));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-[6vh] font-[900] mb-3"
            style={{ color: theme.Text }}
          >
            {title}
          </h2>
          <p className="text-[3vh] text-center">{description}</p>
        </div>

        {/* Content with Left/Right Arrows */}
        <div className="relative flex items-center justify-center">

          {/* LEFT ARROW */}
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="absolute left-0 z-20 p-3 rounded-full border shadow-md bg-white disabled:opacity-40"
            style={{ color: theme.Text }}
          >
            <ChevronLeft size={26} />
          </button>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-12 w-full">
            {loading ? (
              <div className="col-span-4 flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
              </div>
            ) : (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="absolute right-0 z-20 p-3 rounded-full border shadow-md bg-white disabled:opacity-40"
            style={{ color: theme.Text }}
          >
            <ChevronRight size={26} />
          </button>
        </div>

        {/* Page indicator */}
        {/* Bullet Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full ${page === i + 1 ? "bg-black" : "bg-gray-400"
                }`}
              style={{
                backgroundColor: page === i + 1 ? theme.Text : "#ccc",
              }}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
}
