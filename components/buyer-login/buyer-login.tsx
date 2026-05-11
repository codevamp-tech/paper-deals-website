"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BuyerSignin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isRobot: false,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!formData.isRobot) {
      toast.error("Please confirm you are not a robot");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Authenticating...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, type: 3 }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome back!", { id: loadingToast });
        Cookies.set("token", data.token, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(data.user));

        const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
        const approvedValue = tokenPayload?.data?.approved;
        
        if (approvedValue == 1) {
          router.replace(redirectUrl === "/" ? "/buyer-route/dashboard" : redirectUrl);
        } else {
          router.replace("/");
        }
      } else {
        toast.error(data.message || "Invalid credentials", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    const loadingToast = toast.loading("Sending reset link...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, user_type: 3 }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Instructions sent to your email", { id: loadingToast });
        setIsForgotOpen(false);
      } else {
        toast.error(data.message || "Failed to send reset link", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: loadingToast });
    }
  };

  return (
    <AuthLayout
      title="Buyer Login"
      subtitle="Access your procurement dashboard and source premium paper products."
      illustration="/loginimg.svg"
      oppositeAction={{
        text: "New to the platform?",
        linkText: "Create a Buyer Account",
        link: "/register"
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Corporate Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-12 py-7 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all text-gray-900"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secret Password</label>
              <button 
                type="button" 
                onClick={() => setIsForgotOpen(true)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-12 pr-12 py-7 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all text-gray-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-colors hover:border-primary/20">
          <Checkbox 
            id="isRobot" 
            checked={formData.isRobot} 
            onCheckedChange={(checked) => setFormData(p => ({ ...p, isRobot: !!checked }))}
            className="w-5 h-5 rounded-md border-gray-300"
          />
          <label htmlFor="isRobot" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
            I confirm that I am a human procurement professional
          </label>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full py-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all bg-primary text-white"
        >
          {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
        </Button>
      </form>

      {/* Forgot Password Dialog */}
      <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-black text-gray-900">Reset Access</DialogTitle>
            <p className="text-gray-500 font-medium">Enter your email to receive recovery instructions.</p>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Registered Email</Label>
              <Input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="py-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-primary/20 transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <Button type="submit" className="w-full py-6 rounded-2xl font-bold bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20">
              Send Reset Instructions
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}
