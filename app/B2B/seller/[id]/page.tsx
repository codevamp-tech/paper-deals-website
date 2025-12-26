"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import SellerProductCrousel from "@/components/sellerProductCrousel"
import Cookies from "js-cookie"
import { useRouter, usePathname } from "next/navigation"



const states = [
  { id: "1", name: "Andaman and Nicobar Islands" },
  { id: "2", name: "Andhra Pradesh" },
  { id: "3", name: "Arunachal Pradesh" },
  { id: "4", name: "Assam" },
  { id: "5", name: "Bihar" },
  { id: "6", name: "Chhattisgarh" },
  { id: "7", name: "Chandigarh" },
  { id: "8", name: "Daman and Diu" },
  { id: "9", name: "Delhi" },
  { id: "10", name: "Goa" },
  { id: "11", name: "Gujarat" },
  { id: "12", name: "Haryana" },
  { id: "13", name: "Himachal Pradesh" },
  { id: "14", name: "Jammu and Kashmir" },
  { id: "15", name: "Jharkhand" },
  { id: "16", name: "Karnataka" },
  { id: "17", name: "Kerala" },
  { id: "18", name: "Ladakh" },
  { id: "19", name: "Lakshadweep" },
  { id: "20", name: "Madhya Pradesh" },
  { id: "21", name: "Maharashtra" },
  { id: "22", name: "Manipur" },
  { id: "23", name: "Meghalaya" },
  { id: "24", name: "Mizoram" },
  { id: "25", name: "Nagaland" },
  { id: "26", name: "Odisha" },
  { id: "27", name: "Puducherry" },
  { id: "28", name: "Punjab" },
  { id: "29", name: "Rajasthan" },
  { id: "30", name: "Sikkim" },
  { id: "31", name: "Tamil Nadu" },
  { id: "32", name: "Telangana" },
  { id: "33", name: "Tripura" },
  { id: "34", name: "Uttar Pradesh" },
  { id: "35", name: "Uttarakhand" },
  { id: "36", name: "West Bengal" },
]

type Seller = {
  name?: string
  email_address?: string
  phone_no?: string
  organization?: any
}

function Field({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-sm text-gray-600">{value || "N/A"}</p>
    </div>
  )
}

function SellerSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Card className="border rounded-xl bg-white">
          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8">
              {/* Skeleton for image */}
              <div className="w-full">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              </div>

              {/* Right side skeleton */}
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Grid fields */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 flex justify-center">
          <Skeleton className="h-11 w-40 rounded-md" />
        </div>
      </section>
    </main>
  )
}


export default function BuyersPage() {
  const { id } = useParams()
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  const handleSendEnquiry = () => {
    const token = Cookies.get("token")

    if (!token) {
      // 🔁 Redirect to login with return URL
      router.push(`/buyer-login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // ✅ Logged in → go to enquiry
    router.push(`/B2B/seller/${id}/enquiry`)
  }


  useEffect(() => {
    let isMounted = true
    const fetchSeller = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users//buyerbyid/${id}`
        )
        const data = await res.json()

        if (!isMounted) return
        setSeller(data || null)
      } catch (e) {
        console.error("[BuyersPage] Error fetching seller:", e)
        if (isMounted) setSeller(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchSeller()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) return <SellerSkeleton />

  if (!seller) {
    return (
      <main className="min-h-screen grid place-items-center bg-white">
        <p className="text-sm font-medium text-gray-600">Seller not found</p>
      </main>
    )
  }

  const org = seller.organization || {}
  const isVerified = Boolean(org?.verified)
  const orgName = org?.organizations || seller.name || "Seller"
  const stateName =
    states.find((s) => s.id === String(org?.state))?.name || "N/A"

  // Normalize optional fields
  const typeOfSeller = org?.type_of_seller || "Seller"
  const capacity =
    org?.production_capacity_tpm || org?.production_capacity || ""
  const dealsIn = org?.materials_used_names && org.materials_used_names.length > 0
    ? org.materials_used_names.join(", ")
    : "Not Available"

  const description = org?.description || org?.descriptions || ""

  const email = seller.email_address || org?.email || ""
  const phone = seller.phone_no || org?.phone || ""

  // enquiryid (static or dynamic)
  const enquiryid = "new"

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Card with Gradient Background */}
        <Card className="border-0 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-xl overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
              {/* Image / Logo */}
              <div className="w-full">
                <div className="aspect-[4/3] w-full rounded-xl border-2 border-gray-200 bg-white shadow-md overflow-hidden flex items-center justify-center hover:shadow-lg transition-shadow">
                  {org?.image_banner ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${org.image_banner}`}
                      alt={orgName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold uppercase">
                          {orgName
                            ?.split(" ")
                            .map(word => word[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-3">
                        {orgName}
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right: Title + badge + fields */}
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {orgName}
                  </h1>
                  <Badge
                    className={
                      isVerified
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 text-sm font-semibold shadow-md"
                        : "bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-1.5 text-sm font-semibold shadow-md"
                    }
                  >
                    {isVerified ? "✓ Verified" : "Not Verified"}
                  </Badge>
                </div>

                {/* Grid fields with enhanced styling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">City</p>
                    <p className="text-base font-semibold text-gray-900">{org?.city || "N/A"}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">State</p>
                    <p className="text-base font-semibold text-gray-900">{stateName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type of Seller</p>
                    <p className="text-base font-semibold text-gray-900">{typeOfSeller}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Production Capacity</p>
                    <p className="text-base font-semibold text-gray-900">{capacity || "N/A"}</p>
                  </div>
                </div>

                {/* Deals In - Full width */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 mb-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Deals In</p>
                  <p className="text-sm font-medium text-gray-800">{dealsIn}</p>
                </div>

                {/* Description */}
                {description && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      About
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className=" flex justify-center">
              <Button
                onClick={handleSendEnquiry}
                className="px-10 h-14 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:scale-105 transition-all rounded-xl"
              >
                Send Enquiry Now
              </Button>
            </div>
          </div>
        </Card>

        {/* CTA – centered under the card */}


      </section>
      <SellerProductCrousel sellerId={id} />
    </main>
  )
}



