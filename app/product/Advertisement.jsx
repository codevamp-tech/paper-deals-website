import React, { useState } from "react";

export default function Advertisement() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "abs", name: "ABS" },
    { id: "cpvc", name: "CPVC" },
    { id: "hdpe", name: "HDPE" },
    { id: "ldpe", name: "LDPE" },
    { id: "lldpe", name: "LLDPE" },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <section className=" py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-white mb-6">
          Polymers & Packaging Prices
        </h2>

        {/* Category List */}
        <div className="flex gap-6 mb-8 justify-center">
          <div className="w-1/4 bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Top Category
            </h3>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded-md transition-all duration-200"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span
                    className={
                      selectedCategory === category.id
                        ? "text-blue-500 font-semibold"
                        : "text-gray-700"
                    }
                  >
                    {category.name}
                  </span>
                  {selectedCategory === category.id && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v9a1 1 0 01-2 0V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Product Area */}
          <div className="bg-white border border-green-500 rounded-xl p-8 w-[40vw]">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">
              Get the Best Quality PVC at the Best Prices
            </h3>
            <p className="text-gray-700 mb-6">
              Unlock the best rates, get working capital, and enjoy nationwide
              delivery on premium products.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 py-3 rounded-full transition-all duration-200">
              Get Quotes
            </button>
          </div>
          <div className="w-1/4 bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Top Category
            </h3>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded-md transition-all duration-200"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span
                    className={
                      selectedCategory === category.id
                        ? "text-blue-500 font-semibold"
                        : "text-gray-700"
                    }
                  >
                    {category.name}
                  </span>
                  {selectedCategory === category.id && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v9a1 1 0 01-2 0V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="flex justify-between items-center mt-12 bg-white p-6 rounded-xl w-[55vw] h-52 ml-8">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Download Paper deals App
            </h3>
            <div className="flex gap-4">
              <img src="/appstore.png" alt="App Store" className="w-32" />
              <img src="/googleplay.png" alt="Google Play" className="w-32" />
            </div>
          </div>
          <img
            src="/myapp.jpg"
            alt="PVC"
            className="w-36 h-36 object-cover rounded-full shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
