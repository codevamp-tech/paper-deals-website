"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, X } from "lucide-react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"



export default function BuyerSignin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginType: "buyer",
    isRobot: false,
  });

  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectUrl = searchParams.get("redirect") || "/buyer3/dashboard"


  // ✅ Handle input changes
  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: any) => {
    setFormData({
      ...formData,
      isRobot: e.target.checked,
    });
  };

  // ✅ Handle Login Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    if (!formData.isRobot) {
      toast.error("Please confirm you are not a robot");
      return;
    }
    const loadingToast = toast.loading("Signing you in...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            type: 3,
          }),
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (res.ok) {
        toast.success("Login successful 🎉", {
          id: loadingToast,
          description: "Redirecting to dashboard...",
        });
        Cookies.set("token", data.token, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(redirectUrl);
      } else {
        toast.error(data.message || "Invalid email or password", {
          id: loadingToast,
        });
       
        console.log("Login failed:", data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const [mode, setMode] = useState(""); // default

  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) setMode(savedMode);
  }, []);



  // ✅ Forgot Password Submit
  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    const loadingToast = toast.loading("Sending reset link...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/forgot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, user_type: 3 }),
        }
      );
      const data = await res.json();
      toast.success("Reset link sent!", {
        id: loadingToast,
        description: data.message || "Check your email inbox",
      });
      setIsForgotOpen(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(data.message || "Failed to send reset link", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-semibold mb-2">Sign In</h1>
          <div className="flex items-center text-sm opacity-80">
            <Link href="/">Home</Link>
            <span className="mx-2">›</span>
            <span>Sign In</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row items-stretch justify-center max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-12 lg:p-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Welcome Back 👋
              </h2>

              <div className="space-y-6">
                {/* Login Type */}
                {mode !== "B2C" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Login as
                    </label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3">
                      <User className="w-5 h-5 text-cyan-500 mr-2" />
                      <input
                        type="text"
                        name="loginType"
                        value="buyer"
                        readOnly
                        className="w-full bg-transparent outline-none text-gray-700"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email address
                  </label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3">
                    <Mail className="w-5 h-5 text-cyan-500 mr-2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-transparent outline-none text-gray-700"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Password
                  </label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 relative">
                    <Lock className="w-5 h-5 text-cyan-500 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-transparent outline-none text-gray-700 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Captcha */}
                <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    id="recaptcha"
                    checked={formData.isRobot}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="recaptcha" className="ml-3 text-sm text-gray-700">
                    I'm not a robot
                  </label>
                </div>

                {/* Forgot + Register */}
                <div className="flex justify-between items-center text-sm">
                  <button
                    onClick={() => setIsForgotOpen(true)}
                    className="text-gray-500 hover:text-cyan-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                  <a
                    href="/register"
                    className="font-semibold text-cyan-600 hover:text-blue-600 transition-colors"
                  >
                    Register Here →
                  </a>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-xl font-semibold text-lg text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 p-12 lg:p-16 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="relative z-10 mb-12">
              <div className="bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm border border-white border-opacity-20 flex items-center justify-center p-6">
                <img
                  style={{ height: "45vh", width: "45vh" }}
                  src="/loginimg.svg"
                  alt="login Image"
                />
              </div>
            </div>

            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-semibold mb-4">
                {mode === "B2C" ? "Buyer & Seller Features" : "Create new Buyer Account"}
              </h3>

              {mode === "B2C" ? (
                <p className="text-lg opacity-90 leading-relaxed">
                  You can buy and sell products on this platform.
                </p>
              ) : (
                <p className="text-lg opacity-90 leading-relaxed">
                  Join our platform to access exclusive buyer deals.
                </p>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ✅ Forgot Password Modal */}
      <AnimatePresence>
        {isForgotOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
            >
              <button
                onClick={() => setIsForgotOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Forgot Password
              </h2>
              <p className="text-gray-600 text-sm mb-6 text-center">
                Enter your registered email to receive reset instructions.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
