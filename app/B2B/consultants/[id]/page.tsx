"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  MessageSquare, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserFromToken } from "@/hooks/use-token";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ConsultantBookingPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const consultantId = params?.id as string;

  const [slots, setSlots] = useState<
    { id: string; slot_id: string; from: string; to: string; date: string; price: number }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    consultantId: consultantId || "",
    slot: "", // ✅ ConsultantSlot primary key ID
    date: "", // Fixed: Added missing date field
    remarks: "",
  });

  const user = getUserFromToken();

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  // Prefill buyer information if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.user_name || "",
        mobile: prev.mobile || user.phone_no || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // ✅ Fetch slots for consultant
  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/consultant-availability/${consultantId}`
        );
        const data = await res.json();

        // ✅ Extract slots from response, only showing available slots (is_booked === 0)
        const extractedSlots =
          Array.isArray(data) && data.length > 0
            ? data
              .filter((item: any) => item.is_booked === 0)
              .map((item: any) => ({
                id: String(item.id),
                slot_id: String(item.id),
                from: item.from_time || "",
                to: item.to_time || "",
                date: item.date || "",
                price: Number(item.price || 0),
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
 
  // ✅ Extract all available dates formatted as YYYY-MM-DD
  const availableDatesStr = slots.map(s => {
    const d = new Date(s.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // ✅ Filter slots by selected date
  const filteredSlots = slots.filter((s) => {
    if (!formData.date) return false;
    try {
      const d = new Date(s.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const slotDate = `${year}-${month}-${day}`;
      
      return slotDate === formData.date || s.date.split("T")[0] === formData.date;
    } catch (e) {
      return false;
    }
  });

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit booking form & launch payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to book a consultation.");
      return;
    }

    const selectedSlotObj = slots.find((s) => String(s.id) === formData.slot);
    if (!selectedSlotObj) {
      alert("Please select a valid available time slot.");
      return;
    }

    setSubmitting(true);
    const amount = Number(selectedSlotObj.price) || 0;

    try {
      if (amount <= 0) {
        // Direct booking if price is 0 (free slot)
        const bookingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/consultant-booking`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              availability_id: Number(selectedSlotObj.id),
              consultant_id: Number(consultantId),
              buyer_id: user.user_id,
              amount: amount,
              order_id: null,
              payment_id: null,
              signature: null
            }),
          }
        );
        if (!bookingRes.ok) throw new Error("Failed to create booking.");
        alert("Booking confirmed successfully!");
        router.push("/buyer-route/consultant-bookings");
        return;
      }

      // 1. Create order on backend (amount in Rupees)
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed");
      }

      const { order, key } = orderData;

      // 2. Open Razorpay payment gateway
      const options = {
        key: key,
        amount: order.amount, // in paise
        currency: "INR",
        name: "Paper Deals",
        description: `Consultation Booking`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            setSubmitting(true);
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

            // 3. Verify payment on backend
            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              // 4. Create the Booking record (marks slot as booked on backend)
              const bookingRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/consultant-booking`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    availability_id: Number(selectedSlotObj.id),
                    consultant_id: Number(consultantId),
                    buyer_id: user.user_id,
                    amount: amount,
                    order_id: razorpay_order_id,
                    payment_id: razorpay_payment_id,
                    signature: razorpay_signature,
                  }),
                }
              );

              if (!bookingRes.ok) throw new Error("Failed to confirm booking.");
              
              alert("Payment & Booking confirmed successfully!");
              router.push("/buyer-route/consultant-bookings");
            } else {
              alert(verifyData.message || "Payment verification failed.");
            }
          } catch (err: any) {
            console.error("Booking error:", err);
            alert("An error occurred during booking confirmation. Please contact support.");
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#0F766E", // Teal primary color
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error.description || "Unknown Error"}`);
        setSubmitting(false);
      });
    } catch (err: any) {
      console.error("Error launching checkout:", err);
      alert(err.message || "Something went wrong! Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Consultants</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-primary border-none text-white rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20">
                <CardContent className="p-8 space-y-6">
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Book Your Session</h1>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Secure your consultation with our verified industry expert. Fill in your details to confirm the appointment.
                    </p>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Verified Expert</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Instant Confirmation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips or Summary */}
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Quick Tip</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Briefly describe your requirements in the remarks section to help the consultant prepare better for your session.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" /> Full Name *
                        </Label>
                        <Input
                          className="h-14 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10 transition-all text-base"
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" /> Email Address *
                        </Label>
                        <Input
                          className="h-14 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10 transition-all text-base"
                          placeholder="your@email.com"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Mobile */}
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" /> Mobile Number *
                        </Label>
                        <Input
                          className="h-14 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10 transition-all text-base"
                          placeholder="+91 XXXXX XXXXX"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-2 flex flex-col">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" /> Select Date *
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-14 justify-start text-left font-normal rounded-xl border-gray-200 text-base hover:bg-gray-50",
                                !formData.date && "text-muted-foreground"
                              )}
                            >
                              {formData.date ? format(parseISO(formData.date), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.date ? parseISO(formData.date) : undefined}
                              onSelect={(day) => {
                                if (day) {
                                  const year = day.getFullYear();
                                  const month = String(day.getMonth() + 1).padStart(2, "0");
                                  const date = String(day.getDate()).padStart(2, "0");
                                  setFormData(prev => ({ ...prev, date: `${year}-${month}-${date}`, slot: "" }));
                                }
                              }}
                              initialFocus
                              disabled={(date) => {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                const dateStr = `${year}-${month}-${day}`;
                                // Only allow dates that have available slots
                                return !availableDatesStr.includes(dateStr);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Slots Selection */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> Available Time Slots *
                      </Label>
                      {loadingSlots ? (
                        <div className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                      ) : !formData.date ? (
                        <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Please select a date to see available slots.</span>
                        </div>
                      ) : filteredSlots.length > 0 ? (
                        <Select
                          onValueChange={(val) =>
                            setFormData((prev) => ({ ...prev, slot: val }))
                          }
                          required
                        >
                          <SelectTrigger className="h-14 rounded-xl border-gray-200 focus:border-primary transition-all text-base">
                            <SelectValue placeholder="Select a convenient slot" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                            {filteredSlots.map((s) => (
                              <SelectItem key={s.id} value={s.id} className="h-12 focus:bg-primary/5">
                                <span className="font-medium text-gray-700">{s.from} - {s.to}</span>
                                <span className="ml-2 text-xs text-gray-400">
                                  ({new Date(s.date).toLocaleDateString()})
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">No slots available for the selected date.</span>
                        </div>
                      )}
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" /> Additional Remarks
                      </Label>
                      <Textarea
                        className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10 transition-all text-base min-h-[120px] p-4"
                        placeholder="Tell us more about what you want to discuss..."
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Dynamic Price Display */}
                    {formData.slot && (
                      <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100/50 flex justify-between items-center animate-fadeIn shadow-sm shadow-teal-500/5">
                        <div className="flex flex-col">
                          <span className="text-teal-900 font-bold text-base">Consultation Fee</span>
                          <span className="text-teal-600/70 text-xs mt-0.5 font-medium">Charged once slot is booked</span>
                        </div>
                        <span className="text-teal-700 font-black text-2xl tracking-tight">
                          Rs. {slots.find((s) => String(s.id) === formData.slot)?.price || 0}
                        </span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        {submitting ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                      <p className="text-center text-gray-400 text-xs mt-4 uppercase tracking-widest">
                        Secure & Confidential Consultation
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Dummy component for imports that might be missing in context
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default ConsultantBookingPage;
