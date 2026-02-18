"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, Send } from "lucide-react";
import EnquiryModal from "@/components/enquiryModal";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [mode, setMode] = useState<"B2B" | "B2C">("B2C");
  const [enquiryData, setEnquiryData] = useState({
    company_name: "",
    name: "",
    email: "",
    mobile: "",
    city: "",
    remarks: "",
    message: "",
  });
  const productsRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();


  const [productEdits, setProductEdits] = useState<Record<
    number,
    {
      quantity_in_kg?: string;
      remarks?: string;
      shade?: string;
      gsm?: string;
      size?: string;
      bf?: string;
      rim?: string;
      sheat?: string;
      brightness?: string;
      weight?: number | string;
    }
  >>({});

  const setProductEdit = (productId: number, patch: Partial<(typeof productEdits)[number]>) =>
    setProductEdits(prev => ({ ...prev, [productId]: { ...(prev[productId] || {}), ...patch } }));

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const url = `${baseUrl}/api/product/by-user-type?user_type=3&page=${page}&limit=12`;
      // mode === "B2C"
      //   ? `${baseUrl}/api/product/by-user-type?user_type=3&page=${page}&limit=12`
      //   : `${baseUrl}/api/product?page=${page}&limit=12`;

      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      setProducts(data.products || []);
      setPagination(
        data.pagination || {
          total: data.totalProducts || 0,
          page: data.currentPage || page,
          pages: data.totalPages || 0,
        }
      );

      const uniqueCategories = Array.from(
        new Map(
          (data.products || [])
            .filter((p: any) => p.category && p.category.id)
            .map((p: any) => [p.category.id, { id: p.category.id, name: p.category.name }])
        ).values()
      );

      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [mode]);

  useEffect(() => {
    const toProduct = searchParams.get("toProduct");

    if (toProduct === "true") {
      // slight delay ensures DOM is rendered
      setTimeout(() => {
        productsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [searchParams]);



  useEffect(() => {
    const savedMode = localStorage.getItem("mode") as "B2B" | "B2C";
    if (savedMode) setMode(savedMode);

    const savedCart = localStorage.getItem(`cart_${savedMode || "B2B"}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);



  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${mode}`);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`cart_${mode}`, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cart, mode]);


  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, mode }];
    });
  };


  const updateQuantity = (productId: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId);
  };

  const getCartQuantity = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const groupCartBySeller = () => {
    const grouped: { [key: string]: any[] } = {};
    cart.forEach((item) => {
      const sellerId = item.seller_id || "unknown";
      if (!grouped[sellerId]) {
        grouped[sellerId] = [];
      }
      grouped[sellerId].push(item);
    });
    return grouped;
  };

  const handleEnquirySubmit = async (): Promise<void> => {
    const groupedCart = groupCartBySeller();

    // Build enquiries array - one enquiry per seller
    const enquiries = Object.entries(groupedCart).map(([sellerId, items]) => {
      // Extract product IDs for this seller
      const product_ids = items.map((item: any) => item.id);

      // Build detailed product info
      const products = items.map((item: any) => {
        const edit = productEdits[item.id] || {};
        return {
          product_id: item.id,
          product_name: item.product_name,
          category_id: item.category?.id ?? item.category_id ?? null,
          quantity_in_kg: edit.quantity_in_kg || String(item.quantity || ""),
          remarks: edit.remarks || "",
          shade: edit.shade || item.shade || "",
          gsm: edit.gsm || (item.gsm ? String(item.gsm) : ""),
          size: edit.size || item.size || "",
          bf: edit.bf || item.bf || "",
          rim: edit.rim || item.rim || "",
          sheat: edit.sheat || item.sheat || "",
          brightness: edit.brightness || item.brightness || "",
          weight: edit.weight || item.weight || null,
        };
      });

      return {
        seller_id: Number(sellerId),
        product_ids, // Array of product IDs
        products, // Array of detailed product objects
        customer_details: {
          company_name: enquiryData.company_name,
          name: enquiryData.name,
          email: enquiryData.email,
          mobile: enquiryData.mobile,
          city: enquiryData.city,
          remarks: enquiryData.remarks,
          message: enquiryData.message,
        },
      };
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiries }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      toast.success(`Successfully sent ${enquiries.length} enquiry batch(es) to seller(s)!`);
      setCart([]);
      setIsEnquiryModalOpen(false);
      setIsCartOpen(false);
      setEnquiryData({
        company_name: "",
        name: "",
        email: "",
        mobile: "",
        city: "",
        remarks: "",
        message: "",
      });
      setProductEdits({});
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry. Please try again.");
    }
  };


  const handlePageChange = (page: number) => fetchProducts(page);

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
        (p) =>
          p.category?.id?.toString() === selectedCategory ||
          p.category_id?.toString() === selectedCategory
      );

  const getFirstProductImage = (images?: string | string[]) => {
    // ✅ New API: images already an array
    if (Array.isArray(images)) {
      return images.length > 0 ? images[0] : "/mainimg.png";
    }

    // ✅ Old API: images is JSON string
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch (err) {
        // ignore
      }
    }

    // ✅ Fallback
    return "/mainimg.png";
  };



  const getImageContent = (item: any) => {
    const imageUrl = getFirstProductImage(item.images);

    if (/\.(jpe?g|png|webp)$/i.test(imageUrl)) {
      return (
        <img
          src={imageUrl}
          alt={item.product_name || "Product Image"}
          className="h-40 w-full object-cover rounded-lg"
        />
      );
    }

    return (
      <img
        src="/mainimg.png"
        alt="No Image"
        className="h-40 w-full object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupCartBySeller()).map(([sellerId, items]) => (
                    <div key={sellerId} className="border-b pb-4 mb-4">
                      <h3 className="font-semibold text-gray-800 mb-3 bg-gray-100 px-3 py-2 rounded-lg">
                        🏪 Seller {sellerId} ({items.length} product{items.length > 1 ? "s" : ""})
                      </h3>
                      {items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-2"
                        >
                          <img
                            src={
                              item.image && item.image !== "null"
                                ? item.image.startsWith("http")
                                  ? item.image
                                  : `${process.env.NEXT_PUBLIC_API_URL}/${item.image}`
                                : "/mainimg.png"
                            }
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.product_name}
                            </h3>
                            <div className="mt-2 flex justify-between text-gray-700 text-sm">
                              <p>
                                <span className="font-semibold">GSM:</span> {item.gsm || "-"}
                              </p>
                              <p>
                                <span className="font-semibold">Size:</span> {item.sizes || item.size || "-"}
                              </p>
                            </div>
                            <p className="text-blue-600 font-bold mb-2">
                              ₹{item.price_per_kg}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-semibold px-3">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 bg-white">
                <div className="mb-4 text-sm text-gray-600">
                  {Object.keys(groupCartBySeller()).length} Seller{Object.keys(groupCartBySeller()).length > 1 ? "s" : ""} • {getTotalItems()} Item{getTotalItems() > 1 ? "s" : ""}
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsEnquiryModalOpen(true);
                  }}
                  className="w-full py-2 mb-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Enquiry
                </button>

              </div>
            )}
          </div>
        </div>
      )}
      {isEnquiryModalOpen && (
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          enquiryData={enquiryData}
          setEnquiryData={setEnquiryData}
          productEdits={productEdits}
          setProductEdit={setProductEdit}
          groupedCart={groupCartBySeller()}
          onSubmit={handleEnquirySubmit}
        />
      )}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-6">
          {/* Title Section */}
          <div className="text-center sm:text-left">
            <h2 ref={productsRef} className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Top-Rated Paper Products
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-3 mx-auto sm:mx-0"></div>
          </div>

          {/* Cart Button Section */}
          {/* <div className="flex items-center">
            <button
              onClick={() => router.push("/cart")}
              className="group relative p-4 bg-white border border-gray-200 text-blue-600 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ShoppingCart size={28} className="group-hover:scale-110 transition-transform" />

              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-lg h-6 px-2 flex items-center justify-center shadow-lg animate-in zoom-in">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div> */}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => handleCategoryFilter("all")}
            className={`px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition ${selectedCategory === "all"
              ? "text-white bg-gradient-to-r from-blue-500 to-blue-500 shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryFilter(cat.id.toString())}
              className={`px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition ${selectedCategory === cat.id.toString()
                ? "text-white bg-gradient-to-r from-blue-500 to-blue-500 shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200 w-full"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4 mt-3"></div>
                  <div className="flex gap-3 mt-4">
                    <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl overflow-hidden transition transform hover:-translate-y-2 shadow-lg"
              >
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white bg-opacity-90 px-3 py-1 rounded-lg shadow-md z-10">
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

                <div className="p-6 flex flex-col space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product_name}
                  </h3>
                  <Link href={`/product/${item.id}`} className="block">
                    {getImageContent(item)}
                  </Link>
                  <div className="mt-2 flex justify-between text-gray-700 text-sm">
                    <p>
                      <span className="font-semibold">GSM:</span> {item.gsm || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Size:</span> {item.sizes || item.size || "-"}
                    </p>
                  </div>

                  <p className="text-2xl font-extrabold text-blue-600 mt-2">
                    ₹{item.price_per_kg}
                  </p>
                  <p className="text-gray-700">{item.category?.name}</p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "/subscriptionPlan";
                      }}
                      className="flex-1 py-2 rounded-lg text-white bg-[#0f7aed] hover:opacity-90 transition"
                    >
                      Contact
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/B2B/seller/${item.seller_id}`);
                    }}
                    className="flex-1 py-2 rounded-lg text-white bg-[#0f7aed] hover:opacity-90 transition"
                  >
                    View Seller
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className={`w-full py-2 rounded-lg text-white hover:opacity-90 transition mt-2 flex items-center justify-center gap-2 ${isInCart(item.id)
                      ? "bg-orange-500"
                      : "bg-[#38d200]"
                      }`}
                  >
                    <ShoppingCart size={18} />
                    {isInCart(item.id) ? `Added (${getCartQuantity(item.id)})` : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}