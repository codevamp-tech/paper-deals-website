"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import WhySellpaperdeals from "./Why-Sell-Paperdeals";
import RegisterNow from "@/components/modal/RegisterNow";
import { useTheme } from "@/hooks/use-theme";

export default function SellOnlinePage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleSellerLogin = () => {
    window.location.href = "https://paper-deals-admin.netlify.app/";
  };

  return (
    <div className="min-h-screen font-sans">

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 text-sm">
        <div className="flex items-center text-black">
          <Link
            href="/"
            className="hover:text-blue-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-black" />
          <span className="text-black font-medium">Sell Online</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-10">

          {/* LEFT CONTENT */}
          <div className="md:w-1/2 mb-8 md:mb-0 space-y-6 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
              Sell Paper Products on{" "}
              <span className={`${theme.Text}`}>PaperDeals</span>
            </h1>

            <p className="text-lg text-gray-800 max-w-lg leading-relaxed">
              Join India’s first dedicated marketplace for the paper industry.
              Whether you are a mill, wholesaler, distributor, or manufacturer —
              PaperDeals helps you grow faster with verified B2B & B2C buyers.
            </p>

            <p className="text-gray-700 text-base leading-relaxed">
              Reach thousands of businesses looking for Kraft Paper, Duplex
              Board, Copier Paper, Tissue Products, Packaging Materials, and
              more — all in one trusted platform.
            </p>

            <div className="flex space-x-4">
              <button
                className="bg-[#0f7aed] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                onClick={() => setIsOpen(true)}
              >
                Start Selling
              </button>

              {/* Seller Login */}
              <button
                onClick={handleSellerLogin}
                className="border border-gray-300 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-600 hover:text-blue-600 shadow-md hover:shadow-lg"
              >
                Login as a Seller
              </button>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-96 w-full animate-float">
              <Image
                src="/becomeaseller.png"
                alt="Sell on PaperDeals"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <WhySellpaperdeals />

      {/* CTA Section */}
      <section className="py-16 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
            Ready to Grow Your{" "}
            <span className={`${theme.Text}`}>Paper Business?</span>
          </h2>

          <p className="text-gray-800 max-w-2xl mx-auto mb-8 text-lg font-semibold">
            Join the fastest-growing platform built exclusively for the paper
            and packaging industry. Sell smarter, reach verified buyers, and
            scale your business nationwide.
          </p>

          <button
            className="bg-white text-blue-600 font-bold py-4 px-10 rounded-lg"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
            onClick={() => setIsOpen(true)}
          >
            Register Now – It’s Free!
          </button>
        </div>

        {/* Popup Modal */}
        <RegisterNow visible={isOpen} onClose={() => setIsOpen(false)} />
      </section>
    </div>
  );
}
