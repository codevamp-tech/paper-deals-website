"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
  email: string;
  user_type: number;
  iat: number;
  exp: number;
}

function ResetPasswordInner() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setMessage("❌ Invalid token");
      }
    } else {
      setMessage("❌ No token provided");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (!userId) {
      setMessage("❌ Invalid user");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, newPassword, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/buyer-login");
        }, 1500);
      } else {
        setMessage(`❌ ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-800 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/90 shadow-2xl rounded-3xl w-full max-w-lg p-10 border border-white/30 backdrop-blur-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 text-center mb-8 animate-pulse">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-800 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-3 rounded-xl text-white font-semibold transition shadow-lg ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-700 to-sky-200 hover:opacity-90"
              }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense to fix build error
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
