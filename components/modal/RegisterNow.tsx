"use client";

import { useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function RegisterNow({ visible, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    mobile: "",
    otp: "",
  });

  if (!visible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    onClose(); // submit ke baad modal band
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4">Seller Registration</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />
          <input
            type="text"
            name="business"
            placeholder="Business Name"
            value={form.business}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 flex-1 bg-white text-black"
            />
            <button
              type="button"
              onClick={() => console.log("Send OTP clicked for:", form.mobile)}
              className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700"
            >
              Send OTP
            </button>
          </div>



          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={form.otp}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />
          <button
            type="submit"
            className="bg-black text-white rounded-lg px-0.5 py-1.5 hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
