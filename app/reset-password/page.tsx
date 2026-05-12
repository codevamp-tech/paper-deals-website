"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@/hooks/use-theme";

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
  const { mode, theme } = useTheme();

  const isB2B = mode === "B2B";
  const primaryColor = isB2B ? "#16a34a" : "#173a8a"; // Green for B2B, Blue for B2C
  const accentBg = isB2B ? "bg-green-100" : "bg-blue-100";
  const focusRing = isB2B ? "focus:border-green-600 focus:ring-green-500/5" : "focus:border-[#173a8a] focus:ring-blue-500/5";
  const btnBg = isB2B ? "bg-green-600 hover:bg-green-700" : "bg-[#173a8a] hover:opacity-90";
  const iconColor = isB2B ? "group-focus-within:text-green-600" : "group-focus-within:text-[#173a8a]";
  const msgBg = isB2B ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100";
 
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Mesh Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${isB2B ? 'bg-green-100' : 'bg-indigo-200'} rounded-full blur-[100px]`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${accentBg} rounded-full blur-[100px]`} />
      </div>

      <div className="w-full max-w-[460px] z-10">
        <div className="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[2rem] overflow-hidden border border-slate-100 relative">
          
          <div className="p-10 text-center relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
             {/* Abstract pattern in header */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0 L100 100 Z" fill="white" />
              </svg>
            </div>
            
            <div className="relative z-10 mb-6 flex justify-center">
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/5">
                <img
                  src="/logomain.png"
                  alt="PaperDeals Logo"
                  className="h-10 w-auto"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight relative z-10">
              Set New Password
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
              <div className={`h-1.5 w-1.5 rounded-full ${isB2B ? 'bg-white' : 'bg-emerald-400'} animate-pulse`} />
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                {isB2B ? 'Wholesale Business Portal' : 'Retail Customer Portal'}
              </p>
            </div>
          </div>
 
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-600 text-[13px] font-bold ml-1 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-800 ${focusRing}`}
                    required
                  />
                  <div className={`absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${iconColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>
  
              <div className="space-y-2">
                <label className="text-slate-600 text-[13px] font-bold ml-1 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-300 font-medium text-slate-800 ${focusRing}`}
                    required
                  />
                  <div className={`absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${iconColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                </div>
              </div>
  
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                    loading
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : btnBg
                  }`}
                  style={{ boxShadow: loading ? 'none' : `0 10px 25px -5px ${isB2B ? 'rgba(22, 163, 74, 0.2)' : 'rgba(23, 58, 138, 0.2)'}` }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Update Password</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </>
                  )}
                </button>
              </div>
  
              {message && (
                <div className={`mt-6 p-4 rounded-xl text-[13px] font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 border ${
                  message.startsWith("✅") 
                    ? msgBg
                    : "bg-rose-50 text-rose-700 border-rose-100"
                }`}>
                  <span className="text-base">{message.startsWith("✅") ? "✓" : "!"}</span>
                  {message.replace(/^[✅❌]/, "")}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="text-center mt-8 space-y-2">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            {isB2B ? 'Wholesale Grade Security' : 'Retail Secure Protocol'}
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-300">
             <div className="w-8 h-px bg-slate-200" />
             <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>
             <div className="w-8 h-px bg-slate-200" />
          </div>
        </div>
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
