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
          `${process.env.NEXT_PUBLIC_API_URL}/api/product?page=1&limit=10`
        );
        const data = await res.json();

        if (data && Array.isArray(data.products)) {
          const mapped = data.products.map((item: any) => ({
            id: item.id,
            title: item.product_name,
            subtitle: `${item.gsm} GSM • ${item.shade}`,
            price: item.price_per_kg,
            date: new Date(item.created_at).toLocaleDateString(),
            type: item.category?.name || "Product",
            image: item.image,
            city: item.city,
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
                      date={p.date}
                      type={p.type}
                      image={p.image}
                      city={p.city}
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
  date: string;
  type: string;
  image: string;
  city: string;
}


function ProductCard({
  id,
  title,
  subtitle,
  price,
  date,
  type,
  image,
  city,
}: ProductCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/product/${id}`)}
      className="group w-[300px] rounded-xl overflow-hidden bg-white border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
          {type}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1">
          {title}
        </h3>

        {/* Specs */}
        <p className="text-sm text-slate-500 mb-2 line-clamp-1">
          {subtitle}
        </p>

        {/* Location */}
        <p className="text-xs text-slate-400 mb-3">
          📍 {city || "India"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-blue-600">
              ₹{price}
            </div>
            <div className="text-xs text-slate-400">
              Listed on {date}
            </div>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
