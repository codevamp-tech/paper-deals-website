"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

const ConsultantBookingPage: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const consultantId = params?.id as string

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    consultantId: consultantId || "",
    date: "",
    remarks: "",
  })

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ Submit booking form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/consultant/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error(`Error: ${res.status}`)
      const data = await res.json()
      console.log("Booking confirmed:", data)

      router.push("/booking-success")
    } catch (err) {
      console.error("Error booking consultant:", err)
      alert("Something went wrong!")
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 md:p-10">
          <h2 className="text-xl font-bold mb-6 text-black">
            Book Consultant #{consultantId}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <Label className="mb-1 block text-gray-700">Full Name *</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {/* Email */}
            <div>
              <Label className="mb-1 block text-gray-700">Email *</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Mobile */}
            <div>
              <Label className="mb-1 block text-gray-700">Mobile *</Label>
              <Input name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>

            {/* Date */}
            <div>
              <Label className="mb-1 block text-gray-700">Preferred Date *</Label>
              <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>

            {/* Remarks */}
            <div>
              <Label className="mb-1 block text-gray-700">Remarks</Label>
              <Textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3} />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <Button type="submit" className="px-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                Book Now
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}

export default ConsultantBookingPage
