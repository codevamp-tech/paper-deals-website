<<<<<<< HEAD
import React, { useState } from "react";

const categories = [
  { id: "all", name: "All" },
  { id: "mild-steel", name: "Mild Steel" },
  { id: "stainless-steel", name: "Stainless Steel" },
  { id: "aluminium", name: "Aluminium" },
  { id: "copper", name: "Copper" },
  { id: "zinc", name: "Zinc" },
  { id: "nickel", name: "Nickel" },
  { id: "ferrous-scrap", name: "Ferrous Scrap" },
  { id: "non-ferrous-scrap", name: "Non Ferrous Scrap" },
];

const products = [
  {
    id: 1,
    category: "mild-steel",
    name: "MS TMT Bars",
    image: "/mainimg.png",
    price: 2000,
  },
  {
    id: 2,
    category: "mild-steel",
    name: "MS Sheets | Plates",
    image: "/mainimg.png",
    price: 3500,
  },
  {
    id: 3,
    category: "stainless-steel",
    name: "SS Sheets",
    image: "/mainimg.png",
  },
  {
    id: 4,
    category: "stainless-steel",
    name: "SS Pipes",
    image: "/mainimg.png",
  },
  {
    id: 5,
    category: "aluminium",
    name: "Aluminium Sheets",
    image: "/mainimg.png",
  },
  {
    id: 6,
    category: "copper",
    name: "Copper Rods",
    image: "/mainimg.png",
  },
  {
    id: 7,
    category: "zinc",
    name: "Zinc Plates",
    image: "/mainimg.png",
  },
  {
    id: 8,
    category: "nickel",
    name: "Nickel Bars",
    image: "/mainimg.png",
  },
  {
    id: 9,
    category: "nickel",
    name: "hassan",
    image: "/mainimg.png",
  },
  {
    id: 10,
    category: "nickel",
    name: "mohd",
    image: "/mainimg.png",
  },
];

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="container mx-auto py-10 h-[220vh]">
      <h1 className="text-4xl font-bold text-center mb-8 text-white font-poppins">
        Order Ferrous and Non-Ferrous commodities
      </h1>
      <div className="flex justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 mx-2 rounded-lg text-white ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                : "bg-black"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#fff] p-4 rounded-lg text-center h-96"
          >
            <p className="text-lg font-semibold text-black">{product.name}</p>
            <img
              alt={product.name}
              src={product.image}
              className="w-full h-48 object-cover rounded-md flex justify-center items-center flex-row "
            />
            <div className="flex gap-4 h-28 mt-2 border border-yellow-600">
              {/* Primary Button */}
              <div>
                <button className="relative h-14 px-8 bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-sm font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-grey-200 hover:border-gray-300">
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="relative top-[1px]">Contact Supplier</span>
                  </div>
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/0 to-white/0 hover:from-white/5 hover:to-white/0 transition-all duration-300"></div>
                </button>

                {/* Secondary Button */}
                <button className="relative h-10 px-6 bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-xs font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="relative top-[1px] text-xs">
                      Live Chat
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-black/0 to-black/0 hover:from-black/5 hover:to-black/0 transition-all duration-300"></div>
                </button>
              </div>
              {/* Price */}
              <div>
                <button className="relative h-14  bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-sm font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-grey-200 hover:border-gray-300">
                  <div className="flex flex-wrap justify-center p-4 max-w-full">
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full sm:w-96 overflow-hidden">
                      {/* Product Price */}
                      <span className="text-blue-500 text-sm font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/0 to-white/0 hover:from-white/5 hover:to-white/0 transition-all duration-300"></div>
                </button>

                {/* Add */}
                <button className="relative h-10 px-6 bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-xs font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="relative top-[1px] text-xs">
                      Live Chat
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-black/0 to-black/0 hover:from-black/5 hover:to-black/0 transition-all duration-300"></div>
                </button>
              </div>
            </div>
            {/* <button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-full h-10 w-10 text-sm text-center font-semibold  ">
                Add
              </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
=======
import React, { useState } from "react";

const categories = [
  { id: "all", name: "All" },
  { id: "mild-steel", name: "Mild Steel" },
  { id: "stainless-steel", name: "Stainless Steel" },
  { id: "aluminium", name: "Aluminium" },
  { id: "copper", name: "Copper" },
  { id: "zinc", name: "Zinc" },
  { id: "nickel", name: "Nickel" },
  { id: "ferrous-scrap", name: "Ferrous Scrap" },
  { id: "non-ferrous-scrap", name: "Non Ferrous Scrap" },
];

const products = [
  {
    id: 1,
    category: "mild-steel",
    name: "MS TMT Bars",
    image: "/mainimg.png",
    price: 2000,
  },
  {
    id: 2,
    category: "mild-steel",
    name: "MS Sheets | Plates",
    image: "/mainimg.png",
    price: 3500,
  },
  {
    id: 3,
    category: "stainless-steel",
    name: "SS Sheets",
    image: "/mainimg.png",
  },
  {
    id: 4,
    category: "stainless-steel",
    name: "SS Pipes",
    image: "/mainimg.png",
  },
  {
    id: 5,
    category: "aluminium",
    name: "Aluminium Sheets",
    image: "/mainimg.png",
  },
  {
    id: 6,
    category: "copper",
    name: "Copper Rods",
    image: "/mainimg.png",
  },
  {
    id: 7,
    category: "zinc",
    name: "Zinc Plates",
    image: "/mainimg.png",
  },
  {
    id: 8,
    category: "nickel",
    name: "Nickel Bars",
    image: "/mainimg.png",
  },
  {
    id: 9,
    category: "nickel",
    name: "hassan",
    image: "/mainimg.png",
  },
  {
    id: 10,
    category: "nickel",
    name: "mohd",
    image: "/mainimg.png",
  },
];

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="container mx-auto py-10 h-[220vh]">
      <h1 className="text-4xl font-bold text-center mb-8 text-white font-poppins">
        Order Ferrous and Non-Ferrous commodities
      </h1>
      <div className="flex justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 mx-2 rounded-lg text-white ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                : "bg-black"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#fff] p-4 rounded-lg text-center h-96"
          >
            <p className="text-lg font-semibold text-black">{product.name}</p>
            <img
              alt={product.name}
              src={product.image}
              className="w-full h-48 object-cover rounded-md flex justify-center items-center flex-row "
            />
            <div className="flex gap-4 h-28 mt-2 border border-yellow-600">
              {/* Primary Button */}
              <div>
                <button className="relative h-14 px-8 bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-sm font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-grey-200 hover:border-gray-300">
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="relative top-[1px]">Contact Supplier</span>
                  </div>
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/0 to-white/0 hover:from-white/5 hover:to-white/0 transition-all duration-300"></div>
                </button>

                {/* Secondary Button */}
                <button className="relative h-10 px-6 bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-xs font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="relative top-[1px] text-xs">
                      Live Chat
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-black/0 to-black/0 hover:from-black/5 hover:to-black/0 transition-all duration-300"></div>
                </button>
              </div>
              {/* Price */}
              <div>
                <button className="relative h-14  bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-sm font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-grey-200 hover:border-gray-300">
                  <div className="flex flex-wrap justify-center p-4 max-w-full">
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full sm:w-96 overflow-hidden">
                      {/* Product Price */}
                      <span className="text-blue-500 text-sm font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/0 to-white/0 hover:from-white/5 hover:to-white/0 transition-all duration-300"></div>
                </button>

                {/* Add */}
                <button className="relative h-10 px-6 bg-white/90 hover:bg-white rounded-[14px] font-poppins text-black text-xs font-semibold tracking-wide w-32 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="relative top-[1px] text-xs">
                      Live Chat
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-black/0 to-black/0 hover:from-black/5 hover:to-black/0 transition-all duration-300"></div>
                </button>
              </div>
            </div>
            {/* <button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-full h-10 w-10 text-sm text-center font-semibold  ">
                Add
              </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
>>>>>>> 9befba398a387eb889c26a476e570e063c8a48c3
