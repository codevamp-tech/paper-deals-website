"use client";

import B2bOrder from "@/components/orders/b2bOrders";
import B2cOrder from "@/components/orders/b2cOrders";
import { useState } from "react";

export default function B2Page() {
  const [activeTab, setActiveTab] = useState<"b2b" | "b2c">("b2b");

  return (
    <div className="min-h-screen items-center p-6">
 

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("b2b")}
          className={`px-6 py-2 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
            activeTab === "b2b"
              ? "bg-white text-cyan-600 border-x border-t border-gray-200"
              : "text-gray-500 hover:text-cyan-500"
          }`}
        >
          B2B
        </button>
        <button
          onClick={() => setActiveTab("b2c")}
          className={`px-6 py-2 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
            activeTab === "b2c"
              ? "bg-white text-cyan-600 border-x border-t border-gray-200"
              : "text-gray-500 hover:text-cyan-500"
          }`}
        >
          B2C
        </button>
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
