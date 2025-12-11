"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BioImageSec from "../ImageOrBio/ImageAndBio";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";

const b2cImages = ["/banner2.png", "/banner3.jpg"];
const b2bImages = ["/banner1.png"];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [mode, setMode] = useState<"B2B" | "B2C">("B2B");

  const router = useRouter();
  const { theme } = useTheme();

  // Detect mode
  useEffect(() => {
    const stored = localStorage.getItem("mode");
    if (stored === "B2C") setMode("B2C");
  }, []);

  const images = mode === "B2C" ? b2cImages : b2bImages;

  // Slider only for B2C
  useEffect(() => {
    if (mode === "B2C") {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mode, images.length]);

  // Search API
  useEffect(() => {
    if (!query.trim()) return setResults([]);

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
          const filtered = data.data.filter((item: any) => {
            const product = item.product_name?.toLowerCase() || "";
            const category =
              item.category?.name?.toLowerCase() ||
              item.category_id?.toLowerCase() ||
              "";
            return (
              product.includes(query.toLowerCase()) ||
              category.includes(query.toLowerCase())
            );
          });

          setResults(
            filtered.map((i) => ({
              ...i,
              _type: "product",
            }))
          );
        }
      } catch {
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  const handleSelect = (item: any) => {
    router.push(`/product/${item.id}`);
  };

  return (
    <section className="relative py-[12vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-30">
        <div className="container mx-auto px-4 text-center max-w-4xl">

          {/* Change text by MODE */}
          {mode === "B2C" ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Transform Your Everyday with{" "}
                <span className="text-gray-200">Premium Paper Essentials</span>
              </h1>
              <p className="text-xl text-zinc-200 mb-8">
                Discover high-quality paper products that elevate your day-to-day life.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Revolutionize{" "}
                <span className="text-gray-200">Your Business with Premium Paper</span>
              </h1>
              <p className="text-xl text-zinc-200 mb-8">
                High-quality paper products designed for modern B2B needs.
              </p>
            </>
          )}

          {/* CTA BUTTON + SEARCH BAR IN ONE LINE */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full mt-6">

            {/* SEARCH BAR */}
            <div className="w-full max-w-xl">
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search by product or category..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
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
            </div>
            <Button
              onClick={() => router.push("/product")}
              className="text-white px-8 py-6 text-lg whitespace-nowrap"
              style={{ backgroundColor: theme.buttoncolor }}
            >
              {mode === "B2C" ? "Shop Now" : "Order Now"}
              <ShoppingCart className="ml-2" />
            </Button>

          </div>

        </div>
      </div>

      {/* ⭐ SHOW STATS BASED ON MODE */}
      {mode === "B2C" ? (
       <div className="w-full bg-black/50 backdrop-blur-md py-6 text-white grid grid-cols-2 md:grid-cols-4 text-center gap-6 mt-8">
          <div>
            <h3 className="text-xl font-bold">500K+</h3>
            <p>Happy Customers</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">🚚 Fast & Reliable</h3>
            <p>Delivery</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">1 Million+</h3>
            <p>Products Sold</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">🏆 Top Rated</h3>
            <p>Service</p>
          </div>
        </div>
      ) : (
        <div className="w-full bg-black/50 backdrop-blur-md py-6 text-white grid grid-cols-2 md:grid-cols-4 text-center gap-6 mt-8">
          <div>
            <h3 className="text-xl font-bold">400K+</h3>
            <p>Raw Materials Prices</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">1 Million+</h3>
            <p>SMEs Empowered</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">500K+</h3>
            <p>Orders Delivered</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">30+</h3>
            <p>Countries Served</p>
          </div>
        </div>
      )}


      {/* <BioImageSec /> */}
    </section>
  );
};

export default Hero;
