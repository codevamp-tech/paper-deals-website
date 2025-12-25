"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "next/navigation";

type Mode = "B2B" | "B2C";

export default function ProductCrousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [mode, setMode] = useState<Mode>("B2B");
  const { theme } = useTheme();

  /* ✅ Read mode from localStorage */
  useEffect(() => {
    const savedMode = localStorage.getItem("mode") as Mode;
    if (savedMode) setMode(savedMode);
  }, []);

  /* ✅ Fetch products based on mode */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const url =
          mode === "B2C"
            ? `${baseUrl}/api/product/by-user-type?user_type=3&page=1&limit=10`
            : `${baseUrl}/api/product?page=1&limit=10`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        if (Array.isArray(data.products)) {
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
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [mode]);

  /* ✅ Auto-scroll */
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || products.length === 0) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      scrollPosition += 0.5;
      const scrollWidth = scrollContainer.scrollWidth / 2;
      scrollContainer.style.transform = `translateX(-${scrollPosition % scrollWidth}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [products]);

  return (
    <div className="w-full py-6 px-4 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className={`${theme.Text} text-[6vh] font-[900]`}>
            Products
          </h2>
        </div>

        {/* View All */}
        <div className="flex justify-end mb-6">
          <a href="/product">
            <button className="flex items-center gap-2 px-6 py-3 border border-cyan-600 rounded-2xl text-blue-600 hover:bg-cyan-50">
              View all Products
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div className="overflow-hidden py-4">
            <div
              ref={scrollRef}
              className="flex gap-6"
              style={{ width: "fit-content" }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  {products.map((p) => (
                    <ProductCard key={`${p.id}-${i}`} {...p} />
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

/* ---------------- CARD ---------------- */

function ProductCard({
  id,
  title,
  subtitle,
  price,
  date,
  type,
  image,
  city,
}: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/product/${id}`)}
      className="w-[300px] rounded-xl border hover:shadow-xl cursor-pointer transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition"
        />
        <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-3 py-1 rounded-full">
          {type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <p className="text-xs text-slate-400 mt-1">📍 {city || "India"}</p>

        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="text-xl font-bold text-blue-600">₹{price}</div>
            <div className="text-xs text-slate-400">Listed on {date}</div>
          </div>

          <button className="px-4 py-2 text-sm text-white rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
