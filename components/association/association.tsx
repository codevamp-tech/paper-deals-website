"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bottom-logo`)
        if (!res.ok) throw new Error("Failed to fetch partner logos")
        const data = await res.json()

        // assuming API returns an array like: [{ id, name, logo, alt }]
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
    <div className="flex-shrink-0 w-32 md:w-40 h-32 md:h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
    </div>
  )

  return (
    <section className="w-full bg-white">
      {/* Header Section */}
      <div className="py-2  px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-600 tracking-tight">
          Our Brands
        </h1>
      </div>

      {/* Partner Logos Section */}
      <div className="px-4  py-2 md:py-16">
        {loading ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 md:gap-8 overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <PartnerSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-gray-500">No partners found.</p>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 md:gap-8 overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center"
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex-shrink-0 w-32 md:w-40 h-32 md:h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image
                    src={partner.logo_picture || "/placeholder.svg"}
                    alt={partner.alt || partner.logo_name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company Description Section */}
      <div className="px-4 py-2 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center max-w-6xl mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
            <div className="relative w-40 h-20 md:w-48 md:h-24">
              <Image
                src="/logomain.png"
                alt="Paper Deals Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 160px, 192px"
              />
            </div>
          </div>

          {/* Description Text */}
          <div className="flex-1">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center md:text-left">
              Kay Paper Deals Pvt Ltd is working as sourcing agent for Paper Industries. We are working with various
              paper mills across India and exporting to all the major paper manufacturers across world.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
    </section>
  )
}
