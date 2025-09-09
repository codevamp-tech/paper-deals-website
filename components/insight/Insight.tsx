"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowRight, ArrowUp, MapPin } from "lucide-react";

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
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#fff] text-[6vh] font-[900] mb-3">
            Paper Industry Insights
          </h2>
          <p className="flex justify-center text-[3vh]">
            Keep up to date with Paper Industry News and Commodity Prices.
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <a href="/insights-comparison">
            <button
              className="
        flex items-center justify-center gap-2
        px-6 py-3 
        bg-white text-blue-600 
        border border-cyan-600 
        rounded-2xl 
        font-medium
        hover:bg-cyan-50 
        transition-all duration-200
        shadow-sm hover:shadow-md
      "
            >
              View all Insights
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>
        <div className="relative overflow-hidden">
          <div className="hidden md:block absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#31a8de] to-transparent z-10"></div>
          <div className="hidden md:block absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#31a8de] to-transparent z-10"></div>

          <div className="overflow-hidden py-4">
            <div
              ref={scrollRef}
              className="flex gap-4 transition-transform"
              style={{ width: "fit-content" }}
            >
              {[...Array(2)].map((_, dupeIndex) => (
                <div key={dupeIndex} className="flex gap-4">
                  <ProductCard
                    title="A4 Copy Paper"
                    subtitle="80 GSM, Bright White, 500 Sheets/Ream"
                    price={0.85}
                    change={0.63}
                    isPositive={true}
                    date="29/04/2025"
                    location="Chennai"
                    type="Premium"
                  />

                  <ProductCard
                    title="Kraft Paper"
                    subtitle="120 GSM, Natural Brown, 100% Recycled"
                    price={1.2}
                    change={0.93}
                    isPositive={true}
                    date="29/04/2025"
                    location="Mumbai"
                    type="Industrial"
                  />

                  <ProductCard
                    title="Art Paper"
                    subtitle="150 GSM, Glossy Finish, Coated"
                    price={1.5}
                    change={0.8}
                    isPositive={false}
                    date="29/04/2025"
                    location="Delhi"
                    type="Premium"
                  />

                  <ProductCard
                    title="Newsprint"
                    subtitle="45 GSM, Standard Quality"
                    price={0.45}
                    change={0.0}
                    isPositive={false}
                    date="29/04/2025"
                    location="Kolkata"
                    type="Standard"
                  />

                  <ProductCard
                    title="Gumming Sheets"
                    subtitle="90 GSM, Self-Adhesive, White"
                    price={1.8}
                    change={0.0}
                    isPositive={false}
                    date="29/04/2025"
                    location="Bangalore"
                    type="Specialty"
                  />

                  <ProductCard
                    title="Corrugated Sheets"
                    subtitle="3-Ply, E-Flute, 200 GSM"
                    price={2.3}
                    change={1.04}
                    isPositive={false}
                    date="29/04/2025"
                    location="Hyderabad"
                    type="Packaging"
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
  type: "Premium" | "Standard" | "Industrial" | "Specialty" | "Packaging";
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
  const typeColors = {
    Premium: "bg-blue-50 text-blue-600",
    Standard: "bg-green-50 text-green-600",
    Industrial: "bg-amber-50 text-amber-600",
    Specialty: "bg-purple-50 text-purple-600",
    Packaging: "bg-red-50 text-red-600",
  };

  return (
    <div className="w-[300px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-slate-100 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type]}`}>
          {type}
        </span>
      </div>

      <div className="p-4 flex-1">
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 h-10">
          {subtitle}
        </p>

        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl font-bold text-slate-800">
            ₹{price.toFixed(2)}
          </span>
          <span className="text-slate-600 text-sm">/ kg</span>

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
