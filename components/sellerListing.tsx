"use client";
import RequirementModal from "@/components/modal/TellUsModal";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function SellerList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Filters
  const [selectedCategory, setSelectedCategory] = useState("All");

  const router = useRouter();

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // ✅ Fetch all sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/getallsellers?user_type=2`
        );
        const data = await res.json();
        setSellers(data.data || []);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  // ✅ Extract unique categories dynamically
  const categories = useMemo(() => {
    const allCats = sellers
      .map((seller) => seller.organization?.materials_used)
      .filter(Boolean);
    const unique = Array.from(new Set(allCats));
    return ["All", ...unique];
  }, [sellers]);

  // ✅ Filter sellers by category
  const filteredSellers = sellers.filter((seller) => {
    const category =
      seller.organization?.materials_used?.trim().toLowerCase() || "other";
    return (
      selectedCategory === "All" ||
      category === selectedCategory.toLowerCase()
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedSellers = filteredSellers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ Fetch ratings for each seller
  const [ratingsData, setRatingsData] = useState<Record<
    number,
    { average: number; reviews: number }
  >>({});

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const newRatings: Record<number, { average: number; reviews: number }> =
          {};

        await Promise.all(
          selectedSellers.map(async (seller) => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/getbyseller?seller_id=${seller.id}`
              );
              const data = await res.json();

              if (data.success && data.data) {
                newRatings[seller.id] = {
                  average: data.data.average_rating || 0,
                  reviews: data.data.review_count || 0,
                };
              } else {
                newRatings[seller.id] = { average: 0, reviews: 0 };
              }
            } catch {
              newRatings[seller.id] = { average: 0, reviews: 0 };
            }
          })
        );

        setRatingsData(newRatings);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      }
    };

    fetchRatings();
  }, [selectedSellers]);

  // ✅ Contact Seller Modal
  const ContactSellerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [mobileNumber, setMobileNumber] = useState("");
    const [country, setCountry] = useState("India");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Contact form submitted");
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

  // ✅ Render Section
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-purple-600 sm:text-4xl">
          Sellers Directory
        </h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-600 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sellers */}
      {loading ? (
        <p className="text-center text-gray-600">Loading sellers...</p>
      ) : filteredSellers.length === 0 ? (
        <p className="text-center text-gray-600">No sellers found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedSellers.map((seller, index) => {
              const org = seller.organization || {};
              const ratingData = ratingsData[seller.id] || {
                average: 0,
                reviews: 0,
              };

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 flex justify-between"
                >
                  {/* Seller Info */}
                  <div className="flex p-6 flex-1">
                    <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src="/mainimg.png"
                        alt="company logo"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="ml-6 flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {`KPDS_${seller.id}`}
                      </h3>

                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          seller.approved === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {seller.approved === "1"
                          ? "Verified"
                          : "Not Verified"}
                      </span>

                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Company Id:</strong> KPDS_{seller.id}
                        </p>
                        <p>
                          <strong>State:</strong>{" "}
                          {org.city ? org.city.split(",").pop().trim() : "N/A"}
                        </p>
                        <p>
                          <strong>City:</strong> {org.city || "N/A"}
                        </p>
                        <p>
                          <strong>Type of Seller:</strong>{" "}
                          {seller.user_type === 2
                            ? "Wholeseller"
                            : "Distributor"}
                        </p>
                        <p>
                          <strong>Deals In:</strong>{" "}
                          {org.materials_used || "Not Available"}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push(`/B2B/seller/${seller.id}`)}
                        className="mt-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-colors duration-300"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  {/* ⭐ Rating Section */}
                  <div className="p-6 text-right min-w-[120px] flex flex-col items-end ">
                    <div className="flex items-center justify-end space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={i < Math.round(ratingData.average) ? "#facc15" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#facc15"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.5a.562.562 0 011.04 0l2.125 4.308a.563.563 0 00.424.308l4.753.691a.563.563 0 01.312.96l-3.438 3.35a.563.563 0 00-.162.498l.812 4.736a.563.563 0 01-.817.593l-4.25-2.23a.563.563 0 00-.524 0l-4.25 2.23a.563.563 0 01-.818-.593l.813-4.736a.563.563 0 00-.162-.498L2.866 9.767a.563.563 0 01.312-.96l4.753-.691a.563.563 0 00.424-.308L10.48 3.5z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {ratingData.average.toFixed(1)} ★ ({ratingData.reviews}{" "}
                      reviews)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

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
