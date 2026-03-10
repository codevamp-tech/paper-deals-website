"use client";
import RequirementModal from "@/components/modal/TellUsModal";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Award, MapPin, Package, Star } from "lucide-react";

export default function SellerList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch all sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/getApprovedSellers`
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

  // ✅ Unique categories dynamically
  const categories = useMemo(() => {
    const allCats = sellers
      .flatMap(
        (seller) => seller.organization?.materials_used_names || []
      )
      .filter(Boolean);

    return ["All", ...Array.from(new Set(allCats))];
  }, [sellers]);


  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6); // Reset count when filtering
  };

  // ✅ Filter sellers by category
  const filteredSellers = sellers.filter((seller) => {
    const materials = seller.organization?.materials_used_names || [];
    return (
      selectedCategory === "All" ||
      materials.some(
        (m) => m.toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  });

  // ✅ Infinite scroll logic
  const selectedSellers = filteredSellers.slice(0, visibleCount);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredSellers.length) {
        setVisibleCount((prev) => prev + 6);
      }
    });

    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [visibleCount, filteredSellers.length]);

  // ✅ Ratings state
  const [ratingsData, setRatingsData] = useState<Record<
    number,
    { average: number; reviews: number }
  >>({});

  // ✅ Fetch Ratings for Each Seller (Dynamic)
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const newRatings: Record<number, { average: number; reviews: number }> =
          {};

        await Promise.all(
          selectedSellers.map(async (seller) => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/RatingReview/get?seller_id=${seller.id}`
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
            } catch (error) {
              console.error(
                `Error fetching rating for seller ${seller.id}:`,
                error
              );
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
  }, []);

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

  const SellerSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-5 animate-pulse border border-gray-200 max-w-md mx-auto">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 h-9 bg-gray-200 rounded"></div>
    </div>
  );

  // ✅ Render Section
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-blue-500 sm:text-4xl">
          Sellers Directory
        </h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-600 to-green-500 mx-auto rounded-full"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition ${selectedCategory === cat
                ? "text-white bg-gradient-to-r from-blue-500 to-blue-500 shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Sellers */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SellerSkeleton key={i} />
          ))}
        </div>
      ) : filteredSellers.length === 0 ? (
        <p className="text-center text-gray-600">No sellers found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSellers.map((seller) => {
              const org = seller.organization || {};
              const ratingData = ratingsData[seller.id] || {
                average: 0,
                reviews: 0,
              };

              return (
                <div
                  key={seller.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/seller/${seller.id}`)}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                          {org.image_banner && org.image_banner.trim() !== "" ? (
                            <img
                              src="/mainimg.png"
                              alt="company logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xl font-bold uppercase">
                              {(org.organizations || seller.name || "S")
                                .split(" ")
                                .filter(Boolean)
                                .map((word: string) => word[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            KPDS_{seller.id}
                          </h3>
                          {seller.approved === "1" && (
                            <Award className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {seller.approved === "1" && (
                            <span className="inline-block px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              Top Rated
                            </span>
                          )}

                          {/* Show Seller Type */}
                          {(() => {
                            const typeMap: Record<string | number, string> = {
                              "3": "Distributor",
                              "4": "Converter",
                              "5": "Other"
                            };
                            const sellerType = typeMap[org.organization_type] || "Seller";
                            return (
                              <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                {sellerType}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {seller.user_type === 2
                        ? "Leading supplier of premium materials and specialty products"
                        : "Bulk distributor of industrial supplies"}
                    </p> */}

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{org.city || "N/A"}</span>
                    </div>

                    {/* Rating & Products */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">
                          {ratingData.average.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({ratingData.reviews})
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Package className="h-4 w-4" />
                        <span>156 products</span>
                      </div> */}
                    </div>

                    {/* Specialties/Materials */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {org.materials_used_names &&
                        org.materials_used_names.length > 0 ? (
                        org.materials_used_names.slice(0, 3).map((material, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {material}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          General Trade
                        </span>
                      )}
                    </div>

                    {/* Years in Business */}
                    {/* <div className="text-xs text-gray-600 mb-4">
                      <span className="font-medium">
                        {Math.floor(Math.random() * 15) + 5}
                      </span>{" "}
                      years in business
                    </div> */}

                    {/* View Profile Button */}
                    <button
                      className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/seller/${seller.id}`);
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>



          {/* Infinite Scroll Trigger */}
          {visibleCount < filteredSellers.length && (
            <div ref={bottomRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SellerSkeleton key={`skeleton-load-${i}`} />
              ))}
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