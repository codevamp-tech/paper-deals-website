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
      className={`w-full   my-16  ${theme.Bg}`}
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
            className={`flex items-center ml-auto text-xs font-medium ${isPositive
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