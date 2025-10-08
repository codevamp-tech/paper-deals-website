"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
} from "lucide-react";
import WhySellpaperdeals from "./Why-Sell-Paperdeals";
import RegisterNow from "@/components/modal/RegisterNow";

export default function SellOnlinePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 text-sm">
        <div className="flex items-center text-white">
          <Link
            href="/"
            className="hover:text-blue-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-white" />
          <span className="text-white font-medium">Sell Online</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-10">
          <div className="md:w-1/2 mb-8 md:mb-0 space-y-6 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Sell Online with <span className="text-gray-100">PaperDeals</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-lg leading-relaxed">
              Join millions of sellers and grow your business with India's
              leading e-commerce platform.
            </p>
            <div className="flex space-x-4">
              {/* ✅ Modified Button */}
              <button
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                onClick={() => setIsOpen(true)}
              >
                Start Selling
              </button>

              <button className="border border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Learn More
              </button>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-96 w-full animate-float">
              <Image
                src="/becomeaseller.png"
                alt="Sell on Flipkart"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <WhySellpaperdeals />

      {/* CTA Section */}
      <section className="py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start <span className="text-gray-100"> Selling?</span>
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
            Join India's most trusted e-commerce platform and take your business
            to new heights.
          </p>
          <button
            className="bg-white text-blue-600 font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-Poppins"
            onClick={() => setIsOpen(true)}
          >
            Register Now - It's Free!
          </button>
        </div>

        {/* ✅ Same Popup */}
        <RegisterNow visible={isOpen} onClose={() => setIsOpen(false)} />
      </section>
    </div>
  );
}
