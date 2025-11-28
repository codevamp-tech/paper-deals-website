"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CategoryCard from "./category-card"

interface Category {
  id: number | string
  name: string
  image: string
  status: number
  date: string
}

interface CategoriesProps {
  title?: string
  description?: string
}

const PAGINATION_CONFIG = {
  limit: 8,
  minPage: 1,
}

const RESPONSIVE_GRID_CLASSES = {
  mobile: "grid-cols-1",
  tablet: "md:grid-cols-2",
  desktop: "lg:grid-cols-4",
  gap: "gap-6 sm:gap-8 lg:gap-10",
}

export default function Categories({
  title = "Explore Our Categories",
  description = "Tap to access expertise across supply chains. Get Quotations, Prices, and Latest News Instantly",
}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { theme } = useTheme()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry?page=${page}&limit=${PAGINATION_CONFIG.limit}`,
        )

        if (!res.ok) throw new Error("Failed to fetch categories")

        const data = await res.json()
        const catArray = Array.isArray(data.categories) ? data.categories : []

        setCategories(catArray)

        if (data.total) {
          setTotalPages(Math.ceil(data.total / PAGINATION_CONFIG.limit))
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [page])

  const handlePreviousPage = () => {
    setPage((p) => Math.max(p - 1, PAGINATION_CONFIG.minPage))
  }

  const handleNextPage = () => {
    setPage((p) => Math.min(p + 1, totalPages))
  }

  const handlePageSelect = (pageNum: number) => {
    setPage(pageNum)
  }

  return (
    <section className="w-full overflow-x-hidden py-12 sm:py-16 lg:py-20 px-1 sm:px-2 lg:px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance"
            style={{ color: theme.Text }}
          >
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto">{description}</p>
        </header>

        {error && (
          <div
            className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Grid Container with pagination controls */}
        <div className="relative">
          <button
            onClick={handlePreviousPage}
            disabled={page === PAGINATION_CONFIG.minPage}
            className="absolute -left-16 sm:-left-12 top-1/2 transform -translate-y-1/2 z-20
                       p-2 rounded-full border border-border bg-card hover:bg-accent/10
                       transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                       hidden sm:flex items-center justify-center"
            aria-label="Previous page"
            aria-disabled={page === PAGINATION_CONFIG.minPage}
          >
            <ChevronLeft size={24} className="text-foreground text-green-400" />
          </button>

          <div
            className={`grid ${RESPONSIVE_GRID_CLASSES.mobile} ${RESPONSIVE_GRID_CLASSES.tablet} 
              ${RESPONSIVE_GRID_CLASSES.desktop} ${RESPONSIVE_GRID_CLASSES.gap} 
              w-full`}
          >

            {loading ? (
              <div
                className="col-span-full flex justify-center items-center py-20"
                role="status"
                aria-label="Loading categories"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent" />
                  <p className="text-sm text-muted-foreground">Loading categories...</p>
                </div>
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => <CategoryCard key={category.id} category={category} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No categories available</p>
              </div>
            )}
          </div>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="absolute -right-16 sm:-right-12 top-1/2 transform -translate-y-1/2 z-20
                       p-2 rounded-full border border-border bg-card hover:bg-accent/10
                       transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                       hidden sm:flex items-center justify-center"
            aria-label="Next page"
            aria-disabled={page === totalPages}
          >
            <ChevronRight size={24} className="text-foreground text-green-400" />
          </button>
        </div>

        {totalPages > 1 && (
          <nav className="mt-10 sm:mt-12 flex justify-center gap-2 sm:gap-3" aria-label="Pagination">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              const isActive = page === pageNum

              return (
                <button
                  key={i}
                  onClick={() => handlePageSelect(pageNum)}
                  className={`h-3 w-3 rounded-full transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                            ${isActive
                      ? "bg-foreground w-8 shadow-md"
                      : "bg-muted hover:bg-muted-foreground cursor-pointer"
                    }`}
                  style={{
                    backgroundColor: isActive ? theme.Text : "#ccc",
                  }}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isActive ? "page" : undefined}
                />
              )
            })}
          </nav>
        )}
      </div>
    </section>
  )
}
