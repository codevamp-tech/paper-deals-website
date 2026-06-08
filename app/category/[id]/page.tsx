"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, X, Plus, Minus, Trash2, Send, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { ListingProductCard } from "@/components/product/ListingProductCard";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";
import EnquiryModal from "@/components/enquiryModal";
import { useTheme } from "@/hooks/use-theme";
import PageAdvertising from "@/components/advertising/pageAdvetise";
import ProductCrousel from "@/components/productForhome/productcrousel";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";

export default function CategoryProductsPage() {
  const { id } = useParams();
  const { mode } = useTheme();

  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

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
  const [enquiryData, setEnquiryData] = useState({
    company_name: "", name: "", email: "", mobile: "", city: "", remarks: "", message: "",
  });
  const [productEdits, setProductEdits] = useState<Record<number, any>>({});
  const setProductEdit = (productId: number, patch: any) =>
    setProductEdits(prev => ({ ...prev, [productId]: { ...(prev[productId] || {}), ...patch } }));

  // Fetch products for this category
  useEffect(() => {
    if (!id) return;
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/category/${id}`);
        // 404 means no products in this category — treat as empty
        if (res.status === 404) { setProducts([]); return; }
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // Response is a plain array
        const prods = Array.isArray(data) ? data : [];
        setProducts(prods);
        if (prods.length > 0 && prods[0].category?.name) {
          setCategoryName(prods[0].category.name);
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  // Sync cart with mode
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${mode}`);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(`cart_${mode}`, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cart, mode]);

  const addToCart = (product: any) => {
    setCart(prev => {
      if (prev.find(i => i.id === product.id)) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      toast.success("Added to cart");
      return [...prev, { ...product, quantity: 1, mode }];
    });
  };

  const updateQuantity = (productId: number, delta: number) =>
    setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.id !== productId));
    toast.error("Removed from cart");
  };

  const isInCart = (productId: number) => cart.some(i => i.id === productId);
  const getTotalItems = () => cart.reduce((sum, i) => sum + i.quantity, 0);

  const groupCartBySeller = () => {
    const grouped: { [key: string]: any[] } = {};
    cart.forEach(item => {
      const sid = item.seller_id || item.user_id || "unknown";
      if (!grouped[sid]) grouped[sid] = [];
      grouped[sid].push(item);
    });
    return grouped;
  };

  const handleEnquirySubmit = async () => {
    const groupedCart = groupCartBySeller();
    const enquiries = Object.entries(groupedCart).map(([sellerId, items]) => ({
      seller_id: Number(sellerId),
      product_ids: items.map(i => i.id),
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Ads Banner */}
      <PageAdvertising />

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
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
                        <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
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

      {/* Enquiry Modal */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/product" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors font-semibold mb-2">
              <ArrowLeft size={16} /> Back to All Products
            </Link>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">
              {categoryName ? (
                <><span className="text-primary">{categoryName}</span> Products</>
              ) : (
                "Category Products"
              )}
            </h1>
            <p className="text-lg text-gray-500">
              {loading ? "" : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Cart Button */}

        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart size={36} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-8">No products are available in this category yet.</p>
            <Link href="/product" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((item) => (
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
      </div>

      {/* Additional home page components */}
      <div className="mt-16 border-t border-gray-100 bg-white">
        <ProductCrousel />
      </div>
      <ReadyToOrder />
    </div>
  );
}
