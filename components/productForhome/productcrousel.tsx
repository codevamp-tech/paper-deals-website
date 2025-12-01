"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Package,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "next/navigation"; // ✅ added

export default function ProductCrousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const { theme } = useTheme();

  // ✅ Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks?page=1&limit=10`
        );
        const data = await res.json();

        if (data && Array.isArray(data.data)) {
          const mapped = data.data.map((item: any) => ({
            id: item.id,
            title: item.product_name || "Untitled",
            subtitle: `${item.gsm || ""} ${item.shade || ""}`.trim() || "—",
            price: item.price_per_kg ?? 0,
            change: 0,
            isPositive: false,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "—",
            location: item.category_id || "—",
            type: "Premium",
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
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

  return (
    <div className="w-full py-8 px-4 sm:px-3 lg:px-4 overflow-hidden  bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className={`${theme.Text} text-[6vh] font-[900] mb-3`}
          // style={{ color: theme.Text }}
          >
            Products
          </h2>
        </div>

        {/* View All Products Button */}
        <div className="flex justify-end mb-6">
          <a href="/product">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border border-cyan-600 rounded-2xl font-medium hover:bg-cyan-50 transition-all duration-200 shadow-sm hover:shadow-md">
              View all Products
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>

        {/* Product Carousel */}
        <div className="relative overflow-hidden">
          <div className="overflow-hidden py-4">
            <div
              ref={scrollRef}
              className="flex gap-6 transition-transform"
              style={{ width: "fit-content" }}
            >
              {[...Array(2)].map((_, dupeIndex) => (
                <div key={dupeIndex} className="flex gap-6">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id + dupeIndex}
                      id={p.id}
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
  id: number;
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
  id,
  title,
  subtitle,
  price,
  change,
  isPositive,
  date,
  type,
}: ProductCardProps) {
  const router = useRouter(); // ✅ for navigation

  const handleClick = () => {
    router.push(`/product/${id}`); // ✅ Navigate to product detail page
  };

  const typeColors = {
    Premium: "from-blue-500 to-cyan-500",
    Standard: "from-green-500 to-emerald-500",
    Industrial: "from-amber-500 to-orange-500",
    Specialty: "from-purple-500 to-pink-500",
    Packaging: "from-red-500 to-rose-500",
  };

  const typeIcons = {
    Premium: "✦",
    Standard: "●",
    Industrial: "▲",
    Specialty: "★",
    Packaging: "■",
  };

  return (
    <div
      onClick={handleClick}
      className="group w-[380px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 cursor-pointer"
    >
      <div
        className={`h-24 bg-gradient-to-br ${typeColors[type]} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
          <span className="text-sm">{typeIcons[type]}</span>
          {type}
        </div>
        <div className="absolute bottom-3 left-4">
          <Package className="w-8 h-8 text-white/40" />
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 text-xl mb-1.5 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-1">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900">
              ₹{price ? price.toFixed(2) : "0.00"}
            </span>
            <span className="text-slate-500 text-sm font-medium">/ kg</span>
          </div>

          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-sm ${isPositive
              ? "bg-green-50 text-green-700"
              : change === 0
                ? "bg-slate-50 text-slate-600"
                : "bg-red-50 text-red-700"
              }`}
          >
            {isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : change === 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {change === 0 ? "0.00%" : `${change.toFixed(2)}%`}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Listed on</span>
          <span className="text-slate-700 font-semibold bg-slate-50 px-3 py-1 rounded-lg">
            {date}
          </span>
        </div>
      </div>

      <div className="h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-[#173a8a]"></div>
    </div>
  );
}
