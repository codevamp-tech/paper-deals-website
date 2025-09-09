"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SellerSignin() {
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
      isRobot: e.target.checked,
    });
  };
  const handleSubmit = () => {
    console.log('signin:', formData);
    // Add your seller signin logic here
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
          <h1 className="text-5xl font-light mb-2">
            {currentPage === "buyer" ? "Buyer Sign In" : "Seller Sign In"}
          </h1>
          <div className="flex items-center text-sm opacity-90">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>{currentPage === "buyer" ? "Buyer" : "Seller"} Sign In</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row items-stretch justify-center max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
          {/* Left Side - Form */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
            
            <div className="space-y-6">
              {/* Login Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login as
                </label>
                <select 
                  name="loginType"
                  value={formData.loginType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              {/* Email Input */}
              <input
                type="email"
                name="email"
                placeholder="Enter your seller email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* reCAPTCHA */}
              <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-100">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-sm text-gray-700">I'm not a robot</span>
              </div>

              {/* Forgot Password */}
              <div className="text-left">
                <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-cyan-400 text-white py-4 rounded-lg font-medium hover:bg-cyan-500 transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>

          

          {/* Right Side */}
          <div className="flex-1 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg p-8 text-white flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-center">
              Create new seller account to start selling
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}









