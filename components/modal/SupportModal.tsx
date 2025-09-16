"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SupportModal({ visible, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    type: "",
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true); // ensure client-side rendering
  }, []);

  // ✅ Update only the changed field
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bodyData = {
        subject: form.type,
        name: form.name,
        phone: form.mobile,
        email: form.email,
        message: form.message,
        created_at: new Date().toISOString(),
      };

      console.log("Submitting:", bodyData);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit");
      }

      const data = await res.json();
      console.log("✅ API Response:", data);

      alert("Request submitted successfully!");
      setForm({ type: "", name: "", mobile: "", email: "", message: "" });
      onClose();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
      onClick={onClose} // click outside closes modal
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent modal clicks from closing
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full"
        >
          ✕
        </button>

        <h2 className="text-black font-semibold mb-4 border-l-4 border-purple-500 pl-2">
          📞 Support
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          For enquiry, complaint, deactivate or disable account, etc.
        </p>

        {/* Support Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">--Select--</option>
            <option value="enquiry">Enquiry</option>
            <option value="complaint">Complaint</option>
            <option value="deactivate">Deactivate Account</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Registered Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none h-24"
          ></textarea>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-1.5 rounded-md text-sm font-medium text-white ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
