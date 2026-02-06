"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/hooks/use-theme"

interface Partner {
  id: string
  logo_name: string
  logo_picture: string
  alt: string
}

export default function AssumptionPartner() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bottom-logo?type=b2c`)
        if (!res.ok) throw new Error("Failed to fetch partner logos")
        const data = await res.json()
        setPartners(data?.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const PartnerSkeleton = () => (
    <div className="flex-shrink-0 w-40 md:w-48 h-32 md:h-36 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm animate-pulse">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )

  const LogoItem = ({ partner }: { partner: Partner }) => (
    <div
      className="group flex-shrink-0 w-40 md:w-48 h-32 md:h-36 bg-white rounded-2xl 
                 shadow-md hover:shadow-xl transition-all duration-300 
                 border border-gray-100 hover:border-gray-200
                 transform hover:scale-105 hover:-translate-y-1"
    >
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="relative w-full h-full">
          <Image
            src={partner.logo_picture || "/placeholder.svg"}
            alt={partner.alt || partner.logo_name}
            fill
            className="object-contain transition-all duration-300 group-hover:scale-110 
                       filter grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 160px, 192px"
          />
        </div>
      </div>
    </div>
  )

  return (
    <section className="w-full bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-24 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-12 md:mb-16">
        <div className="inline-block mb-4">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-wider">
            Our Partners
          </span>
        </div>

        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-[Poppins] ${theme.Text} 
                        bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent`}>
          Trusted Brands
        </h2>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Kay Paper Deals Pvt Ltd is working as a sourcing agent for Paper Industries.
          We collaborate with leading paper mills across India and export globally to major paper manufacturers.
        </p>
      </div>

      {/* Partner Logos Section with Gradient Overlays */}
      <div className="relative">
        {/* Left Gradient Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Right Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {loading ? (
          <div className="flex gap-6 md:gap-8 px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PartnerSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No partners found.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 md:gap-8 animate-marquee hover:pause-animation px-4"
              style={{
                width: "max-content",
              }}
            >
              {/* First set of logos */}
              {partners.map((partner) => (
                <LogoItem key={partner.id} partner={partner} />
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner) => (
                <LogoItem key={`duplicate-${partner.id}`} partner={partner} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Decorative Element */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
      </div>
    </section>
  )
}