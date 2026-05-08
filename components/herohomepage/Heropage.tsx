"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronRight, ShoppingCart, ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Hero = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [results, setResults] = useState<any[]>([]);
  const [mode, setMode] = useState<"B2B" | "B2C">("B2C");
  const router = useRouter();

  function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  }

  useEffect(() => {
    const stored = localStorage.getItem("mode");
    setMode(stored === "B2B" ? "B2B" : "B2C");
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const currentMode = localStorage.getItem("mode") || "B2C";
        const userType = currentMode === "B2B" ? 2 : 3;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/search?q=${encodeURIComponent(
            debouncedQuery
          )}&user_type=${userType}&limit=6`
        );

        if (!res.ok) {
          setResults([]);
          return;
        }

        const data = await res.json();
        if (data?.success && Array.isArray(data.products)) {
          setResults(
            data.products.map((item: any) => ({
              ...item,
              _type: "product",
            }))
          );
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("❌ Hero search error:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (item: any) => {
    setQuery("");
    setResults([]);
    router.push(`/product/${item.id}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white border-b border-gray-100">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors">
                  {mode === "B2C" ? "✨ Premium Paper Marketplace" : "🏢 Enterprise B2B Solutions"}
                </Badge>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                {mode === "B2C" ? (
                  <>The Best Quality <span className="text-primary relative inline-block">
                    Paper
                    <motion.span 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute bottom-1 left-0 h-2 bg-primary/20 -z-10"
                    />
                  </span> for Your Home</>
                ) : (
                  <>Direct <span className="text-primary relative inline-block">
                    Sourcing
                    <motion.span 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute bottom-1 left-0 h-2 bg-primary/20 -z-10"
                    />
                  </span> for Business</>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
                {mode === "B2C" 
                  ? "Discover a wide range of premium paper products delivered right to your door. From professional projects to daily needs."
                  : "Optimize your supply chain with wholesale pricing, bulk ordering, and custom manufacturing solutions for businesses."}
              </p>
            </div>

            {/* Premium Search Bar */}
            <div className="relative max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <div className="pl-4 pr-2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="What are you looking for today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full py-5 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                />
                <button className="mr-2 bg-primary text-white p-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              
              <AnimatePresence>
                {debouncedQuery && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {results.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No products found for "{debouncedQuery}"
                      </div>
                    ) : (
                      <ul className="max-h-[400px] overflow-y-auto py-2">
                        {results.map((item, index) => (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center justify-between group"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {item.product_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                Category: {item.category?.name || item.category_id}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span>Verified Suppliers</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Star className="h-5 w-5" />
                </div>
                <span>Premium Quality</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden premium-shadow group">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img
                src={mode === "B2C" ? "/banner2.png" : "/banner1.png"}
                alt="Paper Solutions"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-1000"
              />
            </div>
            
            {/* Floating Info Cards */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl z-20 border border-white/20 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <ShoppingCart className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 tracking-tight">50,000+</div>
                  <div className="text-sm font-medium text-gray-500 italic">Premium Products</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-12 -right-8 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl z-20 border border-white/20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  Join 10k+ <br /> <span className="text-primary">Trusted Users</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
