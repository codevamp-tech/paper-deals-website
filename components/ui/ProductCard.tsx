"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight, ShoppingCart, Info } from "lucide-react";
import { Badge } from "./badge";
import { useTheme } from "@/hooks/use-theme";

interface ProductCardProps {
  id: string | number;
  title: string;
  subtitle: string;
  price: string | number;
  date: string;
  type: string;
  images?: string | string[];
  city?: string;
}

const getProductImage = (images?: string | string[]) => {
  if (Array.isArray(images)) return images[0] || "/placeholder.svg";
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed[0] : "/placeholder.svg";
    } catch {
      return images || "/placeholder.svg";
    }
  }
  return "/placeholder.svg";
};

export function ProductCard({
  id,
  title,
  subtitle,
  price,
  date,
  type,
  images,
  city,
}: ProductCardProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => router.push(`/product/${id}`)}
      className="group relative w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer premium-shadow-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={getProductImage(images)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/90 backdrop-blur-md text-primary border-primary/20 hover:bg-white text-xs font-bold px-3 py-1 shadow-sm">
            {type}
          </Badge>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="p-3 bg-white rounded-full text-primary shadow-xl hover:scale-110 transition-transform">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button className="p-3 bg-primary text-white rounded-full shadow-xl hover:scale-110 transition-transform">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{city || "India"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-gray-50">
          <div>
            <span className="text-2xl font-[900] text-primary">₹{price}</span>
            <span className="text-[10px] text-gray-400 block -mt-1">Inc. GST</span>
          </div>
          
          <div 
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: theme.buttoncolor }}
          >
            Details <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
