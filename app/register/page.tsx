"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ShieldCheck, ArrowRight, Smartphone } from "lucide-react";
import { usePasswordStrength, isPasswordStrong } from "@/lib/passwordStrength";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  const { strength, checkStrength } = usePasswordStrength();
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      checkStrength(value);
      setPasswordError("");
    }
  };

  const handleSendOtp = async () => {
    if (!form.mobile) {
      toast.error("Please enter mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.mobile, type: otpSent ? "Resend OTP" : "GET OTP" }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        toast.success(data.message || "Security code sent to your device");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Verification service currently unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<boolean> => {
    if (!form.otp) {
      toast.error("Please enter the verification code");
      return false;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.mobile, otp: form.otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        toast.success("Identity verified successfully");
        return true;
      } else {
        toast.error("Invalid verification code");
        return false;
      }
    } catch {
      toast.error("Verification failed");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.mobile) {
      toast.error("All mandatory fields must be completed");
      return;
    }

    if (!isPasswordStrong(form.password)) {
      setPasswordError("Please strengthen your password before proceeding.");
      return;
    }

    const verified = await handleVerifyOtp();
    if (!verified) return;

    setLoading(true);
    try {
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
        toast.success("Welcome to Paper Deals! Registration complete.");
        setTimeout(() => router.push("/buyer-login"), 1500);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("System error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Buyer Account"
      subtitle="Join thousands of businesses sourcing premium paper products worldwide."
      illustration="/loginimg.svg"
      oppositeAction={{
        text: "Already a member?",
        linkText: "Sign In instead",
        link: "/buyer-login"
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="pl-11 py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Corporate Email</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="pl-11 py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                placeholder="john@company.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Secure Password</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="pl-11 py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="px-1 pt-1">
            <PasswordStrengthIndicator strength={strength} />
            {passwordError && <p className="text-[10px] text-red-500 mt-1 font-bold">{passwordError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">WhatsApp (Optional)</Label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <Input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="pl-11 py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                placeholder="+91..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="relative group flex-1">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="pl-11 py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                  placeholder="10 digit number"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleSendOtp} 
                disabled={loading || !form.mobile}
                className="h-auto px-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold text-[10px] uppercase"
              >
                {otpSent ? "Resend" : "Send OTP"}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Verification Code</Label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  className="pl-11 py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all tracking-[0.5em] font-black"
                  placeholder="••••••"
                  maxLength={6}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all bg-primary text-white flex items-center justify-center gap-3"
          >
            {loading ? "Processing Registration..." : (
              <>
                Register Account <ArrowRight size={20} />
              </>
            )}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
