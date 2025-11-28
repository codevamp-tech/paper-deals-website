"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface CategoryCardProps {
  category: {
    id: number | string
    name: string
    description?: string
    image: string
  }
}

// Image now takes prominent position with enhanced styling and responsiveness
export default function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <article
      className="group relative bg-white rounded-2xl border border-border/50 
                 transition-all duration-300 ease-out 
                 hover:shadow-2xl hover:border-accent 
                 hover:scale-105 cursor-pointer
                 flex flex-col h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="link"
      tabIndex={0}
      aria-label={`${category.name} category`}
    >
      {/* Mobile: 140px, Tablet: 160px, Desktop: 180px */}
      <figure
        className="relative w-full pt-6 px-6 flex justify-center 
                   bg-gradient-to-b from-accent/5 to-transparent"
      >
        <div
          className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32
             rounded-2xl flex items-center justify-center 
             overflow-hidden 
             transition-all duration-300 group"
        >
          <img
            src={imageError ? "/placeholder.svg" : category.image}
            alt={`${category.name} category icon`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
          aria-hidden="true"
        />
      </figure>

      {/* Content container with semantic spacing */}
      <div className="flex flex-col flex-1 px-6 py-4 text-center">
        <h3
          className="text-base sm:text-lg lg:text-xl font-bold text-foreground 
                      mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-accent"
        >
          {category.name}
        </h3>

        {category.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
        )}

        <Link
          href={`/category/${category.id}`}
          className="mt-auto pt-2"
          aria-label={`View all items in ${category.name}`}
        >
          <div
            className="inline-flex items-center justify-center gap-2 
                       px-3 py-2 rounded-lg
                       text-accent font-semibold text-sm
                       bg-accent/10 hover:bg-accent/20
                       transition-all duration-300 
                       group-hover:gap-3 group-hover:translate-x-0.5"
          >
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">View All</span>
            <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </article>
  )
}
