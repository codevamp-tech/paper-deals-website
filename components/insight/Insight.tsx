"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, MapPin } from "lucide-react";

export default function ProductInsights() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollPosition += 0.5;

      // Use modulus to create seamless loop without resetting
      const scrollWidth = scrollContainer.scrollWidth / 2;
      const currentOffset = scrollPosition % scrollWidth;

      scrollContainer.style.transform = `translateX(-${currentOffset}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className="w-full  py-16 px-4 sm:px-6 lg:px-8 overflow-hidden
    "
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#fff] text-[6vh] font-[900]  mb-3">
            Insights
          </h2>
          <p className="flex justify-center text-[3vh]">
            Keep up to date with Industry News and Commodity Prices.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth scroll effect */}
          <div className="hidden md:block absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#063733] to-transparent z-10"></div>
          <div className="hidden md:block absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#07423d] to-transparent z-10"></div>

          <div className="overflow-hidden py-4">
            <div
              ref={scrollRef}
              className="flex gap-4 transition-transform"
              style={{ width: "fit-content" }}
            >
              {/* Product Cards - duplicated for continuous scroll effect */}
              {[...Array(2)].map((_, dupeIndex) => (
                <div key={dupeIndex} className="flex gap-4">
                  <ProductCard
                    title="HB Wire"
                    subtitle="12Gauge"
                    price={47.7}
                    change={0.63}
                    isPositive={true}
                    date="29/04/2025"
                    location="Raipur"
                    type="Primary"
                  />

                  <ProductCard
                    title="Copper Wire Rods"
                    subtitle="Primary CC Rods(CCR), 8mm, Cu 99.99%"
                    price={872.0}
                    change={0.93}
                    isPositive={true}
                    date="29/04/2025"
                    location="Mumbai"
                    type="Primary"
                  />

                  <ProductCard
                    title="Copper Wire Rods"
                    subtitle="Primary CC Rods(CCR), 8mm, Cu 99.99%"
                    price={865.0}
                    change={0.8}
                    isPositive={false}
                    date="29/04/2025"
                    location="Delhi"
                    type="Primary"
                  />

                  <ProductCard
                    title="Channel"
                    subtitle="100*50, IS2062/2011 E250 Gr A"
                    price={45.3}
                    change={0.0}
                    isPositive={false}
                    date="29/04/2025"
                    location="Raipur"
                    type="Secondary"
                  />

                  <ProductCard
                    title="Channel"
                    subtitle="100*50, IS2062/2011 E250 Gr A"
                    price={50.7}
                    change={0.0}
                    isPositive={false}
                    date="29/04/2025"
                    location="Mumbai"
                    type="Secondary"
                  />

                  <ProductCard
                    title="Channel"
                    subtitle="100*50, IS2062/2011 E250 Gr A"
                    price={47.6}
                    change={1.04}
                    isPositive={false}
                    date="29/04/2025"
                    location="Hyderabad"
                    type="Secondary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: number;
  change: number;
  isPositive: boolean;
  date: string;
  location: string;
  type: "Primary" | "Secondary";
}

function ProductCard({
  title,
  subtitle,
  price,
  change,
  isPositive,
  date,
  location,
  type,
}: ProductCardProps) {
  return (
    <div className="w-[300px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-slate-100 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            type === "Primary"
              ? "bg-blue-50 text-blue-600"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {type}
        </span>
      </div>

      <div className="p-4 flex-1">
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 h-10">
          {subtitle}
        </p>

        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl font-bold text-slate-800">
            {price.toFixed(1)}
          </span>
          <span className="text-slate-600 text-sm">/ Kg</span>

          <div
            className={`flex items-center ml-auto text-xs font-medium ${
              isPositive
                ? "text-green-600"
                : change === 0
                ? "text-slate-500"
                : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-3 h-3 mr-0.5" />
            ) : change === 0 ? null : (
              <ArrowDown className="w-3 h-3 mr-0.5" />
            )}
            {change === 0 ? "0.00 %" : `${change.toFixed(2)} %`}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-3 text-xs text-slate-600 flex justify-between items-center">
        <span>{date}</span>
        <div className="flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
          {location}
        </div>
      </div>
    </div>
  );
}
