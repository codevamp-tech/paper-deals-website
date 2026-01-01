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
import { useRouter } from "next/navigation";

const getProductImage = (images?: string) => {
  try {
    const parsed = images ? JSON.parse(images) : [];
    return parsed?.[0] || "/placeholder.svg";
  } catch {
    return "/placeholder.svg";
  }
};

export default function SellerProductCrousel({ sellerId }: { sellerId: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const { theme } = useTheme();

  // ✅ Fetch API Data (GET BY SELLER ID)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/seller/${sellerId}`
        );

        const data = await res.json();

        if (data && Array.isArray(data)) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.product_name || "Untitled",
            subtitle: `${item.gsm || ""} GSM • ${item.sizes || ""} Size`,
            price: item.price_per_kg ?? 0,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "—",
            images: item.images,
            type: "Premium",
          }));

          setProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching seller products:", error);
      }
    };

    fetchData();
  }, [sellerId]);

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
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className={`text-[6vh] font-[900] ${theme.Text}`} >
            Seller Products
          </h2>
        </div>

        {/* Product Carousel */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              No products found
            </h3>
            <p className="text-gray-500 mt-1">
              This seller hasn’t listed any products yet.
            </p>
          </div>
        ) : (
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
                        images={p.images}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
  images: string;
}

function ProductCard({
  id,
  title,
  subtitle,
  price,
  date,
  type,
  images,
}: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group w-[300px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-slate-200 hover:border-blue-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* ✅ IMAGE ADDED */}
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={getProductImage(images)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-xl mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-1">{subtitle}</p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold">₹{price}/kg</span>
        </div>

        {/* <div className="text-xs text-slate-600">Listed on: {date}</div> */}
      </div>
    </div>
  );
}
