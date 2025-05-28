"use client";

import React from "react";
import { Search, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path if needed
import BioImageSec from "../ImageOrBio/ImageAndBio"; // Replace with actual path

const Hero = () => {
  return (
    <section className="relative py-[12vh] overflow-hidden ">
      <div className="h-[60vh]">
        {/* Background Blurs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] [background-color:rgba(113,47,255,0.21)] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
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
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
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

      {/* Optional visual/image section */}
      <BioImageSec />
    </section>
  );
};

export default Hero;
