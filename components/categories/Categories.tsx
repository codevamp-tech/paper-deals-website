"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
import { motion } from "framer-motion"
import CategoryCard from "./category-card"
import { CategorySkeleton } from "@/components/ui/SkeletonLoader"

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
  limit: 16,
  minPage: 1,
}

export default function Categories({
  title = "Explore Our Categories",
  description = "Access expertise across supply chains. Get quotations and latest prices instantly.",
}: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry?page=1&limit=${PAGINATION_CONFIG.limit}`,
        )
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        setCategories(Array.isArray(data.categories) ? data.categories : [])
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories.")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const midpoint = Math.ceil(categories.length / 2)
  const firstRowCategories = categories.slice(0, midpoint)
  const secondRowCategories = categories.slice(midpoint)

  return (
    <section className="w-full py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            {description}
          </p>
        </motion.header>

        {loading ? (
          <div className="space-y-12">
            <div className="flex gap-6 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-80">
                  <CategorySkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-10">
            {/* Row 1 - Left */}
            <div className="relative">
              <div className="flex animate-marquee gap-8">
                {[...firstRowCategories, ...firstRowCategories].map((category, index) => (
                  <div key={`${category.id}-${index}`} className="flex-shrink-0 w-[350px]">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - Right */}
            <div className="relative">
              <div className="flex animate-marquee-reverse gap-8">
                {[...secondRowCategories, ...secondRowCategories].map((category, index) => (
                  <div key={`${category.id}-${index}`} className="flex-shrink-0 w-[350px]">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No categories found.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-350px * ${midpoint} - 2rem * ${midpoint})); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(calc(-350px * ${midpoint} - 2rem * ${midpoint})); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}