"use client";

import React, { useEffect, useRef, memo, useState } from "react";
import { X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserFromToken } from "@/hooks/use-token";
import { toast } from "sonner";
import { Button } from "./ui/button";


interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiryData: {
    company_name: string;
    name: string;
    email: string;
    mobile: string;
    city: string;
    remarks: string;
  };
  setEnquiryData: (data: any) => void;
  productEdits: Record<number, any>;
  setProductEdit: (productId: number, patch: any) => void;
  groupedCart: { [key: string]: any[] };
  onSubmit: () => Promise<void>;
}

const EnquiryModal = memo(function EnquiryModal({
  isOpen,
  onClose,
  enquiryData,
  setEnquiryData,
  productEdits,
  setProductEdit,
  groupedCart,
  onSubmit,
}: EnquiryModalProps) {
  const sellerCount = Object.keys(groupedCart).length;
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const user = getUserFromToken();

  // ✅ Fetch buyer details if token exists
  useEffect(() => {
    if (!user?.user_id) {
      // No token → redirect to login
      toast.warning("Please login to send enquiry");
      router.push("/buyer-login");
      return;
    }

    const fetchBuyerData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/buyerbyid/${user.user_id}`
        );
        if (!res.ok) throw new Error(`Failed to fetch buyer: ${res.status}`);
        const data = await res.json();
        const org = data?.organization || {};

        setEnquiryData((prev: any) => ({
          ...prev,
          buyer_id: user.user_id,
          company_name: org.organizations || "",
          // name: org.contact_person || "",
          // email: org.email || "",
          city: org.city || "",
          // mobile: org.phone ? org.phone.toString() : data.phone_no || "",
        }));
      } catch (err) {
        console.error("Error fetching buyer info:", err);
      }
    };

    fetchBuyerData();
  }, [user?.user_id]);

  // ✅ Autofocus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ Handle Submit (block if no token)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id) {
      router.push("/buyer-login");
      return;
    }

    setLoading(true);
    await onSubmit();
    setLoading(false);
  };


  const isProfileIncomplete =
    !enquiryData.company_name?.trim();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Send Enquiry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-semibold mb-2">
            📦 Your enquiry will be sent to {sellerCount} seller
            {sellerCount > 1 ? "s" : ""}.
          </p>
          {Object.entries(groupedCart).map(([sellerId, items]) => (
            <div key={sellerId} className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Seller {sellerId}:</span> {items.length} product
              {items.length > 1 ? "s" : ""} (
              {items.map((item: any) => item.product_name).join(", ")})
            </div>
          ))}
        </div>

        {isProfileIncomplete && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-medium">
              Please complete your profile to send an enquiry.
            </p>
            <Button
              type="button"
              variant="outline"
              className="ml-auto border-red-400 text-red-600"
              onClick={() => router.push("/buyer3/profile")}
            >
              Complete Profile
            </Button>
          </div>
        )}


        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name *
              </label>
              <input
                ref={firstInputRef}
                type="text"
                autoComplete="organization"
                value={enquiryData.company_name}
                onChange={(e) =>
                  setEnquiryData({ ...enquiryData, company_name: e.target.value })
                }
                placeholder="Your company"
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
                required
                disabled
              />
            </div>

            {/* Contact Person */}
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={enquiryData.name}
                onChange={(e) =>
                  setEnquiryData({ ...enquiryData, name: e.target.value })
                }
                placeholder="Enter contact person"
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
                required
                disabled
              />
            </div> */}

            {/* Email */}
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">Email *</label>
              <input
                type="email"
                value={enquiryData.email}
                onChange={(e) =>
                  setEnquiryData({ ...enquiryData, email: e.target.value })
                }
                placeholder="Enter your email"
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
                required
                disabled
              />
            </div> */}

            {/* Mobile */}
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">Mobile *</label>
              <input
                type="tel"
                value={enquiryData.mobile}
                onChange={(e) =>
                  setEnquiryData({ ...enquiryData, mobile: e.target.value })
                }
                placeholder="Enter your mobile"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                required
                disabled
              />
            </div> */}

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">City</label>
              <input
                type="text"
                value={enquiryData.city}
                onChange={(e) =>
                  setEnquiryData({ ...enquiryData, city: e.target.value })
                }
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                disabled
              />
            </div>
          </div>


          {/* Product details (unchanged) */}
          <div className="border rounded-xl">
            <div className="px-4 py-3 bg-gray-50 rounded-t-xl font-semibold">
              Product Details
            </div>
            <div className="divide-y">
              {Object.entries(groupedCart).map(([sellerId, items]) => (
                <div key={sellerId} className="p-4">
                  <div className="font-medium text-gray-700 mb-3">🏪 KPDS_{sellerId}</div>
                  <div className="space-y-4">
                    {items.map((item: any) => {
                      const edit = productEdits[item.id] || {};
                      return (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{item.product_name}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                            {[
                              "quantity_in_kg",
                              "gsm",
                              "size",
                              "shade",
                              "bf",
                              "rim",
                              "sheat",
                              "brightness",
                              "weight",
                              "remarks",
                            ].map((field) => (
                              <input
                                key={field}
                                value={edit[field] ?? ""}
                                onChange={(e) =>
                                  setProductEdit(item.id, {
                                    [field]: e.target.value.trim() || undefined,
                                  })
                                }

                                placeholder={
                                  field === "remarks"
                                    ? "Remarks (for this product)"
                                    : field.replace(/_/g, " ").toUpperCase()
                                }
                                className={`px-3 py-2 border rounded-lg ${field === "remarks" ? "sm:col-span-3" : ""
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Send size={20} />
            {loading
              ? "Sending..."
              : `Send Enquiry to ${sellerCount} Seller${sellerCount > 1 ? "s" : ""}`}
          </button>
        </form>
      </div>
    </div>
  );
});

export default EnquiryModal;
