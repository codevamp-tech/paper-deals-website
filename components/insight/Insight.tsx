"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, MapPin } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function ProductInsights() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/live-price`
        );
        const data = await res.json();

        if (data && Array.isArray(data.data)) {
          const mapped = data.data.map((item: any) => ({
            id: item.id,
            title: item.name,
            subtitle: `${item.gsm || ""} ${item.quality || ""}`.trim() || "—",
            price: item.price,
            change: item.change || 0,
            isPositive: (item.change || 0) > 0,
            date: item.updated_at || "—",
            location: item.location,
            type: "Premium", // 🔑 API me type nahi hai, default set kar diya
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
      finally {
        setLoading(false);
      }
    };


    fetchData();
  }, []);

  // ✅ Auto-scroll effect
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

    return () => cancelAnimationFrame(animationId);
  }, [products]);
  const { theme } = useTheme();

  return (
    <div
      className={`w-full   my-10  ${theme.Bg}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className={`${theme.Text} text-[6vh] font-[900] mt-1 font-[Poppins] flex justify-center`}
          // style={{ color: theme.Text }}
          >
            Paper Industry Insights
          </h2>
          <p className="flex justify-center text-[3vh] text-center pb-4 pt-4 ">
            Keep up to date with Paper Industry News and Commodity Prices.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-end mb-6">
          <a href="/insights-comparison">
            <button
              className={`${theme.Text} flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-600 rounded-2xl font-medium hover:bg-cyan-50 transition-all duration-200 shadow-sm hover:shadow-md`}
            // style={{ color: theme.Text }}
            >
              View all Insights
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>

        {/* Product Cards */}
        <div className="relative overflow-hidden">
          {/* <div className="hidden md:block absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#31a8de] to-transparent z-10"></div>
          <div className="hidden md:block absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#31a8de] to-transparent z-10"></div> */}

          <div className="overflow-hidden py-4">
            <div
              ref={scrollRef}
              className="flex gap-4 transition-transform"
              style={{ width: "fit-content" }}
            >
              {loading
                ? // ✅ Skeleton while loading
                [...Array(5)].map((_, i) => <ProductCardSkeleton key={i} />)
                : [...Array(2)].map((_, dupeIndex) => (
                  <div key={dupeIndex} className="flex gap-4">
                    {products.map((p) => (
                      <ProductCard
                        key={p.id + dupeIndex}
                        title={p.title}
                        subtitle={p.subtitle}
                        price={p.price}
                        change={p.change}
                        isPositive={p.isPositive}
                        date={p.date}
                        location={p.location}
                        type={p.type}
                      />
                    ))}
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
    Premium: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200",
    Standard: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-200",
    Industrial: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-200",
    Specialty: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200",
    Packaging: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-200",
  };

  const { theme } = useTheme();

  return (
    <div className="group w-[320px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border-2 border-slate-200 hover:border-cyan-400 flex flex-col hover:scale-105 hover:-translate-y-1">
      {/* Header with gradient background */}
      <div className="relative   p-5"
        style={{
          backgroundColor: theme.bg1,
        }}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white text-xl leading-tight flex-1 pr-2">
            {title}
          </h3>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${typeColors[type]} `}>
            {type}
          </span>
        </div>
        {/* <p className="text-sm text-slate-300 line-clamp-1">
          {subtitle}
        </p> */}

        {/* Decorative element */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-full"></div>
      </div>

      {/* Price Section */}
      <div className="p-6 flex-1 bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-black text-slate-800">
            ₹{price.toFixed(2)}
          </span>
          <span className="text-slate-500 text-base font-medium mb-1">/ kg</span>
        </div>

        {/* Change indicator with enhanced styling */}
        {/* <div
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${isPositive
            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200"
            : change === 0
              ? "bg-slate-200 text-slate-600"
              : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200"
            }`}
        >
          {isPositive ? (
            <ArrowUp className="w-4 h-4" />
          ) : change === 0 ? null : (
            <ArrowDown className="w-4 h-4" />
          )}
          {change === 0 ? "No Change" : `${change > 0 ? '+' : ''}${change.toFixed(2)}%`}
        </div> */}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 text-sm font-medium text-slate-700 flex justify-between items-center border-t-2 border-slate-300">
        {/* <span className="flex items-center gap-1">
          📅 {date}
        </span> */}
        <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-slate-800 font-semibold">{location}</span>
        </div>
      </div>
    </div>
  );
}



function ProductCardSkeleton() {
  return (
    <div className="w-[300px] h-[220px] rounded-xl overflow-hidden shadow-md bg-white border border-slate-100 animate-pulse flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        <div className="h-4 bg-slate-200 rounded w-10"></div>
      </div>
      <div className="p-4 flex-1 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-10"></div>
        </div>
      </div>
      <div className="bg-slate-50 p-3 flex justify-between items-center">
        <div className="h-3 bg-slate-200 rounded w-16"></div>
        <div className="h-3 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  );
}