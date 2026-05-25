"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Eye, ShoppingCart, Trash2, X, Search, Layers, CheckCircle, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

type Row = {
  location: string;
  sellerType: string;
  category: string;
  productName: string;
  subProduct?: string;
  bf: string | number;
  gsm: string;
  shade: string;
  size: string;
  wl: string;
  pricePerKg: string;
  spotPrice?: string | number;
  quantity: string;
  sellerId: string | number | null;
};

type SellerProduct = {
  id: number;
  name: string;
  product_name?: string;
  category: string;
  category_id?: string;
  gsm: string;
  bf: string;
  shade: string;
  size?: string;
  price: string | number;
  price_per_kg?: string | number;
};

type CartItem = {
  id: number;
  name: string;
  category: string;
  gsm: string;
  bf: string;
  shade: string;
  price: string | number;
  sellerId: string | number | null;
};

export default function LiveStockPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Row;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // modal states
  const [selectedSellerId, setSelectedSellerId] = useState<
    string | number | null
  >(null);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const [modalPage, setModalPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalLoading, setModalLoading] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email_id: "",
    phone: "",
    message: "",
    status: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [userMode, setUserMode] = useState<string | null>(null);
  const { mode, theme } = useTheme();

  // Dynamic styling based on the active mode (B2B = emerald green, B2C = royal blue)
  const activeMode = userMode || mode || "B2C";
  const isB2B = activeMode === "B2B";
  const brandColor = isB2B ? "text-emerald-600" : "text-blue-600";
  const brandBg = isB2B ? "bg-emerald-600" : "bg-blue-600";
  const brandHoverBg = isB2B ? "hover:bg-emerald-700" : "hover:bg-blue-700";
  const brandGradient = isB2B 
    ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white" 
    : "bg-gradient-to-r from-blue-600 to-indigo-500 text-white";
  const brandGradientHeader = isB2B
    ? "bg-gradient-to-r from-[#0d2a5c] via-[#094b32] to-[#16a34a]"
    : "bg-gradient-to-r from-[#0d2a5c] via-[#0e52b8] to-[#0f7aed]";
  const brandButton = isB2B 
    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200" 
    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200";

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("paperStockCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    const mode = localStorage.getItem("mode");
    setUserMode(mode);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("paperStockCart", JSON.stringify(cart));
  }, [cart]);

  const handleEnquiryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquiry = (row: Row) => {
    setSelectedRow(row);
    setIsEnquiryModalOpen(true);
  };

  // Add to cart function
  const addToCart = (product: SellerProduct) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.product_name || product.name,
      category: product.category_id || product.category,
      gsm: product.gsm,
      bf: product.bf,
      shade: product.shade,
      price: product.price_per_kg || product.price,
      sellerId: selectedSellerId,
    };

    // Check if already in cart
    if (cart.some((item) => item.id === product.id)) {
      toast.info("Product already in cart");
      return;
    }

    setCart((prev) => [...prev, cartItem]);
    toast.success("Added to cart!");
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Removed from cart");
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  // Open cart modal
  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        setError(null);

        const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/live-stocks/view-live-stock`;
        let res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const json = await res.json();
        if (!json?.data || !Array.isArray(json.data)) {
          throw new Error("Invalid API response format");
        }

        const mapped: Row[] = json.data.map((item: any) => {
          const p = item.ProductNew || {};
          return {
            sellerId: p.seller_id || null,
            location: p.shade || "-",
            sellerType:
              p.user_type === 2
                ? "Manufacturer"
                : p.user_type === 3
                  ? "Distributor"
                  : "Other",
            category: p.category_id || "-",
            productName: p.product_name || "-",
            subProduct: p.sub_product || "-",
            bf: p.bf || "0",
            gsm: p.gsm || "-",
            shade: p.shade || "-",
            size: p.size || "-",
            wl: p.w_l || "-",
            pricePerKg: p.price_per_kg ? `${p.price_per_kg} ₹` : "0 ₹",
            spotPrice: item.spot_price || "-",
            quantity: p.quantity_in_kg || "0",
          };
        });

        setRows(mapped);
      } catch (err: any) {
        console.error("Error fetching stocks:", err);
        setError(err.message || "Something went wrong while fetching stocks");
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (userMode === "B2B") {
      // B2B mode: Show ONLY Manufacturers
      data = data.filter((r) => r.sellerType === "Manufacturer");
    } else if (userMode === "B2C") {
      // B2C mode: Show all EXCEPT Manufacturers (Distributors and Others)
      data = data.filter((r) => r.sellerType !== "Manufacturer");
    }

    if (search) {
      data = data.filter((r) =>
        Object.values(r).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (filter !== "all") {
      data = data.filter((r) => r.sellerType === filter);
    }

    if (sortConfig) {
      data.sort((a, b) => {
        const valA = String(a[sortConfig.key]).toLowerCase();
        const valB = String(b[sortConfig.key]).toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [rows, search, filter, sortConfig, userMode]);

  const handleSort = (key: keyof Row) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleView = async (row: Row, page = 1) => {
    if (!row.sellerId) return;
    setSelectedRow(row);
    setSelectedSellerId(row.sellerId);
    setIsModalOpen(true);
    setModalLoading(true);

    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/seller/${row.sellerId}?page=${page}&limit=5`;
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch seller stocks");
      const data = await res.json();

      setSellerProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setModalPage(page);
    } catch (err) {
      console.error("Error fetching seller products", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    const productIds = cart.map((item) => item.id);

    if (productIds.length === 0) {
      toast.error("Please add at least one product to cart for enquiry.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        products: productIds,
        spot_price_id: null,
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        email_id: enquiryForm.email_id,
        message: enquiryForm.message,
        status: 0,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/spotPriceEnqiry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit enquiry");

      toast.success("✅ Enquiry submitted successfully!");
      setEnquiryForm({
        name: "",
        email_id: "",
        phone: "",
        message: "",
        status: 0,
      });
      clearCart();
      setIsEnquiryModalOpen(false);
      setIsCartModalOpen(false);
    } catch (err: any) {
      console.error("Error submitting enquiry:", err);
      toast.error(err.message || "Something went wrong while submitting enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const LiveStockSkeleton = () => (
    <div className="animate-pulse space-y-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3"
        >
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, j) => (
              <div key={j} className="h-3 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
          transition: background 0.15s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        /* Firefox fallback */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}} />
      <main className="w-full min-h-screen bg-[#fafafa] px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* Main Content */}
            <div className="text-center">
              <h1 className={`${theme.Text} text-4xl sm:text-5xl lg:text-6xl font-black mt-1 font-poppins tracking-tight flex justify-center`}>
                Live Stock
              </h1>
              <p className="flex justify-center text-base sm:text-lg lg:text-xl text-center text-slate-500 max-w-2xl mx-auto pb-4 pt-4 leading-relaxed">
                Real-time market insights for major paper and packaging companies.
                Data delivered directly from the server with live updates.
              </p>
              {/* Cart Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={openCartModal}
                  className={`relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all duration-200 group shadow-md hover:scale-[1.02] ${brandButton}`}
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="ml-2 text-sm sm:text-base">Shopping Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-black bg-rose-500 text-white rounded-full border-2 border-white shadow-md animate-bounce">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </section>

        {/* Table & Filtering */}
        <section className="max-w-7xl mx-auto pb-8 sm:pb-12 md:pb-16 px-1 sm:px-0">
          <Card
            className="w-full border border-slate-200/60 rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-100/40"
          >
            <CardHeader className="flex flex-col gap-4 px-5 py-6 sm:px-8 border-b border-slate-100 bg-slate-50/40">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Package className={`w-5 h-5 ${brandColor}`} />
                    Live Stocks Market
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Filter and view real-time available stock listed by verified sellers.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:max-w-2xl flex-1 lg:justify-end">
                  <div className="flex items-center w-full sm:flex-1 relative">
                    <div className="absolute left-4 text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <Input
                      placeholder="Search for buyer & seller..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-11 sm:h-12 rounded-xl pl-12 pr-24 text-sm sm:text-base border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary shadow-sm"
                    />
                    <button className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all duration-200 ${brandButton}`}>
                      Search
                    </button>
                  </div>

                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-44 h-11 sm:h-12 rounded-xl border border-slate-200 bg-white text-slate-700 px-4 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Filter by Seller" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-100 text-slate-700 shadow-lg rounded-xl">
                      <SelectItem value="all" className="focus:bg-slate-50 focus:text-slate-900">All Sellers</SelectItem>
                      <SelectItem value="Manufacturer" className="focus:bg-slate-50 focus:text-slate-900">Manufacturer</SelectItem>
                      <SelectItem value="Distributor" className="focus:bg-slate-50 focus:text-slate-900">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 bg-white">
              {/* Mobile View */}
              <div className="block lg:hidden px-4 py-4 space-y-4">
                {loading ? (
                  <LiveStockSkeleton />
                ) : error ? (
                  <div className="py-8 text-center text-rose-500 bg-rose-50/50 rounded-xl border border-rose-100 p-4 font-semibold">{error}</div>
                ) : filteredRows.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col items-center gap-2">
                    <Package className="w-10 h-10 text-slate-300" />
                    <span className="text-base font-semibold">No stock data available</span>
                    <span className="text-xs text-slate-400">Try adjusting your filters or search terms.</span>
                  </div>
                ) : (
                  filteredRows.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-slate-900 font-bold text-base mb-1">
                            {r.productName}
                          </h3>
                          <p className="text-slate-400 text-xs font-normal">
                            {r.subProduct}
                          </p>
                        </div>
                        {r.sellerType === "Manufacturer" ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                            {r.sellerType}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 shadow-sm flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                            {r.sellerType}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs border border-slate-100/60 py-3 bg-slate-50/30 rounded-xl px-4">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Category</span>
                          <span className="text-orange-700 font-bold mt-0.5">{r.category}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">BF Rating</span>
                          <span className="text-pink-600 font-bold mt-0.5">{r.bf} BF</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">GSM Weight</span>
                          <span className="text-teal-600 font-bold mt-0.5">{r.gsm} GSM</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Shade / Color</span>
                          <span className="text-purple-600 font-bold mt-0.5">{r.shade}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Price / kg</span>
                          <div className="text-rose-600 font-black text-base mt-0.5">
                            <span className="text-xs font-bold">₹ </span>
                            {r.pricePerKg.replace(" ₹", "")}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Quantity</span>
                          <span className="text-slate-800 font-bold mt-0.5 bg-slate-100 px-2 py-0.5 rounded text-xs">
                            {Number(r.quantity).toLocaleString()} kg
                          </span>
                        </div>
                        <button
                          onClick={() => handleView(r)}
                          className={`p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 hover:text-white transition duration-200 shadow-sm hover:scale-105 ${
                            isB2B ? "hover:bg-emerald-600 hover:border-emerald-600" : "hover:bg-blue-600 hover:border-blue-600"
                          }`}
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block w-full overflow-x-auto">
                <table className="w-full text-sm border-collapse table-auto">
                  <thead>
                    <tr className="text-slate-500 text-left border-b border-slate-100 bg-slate-50/30">
                      {[
                        { key: "sellerType", label: "Seller Type" },
                        { key: "category", label: "Category" },
                        { key: "productName", label: "Product Name" },
                        { key: "subProduct", label: "Sub Product" },
                        { key: "bf", label: "BF" },
                        { key: "gsm", label: "GSM" },
                        { key: "shade", label: "Shade" },
                        { key: "pricePerKg", label: "Price / kg" },
                        { key: "quantity", label: "Quantity" },
                        { key: "action", label: "View" },
                      ].map((col) => {
                        const isSorted = sortConfig?.key === col.key;
                        return (
                          <th
                            key={col.key}
                            onClick={() => col.key !== "action" && handleSort(col.key as keyof Row)}
                            className={`py-4 px-4 xl:px-5 font-semibold text-[11px] uppercase tracking-wider select-none whitespace-nowrap ${
                              col.key !== "action" ? "cursor-pointer hover:text-slate-800 transition-colors" : ""
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {col.label}
                              {col.key !== "action" && (
                                <ArrowUpDown className={`w-3.5 h-3.5 transition-colors ${isSorted ? brandColor : "text-slate-300"}`} />
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="p-8">
                          <div className="animate-pulse space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-12 bg-slate-50 rounded-xl w-full"
                              ></div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="py-12 text-center text-rose-500 font-medium"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-lg">⚠️ Error Loading Data</span>
                            <span className="text-sm text-slate-400">{error}</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="py-12 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package className="w-12 h-12 text-slate-200" />
                            <span className="text-base font-semibold text-slate-700">No Stock Data Available</span>
                            <span className="text-sm text-slate-400">Try modifying your search or filters.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((r, i) => {
                        const isEven = i % 2 === 0;
                        return (
                          <tr
                            key={i}
                            className={`group border-l-2 border-l-transparent hover:bg-slate-50/40 transition-all duration-200 ${
                              isEven ? "bg-white" : "bg-slate-50/10"
                            } ${isB2B ? "hover:border-l-emerald-500" : "hover:border-l-blue-500"}`}
                          >
                            <td className="py-4 px-4 xl:px-5">
                              {r.sellerType === "Manufacturer" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  {r.sellerType}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  {r.sellerType}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 xl:px-5">
                              <span className="font-semibold text-xs tracking-wide bg-orange-50 text-orange-700 border border-orange-100/60 px-2.5 py-1 rounded-md">
                                {r.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 xl:px-5 font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">
                              {r.productName}
                            </td>
                            <td className="py-4 px-4 xl:px-5">
                              <span className="text-slate-500 font-medium">{r.subProduct}</span>
                            </td>
                            <td className="py-4 px-4 xl:px-5">
                              <span className="font-semibold text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                {r.bf} BF
                              </span>
                            </td>
                            <td className="py-4 px-4 xl:px-5">
                              <span className="font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                {r.gsm} GSM
                              </span>
                            </td>
                            <td className="py-4 px-4 xl:px-5">
                              <span className="font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded text-xs whitespace-nowrap">
                                {r.shade}
                              </span>
                            </td>
                            <td className="py-4 px-4 xl:px-5 font-extrabold text-rose-600 text-sm whitespace-nowrap">
                              <span className="text-xs font-bold">₹ </span>
                              {r.pricePerKg.replace(" ₹", "")}
                              <span className="text-[10px] font-normal text-slate-400"> / kg</span>
                            </td>
                            <td className="py-4 px-4 xl:px-5 font-semibold text-slate-700 text-xs">
                              <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium shadow-inner">
                                {Number(r.quantity).toLocaleString()} kg
                              </span>
                            </td>
                            <td className="py-4 px-4 xl:px-5">
                              <button
                                onClick={() => handleView(r)}
                                className={`p-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 transition-all duration-200 shadow-sm hover:scale-105 ${
                                  isB2B ? "hover:text-emerald-600 hover:border-emerald-100" : "hover:text-blue-600 hover:border-blue-100"
                                }`}
                              >
                                <Eye className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* View Modal - Seller Products — Premium Redesign */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-full rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.25)] bg-white max-h-[92vh] overflow-hidden flex flex-col p-0 border-0 gap-0">

          {/* ── Header ── */}
          <div className={`relative ${brandGradientHeader} px-6 py-5 flex items-center justify-between overflow-hidden`}>
            {/* decorative blobs */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-1/2 w-40 h-10 rounded-full bg-black/10 blur-xl" />

            <div className="relative flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight">
                  Seller's Product List
                </DialogTitle>
                {!modalLoading && sellerProducts.length > 0 && (
                  <p className="text-white/70 text-[11px] font-medium mt-0.5">
                    {sellerProducts.length} product{sellerProducts.length !== 1 ? "s" : ""} available
                  </p>
                )}
              </div>
            </div>

            {/* cart badge in header */}
            {cart.length > 0 && (
              <button
                onClick={() => { setIsModalOpen(false); setIsCartModalOpen(true); }}
                className="relative flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 border border-white/30"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cart.length}
                </span>
              </button>
            )}
          </div>

          {/* ── Body ── */}
          {modalLoading ? (
            <div className="p-6 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-100 p-4 flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-3 bg-slate-100 rounded-full w-16" />
                      <div className="h-3 bg-slate-100 rounded-full w-16" />
                      <div className="h-3 bg-slate-100 rounded-full w-16" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-5 bg-slate-200 rounded-full w-20" />
                    <div className="h-8 bg-slate-200 rounded-xl w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : sellerProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 flex-1">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <Package className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-base font-bold text-slate-600">No products found</p>
              <p className="text-sm text-slate-400">This seller has no live products listed right now.</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5 space-y-3 bg-slate-50/40 custom-scrollbar">
              {sellerProducts.map((p, idx) => {
                const inCart = cart.some((item) => item.id === p.id);
                const productLabel = p.product_name || p.name;
                const categoryLabel = (p as any).category?.name || p.category_id || p.category || "-";
                const price = p.price_per_kg || p.price;

                return (
                  <div
                    key={p.id}
                    className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      inCart
                        ? isB2B ? "border-emerald-200 shadow-emerald-50 shadow-md" : "border-blue-200 shadow-blue-50 shadow-md"
                        : "border-slate-100 hover:border-slate-200 hover:shadow-md shadow-sm"
                    }`}
                  >
                    {/* left accent bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 ${
                        inCart
                          ? isB2B ? "bg-emerald-500" : "bg-blue-500"
                          : "bg-transparent group-hover:bg-slate-200"
                      }`}
                    />

                    <div className="pl-5 pr-4 py-4 flex items-center justify-between gap-4">
                      {/* left: product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full tracking-wider">#{idx + 1}</span>
                          <h3 className="font-extrabold text-slate-900 text-sm truncate">{productLabel}</h3>
                          {inCart && (
                            <span className={`ml-auto flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isB2B ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              <CheckCircle className="w-3 h-3" /> In Cart
                            </span>
                          )}
                        </div>

                        {/* attribute chips */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span>
                            {categoryLabel}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                            {p.gsm} GSM
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-100">
                            {p.bf} BF
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                            {p.shade}
                          </span>
                        </div>
                      </div>

                      {/* right: price + CTA */}
                      <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Price / kg</span>
                          <span className="text-rose-600 font-black text-lg leading-tight">
                            ₹ {price}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(p)}
                          disabled={inCart}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                            inCart
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                              : `${brandButton} hover:scale-105 active:scale-95`
                          }`}
                        >
                          {inCart ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Footer ── */}
          {!modalLoading && sellerProducts.length > 0 && (
            <div className="border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4">
              
              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-medium">Page</span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {modalPage} of {totalPages}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(selectedRow!, modalPage - 1)}
                      disabled={modalPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all duration-150"
                      title="Previous Page"
                    >
                      <span className="text-xs font-bold px-1">&larr;</span>
                    </button>

                    {(() => {
                      const pages = [];
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        const start = Math.max(2, modalPage - 1);
                        const end = Math.min(totalPages - 1, modalPage + 1);
                        if (start > 2) pages.push("...");
                        for (let i = start; i <= end; i++) pages.push(i);
                        if (end < totalPages - 1) pages.push("...");
                        pages.push(totalPages);
                      }
                      return pages.map((page, idx) => {
                        if (page === "...") {
                          return (
                            <span key={`dots-${idx}`} className="px-1.5 text-slate-400 text-xs font-bold select-none">
                              ...
                            </span>
                          );
                        }
                        const isCurrent = page === modalPage;
                        return (
                          <button
                            key={page}
                            onClick={() => handleView(selectedRow!, page as number)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center ${
                              isCurrent
                                ? `${brandBg} text-white shadow-sm`
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}

                    <button
                      onClick={() => handleView(selectedRow!, modalPage + 1)}
                      disabled={modalPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all duration-150"
                      title="Next Page"
                    >
                      <span className="text-xs font-bold px-1">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400 font-medium">
                  {cart.length > 0 ? (
                    <span className={`font-bold ${isB2B ? "text-emerald-600" : "text-blue-600"}`}>
                      {cart.length} item{cart.length !== 1 ? "s" : ""} in cart
                    </span>
                  ) : (
                    "Select products to add to cart"
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
                  >
                    Close
                  </button>
                  {cart.length > 0 && (
                    <button
                      onClick={() => { setIsModalOpen(false); setIsCartModalOpen(true); }}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${brandButton}`}
                    >
                      View Cart →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={isCartModalOpen} onOpenChange={setIsCartModalOpen}>
        <DialogContent className="max-w-3xl rounded-2xl shadow-2xl bg-white max-h-[90vh] overflow-hidden flex flex-col p-0 border border-slate-100">
          <div className={`${brandGradientHeader} px-5 sm:px-6 py-4 flex justify-between items-center border-b border-slate-100/10`}>
            <DialogTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart ({cart.length} items)
            </DialogTitle>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-white hover:text-red-200 text-xs sm:text-sm font-semibold transition"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="p-5 sm:p-6 overflow-auto flex-1 bg-white custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                <ShoppingCart className="w-16 h-16 text-slate-200" />
                <p className="text-lg font-semibold text-slate-600">Your cart is empty</p>
                <p className="text-sm text-slate-400 max-w-xs">
                  Go to seller product lists to find live stock and add them to your cart.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:shadow-md transition duration-150 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-base mb-2">
                          {item.name}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-500">
                          <div>
                            <span className="font-semibold text-slate-400">Category:</span>{" "}
                            <span className="text-slate-700 font-medium">{item.category}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400">GSM:</span>{" "}
                            <span className="text-teal-600 font-semibold">{item.gsm}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400">BF:</span>{" "}
                            <span className="text-pink-600 font-semibold">{item.bf}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400">Shade:</span>{" "}
                            <span className="text-purple-600 font-semibold">{item.shade}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-rose-600 font-black text-sm">
                          Price: ₹ {item.price} <span className="text-xs font-normal text-slate-400">/ kg</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition duration-150 shadow-sm border border-slate-100 bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-slate-100 p-5 bg-slate-50 flex justify-between items-center">
              <button
                onClick={() => {
                  setIsCartModalOpen(false);
                  setIsEnquiryModalOpen(true);
                }}
                className={`w-full py-3 px-6 rounded-xl transition duration-200 font-bold text-base shadow-md text-center ${brandButton}`}
              >
                Proceed to Enquiry
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enquiry Modal */}
      <Dialog open={isEnquiryModalOpen} onOpenChange={setIsEnquiryModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-2xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col border border-slate-100">
          <div className={`${brandGradientHeader} px-6 py-4 flex items-center justify-between border-b border-slate-100/10`}>
            <DialogTitle className="text-base sm:text-lg font-bold text-white text-center w-full">
              Submit Enquiry
            </DialogTitle>
          </div>

          <form className="p-6 space-y-4 overflow-y-auto flex-1 bg-white custom-scrollbar" onSubmit={handleSubmitEnquiry}>
            {/* Cart Summary */}
            <div className={`border rounded-xl p-4 ${isB2B ? "bg-emerald-50/50 border-emerald-100/80" : "bg-blue-50/50 border-blue-100/80"}`}>
              <h4 className="font-bold text-slate-800 mb-2 text-sm">
                Selected Products ({cart.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {cart.map((item, idx) => (
                  <div
                    key={item.id}
                    className="text-xs text-slate-700 flex justify-between items-center py-1 border-b border-dashed border-slate-200/50 last:border-b-0"
                  >
                    <span className="font-medium text-slate-700">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-rose-600 font-bold">
                      ₹ {item.price} / kg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={enquiryForm.name}
                onChange={handleEnquiryChange}
                className="bg-white text-slate-800 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary h-11"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email_id"
                type="email"
                value={enquiryForm.email_id}
                onChange={handleEnquiryChange}
                className="bg-white text-slate-800 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary h-11"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                type="tel"
                value={enquiryForm.phone}
                onChange={handleEnquiryChange}
                className="bg-white text-slate-800 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary h-11"
                placeholder="Enter your mobile number"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Enquiry Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={enquiryForm.message}
                onChange={handleEnquiryChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white text-slate-800 focus:ring-primary focus:border-primary focus:outline-none min-h-[100px]"
                placeholder="Describe your requirements (quantity needed, grades required, delivery details, etc.)..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl transition font-bold text-sm shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 text-white py-3 px-4 rounded-xl transition disabled:opacity-50 font-bold text-sm shadow-sm ${brandButton}`}
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}