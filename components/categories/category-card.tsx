"use client"

import { useTheme } from "@/hooks/use-theme"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

interface CategoryCardProps {
  category: {
    id: number | string
    name: string
    description?: string
    image: string
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false)
  const { theme } = useTheme();

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex h-full premium-shadow-hover"
    >
      {/* Decorative background circle */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Left Side: Image */}
      <div className="relative w-1/3 min-w-[120px] bg-gray-50 flex items-center justify-center p-4">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
          <img
            src={imageError ? "/placeholder.svg" : category.image}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {category.description || `Explore our high-quality ${category.name} solutions for your business needs.`}
          </p>
        </div>

        <div className="mt-4">
          <Link href={`/category/${category.id}`}>
            <div 
              className="inline-flex items-center gap-2 text-sm font-bold text-primary group/btn"
              style={{ color: theme.buttoncolor }}
            >
              <span className="relative">
                View All
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </span>
              <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}