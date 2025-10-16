"use client";

import RequirementModal from "@/components/modal/TellUsModal";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ProductListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);
  const router = useRouter();




  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks?page=${page}&limit=10`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (page: number) => fetchProducts(page);

  const handleBuyClick = () => {
    if (!isSignedIn) setIsContactModalOpen(true);
    else console.log("Proceeding with purchase...");
  };

  const ContactSellerModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    const [mobileNumber, setMobileNumber] = useState("");
    const [country, setCountry] = useState("India");

    const handleSubmit = (e: any) => {
      e.preventDefault();
      console.log({ mobileNumber, country });
      onClose();
    };
    const { theme } = useTheme();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Seller
            </h2>
            <p className="text-gray-600 mb-6">
              Get product details on your mobile quickly
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <div className="px-4 py-3 bg-gray-100 flex items-center">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country
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

              <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
                Submit
              </button>
            </form>
          </div>

          <div className="bg-gray-100 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) =>
        p.category_id?.toLowerCase().includes(selectedCategory)
      );

  const getImageContent = (item: any) => {
    if (!item.image)
      return (
        <img
          src="/mainimg.png"
          alt="No image"
          className="h-40 w-full object-cover rounded-lg"
        />
      );

    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${item.image}`;
    if (/\.(jpe?g|png|webp)$/i.test(item.image))
      return (
        <img
          src={fullUrl}
          alt={item.product_name}
          className="h-40 w-full object-cover rounded-lg"
        />
      );

    if (item.image.endsWith(".pdf"))
      return (
        <div className="flex flex-col items-center">
          <img src="/pdf-icon.png" alt="PDF" className="h-16 w-16 mb-2" />
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            View PDF
          </a>
        </div>
      );

    return (
      <img
        src="/mainimg.png"
        alt="Fallback"
        className="h-40 w-full object-cover rounded-lg"
      />
    );
  };
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      <div className="mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-black">
         Top-Rated Paper Products in the Market
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full mt-2"></div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition ${selectedCategory === cat.id
              ? "text-white bg-gradient-to-r from-blue-500 to-blue-500 shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-200"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center text-gray-200">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`}>
              <div
                className="relative bg-[#fff] rounded-2xl  overflow-hidden  transition transform hover:-translate-y-2"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
                }}
              >
                {/* Top-right Rating */}
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white bg-opacity-90 px-3 py-1 rounded-lg shadow-md">
                  <span className="text-yellow-400 font-bold">
                    {item.rating ? item.rating.toFixed(1) : "0.0"}
                  </span>
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.078 9.382c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.955z" />
                  </svg>
                  <span className="text-gray-600 text-xs">
                    ({item.reviews_count || 0})
                  </span>
                </div>

                <div className="p-6 flex flex-col space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product_name}
                  </h3>
                  {/* <span className="text-sm text-gray-500">{item.created_at}</span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {item.sub_product}
                  </span> */}

                  {getImageContent(item)}

                  <p className="text-2xl font-extrabold text-blue-600 mt-2">
                    ₹{item.price_per_kg}
                  </p>
                  <p className="text-gray-700">{item.category_id}</p>

                  <div className="flex gap-3 mt-3">


                    <button
                      onClick={() => setSelectedProductDetail(product)}
                      className="flex-1 py-2 rounded-lg text-white bg-[#0f7aed] hover:opacity-90 transition"
                    >
                      Buy
                    </button>

                    <button className="flex-1 py-2 rounded-lg text-white bg-[#0f7aed] hover:opacity-90 transition"
                       onClick={(e) => {
                      e.stopPropagation(); // stop the click from reaching the parent Link
                      e.preventDefault();
                      router.push("/subscriptionPlan"); // redirect to subscription plan page
                      }}>
                      Contact
                    </button>
                  </div>

                  <button
                    className="w-full py-2 rounded-lg bg-[#38d200] text-white hover:opacity-90 transition mt-2"
                    onClick={(e) => {
                      e.stopPropagation(); // stop the click from reaching the parent Link
                      e.preventDefault();  // prevent the default link behavior
                      setIsModalOpen(true); // open your modal
                    }}
                  >
                    Tell Us Your Requirement
                  </button>


                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
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
