"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BioImageSec from "../ImageOrBio/ImageAndBio";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";

const images = ["/banner1.png", "/banner2.png", "/banner3.jpg"];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();
  const { theme } = useTheme();

  // 🖼️ Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 Fetch Product Search Results (Paper Deal)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/search?query=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
          // ✅ Filter products where product_name or category matches query
          const filtered = data.data.filter((item: any) => {
            const productName = item.product_name?.toLowerCase() || "";
            const categoryName =
              item.category?.name?.toLowerCase() ||
              item.category_id?.toLowerCase() ||
              "";
            return (
              productName.includes(query.toLowerCase()) ||
              categoryName.includes(query.toLowerCase())
            );
          });

          // Tag as product type for UI
          const withType = filtered.map((p: any) => ({
            ...p,
            _type: "product",
          }));
          setResults(withType);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  // 🧭 Handle click on search result
  const handleSelect = (item: any) => {
    router.push(`/product/${item.id}`); // Go directly to product details
  };

  return (
    <section className="relative py-[12vh] overflow-hidden">
      {/* 🖼️ Background */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Background ${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* 🧾 Hero Content */}
      <div className="h-[60vh] relative z-30">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Revolutionize{" "}
              <span className="text-gray-200">
                Your Business with Premium Paper Solutions
              </span>
            </h1>
            <p className="text-xl text-zinc-200 mb-8 max-w-2xl mx-auto">
              Elevate your business with our high-quality products designed for
              modern B2B needs.
            </p>

            {/* 🔍 Search Bar */}
            <div className="flex justify-center relative w-full max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
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

                  {/* 🔽 Dropdown Results */}
                  {results.length > 0 && (
                    <ul className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg text-left z-50 max-h-60 overflow-y-auto text-black">
                      {results.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                        >
                          {/* 🏷️ Product Name */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">
                              {item.product_name}
                            </span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                              Product
                            </span>
                          </div>

                          {/* 📦 Category Name */}
                          {(item.category?.name || item.category_id) && (
                            <div className="text-sm text-gray-500 mt-1">
                              Category: {item.category?.name || item.category_id}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* 🛒 Shop Now Button */}
              <Button
                onClick={() => router.push("/product")}
                className="text-white px-8 py-6 text-lg ml-4"
                style={{
                  backgroundColor: theme.bg1,
                }}
              >
                Shop Now <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BioImageSec />
    </section>
  );
};

export default Hero;
