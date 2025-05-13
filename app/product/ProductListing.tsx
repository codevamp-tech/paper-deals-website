// Importing necessary components in your Next.js file
import { useState } from "react";

export default function PriceList() {
  const data = [
    {
      product: "Secondary TMT Fe 500D",
      brand: "FORTUNE",
      location: "EX - Delhi",
      price: "₹50,000 / MT",
      time: "2 hours ago",
    },
    {
      product: "Secondary TMT Fe 500D",
      brand: "FORTUNE",
      location: "EX - Amritsar",
      price: "₹49,700 / MT",
      time: "2 hours ago",
    },
    {
      product: "Secondary TMT Fe 500",
      brand: "MONO",
      location: "EX - Ahmedabad",
      price: "Login To View",
      time: "",
    },
    {
      product: "Secondary TMT Fe 500",
      brand: "VIBRANT",
      location: "EX - Ahmedabad",
      price: "Login To View",
      time: "",
    },
    {
      product: "Secondary TMT Fe 500",
      brand: "BHAGWATI",
      location: "EX - Nashik",
      price: "Login To View",
      time: "",
    },
    {
      product: "Secondary TMT Fe 500",
      brand: "MOIRA",
      location: "EX - Wada",
      price: "Login To View",
      time: "",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Mild Steel Most Viewed Prices
        </h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.product}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{item.time}</span>
                  </div>
                </div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                  {item.brand}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-gray-700 mb-2">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item.location}</span>
                </div>

                <div className="mt-6 mb-4">
                  <p
                    className={`text-2xl font-extrabold ${
                      item.price.includes("Login")
                        ? "text-gray-500"
                        : "text-blue-600"
                    }`}
                  >
                    {item.price}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105">
                  Sell
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105">
                  Buy
                </button>
              </div>

              <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md">
                Tell Us Your Requirements
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
