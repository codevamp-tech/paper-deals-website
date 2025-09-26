"use client";

import RequirementModal from "@/components/modal/TellUsModal";
import Pagination from "@/components/pagination";
import { useState, useEffect } from "react";

const categories = [
  { id: "all", name: "All" },
  { id: "kraft-paper", name: "Kraft Paper" },
  { id: "board-paper", name: "Board Paper" },
  { id: "tissue-paper", name: "Tissue Paper" },
  { id: "office-paper", name: "Office Paper" },
  { id: "premium-paper", name: "Premium Paper" },
  { id: "stock-lot", name: "Stock Lot Paper" },
  { id: "writing-printing", name: "Writing & Printing Paper" },
  { id: "adhesive-paper", name: "Gumming / Adhesive Paper" },
  { id: "art-paper", name: "Art Paper" },
  { id: "matt-paper", name: "Matt Paper" },
  { id: "coated-paper", name: "Coated / Cromo Paper" },
  { id: "sbs-paper", name: "SBS Paper" },
  { id: "newsprint", name: "Newsprint Paper" },
];

export default function PriceList() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSignedIn, setIsSignedIn] = useState(false);

  // ✅ API Call with pagination
  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks?page=${page}&limit=10`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 0 });
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  const handleBuyClick = () => {
    if (!isSignedIn) {
      setIsContactModalOpen(true);
    } else {
      console.log("Proceeding with purchase...");
    }
  };

  const ContactSellerModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    const [mobileNumber, setMobileNumber] = useState("");
    const [country, setCountry] = useState("India");

    const handleSubmit = (e: any) => {
      e.preventDefault();
      console.log("Contact form submitted", { mobileNumber, country });
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Contact Seller
            </h2>
            <p className="text-gray-600 mb-6">
              Get details on your mobile quickly
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">
                  Mobile Number
                </label>
                <div className="flex">
                  <div className="flex items-center justify-center px-4 bg-gray-100 rounded-l-lg border border-r-0 border-gray-300">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your mobile"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Canada</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="bg-gray-100 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Filtered products
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) =>
          p.category_id?.toLowerCase().includes(selectedCategory)
        );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Kraft & Board Paper Most Viewed Price
        </h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-600 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 mx-2 mb-2 rounded-lg text-black text-sm sm:text-base ${
              selectedCategory === category.id
                ? "text-white bg-gradient-to-r from-red-500 to-orange-500"
                : "bg-gray-100 font-medium"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center text-gray-200">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {item.product_name}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {item.created_at}
                    </span>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {item.sub_product}
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={item.image || "/mainimg.png"}
                    alt={item.product_name}
                    className="h-40 w-auto rounded-lg object-cover"
                  />
                  <p className="mt-4 text-2xl font-extrabold text-blue-600">
                    ₹{item.price_per_kg}
                  </p>
                  <p className="text-gray-700 mt-2">{item.category_id}</p>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleBuyClick}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Buy
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                    Contact
                  </button>
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 transition"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Tell Us Your Requirement
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Pagination Component */}
      <div className="mt-10 flex justify-center">
        <Pagination
          totalPages={pagination.pages}
          currentPage={pagination.page}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <RequirementModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ContactSellerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
