"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, Send, Filter, Grid, LayoutList } from "lucide-react";
import EnquiryModal from "@/components/enquiryModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { ListingProductCard } from "@/components/product/ListingProductCard";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";

export default function ProductListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const savedMode = (localStorage.getItem("mode") as "B2B" | "B2C") || "B2C";
      const savedCart = localStorage.getItem(`cart_${savedMode}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const { mode, theme } = useTheme();
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

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [productEdits, setProductEdits] = useState<Record<number, any>>({});

  const setProductEdit = (productId: number, patch: any) =>
    setProductEdits(prev => ({ ...prev, [productId]: { ...(prev[productId] || {}), ...patch } }));

  const fetchProducts = async (page: number = 1) => {
    try {
      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const currentMode = localStorage.getItem("mode") || "B2C";
      const userType = currentMode === "B2B" ? 2 : 3;
      const url = `${baseUrl}/api/product/by-user-type?user_type=${userType}&page=${page}&limit=12`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      setProducts(prev => page === 1 ? (data.products || []) : [...prev, ...(data.products || [])]);
      setPagination(data.pagination || { total: data.totalProducts || 0, page: data.currentPage || page, pages: data.totalPages || 0 });

      setCategories(prevCats => {
        const prevMap = new Map(page === 1 ? [] : prevCats.map(c => [c.id, c]));
        (data.products || []).forEach((p: any) => {
          if (p.category && p.category.id) prevMap.set(p.category.id, { id: p.category.id, name: p.category.name });
        });
        return Array.from(prevMap.values());
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && !isFetchingMore && pagination.page < pagination.pages) {
        fetchProducts(pagination.page + 1);
      }
    });
    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [pagination, loading, isFetchingMore]);

  useEffect(() => { fetchProducts(1); }, [mode]);

  useEffect(() => {
    const toProduct = searchParams.get("toProduct");
    if (toProduct === "true") {
      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [searchParams]);

  useEffect(() => {
    // Sync cart when mode changes
    const savedCart = localStorage.getItem(`cart_${mode}`);
    if (savedCart) setCart(JSON.parse(savedCart));
    else setCart([]);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`cart_${mode}`, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cart, mode]);

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      toast.success("Added to cart");
      return [...prevCart, { ...product, quantity: 1, mode }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.error("Removed from cart");
  };

  const isInCart = (productId: number) => cart.some(item => item.id === productId);
  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const groupCartBySeller = () => {
    const grouped: { [key: string]: any[] } = {};
    cart.forEach(item => {
      const sellerId = item.seller_id || item.user_id || "unknown";
      if (!grouped[sellerId]) grouped[sellerId] = [];
      grouped[sellerId].push(item);
    });
    return grouped;
  };

  const handleEnquirySubmit = async () => {
    const groupedCart = groupCartBySeller();
    const enquiries = Object.entries(groupedCart).map(([sellerId, items]) => ({
      seller_id: Number(sellerId),
      product_ids: items.map(item => item.id),
      products: items.map(item => {
        const edit = productEdits[item.id] || {};
        return {
          product_id: item.id,
          product_name: item.product_name,
          category_id: item.category?.id || item.category_id || null,
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
      }),
      customer_details: { ...enquiryData, mode: (localStorage.getItem("mode") as any) || mode || "B2C" },
    }));

    const currentMode = (localStorage.getItem("mode") as any) || mode || "B2C";
    const endpoint = currentMode === "B2B" ? "/api/enquiry/multiple" : "/api/enquiry/multiple-broadcast";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiries }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Successfully sent enquiries to ${enquiries.length} seller(s)!`);
      setCart([]);
      setIsEnquiryModalOpen(false);
      setIsCartOpen(false);
      setEnquiryData({ company_name: "", name: "", email: "", mobile: "", city: "", remarks: "", message: "" });
      setProductEdits({});
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry.");
    }
  };

  const filteredProducts = selectedCategory === "all" ? products : products.filter(p => p.category?.id?.toString() === selectedCategory || p.category_id?.toString() === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Premium Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Selection</h2>
                  <p className="text-sm text-gray-500 mt-1">{getTotalItems()} items from {Object.keys(groupCartBySeller()).length} suppliers</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <ShoppingCart size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cart is Empty</h3>
                    <p className="text-gray-500 max-w-[200px]">Add some products to start your enquiry process.</p>
                  </div>
                ) : (
                  Object.entries(groupCartBySeller()).map(([sellerId, items]) => (
                    <div key={sellerId} className="space-y-4">
                      <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Supplier ID: {sellerId}</span>
                      </div>
                      {items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <img src={item.images?.[0] || "/mainimg.png"} alt={item.product_name} className="w-20 h-20 object-cover rounded-xl bg-gray-50" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.product_name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.gsm} GSM • {item.size}</p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all"><Minus size={14} /></button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all"><Plus size={14} /></button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-100 bg-white">
                  <button
                    onClick={() => { setIsCartOpen(false); setIsEnquiryModalOpen(true); }}
                    className="w-full py-5 bg-primary text-white font-bold rounded-[1.25rem] shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <Send size={20} />
                    Submit Enquiry for {getTotalItems()} Items
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h1 ref={productsRef} className="text-5xl font-black text-gray-900 tracking-tight">
              Premium <span className="text-primary">Catalog</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              Source high-quality paper products directly from verified manufacturers. Use the cart to batch your enquiries.
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <button className="p-2.5 bg-gray-50 rounded-xl text-primary"><Grid size={20} /></button>
              <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"><LayoutList size={20} /></button>
            </div>
            
            <button onClick={() => setIsCartOpen(true)} className="relative group px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-primary transition-all duration-300">
              <ShoppingCart className="text-gray-900 group-hover:text-primary" size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg shadow-primary/30 border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-12 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-sm border ${selectedCategory === "all"
              ? "bg-primary text-white border-primary shadow-primary/20"
              : "bg-white text-gray-600 border-gray-100 hover:border-primary/30"
              }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-sm border ${selectedCategory === cat.id.toString()
                ? "bg-primary text-white border-primary shadow-primary/20"
                : "bg-white text-gray-600 border-gray-100 hover:border-primary/30"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item, index) => (
                <ListingProductCard
                  key={item.id}
                  item={item}
                  mode={mode}
                  isInCart={isInCart}
                  addToCart={addToCart}
                  openEnquiry={(item) => {
                    if (!isInCart(item.id)) addToCart(item);
                    setIsEnquiryModalOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Infinite Scroll Bottom */}
        <div ref={bottomRef} className="h-20 flex items-center justify-center mt-12">
          {isFetchingMore && (
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full max-w-[300px]">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          )}
          {!isFetchingMore && pagination.page >= pagination.pages && products.length > 0 && (
            <p className="text-gray-400 font-medium italic">You've reached the end of our catalog.</p>
          )}
        </div>
      </div>
    </div>
  );
}
