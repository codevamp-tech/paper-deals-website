"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, Clock, ArrowRight, Info, AlertCircle } from "lucide-react"
import { getUserFromToken } from "@/hooks/use-token"

interface ConsultantData {
  id: number
  name: string
  email_address: string
  phone_no: string
}

interface AvailabilityData {
  date: string
  from_time: string
  to_time: string
}

interface BookingData {
  id: number
  availability_id: number
  consultant_id: number
  buyer_id: number
  amount: number
  order_id: string | null
  payment_id: string | null
  signature: string | null
  status: number
  created_at: string
  bookingConsultant: ConsultantData
  availability: AvailabilityData
}

export default function BuyerConsultantBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const user = getUserFromToken()
  const buyerId = user?.user_id

  useEffect(() => {
    const fetchBookings = async () => {
      if (!buyerId) return
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consultant-booking/buyer/${buyerId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch consultant bookings")
        }
        const data = await response.json()
        setBookings(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "An error occurred while fetching bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [buyerId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 font-medium animate-pulse">Loading consultant bookings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-4">
        <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-red-800">Error Loading Bookings</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">My Consultant Bookings</h1>
        <p className="mt-2 text-blue-100 max-w-2xl">
          View all your booked consultation slots, session timings, and connect with your consultants directly.
        </p>
      </div>

      {/* Bookings Card */}
      <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 py-5">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Booked Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Info className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">No consultations booked yet</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mt-1">
                  Need expert guidance on paper solutions? Browse our verified consultants and book a session today.
                </p>
              </div>
              <Button onClick={() => router.push("/B2B/consultants")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold">
                Browse Consultants <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Consultant</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900">{booking.bookingConsultant?.name || "N/A"}</div>
                          <div className="text-xs text-gray-500">{booking.bookingConsultant?.email_address || "N/A"}</div>
                          <div className="text-xs text-gray-500">{booking.bookingConsultant?.phone_no || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.availability ? (
                          <div className="space-y-1">
                            <div className="flex items-center text-xs font-medium text-gray-900 gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-blue-500" />
                              {new Date(booking.availability.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              {booking.availability.from_time} - {booking.availability.to_time}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {booking.amount === 0 ? "Free" : `Rs. ${booking.amount}`}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            booking.status === 1
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {booking.status === 1 ? "Confirmed" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/buyer-route/chat`)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Chat
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
