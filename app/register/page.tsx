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
        setTimeout(() => router.push("/buyer-login"), 1500);
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
    <div className="min-h-screen bg-gray-100 ">
      {/* Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-semibold mb-2">Register as Buyer</h1>
          <div className="flex items-center text-sm opacity-80">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Register</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row items-stretch justify-center max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-12 lg:p-16">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">WhatsApp Number </label>
                  <input
                    type="number"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="Enter WhatsApp number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Mobile + OTP */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-cyan-700 transition disabled:opacity-50 flex-shrink-0"
                  >
                    {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>

                {/* OTP */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Message */}
                {message && (
                  <p className={`text-center text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold text-lg text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all"
                >
                  {loading ? "Submitting..." : "Register"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Promo Image */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 p-12 lg:p-16 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="relative z-10 mb-12">
              <div className="bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm border border-white border-opacity-20 flex items-center justify-center p-6">
                <img
                  style={{ height: "45vh", width: "45vh" }}
                  src="/loginimg.svg"
                  alt="Register Illustration"
                />
              </div>
            </div>

            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-semibold mb-4">
                Join as Buyer
              </h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Access exclusive deals and opportunities by creating your buyer account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
