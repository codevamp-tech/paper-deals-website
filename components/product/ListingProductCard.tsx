"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Mail, ArrowRight, MapPin, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";

interface ListingProductCardProps {
  item: any;
  mode: "B2B" | "B2C";
  isInCart: (id: number) => boolean;
  addToCart: (item: any) => void;
  openEnquiry: (item: any) => void;
}

const getFirstProductImage = (images?: string | string[]) => {
  if (Array.isArray(images)) return images[0] || "/mainimg.png";
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0] : images || "/mainimg.png";
    } catch {
      return images || "/mainimg.png";
    }
  }
  return "/mainimg.png";
};

export function ListingProductCard({
  item,
  mode,
  isInCart,
  addToCart,
  openEnquiry,
}: ListingProductCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const inCart = isInCart(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 flex flex-col h-full overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
        <Link href={`/product/${item.id}`} className="block w-full h-full">
          <img
            src={getFirstProductImage(item.images)}
            alt={item.product_name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5 border border-white/50">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-gray-800">{item.rating?.toFixed(1) || "5.0"}</span>
        </div>

        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-2xl bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            {item.category?.name || "General"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${item.id}`} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {item.product_name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <MapPin className="h-3 w-3" />
          <span>{item.city || "India"}</span>
        </div>

        {/* Specs Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">GSM</span>
            <span className="text-xs font-bold text-gray-700">{item.gsm || "-"}</span>
          </div>
          <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Size</span>
            <span className="text-xs font-bold text-gray-700">{item.sizes || item.size || "-"}</span>
          </div>
        </div>

        {/* Pricing & Footer */}
        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Market Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">₹{item.price_per_kg}</span>
                <span className="text-xs font-medium text-gray-500">/ kg</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (inCart) {
                router.push("/cart");
              } else {
                addToCart(item);
              }
            }}
            className={`w-full py-4 rounded-[1.25rem] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg text-white hover:opacity-90 ${
              inCart ? "bg-gray-800 shadow-gray-800/20" : "bg-primary shadow-primary/20"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? "Go to Cart" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
