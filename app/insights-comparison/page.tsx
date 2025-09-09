"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const paperProducts = [
  {
    id: 1,
    category: "Primary",
    name: "Virgin Kraft Imported",
    mill: "Various Foreign Mills",
    shade: "Brown",
    gsm: "70gsm to 450gsm",
    size: "Various",
    weight: "Various",
    stockInKg: "500kg to 5000kg",
    pricePerKg: 85,
    city: "New Delhi",
    date: "29/04/2025",
    change: 2.3,
    minOrder: 100,
    availability: "In Stock",
  },
  {
    id: 2,
    category: "Primary",
    name: "Indian Kraft Paper",
    mill: "STAR PAPER MILLS",
    shade: "Brown",
    gsm: "60",
    size: "58.5 x 66",
    weight: "12.5",
    stockInKg: "600",
    pricePerKg: 79,
    city: "Indore",
    date: "29/04/2025",
    change: -1.2,
    minOrder: 50,
    availability: "In Stock",
  },
  {
    id: 3,
    category: "Primary",
    name: "Yash Kraft Paper",
    mill: "Yash Pakka",
    shade: "Khakee Brown",
    gsm: "80",
    size: "36 x 46 inches",
    weight: "39.2",
    stockInKg: "500",
    pricePerKg: 85,
    city: "Indore",
    date: "29/04/2025",
    change: 0.8,
    minOrder: 25,
    availability: "In Stock",
  },
  {
    id: 4,
    category: "Secondary",
    name: "Bleach Kraft",
    mill: "USA",
    shade: "WHITE",
    gsm: "65 TO 100",
    size: "28",
    weight: "700 TO 800 KG REEL WEIGHT",
    stockInKg: "30000",
    pricePerKg: 73,
    city: "New Delhi",
    date: "29/04/2025",
    change: 1.5,
    minOrder: 500,
    availability: "In Stock",
  },
  {
    id: 5,
    category: "Secondary",
    name: "Kraft Liner Board - KLB",
    mill: "Chadha Paper Mill",
    shade: "Brown",
    gsm: "100-300",
    size: "As per customer requirement",
    weight: "As per customer",
    stockInKg: "Made to order",
    pricePerKg: 92,
    city: "Gurgaon",
    date: "29/04/2025",
    change: -0.5,
    minOrder: 1000,
    availability: "Made to Order",
  },
  {
    id: 6,
    category: "Secondary",
    name: "Testliner",
    mill: "Chadha Paper Mill",
    shade: "Brown",
    gsm: "70-300",
    size: "As per customer requirement",
    weight: "As per customer",
    stockInKg: "Made to order",
    pricePerKg: 88,
    city: "Gurgaon",
    date: "29/04/2025",
    change: 1.8,
    minOrder: 1000,
    availability: "Made to Order",
  },
];

export default function PaperProductsComparison() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedCity, setSelectedCity] = useState<string>("All");

  const cities = [
    "All",
    ...Array.from(new Set(paperProducts.map((p) => p.city))),
  ];
  const filteredProducts =
    selectedCity === "All"
      ? paperProducts
      : paperProducts.filter((p) => p.city === selectedCity);

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 1) + change),
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    console.log(`Added ${quantity}kg of ${product.name} to cart`);
    // Add your cart logic here
  };

  const handleContactSeller = (product: any) => {
    console.log(`Contacting seller for ${product.name} in ${product.city}`);
    // Add your contact logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paper Products Market
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare prices across cities and connect with sellers directly
          </p>
        </div>

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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="p-6">
                {/* Header with Category and Availability */}
                <div className="flex justify-between items-start mb-4">
                  <Badge
                    variant="outline"
                    className={`${
                      product.category === "Primary"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-purple-200 bg-purple-50 text-purple-700"
                    } font-medium`}
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

                {/* Product Name and Mill */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  {product.mill}
                </p>

                {/* Product Specifications */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shade:</span>
                    <span className="font-medium text-gray-900">
                      {product.shade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GSM:</span>
                    <span className="font-medium text-gray-900">
                      {product.gsm}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium text-gray-900">
                      {product.size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900">
                      {product.weight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium text-gray-900">
                      {product.stockInKg}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Order:</span>
                    <span className="font-medium text-gray-900">
                      {product.minOrder}kg
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.pricePerKg}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      / Kg
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        product.change > 0
                          ? "bg-green-100 text-green-700"
                          : product.change < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="text-sm">
                        {product.change > 0
                          ? "↗"
                          : product.change < 0
                          ? "↘"
                          : "→"}
                      </span>
                      <span>{Math.abs(product.change).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Quantity (Kg)
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <span className="font-medium text-gray-900 min-w-[3rem] text-center">
                      {quantities[product.id] || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-8 h-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 mb-4">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={product.availability === "Made to Order"}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                      />
                    </svg>
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleContactSeller(product)}
                    variant="outline"
                    className="w-full border-green-200 text-blue-700 bg-white hover:bg-green-50"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Contact Seller
                  </Button>
                </div>

                {/* Location and Date */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">{product.city}</span>
                    </div>
                    <span className="text-gray-500">{product.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Insights Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Market Insights
              </h2>
              <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-600 leading-relaxed text-center">
                Compare paper products across major Indian cities including New
                Delhi, Indore, and Gurgaon. Our platform connects you directly
                with verified sellers and mills, ensuring competitive pricing
                and reliable supply chains for your paper procurement needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
