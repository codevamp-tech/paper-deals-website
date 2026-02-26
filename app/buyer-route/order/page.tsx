"use client";

import B2bOrder from "@/components/orders/b2bOrders";
import B2cOrder from "@/components/orders/b2cOrders";
import { useEffect, useState } from "react";

export default function B2Page() {
  const [activeTab, setActiveTab] = useState<"b2b" | "b2c">("b2b");
  const [mode, setMode] = useState<"B2B" | "B2C">("B2B");
  useEffect(() => {
    const stored: any = localStorage.getItem("mode");
    setMode(stored)
  }, []);

  return (
    <div className="min-h-screen items-center p-6">


      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8">
        {mode === "B2B" ? (
          <button
            onClick={() => setActiveTab("b2b")}
            className={`px-6 py-2 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${activeTab === "b2b"
              ? "bg-white text-cyan-600 border-x border-t border-gray-200"
              : "text-gray-500 hover:text-cyan-500"
              }`}
          >
            B2B
          </button>
        ) : null}
        {mode === "B2C" ? (
          <button
            onClick={() => setActiveTab("b2c")}
            className={`px-6 py-2 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${activeTab === "b2c"
              ? "bg-white text-cyan-600 border-x border-t border-gray-200"
              : "text-gray-500 hover:text-cyan-500"
              }`}
          >
            B2C
          </button>
        ) : null}
      </div>

      {/* Content Area */}
      <div className="w-full  p-6">
        {activeTab === "b2b" && (
          <B2bOrder />

        )}

        {activeTab === "b2c" && (
          <B2cOrder />
        )}
      </div>
    </div>
  );
}
