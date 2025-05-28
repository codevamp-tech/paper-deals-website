"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  { title: "Email ID & GST" },
  { title: "Password Creation" },
  { title: "Onboarding Dashboard" },
];

const SellerOnboarding: React.FC = () => {
  const [currentStep] = useState(0);
  const [category, setCategory] = useState<"all" | "books">("all");

  return (
    <div className="min-h-screen flex items-center justify-center   px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex items-center">
              <div className="relative flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 
                    ${
                      idx <= currentStep
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 text-xs font-medium text-gray-600">
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                  <motion.div
                    className="h-0.5 bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > idx ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Mobile Number"
              className="w-full pr-24 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Send OTP
            </button>
          </div>

          <input
            type="email"
            placeholder="Email ID"
            className="w-full pr-24 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <div>
            <p className="text-sm text-gray-700 mb-2">
              What are you looking to sell on Flipkart?
            </p>
            <div className="flex space-x-4">
              {["all", "books"].map((opt) => (
                <motion.button
                  key={opt}
                  onClick={() => setCategory(opt as any)}
                  className={`flex-1 border rounded-lg px-4 py-3 focus:outline-none transition 
                    ${
                      category === opt
                        ? "bg-cyan-600 text-white border-cyan-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {opt === "all" ? "All Categories" : "Only Books"}
                </motion.button>
              ))}
            </div>
            {category === "books" && (
              <p className="mt-2 text-sm text-gray-500">(PAN is mandatory)</p>
            )}
          </div>

          <input
            type="text"
            placeholder="Enter GSTIN"
            className="w-full pr-24 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <p className="text-xs text-gray-500">
            GSTIN is required to sell products on Flipkart. You can also share
            it in the final step.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500">
            By continuing, I agree to Flipkart’s{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Use
            </a>{" "}
            &{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
          <motion.button
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white py-3 rounded-lg font-medium shadow-lg  transition transform hover:-translate-y-0.5"
            whileHover={{ scale: 1.02 }}
          >
            Register & Continue →
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;
