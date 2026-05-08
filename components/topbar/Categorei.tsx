"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Grid2X2, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Loader2, 
  ChevronLeft,
  ArrowRight,
  Search,
  ShoppingCart,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ApiCategory = {
  id: number;
  name: string;
  image: string;
  status: number;
  date: string;
  mode?: string;
};

type ApiProduct = {
  id: number;
  product_name: string;
  images: any;
  price_per_kg: number;
  rating?: number;
  gsm?: string;
};

type ApiResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: ApiCategory[];
};

export default function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ApiCategory | null>(null);
  const [categoriesData, setCategoriesData] = useState<ApiCategory[]>([]);
  const [activeProducts, setActiveProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch initial categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch more categories to reduce pagination need
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry?page=1&limit=100`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: ApiResponse = await res.json();

        if (Array.isArray(data.categories)) {
          const currentMode = localStorage.getItem("mode") || "B2C";
          const filtered = data.categories.filter((cat: any) => {
            if (currentMode === "B2B") {
              return cat.mode === "b2b";
            } else {
              return cat.mode === "b2c" || !cat.mode;
            }
          });
          setCategoriesData(filtered);
          if (filtered.length > 0) setActiveCategory(filtered[0]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products for active category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory) return;
      try {
        setProductsLoading(true);
        // Since we don't have a direct category endpoint, we'll fetch general products 
        // and filter or use the search endpoint if available.
        // For now, let's use the search endpoint with category name as it's common.
        const userType = (localStorage.getItem("mode") === "B2B" ? 2 : 3);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/search?q=${encodeURIComponent(activeCategory.name)}&user_type=${userType}&limit=3`
        );
        if (res.ok) {
          const data = await res.json();
          setActiveProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    if (isOpen) fetchProducts();
  }, [activeCategory, isOpen]);

  const filteredCategories = categoriesData.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const getProductImage = (images: any) => {
    if (Array.isArray(images)) return images[0] || "/mainimg.png";
    if (typeof images === "string") {
      try {
        const p = JSON.parse(images);
        return Array.isArray(p) ? p[0] : images;
      } catch {
        return images;
      }
    }
    return "/mainimg.png";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Categories Button */}
      <button
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 font-bold uppercase tracking-widest text-[11px] ${
          isOpen ? "bg-primary text-white" : "text-gray-400 hover:text-white"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Grid2X2 size={16} className={isOpen ? "text-white" : "text-primary"} />
        <span className="hidden sm:inline">Browse Industries</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Megamenu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute left-0 top-full mt-4 bg-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden z-[100] w-[90vw] md:w-[850px] lg:w-[950px] border border-gray-100 flex flex-col md:flex-row h-[600px]"
          >
            {/* Sidebar: Category List */}
            <div className="w-full md:w-72 bg-gray-50/80 border-r border-gray-100 flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Our Industries</h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {filteredCategories.length} Types
                  </span>
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search industries..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-lg text-[11px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Loading...</span>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      className={`flex items-center justify-between w-full p-3.5 rounded-xl transition-all group ${
                        activeCategory?.id === category.id 
                        ? "bg-white shadow-md text-primary translate-x-1" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeCategory?.id === category.id ? "bg-primary text-white" : "bg-white border border-gray-100 group-hover:border-primary/30"}`}>
                          {category.image ? (
                            <img src={category.image} className="w-5 h-5 object-contain" alt="" />
                          ) : (
                            <Package size={14} />
                          )}
                        </div>
                        <span className="text-sm font-bold truncate text-left">{category.name}</span>
                      </div>
                      <ChevronRight size={14} className={`transition-all ${activeCategory?.id === category.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 bg-white relative overflow-hidden flex flex-col">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {activeCategory ? (
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 p-3 border border-gray-100 shadow-inner">
                          {activeCategory.image ? (
                            <img src={activeCategory.image} className="w-full h-full object-contain" alt={activeCategory.name} />
                          ) : (
                            <Package size={24} className="text-gray-200" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Mill Direct</p>
                          </div>
                          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{activeCategory.name}</h2>
                        </div>
                      </div>
                      
                      <Link
                        href={`/product?category=${activeCategory.id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                      >
                        View Collection <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Products Preview Section */}
                    <div className="flex-1">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Featured Products</h4>
                      </div>

                      {productsLoading ? (
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
                          ))}
                        </div>
                      ) : activeProducts.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {activeProducts.map((product) => (
                            <Link 
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => setIsOpen(false)}
                              className="group/prod flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                            >
                              <div className="h-32 bg-gray-50 overflow-hidden relative">
                                <img 
                                  src={getProductImage(product.images)} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/prod:scale-110" 
                                  alt={product.product_name} 
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 shadow-sm">
                                  <Star size={8} className="text-amber-500 fill-amber-500" /> {product.rating || "5.0"}
                                </div>
                              </div>
                              <div className="p-3">
                                <h5 className="text-[11px] font-bold text-gray-900 line-clamp-1 mb-1 group-hover/prod:text-primary transition-colors">
                                  {product.product_name}
                                </h5>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-primary">₹{product.price_per_kg}/kg</span>
                                  <span className="text-[9px] font-bold text-gray-400">{product.gsm || "80"} GSM</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <Package size={32} className="text-gray-300 mb-2" />
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New arrivals coming soon</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-[11px] text-gray-400 font-medium max-w-xs">
                        Bulk orders for <span className="text-gray-900 font-bold">{activeCategory.name}</span> are processed with priority logistics and quality assurance.
                      </p>
                      <Link
                        href={`/product?category=${activeCategory.id}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200 active:scale-95 group/btn"
                      >
                        Explore All <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-20">
                    <Package size={64} className="mb-4" />
                    <p className="text-lg font-black uppercase tracking-widest">Select an Industry</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
