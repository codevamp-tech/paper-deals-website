"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ConsultantBookingPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const consultantId = params?.id as string;

  const [slots, setSlots] = useState<
    { id: string; from: string; to: string; date: string }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    consultantId: consultantId || "",
    slot: "", // ✅ slot_id
    remarks: "",
  });

  // ✅ Fetch slots for consultant
  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/consultant/${consultantId}`
        );
        const data = await res.json();

        // ✅ Extract slots from response (your given structure)
        const extractedSlots =
          Array.isArray(data) && data.length > 0
            ? data.map((item: any) => ({
              id: item.slot_id,
              from: item.slot.from_time,
              to: item.slot.to_time,
              date: item.slot.date,
            }))
            : [];

        setSlots(extractedSlots);
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    if (consultantId) fetchSlots();
  }, [consultantId]);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit booking form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/consultant/book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      console.log("Booking confirmed:", data);

      router.push("/");
    } catch (err) {
      console.error("Error booking consultant:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <main className="min-h-screen bg-white text-black py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 md:p-10 bg-white text-black shadow-md">
          <h2 className="text-xl font-bold mb-6">Book Consultant</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <Label className="mb-1 block text-gray-700">Full Name *</Label>
              <Input
                className="bg-white text-black border border-gray-300"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label className="mb-1 block text-gray-700">Email *</Label>
              <Input
                className="bg-white text-black border border-gray-300"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <Label className="mb-1 block text-gray-700">Mobile *</Label>
              <Input
                className="bg-white text-black border border-gray-300"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            {/* Slots */}{/* Slots */}
            <div>
              <Label className="mb-1 block text-gray-700">Available Slots *</Label>
              {loadingSlots ? (
                <p className="text-gray-500">Loading slots...</p>
              ) : slots.length > 0 ? (
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, slot: val }))
                  }
                >
                  <SelectTrigger className="w-full bg-white text-black border border-gray-300">
                    <SelectValue placeholder="Select a slot" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {slots.map((s, i) => (
                      <SelectItem key={i} value={s.id}>
                        {s.from} - {s.to}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-red-500">No slots available</p>
              )}
            </div>


            {/* Date */}
            <div>
              <Label className="mb-1 block text-gray-700">Date *</Label>
              <Input
                type="date"
                className="bg-white text-black border border-gray-300"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>




            {/* Remarks */}
            <div>
              <Label className="bg-white text-black -700">Remarks</Label>
              <Textarea
                className="bg-white text-black border border-gray-300"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg- bg-[#0f7aed] hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          >
              
                Book Now
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default ConsultantBookingPage;
