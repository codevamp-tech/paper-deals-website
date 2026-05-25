"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";

type Mode = "B2B" | "B2C";

const SCROLL_SPEED = 0.6; // px per frame — adjust for faster/slower

export default function ProductCrousel({ initialProducts }: { initialProducts?: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [mode, setMode] = useState<Mode>("B2C");

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const scrollXRef = useRef(0);

  /* ── Fetch products ── */
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

  /* ── Auto-scroll RAF loop ── */
  useEffect(() => {
    if (loading || products.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    // Wait one frame so the DOM is painted and scrollWidth is accurate
    const startLoop = () => {
      const loop = () => {
        if (!isPausedRef.current && track) {
          scrollXRef.current += SCROLL_SPEED;

          // When we've scrolled exactly half (the cloned set), reset silently
          const halfWidth = track.scrollWidth / 2;
          if (scrollXRef.current >= halfWidth) {
            scrollXRef.current = 0;
          }

          track.style.transform = `translateX(-${scrollXRef.current}px)`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    startLoop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loading, products]);

  // Pause on hover / touch
  const handleMouseEnter = () => { isPausedRef.current = true; };
  const handleMouseLeave = () => { isPausedRef.current = false; };

  // Duplicate the list for seamless infinite loop
  const doubled = [...products, ...products];

  return (
    <section className="w-full py-24 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* ── Heading ── */}
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

        {/* ── Carousel ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
          >
            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
              style={{ background: "linear-gradient(to right, #f9fafb, transparent)" }} />
            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
              style={{ background: "linear-gradient(to left, #f9fafb, transparent)" }} />

            {/* Scrolling track — overflow hidden on parent, translateX on track */}
            <div className="overflow-hidden w-full pb-4">
              <div
                ref={trackRef}
                className="flex gap-6 will-change-transform"
                style={{ width: "max-content" }}
              >
                {doubled.map((p, index) => (
                  <motion.div
                    key={`${p.id}-${index}`}
                    className="flex-shrink-0 w-[280px] sm:w-[300px]"
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ProductCard {...p} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pause indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {products.map((_, i) => (
                <span
                  key={i}
                  className="block h-1.5 rounded-full bg-primary/30 transition-all duration-300"
                  style={{ width: i === 0 ? "2rem" : "0.5rem" }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400">No featured products available at the moment.</p>
          </div>
        )}

      </div>
    </section>
  );
}
