"use client";

import { useEffect, useState } from "react";

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
    password: "",
    whatsapp: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");

  // Reset form whenever modal opens
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      business: "",
      mobile: "",
      otp: "",
      password: "",
      whatsapp: ""

    });
    setOtpSent(false);
    setOtpVerified(false);
    setMessage("");
    setLoading(false);
  };

  if (!visible) return null;

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
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/addseller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email_address: form.email,
          phone_no: form.mobile,
          whatsapp_no: form.whatsapp,
          password: form.password,
        })

      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Seller registered successfully!");
        resetForm();
        setTimeout(() => onClose(), 2000);
      } else {
        // ✅ Specific validation error handling
        if (
          data.message?.toLowerCase().includes("email") &&
          data.message?.toLowerCase().includes("exists")
        ) {
          setMessage("This email is already registered. Please try another email.");
        } else if (
          data.message?.toLowerCase().includes("phone") &&
          data.message?.toLowerCase().includes("exists")
        ) {
          setMessage("This mobile number is already registered.");
        } else {
          setMessage(data.message || "Failed to register seller");
        }
      }

    } catch (error) {
      console.error("Error registering seller:", error);
      setMessage("Something went wrong while registering seller");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // close modal when background is clicked
    >
      <div
        className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
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
            type="text"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-black"
          />

          <input
            type="number"
            name="whatsapp"
            placeholder="WhatsApp Number"
            value={form.whatsapp}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 flex-1 bg-white text-black"
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
              onClick={handleSendOtp}
              disabled={loading}
              className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
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

          {message && (
            <p className="text-sm text-center text-red-600 mt-2">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
