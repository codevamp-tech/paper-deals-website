"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email or mobile number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, user_type: 3 }), // backend expects email or mobile
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset link sent! Check your email.");
        // Optional: redirect to reset password page after 2 sec
        setTimeout(() => {
          router.push("/buyer-login"); // make sure you have this page
        }, 2000);
      } else {
        setMessage(data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Forget Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-700 font-medium mb-1 block">Email </label>
            <input
              type="text"
              placeholder="Enter your email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {message && (
            <p className="text-center text-sm text-gray-600 mt-1">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Remembered password?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
