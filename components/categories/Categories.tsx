"use client"

import { useState, useEffect } from "react"
import CategoryCard from "./category-card"
import { useTheme } from "@/hooks/use-theme"

interface Category {
  id: number | string
  name: string
  image: string
  status: number
  date: string
}

interface CategoriesProps {
  title?: string
  subtitle?: string
  description?: string
}

export default function Categories({
  title = "Explore Our Categories",
  description = "Tap to access expertise across supply chains. Get Quotations, Prices, and Latest News Instantly",
}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry?limit=12`)
        if (!res.ok) throw new Error("Failed to fetch categories")

        const data = await res.json()

        // ✅ Correctly extract categories array
        const catArray = Array.isArray(data.categories) ? data.categories : []

        setCategories(catArray)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className=" text-[6vh] font-[900] mb-3"
            style={{ color: theme.Text }}
          >
            {title}
          </h2>
          <p className="flex justify-center text-[3vh]">
            {description}
          </p>

        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
