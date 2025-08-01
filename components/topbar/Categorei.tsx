"use client";

import { useState } from "react";
import Link from "next/link";

const categoriesData = [
  {
    name: "Kraft Paper",
    icon: "🏗️",
    href: "/mild-steel",
    products: [
      { name: "HR Plate", href: "/products/hr-plate" },
      { name: "HRC", href: "/products/hrc" },
      { name: "Flat Products", href: "/products/flat-products" },
      { name: "Semi-Finished", href: "/products/semi-finished" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Chennai", href: "/city/chennai" },
      { name: "Kolkata", href: "/city/kolkata" },
    ],
    subCategories: [
      "Flat Products",
      "Semi-Finished",
      "Long Products",
      "Structure",
    ],
  },
  {
    name: "Non Ferrous",
    icon: "🔶",
    href: "/non-ferrous",
    products: [
      { name: "Aluminum", href: "/products/aluminum" },
      { name: "Copper", href: "/products/copper" },
      { name: "Brass", href: "/products/brass" },
      { name: "Bronze", href: "/products/bronze" },
    ],
    cities: [
      { name: "Bangalore", href: "/city/bangalore" },
      { name: "Hyderabad", href: "/city/hyderabad" },
      { name: "Ahmedabad", href: "/city/ahmedabad" },
      { name: "Pune", href: "/city/pune" },
    ],
    subCategories: ["Sheets", "Coils", "Rods", "Wires"],
  },
  {
    name: "Polymers & Packaging",
    icon: "📦",
    href: "/polymers-packaging",
    products: [
      { name: "HDPE", href: "/products/hdpe" },
      { name: "LDPE", href: "/products/ldpe" },
      { name: "PVC", href: "/products/pvc" },
      { name: "Films", href: "/products/films" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Surat", href: "/city/surat" },
      { name: "Vadodara", href: "/city/vadodara" },
    ],
    subCategories: ["Plastic Sheets", "Films", "Packaging", "Containers"],
  },
  {
    name: "Chemicals",
    icon: "🧪",
    href: "/chemicals",
    products: [
      { name: "Industrial Chemicals", href: "/products/industrial-chemicals" },
      {
        name: "Agricultural Chemicals",
        href: "/products/agricultural-chemicals",
      },
      { name: "Specialty Chemicals", href: "/products/specialty-chemicals" },
      { name: "Dyes & Pigments", href: "/products/dyes-pigments" },
    ],
    cities: [
      { name: "Vapi", href: "/city/vapi" },
      { name: "Ankleshwar", href: "/city/ankleshwar" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Vadodara", href: "/city/vadodara" },
    ],
    subCategories: [
      "Base Chemicals",
      "Petrochemicals",
      "Specialty Chemicals",
      "Dyes",
    ],
  },
  {
    name: "Energy & Petroleum",
    icon: "⛽",
    href: "/energy-petroleum",
    products: [
      { name: "Crude Oil", href: "/products/crude-oil" },
      { name: "Natural Gas", href: "/products/natural-gas" },
      { name: "Bio Fuel", href: "/products/bio-fuel" },
      { name: "Coal", href: "/products/coal" },
    ],
    cities: [
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Jamnagar", href: "/city/jamnagar" },
      { name: "Paradip", href: "/city/paradip" },
      { name: "Visakhapatnam", href: "/city/visakhapatnam" },
    ],
    subCategories: ["Crude Oil", "Natural Gas", "Bio Fuel", "Refined Products"],
  },
  {
    name: "Stainless Steel",
    icon: "🔩",
    href: "/stainless-steel",
    products: [
      { name: "SS Sheets", href: "/products/ss-sheets" },
      { name: "SS Coils", href: "/products/ss-coils" },
      { name: "SS Pipes", href: "/products/ss-pipes" },
      { name: "SS Fittings", href: "/products/ss-fittings" },
    ],
    cities: [
      { name: "Chennai", href: "/city/chennai" },
      { name: "Ahmedabad", href: "/city/ahmedabad" },
      { name: "Pune", href: "/city/pune" },
      { name: "Jamshedpur", href: "/city/jamshedpur" },
    ],
    subCategories: ["Sheets", "Coils", "Pipes", "Fittings"],
  },
  {
    name: "Pipes",
    icon: "🔧",
    href: "/pipes",
    products: [
      { name: "MS Pipes", href: "/products/ms-pipes" },
      { name: "GI Pipes", href: "/products/gi-pipes" },
      { name: "SS Pipes", href: "/products/ss-pipes" },
      { name: "PVC Pipes", href: "/products/pvc-pipes" },
    ],
    cities: [
      { name: "Ahmedabad", href: "/city/ahmedabad" },
      { name: "Indore", href: "/city/indore" },
      { name: "Chennai", href: "/city/chennai" },
      { name: "Jaipur", href: "/city/jaipur" },
    ],
    subCategories: [
      "Steel Pipes",
      "Plastic Pipes",
      "Seamless Pipes",
      "ERW Pipes",
    ],
  },
  {
    name: "Infrastructure & Construction",
    icon: "🏗️",
    href: "/infrastructure-construction",
    products: [
      { name: "TMT Bars", href: "/products/tmt-bars" },
      { name: "Cement", href: "/products/cement" },
      { name: "Structural Steel", href: "/products/structural-steel" },
      {
        name: "Pre-Engineered Buildings",
        href: "/products/pre-engineered-buildings",
      },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Bangalore", href: "/city/bangalore" },
      { name: "Hyderabad", href: "/city/hyderabad" },
    ],
    subCategories: [
      "Steel Products",
      "Cement & Concrete",
      "Structural Elements",
      "Building Materials",
    ],
  },
];

export default function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryHover = (category) => {
    setActiveCategory(category);
  };

  // Set default active category when dropdown opens
  const handleOpenDropdown = () => {
    setIsOpen(true);
    if (!activeCategory) {
      setActiveCategory(categoriesData[0]);
    }
  };

  return (
    <div className="relative">
      {/* Categories Button */}
      <button
        className="flex items-center gap-2 px-4 py-4 hover:text-black text-gray-700 font-medium"
        onMouseEnter={handleOpenDropdown}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center">
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          All Categories
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full bg-black text-white shadow-lg z-50 w-[80vw]
          h-[100vh]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex border-t border-gray-200">
            {/* Left Sidebar - Categories */}
            <div className="w-64 bg-black py-2">
              {categoriesData.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className={`flex items-center px-4 py-3 hover:bg-[#333] ${
                    activeCategory?.name === category.name ? "bg-[#333]" : ""
                  }`}
                  onMouseEnter={() => handleCategoryHover(category)}
                >
                  <span className="mr-3 text-lg">{category.icon}</span>
                  <span className="text-white">{category.name}</span>
                  {category.name !== "Infrastructure & Construction" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-auto text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Quick Links */}

                {/* Dynamic Products Column */}
                {activeCategory && (
                  <div>
                    <h3 className="text-blue-600 font-semibold mb-4">
                      Products
                    </h3>
                    {activeCategory.products.map((product, index) => (
                      <Link
                        key={index}
                        href={product.href}
                        className="flex items-center justify-between py-2 hover:text-blue-600 text-white"
                      >
                        <span>{product.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    ))}
                    <div className="mt-4">
                      {activeCategory.subCategories.map((subCat, index) => (
                        <Link
                          key={index}
                          href={`/products/${subCat
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className={`block py-2 ${
                            index === 0
                              ? "flex items-center justify-between font-medium text-blue-600"
                              : ""
                          }`}
                        >
                          <span>{subCat}</span>
                          {index === 0 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Cities Column */}
                {activeCategory && (
                  <div>
                    <h3 className="text-blue-600 font-semibold mb-4">City</h3>
                    {activeCategory.cities.map((city, index) => (
                      <Link
                        key={index}
                        href={city.href}
                        className="block py-2 hover:text-blue-600 text-white"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Empty Column for spacing */}
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
