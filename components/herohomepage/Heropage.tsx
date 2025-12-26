"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronRight, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import Link from "next/link";

const Hero = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [results, setResults] = useState<any[]>([]);

  const [mode, setMode] = useState<"B2B" | "B2C">("B2B");

  const router = useRouter();
  const { theme } = useTheme();

  function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  }

  // Detect mode
  useEffect(() => {
    const stored = localStorage.getItem("mode");
    if (stored === "B2C") setMode("B2C");
  }, []);

  // Search API
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/search?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=6`
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
        console.error("❌ B2C Hero search error:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedQuery]);


  const handleSelect = (item: any) => {
    setQuery("");        // ✅ clear input
    setResults([]);      // ✅ close dropdown
    router.push(`/product/${item.id}`);
  };


  return (
    <>
      {mode === "B2C" ? (
        // B2C HERO SECTION
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="absolute inset-0 bg-[url('/abstract-paper-texture-pattern.jpg')] opacity-10" />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Premium Paper Products
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Quality Paper Products for Every Need
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  From everyday printing to professional projects, discover our wide range of premium paper products
                  delivered right to your door.
                </p>

                {/* Search Bar */}
                <div className="relative group w-full max-w-xl">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  <input
                    type="text"
                    placeholder="Search by product or category..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  {results.length === 0 && debouncedQuery && (
                    <li className="px-4 py-3 text-sm text-gray-500">
                      No products found
                    </li>
                  )}

                  {results.length > 0 && (
                    <ul className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-black">
                      {results.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              {item.product_name}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                              Product
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Category: {item.category?.name || item.category_id}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="group bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => router.push("/product?toProduct=true")}
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                    asChild
                  >
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="relative animate-fade-in-up">
                <img
                  src="/banner2.png"
                  alt="Paper Products"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* B2C Stats */}
          {/* <div className="w-full bg-black/30 backdrop-blur-md py-8 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">500K+</h3>
                  <p className="text-white/80">Happy Customers</p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">🚚 Fast</h3>
                  <p className="text-white/80">Delivery</p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">1M+</h3>
                  <p className="text-white/80">Products Sold</p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">🏆 Top</h3>
                  <p className="text-white/80">Rated Service</p>
                </div>
              </div>
            </div>
          </div> */}
        </section>
      ) : (
        // B2B HERO SECTION
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0F9D58]/95 to-[#0B7D46]/80 text-white">
          <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-10" />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  B2B Solutions
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Industrial Paper Solutions for Your Business
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Wholesale pricing, bulk ordering, and custom manufacturing solutions for businesses. From raw materials
                  to finished products.
                </p>

                {/* Search Bar */}
                <div className="relative group w-full max-w-xl">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  <input
                    type="text"
                    placeholder="Search by product or category..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  {results.length > 0 && (
                    <ul className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-black">
                      {results.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              {item.product_name}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                              Product
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Category: {item.category?.name || item.category_id}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="group bg-white text-slate-800 hover:bg-gray-100"
                    onClick={() => router.push("/product")}
                  >
                    Products
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-slate-800 bg-transparent"
                    asChild
                  >
                    <Link href="/livestock">View Livestock</Link>
                  </Button>
                </div>
              </div>
              <div className="relative animate-fade-in-up">
                <img
                  src="/banner1.png"
                  alt="Industrial Paper Products"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* B2B Stats */}
          {/* <div className="w-full bg-black/30 backdrop-blur-md py-8 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">400K+</h3>
                  <p className="text-white/80">Raw Materials Prices</p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">1M+</h3>
                  <p className="text-white/80">SMEs Empowered</p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">500K+</h3>
                  <p className="text-white/80">Orders Delivered</p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">30+</h3>
                  <p className="text-white/80">Countries Served</p>
                </div>
              </div>
            </div>
          </div> */}
        </section>
      )}
    </>
  );
};

export default Hero;