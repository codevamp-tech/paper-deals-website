"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EnquiryPage() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/spotPriceEnqiry`, // ✅ Correct API URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.mobile,      // 🔧 backend expects `phone`
          email_id: formData.email,    // 🔧 backend expects `email_id`
          message: formData.message,
          products: product,           // 🔧 backend expects `products`
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to submit enquiry");
    }

    await res.json();
    setSuccess("✅ Enquiry submitted successfully!");
    setFormData({ name: "", mobile: "", email: "", message: "" }); // reset form
  } catch (err: any) {
    console.error(err);
    setError("❌ Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-bold">Spot Price Enquiry</h2>
          <p className="text-sm">
            For enquiry, complaint, deactivate or disable account, remove or
            delete profile from mobile app and any other query submit your
            request or message. Our team will contact you soon and process your
            request.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {product && (
            <p className="text-black">
              You are enquiring about:{" "}
              <span className="font-semibold text-blue-600">{product}</span>
            </p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Enter your Register Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <textarea
            name="message"
            rows={4}
            placeholder="Message (Specify Quantity and Requirement)"
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-white rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {/* Status Messages */}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </main>
  );
}
