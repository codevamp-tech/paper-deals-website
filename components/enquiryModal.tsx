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
  const [mode, setMode] = useState<string>("B2C");

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
          buyer_id: user.user_id,
          company_name: org.organizations || "",
          name: org.contact_person || data.name || "",
          email: org.email || data.email_address || "",
          city: org.city || "",
          mobile: org.phone ? org.phone.toString() : data.phone_no || "",
        }));
      } catch (err) {
        console.error("Error fetching buyer info:", err);
      }
    };

    fetchBuyerData();
  }, [user?.user_id]);

  // ✅ Read mode from localStorage
  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "B2C";
    setMode(currentMode);
  }, [isOpen]);

  // ✅ Autofocus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // City is always required; B2B also requires company_name
  const isProfileIncomplete =
    !enquiryData.city?.trim() ||
    (mode === "B2B" && !enquiryData.company_name?.trim());

  // ✅ Handle Submit — block if profile incomplete
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id) {
      router.push("/buyer-login");
      return;
    }

    if (isProfileIncomplete) {
      toast.error("Please complete your profile before raising an enquiry.", {
        description: "Go to Profile → Company Information and fill in City" +
          (mode === "B2B" ? " and Company Name" : "") + ".",
        action: {
          label: "Complete Profile",
          onClick: () => router.push("/buyer-route/profile"),
        },
      });
      return;
    }

    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Send Enquiry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

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
              onClick={() => router.push("/buyer-route/profile")}
            >
              Complete Profile
            </Button>
          </div>
        )}


        {/* Form Fields Container */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company — Only shown for B2B */}
            {mode === "B2B" && (
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                  required
                />
              </div>
            )}

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                required
              />
            </div> */}

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={enquiryData.city}
                onChange={(e) =>
                  setEnquiryData({ ...enquiryData, city: e.target.value })
                }
                placeholder="City"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 ${
                  !enquiryData.city?.trim()
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {!enquiryData.city?.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  City is missing — please{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/buyer-route/profile")}
                    className="underline font-medium"
                  >
                    complete your profile
                  </button>
                  .
                </p>
              )}
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
                      
                      // Pre-fill fields logic: use edit value if exists, else use item property
                      const getFieldValue = (field: string) => {
                        if (edit[field] !== undefined) return edit[field];
                        
                        // Mapping for common fields from item to enquiry
                        const itemMapping: Record<string, any> = {
                          gsm: item.gsm,
                          size: item.size || item.sizes,
                          shade: item.shade,
                          bf: item.bf,
                          brightness: item.brightness,
                          weight: item.weight,
                        };
                        
                        return itemMapping[field] || "";
                      };

                      return (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{item.product_name}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                            <div className="flex gap-2">
                              <input
                                value={edit["quantity_in_kg"] ?? item.quantity ?? ""}
                                onChange={(e) =>
                                  setProductEdit(item.id, {
                                    quantity_in_kg: e.target.value || undefined,
                                  })
                                }
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder="QUANTITY"
                                className="px-3 py-2 border rounded-lg flex-1 min-w-0"
                              />
                              <select
                                value={edit["quantity_unit"] || "kg"}
                                onChange={(e) =>
                                  setProductEdit(item.id, {
                                    quantity_unit: e.target.value,
                                  })
                                }
                                className="px-3 py-2 border rounded-lg w-24 flex-shrink-0"
                              >
                                <option value="kg">kg</option>
                                <option value="ton">ton</option>
                                <option value="piece">piece</option>
                              </select>
                            </div>
                            {[
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
                                value={getFieldValue(field)}
                                onChange={(e) =>
                                  setProductEdit(item.id, {
                                    [field]: e.target.value || undefined,
                                  })
                                }
                                onKeyDown={(e) => e.stopPropagation()}
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
        </div>
      </div>

          <div className="p-6 border-t bg-white">
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
          </div>
        </form>
      </div>
    </div>
  );
});

export default EnquiryModal;
