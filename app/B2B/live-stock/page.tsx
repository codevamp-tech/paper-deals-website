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
import { ArrowUpDown, Eye, ShoppingCart, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  }, [rows, search, filter, sortConfig]);

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
      <main className="w-full min-h-screen bg-[#fafafa] px-4 sm:px-6 lg:px-8">
        {/* Floating Cart Button */}


        {/* Hero */}
        <section className="relative border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#22d3ee] text-white">
                <span className="textfont-medium text-sm sm:text-base">Live Stock </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-foreground">Paper & Packaging</span>
                <span className="block text-muted-foreground">Market Watch</span>
              </h1>

              <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                Real-time market insights for major paper and packaging companies.
                <br className="hidden sm:block" />
                Data delivered directly from the server with live updates.
              </p>

              {/* Cart Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={openCartModal}
                  className="relative inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary hover:bg-accent text-primary-foreground font-semibold transition-colors duration-200 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="ml-2 text-sm">Shopping Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-destructive text-white rounded-full">
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

        {/* Table */}
        <section className="max-w-7xl mx-auto pb-8 sm:pb-12 md:pb-16">
          <Card
            className="w-full border-0 rounded-lg sm:rounded-xl overflow-hidden"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            <CardHeader className="flex flex-col gap-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex items-center w-full sm:flex-1 relative">
                  <Input
                    placeholder="Search for buyer & seller..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 sm:h-12 rounded-full pl-4 sm:pl-5 pr-20 sm:pr-24 text-sm sm:text-base shadow-sm border border-gray-300 bg-[#fafafa] text-gray-600"
                  />
                  <button className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:opacity-90 transition">
                    Search
                  </button>
                </div>

                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-11 sm:h-12 rounded-full border-gray-300 bg-[#fafafa] text-gray-600 px-4 text-sm sm:text-base">
                    <SelectValue placeholder="Filter by Seller" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#fafafa] text-gray-600">
                    <SelectItem value="all">All Sellers</SelectItem>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="Distributor">Distributor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Mobile View */}
              <div className="block lg:hidden px-4 pb-4 space-y-4">
                {loading ? (
                  <LiveStockSkeleton />
                ) : error ? (
                  <div className="py-8 text-center text-red-500">{error}</div>
                ) : filteredRows.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No stock data available
                  </div>
                ) : (
                  filteredRows.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-indigo-600 font-bold text-base mb-1">
                            {r.productName}
                          </h3>
                          <p className="text-indigo-500 text-sm">
                            {r.subProduct}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${r.sellerType === "Manufacturer"
                            ? "bg-green-100 text-green-700"
                            : r.sellerType === "Distributor"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {r.sellerType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-1 text-orange-600">
                            {r.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">BF:</span>
                          <span className="ml-1 text-pink-600">{r.bf}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">GSM:</span>
                          <span className="ml-1 text-teal-600">{r.gsm}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Shade:</span>
                          <span className="ml-1 text-purple-600">
                            {r.shade}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-1 text-violet-700 font-bold">
                            {r.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Price/Kg</div>
                          <div className="text-red-600 font-bold">
                            {r.pricePerKg}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">
                            Spot Price
                          </div>
                          <div className="text-red-500 font-bold">
                            {r.spotPrice}
                          </div>
                        </div>
                        <button
                          onClick={() => handleView(r)}
                          className="p-2 hover:bg-gray-100 rounded-full text-blue-500 hover:text-blue-600"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block w-full overflow-hidden">
                <table className="w-full text-sm border-collapse table-auto">
                  <thead>
                    <tr className="text-gray-600 text-left border-b border-gray-200">
                      {[
                        "sellerType",
                        "category",
                        "productName",
                        "subProduct",
                        "bf",
                        "gsm",
                        "shade",
                        "pricePerKg",
                        "spotPrice",
                        "quantity",
                        "view",
                      ].map((col) => (
                        <th
                          key={col}
                          onClick={() => handleSort(col as keyof Row)}
                          className="py-3 px-3 xl:px-4 font-medium cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1">
                            {col}
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={11} className="p-6">
                          <div className="animate-pulse space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-6 bg-gray-200 rounded w-full"
                              ></div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="py-6 text-center text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : filteredRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="py-6 text-center text-gray-500"
                        >
                          No stock data available
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((r, i) => (
                        <tr
                          key={i}
                          className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100 transition-colors`}
                        >
                          <td className="py-3 px-3 xl:px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${r.sellerType === "Manufacturer"
                                ? "bg-green-100 text-green-700"
                                : r.sellerType === "Distributor"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-200 text-gray-700"
                                }`}
                            >
                              {r.sellerType}
                            </span>
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-orange-600">
                            {r.category}
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-indigo-600 font-semibold">
                            {r.productName}
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-indigo-500">
                            {r.subProduct}
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-pink-600">
                            {r.bf}
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-teal-600">
                            {r.gsm}
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-purple-600">
                            {r.shade}
                          </td>
                          <td className="py-3 px-3 xl:px-4 font-bold text-red-600">
                            {r.pricePerKg}
                          </td>
                          <td className="py-3 px-3 xl:px-4 font-bold text-red-500">
                            {r.spotPrice}
                          </td>
                          <td className="py-3 px-3 xl:px-4 font-bold text-violet-700">
                            {r.quantity}
                          </td>
                          <td className="py-3 px-3 xl:px-4">
                            <button
                              onClick={() => handleView(r)}
                              className="hover:text-blue-600 text-blue-500"
                            >
                              <Eye />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* View Modal - Seller Products */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl rounded-2xl shadow-lg bg-white max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-4">
            <DialogTitle className="text-base sm:text-lg font-semibold text-white text-center">
              Seller's Product List
            </DialogTitle>
          </div>

          {modalLoading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : (
            <div className="p-4 sm:p-6 overflow-auto flex-1">
              {sellerProducts.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-xs sm:text-sm border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b text-left text-gray-600">
                        <th className="py-2 px-2 sm:px-3">Product</th>
                        <th className="py-2 px-2 sm:px-3">Category</th>
                        <th className="py-2 px-2 sm:px-3">GSM</th>
                        <th className="py-2 px-2 sm:px-3">BF</th>
                        <th className="py-2 px-2 sm:px-3">Shade</th>
                        <th className="py-2 px-2 sm:px-3">Price</th>
                        <th className="py-2 px-2 sm:px-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProducts.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2 sm:px-3 font-medium">
                            {p.product_name || p.name}
                          </td>
                          <td className="py-2 px-2 sm:px-3">
                            {p.category?.name || p.category_id || "-"}
                          </td>
                          <td className="py-2 px-2 sm:px-3">{p.gsm}</td>
                          <td className="py-2 px-2 sm:px-3">{p.bf}</td>
                          <td className="py-2 px-2 sm:px-3">{p.shade}</td>
                          <td className="py-2 px-2 sm:px-3 text-red-600 font-semibold">
                            {p.price_per_kg || p.price} ₹
                          </td>
                          <td className="py-2 px-2 sm:px-3 text-center">
                            <button
                              onClick={() => addToCart(p)}
                              disabled={cart.some((item) => item.id === p.id)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${cart.some((item) => item.id === p.id)
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                                }`}
                            >
                              {cart.some((item) => item.id === p.id)
                                ? "Added"
                                : "Add to Cart"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={isCartModalOpen} onOpenChange={setIsCartModalOpen}>
        <DialogContent className="max-w-3xl rounded-2xl shadow-2xl bg-white max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-4 flex justify-between items-center">
            <DialogTitle className="text-base sm:text-lg font-semibold text-white">
              Your Cart ({cart.length} items)
            </DialogTitle>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-white hover:text-red-200 text-sm underline"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 overflow-auto flex-1">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add products from the seller's list
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {item.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            {item.category}
                          </div>
                          <div>
                            <span className="font-medium">GSM:</span> {item.gsm}
                          </div>
                          <div>
                            <span className="font-medium">BF:</span> {item.bf}
                          </div>
                          <div>
                            <span className="font-medium">Shade:</span>{" "}
                            {item.shade}
                          </div>
                        </div>
                        <div className="mt-2 text-red-600 font-bold">
                          Price: {item.price} ₹/kg
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 sm:p-6 bg-gray-50">
              <button
                onClick={() => {
                  setIsCartModalOpen(false);
                  setIsEnquiryModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition font-semibold text-lg shadow-lg"
              >
                Proceed to Enquiry
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enquiry Modal */}
      <Dialog open={isEnquiryModalOpen} onOpenChange={setIsEnquiryModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-2xl p-0 overflow-y-scroll h-[90vh] bg-gradient-to-b from-purple-50 to-white">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-white text-center">
              Submit Enquiry
            </DialogTitle>
          </div>

          <form className="p-6 space-y-4" onSubmit={handleSubmitEnquiry}>
            {/* Cart Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Selected Products ({cart.length})
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div
                    key={item.id}
                    className="text-sm text-gray-700 flex justify-between"
                  >
                    <span>
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-red-600 font-semibold">
                      {item.price} ₹
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={enquiryForm.name}
                onChange={handleEnquiryChange}
                className="bg-white text-black border border-gray-300"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email_id"
                type="email"
                value={enquiryForm.email_id}
                onChange={handleEnquiryChange}
                className="bg-white text-black border border-gray-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Mobile <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                type="tel"
                value={enquiryForm.phone}
                onChange={handleEnquiryChange}
                className="bg-white text-black border border-gray-300"
                placeholder="Enter your mobile number"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={enquiryForm.message}
                onChange={handleEnquiryChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white text-black"
                placeholder="Write your enquiry message..."
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50 font-semibold"
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