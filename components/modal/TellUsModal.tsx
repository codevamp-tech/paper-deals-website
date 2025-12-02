"use client";

import { useState, useEffect } from "react";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Category = {
  id: string | number;
  name: string;
};

export default function RequirementModal({ visible, onClose }: ModalProps) {
  if (!visible) return null;

  const [form, setForm] = useState({
    category: "",
    product: "",
    quantity: "",
    pincode: "",
    email: "",
    mobile: "",
    otp: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || data || []);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Send or Resend OTP
  const handleSendOtp = async () => {
    if (!form.mobile) {
      setMessage("Please enter mobile number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.mobile,
          type: otpSent ? "Resend OTP" : "GET OTP",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setMessage(data.message || "OTP sent successfully!");
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit requirement (auto verify OTP before submit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      setMessage("Please send OTP before submitting");
      return;
    }

    if (!form.otp) {
      setMessage("Please enter OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Step 1️⃣ Verify OTP
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.mobile, otp: form.otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setMessage(verifyData.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // Step 2️⃣ Submit requirement (only if OTP verified)
      const reqRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rquarment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: form.category,
          product_name: form.product,
          quantity: form.quantity,
          pincode: form.pincode,
          email: form.email,
          phone_no: form.mobile,
          status: 0,
        }),
      });

      const reqData = await reqRes.json();

      if (reqRes.ok) {
        setMessage("✅ Requirement submitted successfully!");
        setForm({
          category: "",
          product: "",
          quantity: "",
          pincode: "",
          email: "",
          mobile: "",
          otp: "",
        });
        setOtpSent(false);
      } else {
        setMessage(reqData.message || "Failed to submit requirement");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong while submitting requirement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="w-full max-w-md rounded-lg shadow-lg relative ml-[55rem] mt-[7rem]"
        style={{ background: "white" }}
      >
        {/* Header */}
        <div className="px-4 py-3 text-blue-600 font-bold text-xl rounded-t-lg flex justify-between items-center border-b">
          <span>Tell Us Your Requirement</span>
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 mb-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Category Dropdown */}
            <select
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">
                {catLoading ? "Loading categories..." : "Select Category"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Product"
              value={form.product}
              onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))}
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="text"
              placeholder="Enter Quantity"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="text"
              placeholder="Enter Pincode"
              value={form.pincode}
              onChange={(e) => setForm((prev) => ({ ...prev, pincode: e.target.value }))}
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            {/* Mobile + OTP */}
            <div className="flex space-x-2">
              <select className="border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-2 py-2 text-sm">
                <option>+91</option>
              </select>
              <input
                type="tel"
                placeholder="Enter mobile"
                value={form.mobile}
                onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))}
                className="flex-1 border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Send OTP */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600  text-white py-2 rounded-md font-semibold"
              >
                {loading ? "Please wait..." : "Send OTP"}
              </button>
            )}

            {/* OTP Input */}
            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => setForm((prev) => ({ ...prev, otp: e.target.value }))}
                className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
              />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 rounded-md font-semibold"
            >
              {loading ? "Submitting..." : "Submit Requirement"}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`text-sm mt-3 font-medium ${message.includes("success") ? "text-green-600" : "text-red-500"
                }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
