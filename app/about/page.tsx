"use client";
import type React from "react";
import InfiniteCarousel from "./CulturePaperdeals";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";
import { useTheme } from "@/hooks/use-theme";

export default function AboutUs() {
  // Mock theme for demonstration
  const { theme } = useTheme();

  return (
    <section className="w-full">
      {/* First Section - Hero */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-white"
                style={{
                  backgroundColor: theme.bg1,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span className="font-medium">About Us</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-black">
                  Largest Vertically
                  <br />
                  Integrated
                </span>{" "}
                <span style={{ color: theme.Text }}>
                  Paper
                  <br />
                  Supply Chain
                  <br />
                  Platform
                </span>
              </h1>
            </div>

            {/* Right Column - Business Flow Image */}
            <div className="w-full">
              <img
                src="/flowimg.png"
                alt="business flow"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Section - Company Info */}
      <div className="w-full bg-[#111111] rounded-tl-3xl rounded-tr-3xl">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
              {/* Text Content */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-indigo-900 bg-opacity-30 rounded-full">
                    About Our Company
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Pioneering{" "}
                    <span style={{ color: theme.Text }}>Sustainable</span> Paper
                    Solutions
                  </h1>
                </div>

                <div className="space-y-6">
                  <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
                    As a vertically integrated leader, we deliver comprehensive
                    Value Added Services through innovation and partnership. Our
                    digital ecosystem connects all stakeholders on a unified
                    platform, driving efficiency and transparency across the
                    paper supply chain.
                  </p>

                  <div className="p-4 lg:p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-sm lg:text-base text-gray-300 italic">
                      "We're committed to reducing environmental impact by
                      optimizing resource utilization and pioneering circular
                      economy practices in paper distribution."
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <li className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-indigo-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">Premium Sourcing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-indigo-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">Fabrication</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-indigo-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">Financing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-indigo-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">Global Logistics</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-4 lg:gap-5">
                  {/* Image 1 - Main featured image */}
                  <div className="col-span-2 relative group overflow-hidden rounded-2xl shadow-xl h-64 sm:h-80 lg:h-96">
                    <img
                      src="/mainimg.png"
                      alt="Innovation in paper Processing"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 flex items-end p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-semibold text-white">
                        Innovation in paper Processing
                      </h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs lg:text-sm font-medium text-white">
                      Sustainability
                    </div>
                  </div>

                  {/* Vertical stack for Image 2 and Image 3 */}
                  <div className="col-span-2 md:col-span-1 space-y-4 lg:space-y-5">
                    {/* Image 2 */}
                    <div className="relative group overflow-hidden rounded-2xl shadow-xl h-40 sm:h-48">
                      <img
                        src="/mainimg.png"
                        alt="Team discussing sustainable solutions"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition duration-700"></div>
                    </div>

                    {/* Image 3 */}
                    <div className="relative group overflow-hidden rounded-2xl shadow-xl h-40 sm:h-48">
                      <img
                        src="/mainimg.png"
                        alt="Global logistics network"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs lg:text-sm font-medium text-white transform group-hover:scale-125 transition duration-700">
                          Global Reach
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image 4 */}
                  <div className="col-span-2 md:col-span-1 relative group overflow-hidden rounded-2xl shadow-xl h-[21rem] sm:h-[25rem]">
                    <img
                      src="/mainimg.png"
                      alt="Premium paper products"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-semibold text-white">
                        Quality Products
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InfiniteCarousel />

      <ReadyToOrder />

      <PartnerWithUs />

      <FaqSection />
    </section>
  );
}
