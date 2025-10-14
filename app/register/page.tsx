"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBuyerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
    password: "",
    whatsapp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<boolean> => {
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.mobile, otp: form.otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);
        setMessage(data.message || "OTP verified successfully!");
        return true;
      } else {
        setMessage(data.message || "Invalid OTP");
        return false;
      }
    } catch (err) {
      console.error(err);
      setMessage("Error verifying OTP");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verified = await handleVerifyOtp();
    if (!verified) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create-buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email_address: form.email,
          phone_no: form.mobile,
          whatsapp_no: form.whatsapp,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Buyer registered successfully!");
        setForm({ name: "", email: "", mobile: "", otp: "", password: "", whatsapp: "" });
        setOtpSent(false);
        setOtpVerified(false);

        setTimeout(() => {
          router.push("/buyer-login");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to register buyer");
      }
    } catch (err) {
      console.error("Error registering buyer:", err);
      setMessage("Something went wrong while registering buyer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-7000  to-sky-200 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/90 shadow-2xl rounded-3xl w-full max-w-md p-10 border border-white/30 backdrop-blur-lg">
        <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center animate-pulse">
          Register as Buyer
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter a strong password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">WhatsApp Number (Optional)</label>
            <input
              type="number"
              name="whatsapp"
              placeholder="Enter WhatsApp number"
              value={form.whatsapp}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Mobile + OTP */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 flex flex-col">
              <label className="text-purple-800 font-medium mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex-shrink-0"
            >
              {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
            </button>
          </div>

          {/* OTP */}
          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Message */}
          {message && (
            <p className={`text-center text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-sky-300 text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
