"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PaperProductsComparison() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/live-price`
        );
        const data = await res.json();

        // 🔑 API se `data.data` aata hai
        if (data && Array.isArray(data.data)) {
          // Map API fields -> frontend fields
          const mapped = data.data.map((item: any) => ({
            _id: item.id, // backend id
            name: item.name,
            pricePerKg: item.price,
            city: item.location, // using location as "city"
            category: "Paper", // static value (API me nahi hai)
            availability: item.status === 0 ? "In Stock" : "Out of Stock",
            mill: item.location.split("(")[0].trim(), // rough parse
            date: item.updated_at || "—",
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching live prices:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ City filter options
  const cities = [
    "All",
    ...Array.from(new Set((products || []).map((p) => p.city))),
  ];

  const filteredProducts =
    selectedCity === "All"
      ? products
      : products.filter((p) => p.city === selectedCity);

  // ✅ Quantity Update
  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 1) + change),
    }));
  };

  // ✅ Add to cart (dummy)
  const handleAddToCart = (product: any) => {
    const quantity = quantities[product._id] || 1;
    console.log(`Added ${quantity}kg of ${product.name} to cart`);
  };

  // ✅ Contact Seller (dummy)
  const handleContactSeller = (product: any) => {
    console.log(`Contacting seller for ${product.name} in ${product.city}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paper Products Market
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare prices across cities and connect with sellers directly
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading live prices...</p>
        ) : (
          <>
            {/* City Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {cities.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? "default" : "outline"}
                    onClick={() => setSelectedCity(city)}
                    className={
                      selectedCity === city ? "bg-blue-600 text-white" : ""
                    }
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="bg-white shadow-sm hover:shadow-lg transition"
                >
                  <CardContent className="p-6">
                    {/* Category */}
                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 text-blue-700 font-medium"
                      >
                        {product.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          product.availability === "In Stock"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-orange-200 bg-orange-50 text-orange-700"
                        } text-xs`}
                      >
                        {product.availability}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      {product.mill}
                    </p>

                    {/* Price */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.pricePerKg}
                        </span>
                        <span className="text-sm text-gray-500">/ Kg</span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-4 flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product._id, -1)}
                      >
                        -
                      </Button>
                      
                      <span>{quantities[product._id] || 1}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product._id, 1)}
                      >
                        +
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 mb-4">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-blue-600 text-white"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => handleContactSeller(product)}
                        variant="outline"
                        className="w-full"
                      >
                        Contact Seller
                      </Button>
                    </div>

                    {/* City + Date */}
                    <div className="pt-4 border-t border-gray-100 text-sm flex justify-between">
                      <span className="font-medium">{product.city}</span>
                      <span className="text-gray-500">{product.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
