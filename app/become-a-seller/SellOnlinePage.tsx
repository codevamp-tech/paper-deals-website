"use client";

import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Users,
  Calendar,
  TrendingDown,
  HeadphonesIcon,
  ShoppingBag,
} from "lucide-react";
import WhySellpaperdeals from "./Why-Sell-Paperdeals";
import RegisterNow from "@/components/modal/RegisterNow";
export default function SellOnlinePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen  font-sans">
      {/* Animated Breadcrumb */}
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

      {/* Hero Section with Animation */}
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
              <Link href="/SellerPage">
                {" "}
                <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
                  Start Selling
                </button>
              </Link>

              <button className="border border-white text-white font-medium py-3 px-6 rounded-lg  hover:bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
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

      {/* Features Section with Hover Effects */}
      <WhySellpaperdeals />
      {/* Seller Success Stories - Carousel Style */}
      {/* <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-blue-600">Seller Success</span> Stories
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Hear from sellers who transformed their businesses with Flipkart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Gupta",
                business: "Handicrafts Store",
                growth: "10x revenue growth in 2 years",
                testimonial:
                  "Flipkart helped me reach customers across India that I could never have accessed otherwise.",
              },
              {
                name: "Priya Sharma",
                business: "Home Decor",
                growth: "500+ orders per month",
                testimonial:
                  "The seller support team guided me at every step to optimize my listings and sales.",
              },
              {
                name: "Amit Patel",
                business: "Electronics Accessories",
                growth: "From local shop to national brand",
                testimonial:
                  "Participating in Big Billion Days transformed my business completely.",
              },
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.business}</p>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-800 text-sm font-medium px-3 py-2 rounded-lg mb-4 inline-block">
                  {story.growth}
                </div>
                <p className="text-gray-700 italic">"{story.testimonial}"</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-white border border-blue-600 text-blue-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
              View More Success Stories
            </button>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className=" py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start <span className="text-gray-100"> Selling?</span>
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg ">
            Join India's most trusted e-commerce platform and take your business
            to new heights
          </p>
          <button className="bg-white text-blue-600 font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-Poppins"
            onClick={() => setIsOpen(true)}>
            Register Now - It's Free!
          </button>
        </div>
        <RegisterNow
          visible={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </section>
    </div>
  );
}
