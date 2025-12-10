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
  <section className="w-full overflow-hidden py-16 px-1 sm:px-2 lg:px-4 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 sm:mb-20">
          <h2
            className={`${theme.Text} text-[6vh] font-[900] mt-1 font-[Poppins] flex justify-center bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent`}
          >
            {title}
          </h2>
          <p className="flex justify-center text-[3vh] text-center pb-4 pt-4 text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </header>

        {error && (
          <div
            className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm backdrop-blur-sm shadow-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {/* First Row Skeleton */}
            <div className="relative py-4 overflow-hidden">
              <div className="flex">
                {[...Array(6)].map((_, i) => (
                  <CategorySkeleton key={`sk-first-${i}`} />
                ))}
              </div>
            </div>
            {/* Second Row Skeleton */}
            <div className="relative py-4 overflow-hidden">
              <div className="flex">
                {[...Array(6)].map((_, i) => (
                  <CategorySkeleton key={`sk-second-${i}`} />
                ))}
              </div>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-8">
            {/* First Carousel - Right to Left */}
            <div className="relative py-6 overflow-hidden ">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
              
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

              <div className="flex animate-scroll-left gap-6 ">
                {/* Duplicate items for seamless loop */}
                {[...firstRowCategories, ...firstRowCategories].map((category, index) => (
                  <div key={`first-${category.id}-${index}`} className="flex-shrink-0 w-80 h-52 transform transition-transform duration-300 hover:scale-105 ">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>

            {/* Second Carousel - Left to Right */}
            <div className="relative py-6 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
              
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

              <div className="flex animate-scroll-right gap-6">
                {/* Duplicate items for seamless loop */}
                {[...secondRowCategories, ...secondRowCategories].map((category, index) => (
                  <div key={`second-${category.id}-${index}`} className="flex-shrink-0 w-80 h-52 transform transition-transform duration-300 hover:scale-105">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No categories available</p>
          </div>
        )}
      </div>
    </section>
  )
}

function CategorySkeleton() {
  return (
    <div className="w-64 px-3 flex-shrink-0">
      <div className="animate-pulse">
        <div className="w-full h-40 bg-muted rounded-xl mb-3"></div>
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  )
}