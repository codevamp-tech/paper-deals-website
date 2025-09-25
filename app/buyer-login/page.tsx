"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Settings,
  Search,
  Target,
  User,
} from "lucide-react";
import Cookies from "js-cookie"


export default function BuyerSignin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginType: "buyer",
    isRobot: false,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      isRobot: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.isRobot) {
      alert("Please verify that you are not a robot.");
      return;
    }

    try {
      console.log("Sending request to:", process.env.NEXT_PUBLIC_API_URL);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        type: 3, // 👈 direct fix, kyunki aapke liye user_type = 3 hai
      }),
    });

    const text = await res.text();
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (res.ok) {
       Cookies.set("token", data.token, { expires: 7 })
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful!");
      window.location.href = "/buyer3/dashboard"; // Redirect to buyer dashboard
    } else {
      alert(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Network/Server error, check console.");
  }
};



return (
  <div className="min-h-screen bg-gray-100 py-16">
    {/* Header Section */}
    <div className="relative h-48 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 border"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      {/* Header Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-5xl font-light mb-2">Sign In</h1>
        <div className="flex items-center text-sm opacity-90">
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
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Sign In
            </h2>

            <div className="space-y-6">
              {/* Login Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Login as
                </label>
                <select
                  name="loginType"
                  value={formData.loginType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white text-gray-700"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 pr-12 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                <div className="ml-auto">
                  <div className="w-10 h-10 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-left">
                <a href="#" className="text-sm text-cyan-600 hover:underline">
                  Forgot Password ?
                </a>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Signin
              </button>

              <div className="text-center text-sm text-gray-500 mt-6">
                New user?{" "}
                <a
                  href="#"
                  className="text-cyan-600 font-semibold hover:underline"
                >
                  Register here
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Promo Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 p-12 lg:p-16 flex flex-col justify-center items-center text-white relative overflow-hidden ">
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-white opacity-5 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white opacity-5 rounded-full animate-ping"></div>
          </div>

          {/* Illustration */}
          <div className="relative z-10 mb-12 ">
            <div className=" bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm border border-white border-opacity-20 flex items-center justify-center relative overflow-hidden">
              {/* Main Character */}
              <div>
                <img
                  style={{ height: "50vh", width: "50vh" }}
                  src="/loginimg.svg"
                  alt="login Image"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-white rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute top-12 right-12 w-2 h-2 bg-white rounded-full opacity-40 animate-bounce delay-300"></div>
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-full opacity-50 animate-bounce delay-500"></div>
            </div>
          </div>

          {/* Text Content */}
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