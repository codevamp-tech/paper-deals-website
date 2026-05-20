"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Grid2X2, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Loader2, 
  ArrowRight,
  Search,
  Layers,
  Tag
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories filtered to B2B mode
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
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
            className="absolute left-0 top-full mt-4 bg-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden z-[100] w-[90vw] md:w-[680px] border border-gray-100 flex flex-col md:flex-row"
          >
            {/* Sidebar: Category List */}
            <div className="w-full md:w-64 bg-gray-50/80 border-r border-gray-100 flex flex-col">
              <div className="p-5 border-b border-gray-100 bg-white/50">
                <div className="flex items-center justify-between mb-3">
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

              <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar max-h-[400px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-3 opacity-50">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Loading...</span>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      onClick={() => setActiveCategory(category)}
                      className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${
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

            {/* Right Panel: Category Detail + CTA only (no products) */}
            <div className="flex-1 p-8 bg-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

              <AnimatePresence mode="wait">
                {activeCategory ? (
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 flex flex-col h-full justify-between"
                  >
                    {/* Category Header */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 p-3 border border-gray-100 shadow-inner flex items-center justify-center">
                          {activeCategory.image ? (
                            <img src={activeCategory.image} className="w-full h-full object-contain" alt={activeCategory.name} />
                          ) : (
                            <Package size={28} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Mill Direct</p>
                          </div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{activeCategory.name}</h2>
                        </div>
                      </div>

                      {/* Info chips */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary text-[10px] font-bold rounded-lg border border-primary/15">
                          <Layers size={11} /> Bulk Orders Available
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100">
                          <Tag size={11} /> Best Mill Prices
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Browse all verified <span className="text-gray-900 font-bold">{activeCategory.name}</span> products from top manufacturers. 
                        Bulk orders processed with priority logistics and quality assurance.
                      </p>
                    </div>

                    {/* View Collection CTA */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Link
                        href={`/category/${activeCategory.id}`}
                        onClick={() => setIsOpen(false)}
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 group/btn"
                      >
                        View Collection
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
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
