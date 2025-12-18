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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bottom-logo`)
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
    <div className="flex-shrink-0 w-32 md:w-40 h-32 md:h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
    </div>
  )

  const LogoItem = ({ partner }: { partner: Partner }) => (
    <div
      className="flex-shrink-0 w-32 md:w-40 h-32 md:h-40 border border-gray-200 
                 flex items-center justify-center cursor-pointer rounded-full"
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl">
        <Image
          src={partner.logo_picture || "/placeholder.svg"}
          alt={partner.alt || partner.logo_name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 96px, 128px"
        />
      </div>
    </div>
  )

  return (
    <section className="w-full bg-white my-[20px]">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className={`text-[6vh] font-[900] mt-1 font-[Poppins] flex justify-center ${theme.Text}`}>Our Brands</h2>

        <p className=" flex justify-center text-[3vh] text-center pb-4 pt-4 ">
          Kay Paper Deals Pvt Ltd is working as a sourcing agent for Paper Industries. We collaborate with leading paper
          mills across India and export globally to major paper manufacturers.
        </p>
      </div>

      {/* Partner Logos Section */}
      <div>
        {loading ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 md:gap-8 overflow-hidden pb-4 md:pb-0 md:flex-wrap md:justify-center"
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
          <div className="overflow-hidden pt-12 mb-10">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 md:gap-8 animate-marquee hover:pause-animation"
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
    </section>
  )
}
