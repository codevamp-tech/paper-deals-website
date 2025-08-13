"use client";

import { useState } from "react";
import Link from "next/link";

const categoriesData = [
  {
    name: "Kraft Paper",
    icon: "📄",
    href: "/kraft-paper",
    products: [
      { name: "Brown Kraft", href: "/products/brown-kraft" },
      { name: "Bleached Kraft", href: "/products/bleached-kraft" },
      { name: "Recycled Kraft", href: "/products/recycled-kraft" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Surat", href: "/city/surat" },
      { name: "Ahmedabad", href: "/city/ahmedabad" },
    ],
    subCategories: ["Brown Kraft", "Bleached Kraft", "Recycled Kraft"],
  },
  {
    name: "Duplex Board",
    icon: "📦",
    href: "/duplex-board",
    products: [
      { name: "White Back", href: "/products/white-back-duplex" },
      { name: "Grey Back", href: "/products/grey-back-duplex" },
      { name: "Coated Board", href: "/products/coated-duplex" },
    ],
    cities: [
      { name: "Amritsar", href: "/city/amritsar" },
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Pune", href: "/city/pune" },
    ],
    subCategories: ["White Back", "Grey Back", "Coated Board"],
  },
  {
    name: "Jumbo Tissue",
    icon: "🧻",
    href: "/jumbo-tissue",
    products: [
      { name: "Toilet Tissue Rolls", href: "/products/toilet-tissue-rolls" },
      { name: "Facial Tissue Rolls", href: "/products/facial-tissue-rolls" },
      { name: "Napkin Tissue Rolls", href: "/products/napkin-tissue-rolls" },
    ],
    cities: [
      { name: "Ahmedabad", href: "/city/ahmedabad" },
      { name: "Surat", href: "/city/surat" },
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
    ],
    subCategories: ["Toilet Tissue", "Facial Tissue", "Napkin Tissue"],
  },
  {
    name: "Copier Paper - A4",
    icon: "📑",
    href: "/copier-paper-a4",
    products: [
      { name: "70 GSM A4", href: "/products/70gsm-a4" },
      { name: "75 GSM A4", href: "/products/75gsm-a4" },
      { name: "80 GSM A4", href: "/products/80gsm-a4" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Chennai", href: "/city/chennai" },
      { name: "Kolkata", href: "/city/kolkata" },
    ],
    subCategories: ["70 GSM", "75 GSM", "80 GSM"],
  },
  {
    name: "Prime Paper",
    icon: "📜",
    href: "/prime-paper",
    products: [
      { name: "Premium White", href: "/products/premium-white" },
      { name: "High Gloss", href: "/products/high-gloss" },
      { name: "Specialty Prime", href: "/products/specialty-prime" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Jaipur", href: "/city/jaipur" },
      { name: "Indore", href: "/city/indore" },
    ],
    subCategories: ["Premium White", "High Gloss", "Specialty Prime"],
  },
  {
    name: "Stock lot Papers",
    icon: "📦",
    href: "/stock-lot-papers",
    products: [
      { name: "Surplus Coated", href: "/products/surplus-coated" },
      { name: "Overrun Papers", href: "/products/overrun-papers" },
      { name: "Discount Lot", href: "/products/discount-lot" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Ahmedabad", href: "/city/ahmedabad" },
      { name: "Surat", href: "/city/surat" },
    ],
    subCategories: ["Surplus Coated", "Overrun Papers", "Discount Lot"],
  },
  {
    name: "Writing & Printing paper",
    icon: "🖋️",
    href: "/writing-printing-paper",
    products: [
      { name: "Offset Printing", href: "/products/offset-printing" },
      { name: "Bond Paper", href: "/products/bond-paper" },
      { name: "Ledger Paper", href: "/products/ledger-paper" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Kolkata", href: "/city/kolkata" },
      { name: "Chennai", href: "/city/chennai" },
    ],
    subCategories: ["Offset Printing", "Bond Paper", "Ledger Paper"],
  },
  {
    name: "Gumming Sheets",
    icon: "🏷️",
    href: "/gumming-sheets",
    products: [
      { name: "Label Sheets", href: "/products/label-sheets" },
      { name: "Adhesive Coated", href: "/products/adhesive-coated" },
      { name: "Sticker Paper", href: "/products/sticker-paper" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Pune", href: "/city/pune" },
      { name: "Ahmedabad", href: "/city/ahmedabad" },
    ],
    subCategories: ["Label Sheets", "Adhesive Coated", "Sticker Paper"],
  },
  {
    name: "Art Paper",
    icon: "🎨",
    href: "/art-paper",
    products: [
      { name: "Gloss Art", href: "/products/gloss-art" },
      { name: "Matt Art", href: "/products/matt-art" },
      { name: "Textured Art", href: "/products/textured-art" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Kolkata", href: "/city/kolkata" },
      { name: "Surat", href: "/city/surat" },
    ],
    subCategories: ["Gloss", "Matt", "Textured"],
  },
  {
    name: "Matt Paper",
    icon: "📃",
    href: "/matt-paper",
    products: [
      { name: "Matte Coated", href: "/products/matte-coated" },
      { name: "Smooth Matte", href: "/products/smooth-matte" },
      { name: "Premium Matte", href: "/products/premium-matte" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Jaipur", href: "/city/jaipur" },
      { name: "Chennai", href: "/city/chennai" },
    ],
    subCategories: ["Matte Coated", "Smooth Matte", "Premium Matte"],
  },
  {
    name: "Cromo Paper",
    icon: "✨",
    href: "/cromo-paper",
    products: [
      { name: "Gloss Coated", href: "/products/gloss-coated" },
      { name: "High Gloss Cromo", href: "/products/high-gloss-cromo" },
      { name: "Printable Cromo", href: "/products/printable-cromo" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Surat", href: "/city/surat" },
      { name: "Ahmedabad", href: "/city/ahmedabad" },
    ],
    subCategories: ["Gloss Coated", "High Gloss", "Printable Cromo"],
  },
  {
    name: "S.B.S",
    icon: "📦",
    href: "/sbs",
    products: [
      { name: "Bleached SBS", href: "/products/bleached-sbs" },
      { name: "Coated SBS", href: "/products/coated-sbs" },
      { name: "Premium SBS", href: "/products/premium-sbs" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Kolkata", href: "/city/kolkata" },
      { name: "Surat", href: "/city/surat" },
    ],
    subCategories: ["Bleached SBS", "Coated SBS", "Premium SBS"],
  },
  {
    name: "News Print",
    icon: "📰",
    href: "/news-print",
    products: [
      { name: "Standard Newsprint", href: "/products/standard-newsprint" },
      { name: "Recycled Newsprint", href: "/products/recycled-newsprint" },
      { name: "White Newsprint", href: "/products/white-newsprint" },
    ],
    cities: [
      { name: "Delhi", href: "/city/delhi" },
      { name: "Mumbai", href: "/city/mumbai" },
      { name: "Kolkata", href: "/city/kolkata" },
      { name: "Chennai", href: "/city/chennai" },
    ],
    subCategories: ["Standard", "Recycled", "White"],
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
