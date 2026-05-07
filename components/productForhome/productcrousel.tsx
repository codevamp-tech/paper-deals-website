"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";

type Mode = "B2B" | "B2C";

export default function ProductCrousel({ initialProducts }: { initialProducts?: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [mode, setMode] = useState<Mode>("B2C");
  const { theme } = useTheme();

  useEffect(() => {
    const savedMode = localStorage.getItem("mode") as Mode;
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const currentMode = localStorage.getItem("mode") || "B2C";
        const userType = currentMode === "B2B" ? 2 : 3;
        
        const url = `${baseUrl}/api/product/by-user-type?user_type=${userType}&page=1&limit=10`;
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
            images: item.images,
            city: item.city,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mode, initialProducts]);

  return (
    <section className="w-full py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        
        {/* Heading Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="text-lg text-gray-500">
              Browse our curated selection of premium paper products, from industrial bulk supplies to fine stationery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/product">
              <button className="group flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/20">
                View All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Product Grid / Scroll */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="relative group">
            <div className="flex gap-8 overflow-x-auto pb-8 snap-x no-scrollbar">
              {products.map((p, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  key={p.id} 
                  className="flex-shrink-0 w-full sm:w-[320px] snap-start"
                >
                  <ProductCard {...p} />
                </motion.div>
              ))}
            </div>
            
            {/* Visual indicators for scroll */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center hidden group-hover:flex border border-gray-100 cursor-pointer hover:bg-gray-50">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center hidden group-hover:flex border border-gray-100 cursor-pointer hover:bg-gray-50">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">No featured products available at the moment.</p>
          </div>
        )}

      </div>
    </section>
  );
}
