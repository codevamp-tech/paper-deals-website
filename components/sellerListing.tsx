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
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
                  onClick={() => router.push(`/seller/${seller.id}`)}
                >
                  {/* Card Header & Banner Area */}
                  <div className="relative h-20 bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 border-b border-gray-100">
                    {seller.approved === "1" && (
                      <div className="absolute top-3 right-3 bg-white/80 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm backdrop-blur-md">
                        <Award className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 pt-0 flex-grow flex flex-col relative">
                    {/* Top Row: Avatar overlapping banner */}
                    <div className="w-[76px] h-[76px] -mt-10 mb-3 rounded-2xl bg-white p-1.5 border border-gray-200 shadow-md flex items-center justify-center overflow-hidden relative z-10">
                      {org.image_banner && org.image_banner.trim() !== "" ? (
                        <img
                          src={org.image_banner}
                          alt="company logo"
                          className="w-full h-full object-contain rounded-xl"
                        />
                      ) : (
                        <span className="text-gray-400 text-2xl font-black uppercase tracking-wider bg-gray-50 w-full h-full flex items-center justify-center rounded-xl">
                          {(org.organizations || seller.name || "S")
                            .split(" ")
                            .filter(Boolean)
                            .map((word: string) => word[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-4 gap-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                          {org.organizations || "Seller " + seller.id}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2.5">
                          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="truncate font-medium">{org.city || "India"}</span>
                        </div>

                        {/* Show Seller Type */}
                        {(() => {
                          const typeMap: Record<string | number, string> = {
                            "0": "Importer",
                            "1": "Wholeseller",
                            "2": "Manufacturer",
                            "3": "Distributor",
                            "4": "Converter",
                            "5": "Other"
                          };
                          const sellerType = typeMap[org.organization_type] || typeMap[seller.user_type] || "Supplier";
                          return (
                            <span className="inline-block px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-md text-xs font-bold tracking-wide">
                              {sellerType}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Product Photos Area */}
                      {seller.products && seller.products.length > 0 && (
                        <div className="flex gap-2 shrink-0 pt-1">
                          {seller.products.slice(0, 2).map((product: any, idx: number) => {
                            let imgUrl = "";
                            if (product.images) {
                              if (Array.isArray(product.images)) {
                                imgUrl = product.images[0];
                              } else if (typeof product.images === "string") {
                                try {
                                  let parsed = JSON.parse(product.images);
                                  imgUrl = Array.isArray(parsed) ? parsed[0] : parsed;
                                } catch (e) {
                                  imgUrl = product.images.split(",")[0];
                                }
                              }
                            }
                            if (!imgUrl) return null;
                            const finalSrc = imgUrl.startsWith("http")
                              ? imgUrl
                              : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/${imgUrl}`;

                            return (
                              <div
                                key={idx}
                                className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow bg-gray-50"
                              >
                                <img
                                  src={finalSrc}
                                  alt="Product"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Stats Box */}
                    <div className="grid grid-cols-2 gap-3 bg-gray-50/80 rounded-xl p-3.5 mb-5 mt-auto border border-gray-100/80">
                      <div className="flex flex-col justify-center border-r border-gray-200">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-base font-bold text-gray-900 leading-none">{ratingData.average.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{ratingData.reviews} Reviews</span>
                      </div>
                      <div className="flex flex-col justify-center pl-1">
                        <div className="text-xs font-bold text-gray-800 mb-1 leading-snug line-clamp-2">
                          {org.materials_used_names && org.materials_used_names.length > 0
                            ? org.materials_used_names.slice(0, 2).join(", ") + (org.materials_used_names.length > 2 ? ` +${org.materials_used_names.length - 2}` : "")
                            : "General Trade"}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deals In</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/seller/${seller.id}`);
                        }}
                        className="w-full py-2.5 rounded-xl border-2 border-transparent bg-gray-900 text-white font-bold text-sm tracking-wide shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        View Profile
                      </button>
                    </div>
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