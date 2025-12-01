"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
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
  limit: 16, // Increased to show more items in carousels
  minPage: 1,
}

export default function Categories({
  title = "Explore Our Categories",
  description = "Tap to access expertise across supply chains. Get Quotations, Prices, and Latest News Instantly",
}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { theme } = useTheme()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry?page=1&limit=${PAGINATION_CONFIG.limit}`,
        )

        if (!res.ok) throw new Error("Failed to fetch categories")

        const data = await res.json()
        const catArray = Array.isArray(data.categories) ? data.categories : []

        setCategories(catArray)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Split categories into two groups for the two carousels
  const midpoint = Math.ceil(categories.length / 2)
  const firstRowCategories = categories.slice(0, midpoint)
  const secondRowCategories = categories.slice(midpoint)

  return (
    <section className="w-full overflow-hidden py-3 sm:py-4 lg:py-5 px-1 sm:px-2 lg:px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 sm:mb-16">
          <h2
            className={`${theme.Text} text-[6vh] font-[900] mt-1 font-[Poppins] flex justify-center`}
          >
            {title}
          </h2>
          <p className="flex justify-center text-[3vh] text-center pb-4 pt-4">{description}</p>
        </header>

        {error && (
          <div
            className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="flex justify-center items-center py-20"
            role="status"
            aria-label="Loading categories"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent" />
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-4">
            {/* First Carousel - Right to Left */}
            <div className="relative py-4 overflow-hidden">
              <style jsx>{`
                @keyframes scroll-left {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-scroll-left {
                  animation: scroll-left 30s linear infinite;
                }
                .animate-scroll-left:hover {
                  animation-play-state: paused;
                }
              `}</style>

              <div className="flex animate-scroll-left">
                {/* Duplicate items for seamless loop */}
                {[...firstRowCategories, ...firstRowCategories].map((category, index) => (
                  <div key={`first-${category.id}-${index}`} className="flex-shrink-0 w-64 px-3">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>

            {/* Second Carousel - Left to Right */}
            <div className="relative  py-4 overflow-hidden">
              <style jsx>{`
                @keyframes scroll-right {
                  0% {
                    transform: translateX(-50%);
                  }
                  100% {
                    transform: translateX(0);
                  }
                }
                .animate-scroll-right {
                  animation: scroll-right 30s linear infinite;
                }
                .animate-scroll-right:hover {
                  animation-play-state: paused;
                }
              `}</style>

              <div className="flex animate-scroll-right">
                {/* Duplicate items for seamless loop */}
                {[...secondRowCategories, ...secondRowCategories].map((category, index) => (
                  <div key={`second-${category.id}-${index}`} className="flex-shrink-0 w-64 px-3">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available</p>
          </div>
        )}
      </div>
    </section>
  )
}