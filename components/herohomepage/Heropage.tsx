"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path if needed
import BioImageSec from "../ImageOrBio/ImageAndBio"; // Replace with actual path

const images = ["/banner1.png", "/banner2.png", "/banner3.jpg"]; // Replace with actual image paths in your public folder

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-[12vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Background ${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Optional overlays for blur or color tint */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Background Blurs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] [background-color:rgba(113,47,255,0.21)] rounded-full blur-[120px] z-20" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] z-20" />
      </div>

      <div className="h-[60vh] relative z-30">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#fff]">
                Revolutionize
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#aaa]">
                Your Business with Premium Paper Solutions
              </span>
            </h1>
            <p className="text-xl text-zinc-200 mb-8 max-w-2xl mx-auto">
              Elevate your business with our high-quality products designed
              specifically for modern B2B needs.
            </p>

            {/* Search + CTA */}
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="relative group max-w-4xl mx-auto">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search samples..."
                    className="block w-full pl-10 pr-12 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
                      hover:border-gray-400 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-6 text-lg ml-4">
                Shop Now <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Section */}
      <BioImageSec />
    </section>
  );
};

export default Hero;
