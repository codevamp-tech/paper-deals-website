// components/RequirementModal.tsx
"use client";

import { useState } from "react";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function RequirementModal({ visible, onClose }: ModalProps) {
  if (!visible) return null;

  const [mode, setMode] = useState<"buy" | "sell">("buy");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ">
      {/* Modal Container */}
      <div
        className="w-full max-w-md rounded-lg shadow-lg relative ml-[55rem]
      mt-[7rem] "
        style={{
          background: "white",
        }}
      >
        {/* Header */}
        <div className="bg- px-4 py-3 text-blue-600 font-bold text-xl rounded-t-lg flex justify-between items-center">
          <span>Tell Us Your Requirement</span>
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {/* Toggle Buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                mode === "buy"
                  ? "bg-white text-blue-600 border border-blue-500"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setMode("buy")}
            >
              Buy
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                mode === "sell"
                  ? "bg-blue-100 text-blue-700 border border-blue-500"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setMode("sell")}
            >
              Sell
            </button>
          </div>

          {/* Form Fields */}
          <form className="space-y-4">
            <select className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm">
              <option>Select Product</option>
              <option>Paper</option>
              <option>Board</option>
            </select>

            <input
              type="text"
              placeholder="Quantity"
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="text"
              placeholder="Enter company"
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="text"
              placeholder="Enter Pincode"
              className="w-fullborder border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
            />

            <div className="flex space-x-2">
              <select className="border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-2 py-2 text-sm">
                <option>+91</option>
              </select>
              <input
                type="tel"
                placeholder="Enter mobile"
                className="flex-1 border border-gray-300 bg-gray-100 text-gray-800 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 border  text-white py-2 rounded-md font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
