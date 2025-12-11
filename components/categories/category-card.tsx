"use client"

import { useTheme } from "@/hooks/use-theme"
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
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }
  const { theme } = useTheme();

  return (
    <article
      className="group relative bg-gradient-to-br from-card via-card to-muted/30 rounded-3xl 
                 border border-border/40 backdrop-blur-sm
                 transition-all duration-500 ease-out 
                 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30
                 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer
                 flex h-full overflow-hidden bg-[#FBFFF9]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="link"
      tabIndex={0}
      aria-label={`${category.name} category`}
    >
      {/* Animated background gradient */}
      <div className=" absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none " aria-hidden="true" />

      {/* Left Side Image Container */}
      <div
        className="relative flex-shrink-0 w-28 sm:w-32 lg:w-36 
                   p-5 flex items-center justify-center 
                   bg-gradient-to-br from-primary/10 via-accent/5 to-transparent "
      >
        <div
          className="relative w-full h-32 sm:h-36
                     rounded-2xl flex items-center justify-center 
                     overflow-hidden shadow-lg
                     transition-all duration-500
                     group-hover:shadow-xl group-hover:shadow-primary/20 "
        >
          <img
            src={imageError ? "/placeholder.svg" : category.image}
            alt={`${category.name} category icon`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
            onError={handleImageError}
          />
          
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-700
                       translate-x-[-100%] group-hover:translate-x-[100%] 
                       skew-x-12 pointer-events-none"
            style={{ transition: 'transform 0.7s ease-out, opacity 0.7s ease-out' }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-1 flex flex-col justify-between p-5 pr-6 relative z-10">
        <div className="space-y-2.5">
          <h3
            className="text-lg font-bold text-foreground 
                      transition-all duration-300 
                      group-hover:text-primary group-hover:translate-x-1
                      line-clamp-2"
          >
            {category.name}
          </h3>

          {category.description && (
            <p className="text-sm text-muted-foreground/80 line-clamp-3 pr-1 leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        <div className="mt-5">
          <Link
            href={`/category/${category.id}`}
            className="inline-flex items-center"
            aria-label={`View all items in ${category.name}`}
          >
            <div
              className="inline-flex items-center justify-center gap-2
                         px-4 py-2 rounded-xl
                         text-primary font-semibold text-sm
                         hover:from-primary/25 hover:via-primary/20 hover:to-accent/20
                         border border-primary/25 hover:border-primary/40
                         transition-all duration-300 
                         group-hover:gap-3 group-hover:translate-x-1
                         group-hover:shadow-md group-hover:shadow-primary/20
                         relative overflow-hidden"
                         style={{color: theme.buttoncolor,
                          borderColor: theme.buttoncolor
                         }}
            >
              <span className="relative z-10">View All</span>
              <ChevronRight 
                size={18} 
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
              />
              
              {/* Button shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           translate-x-[-100%] group-hover:translate-x-[100%] 
                           transition-transform duration-700 ease-out"
                aria-hidden="true"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
    </article>
  )
}