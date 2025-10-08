"use client";

import { ReactNode } from "react";

import OrderSidebar from "@/components/ordersidebar";

export default function OrderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#111]">
      

      {/* Main Section */}
      <div className="flex flex-1 bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Sidebar */}
        <OrderSidebar />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
