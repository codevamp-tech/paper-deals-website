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

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className="group relative bg-white rounded-xl border-2 border-category-border p-6 
                 transition-all duration-300 ease-out hover:shadow-lg 
                 hover:border-category-accent hover:translate-y-[-4px] cursor-pointer
                 flex flex-col items-center text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="link"
      tabIndex={0}
    >

      {/* Category Name on Top */}
      <h3 className="text-lg sm:text-xl font-semibold text-category-heading mb-4">
        {category.name}
      </h3>

      {/* Image in Middle */}
      <div className="w-20 h-20 bg-category-icon-bg rounded-lg flex items-center justify-center 
                      overflow-hidden shadow-sm mb-4">
        <img
          src={category.image || "/placeholder.svg"}
          alt={`${category.name} icon`}
          className="w-full h-full object-contain p-2"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"%3E%3Cpath d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/%3E%3C/svg%3E'
          }}
        />
      </div>

      {/* View All Button at Bottom */}
      <Link href={`/category/${category.id}`}>
        <div className="flex items-center justify-center gap-2 
                        text-category-accent font-medium transition-all duration-300 
                        hover:text-category-accent-hover group-hover:gap-3">
          <span className="text-sm">View All</span>
          <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  )
}
