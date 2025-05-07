import type React from "react";
import Image from "next/image";
import InfiniteCarousel from "./CulturePaperdeals";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";
import Footer from "@/components/footer/Footer";
export default function AboutUs() {
  return (
    <section className="container mx-auto px-4 py-16  border  ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-10">
        {/* Left Column - Text Content */}
        <div className="space-y-6 ">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white ">
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

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-[#8143e7]">
              Largest Vertically
              <br />
              Integrated
            </span>{" "}
            <span className="text-white">
              Metal
              <br />
              Supply Chain
              <br />
              Platform
            </span>
          </h1>
        </div>
        {/* add a business flow  */}

        {/* end of business flow */}
      </div>
      {/*second page about us  */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-[#111111] rounded-tr-2xl rounded-tl-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-sm font-medium text-[#fff] bg-indigo-900 bg-opacity-30 rounded-full">
                About Our Company
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Pioneering <span className="text-[#8440e8]">Sustainable</span>{" "}
                Metal Solutions
              </h1>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                As a vertically integrated leader, we deliver comprehensive
                Value Added Services through innovation and partnership. Our
                digital ecosystem connects all stakeholders on a unified
                platform, driving efficiency and transparency across the metal
                supply chain.
              </p>

              <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <p className="text-gray-300 italic">
                  "We're committed to reducing environmental impact by
                  optimizing resource utilization and pioneering circular
                  economy practices in metal distribution."
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-4">
                <li className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-indigo-400"
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
                    className="h-5 w-5 text-indigo-400"
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
                    className="h-5 w-5 text-indigo-400"
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
                    className="h-5 w-5 text-indigo-400"
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
          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-2 gap-5">
              {/* Image 1 - Main featured image */}
              <div className="col-span-2 relative group overflow-hidden rounded-2xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 flex items-end p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Innovation in Metal Processing
                  </h3>
                </div>
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
                  Sustainability
                </div>
              </div>

              {/* Vertical stack for Image 2 and Image 3 */}
              <div className="col-span-2 md:col-span-1 space-y-5">
                {/* Image 2 - Now appears above */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src="/mainimg.png"
                    alt="Team discussing sustainable solutions"
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition duration-700"></div>
                </div>

                {/* Image 3 - Now appears below */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src="/mainimg.png"
                    alt="Global logistics network"
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white transform group-hover:scale-125 transition duration-700">
                      Global Reach
                    </div>
                  </div>
                </div>
              </div>

              {/* Image 4 - Moved to right side */}
              <div className="col-span-2 md:col-span-1 relative group overflow-hidden rounded-2xl shadow-xl h-full">
                <img
                  src="/mainimg.png"
                  alt="Premium metal products"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Quality Products
                  </h3>
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

      <Footer />
    </section>
  );
}
