"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Cookies from "js-cookie";

export default function BuyerSignin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginType: "buyer",
    isRobot: false,
  });

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.isRobot) return;

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
        Cookies.set("token", data.token, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/buyer3/dashboard"; // direct redirect
      } else {
        console.error("Login failed:", data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      {/* Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-semibold mb-2">Sign In</h1>
          <div className="flex items-center text-sm opacity-80">
            <span>Home</span>
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
                {/* Login Type Selector */}
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

                {/* Email Input */}
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

                {/* Password Input */}
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

                {/* reCAPTCHA */}
                <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    id="recaptcha"
                    checked={formData.isRobot}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label
                    htmlFor="recaptcha"
                    className="ml-3 text-sm text-gray-700"
                  >
                    I'm not a robot
                  </label>
                </div>

                {/* Forgot Password + Register */}
                <div className="flex justify-between items-center text-sm">
                  <a
                    href="/forget"
                    className="text-gray-500 hover:text-cyan-600 transition-colors"
                  >
                    Forgot Password?
                  </a>
                  <a

                    href="/register"
                    className="font-semibold text-cyan-600 hover:text-blue-600 transition-colors"
                  >
                    Register Here →
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-xl font-semibold text-lg text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Promo Section */}
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
                Create new account for Seller and Buyer
              </h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Join our platform to access exclusive deals and opportunities
                for both buyers and sellers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
