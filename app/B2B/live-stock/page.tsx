"use client";
import Link from "next/link";
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
import { ArrowUpDown, Eye } from "lucide-react";

import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";

import {
  Dialog,
  DialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/pagination";
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
  category: string;
  gsm: string;
  bf: string;
  shade: string;
  size: string;
  price: string | number;
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

  // modal states
  const [selectedSellerId, setSelectedSellerId] = useState<string | number | null>(null);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const [modalPage, setModalPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalLoading, setModalLoading] = useState(false);
  // 🟣 Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email_id: "",
    phone: "",
    message: "",
    status: 0,
  });
  const [submitting, setSubmitting] = useState(false);


  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquiry = (row: Row) => {
    setSelectedRow(row);
    setIsEnquiryModalOpen(true);
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
            sellerId: p.seller_id || null, // 👈 Add this
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

  const handleProductEnquiry = (product: SellerProduct) => {
    setSelectedRow({
      id: product.id,
      location: "-",
      sellerType: "-",
      category: product.category,
      productName: product.name,
      bf: product.bf,
      gsm: product.gsm,
      shade: product.shade,
      size: "-",
      wl: "-",
      pricePerKg: product.price,
      quantity: "-",
      sellerId: selectedSellerId,
    });
    setIsEnquiryModalOpen(true);
  };


  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;

    try {
      setSubmitting(true);
      const payload = {
        products: selectedRow.id,  // must match model field name
        spot_price_id: selectedRow.spotPrice || null, // optional, if applicable
        name: enquiryForm.name,
        phone: enquiryForm.phone,   // ✅ added
        email_id: enquiryForm.email_id,
        message: enquiryForm.message,
        status: 0,
      };


      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spotPriceEnqiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit enquiry");

      toast.success("✅ Enquiry submitted successfully!");
      setEnquiryForm({ name: "", email_id: "", phone: "", message: "", status: 0 });
      setIsEnquiryModalOpen(false);
    } catch (err: any) {
      console.error("Error submitting enquiry:", err);
      toast.error(err.message || "Something went wrong while submitting enquiry");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <main className="w-screen -mx-[calc((100vw-100%)/2)] bg-[#fafafa]">
        {/* Hero */}
        <section className="space-y-3 text-center py-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#22d3ee] text-white">
            <span className="font-medium">Live Stock</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-black">Paper & Packaging</span>{" "}
            <span className="text-gray-700">Market Watch</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Real-time styled view of major paper and packaging companies. Data
            comes directly from the server.
          </p>
        </section>

        {/* Table */}
        <section>
          <Card className="w-full border-0 shadow-none rounded-none">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 px-4">
              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="flex items-center w-full sm:w-[300px] md:w-[400px] lg:w-[500px] relative">
                  <Input
                    placeholder="Search for buyer & seller..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 rounded-full pl-5 pr-24 text-base shadow-sm border border-gray-300 bg-[#fafafa] text-gray-600"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition">
                    Search
                  </button>
                </div>

                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-12 rounded-full border-gray-300 bg-[#fafafa] text-gray-600">
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
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-600 text-left border-b border-gray-200">
                      {[
                        "location",
                        "sellerType",
                        "category",
                        "productName",
                        "subProduct",
                        "bf",
                        "gsm",
                        "shade",
                        "size",
                        "wl",
                        "pricePerKg",
                        "spotPrice",
                        "quantity",
                        "view",
                        // "Enquiry",
                      ].map((col) => (
                        <th
                          key={col}
                          onClick={() => handleSort(col as keyof Row)}
                          className="py-3 px-4 font-medium cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
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
                        <td
                          colSpan={15}
                          className="py-6 text-center text-gray-500"
                        >
                          Loading stocks...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={15}
                          className="py-6 text-center text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : filteredRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={15}
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
                          <td className="py-3 px-4 text-blue-600 font-medium">
                            {r.ProductNew?.seller?.organization?.city || "N/A"}
                          </td>
                          <td className="py-3 px-4">
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
                          <td className="py-3 px-4 text-orange-600">
                            {r.category}
                          </td>
                          <td className="py-3 px-4 text-indigo-600 font-semibold">
                            {r.productName}
                          </td>
                          <td className="py-3 px-4 text-indigo-500">
                            {r.subProduct}
                          </td>
                          <td className="py-3 px-4 text-pink-600">{r.bf}</td>
                          <td className="py-3 px-4 text-teal-600">{r.gsm}</td>
                          <td className="py-3 px-4 text-purple-600">
                            {r.shade}
                          </td>
                          <td className="py-3 px-4 text-amber-600">
                            {r.size}
                          </td>
                          <td className="py-3 px-4 text-cyan-600">{r.wl}</td>
                          <td className="py-3 px-4 font-bold text-red-600">
                            {r.pricePerKg}
                          </td>
                          <td className="py-3 px-4 font-bold text-red-500">
                            {r.spotPrice}
                          </td>
                          <td className="py-3 px-4 font-bold text-violet-700">
                            {r.quantity}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleView(r)}
                              className="hover:text-blue-600 text-blue-500"
                            >
                              <Eye />
                            </button>
                          </td>
                          {/* <td className="py-3 px-4 font-bold text-violet-700">
                            <button
                              onClick={() => handleEnquiry(r)}
                              className="text-purple-600 hover:text-purple-800 font-semibold underline"
                            >
                              Enquiry now
                            </button>
                          </td> */}
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

      {/* View Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl rounded-2xl shadow-lg bg-white">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-white text-center">
              Seller’s Product List
            </DialogTitle>
          </div>

          {modalLoading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : (
            <div className="p-6">
              {sellerProducts.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">GSM</th>
                      <th className="py-2 px-3">BF</th>
                      <th className="py-2 px-3">Shade</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{p.product_name || p.name}</td>
                        <td className="py-2 px-3">
                          {p.category?.name || p.category_id || "-"}
                        </td>
                        <td className="py-2 px-3">{p.gsm}</td>
                        <td className="py-2 px-3">{p.bf}</td>
                        <td className="py-2 px-3">{p.shade}</td>
                        <td className="py-2 px-3 text-red-600 font-semibold">
                          {p.price_per_kg || p.price} ₹
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() =>
                              handleProductEnquiry({
                                id: p.id,
                                name: p.product_name || p.name,
                                category: p.category_id || p.category,
                                gsm: p.gsm,
                                bf: p.bf,
                                shade: p.shade,
                                size: p.size || "-",
                                price: p.price_per_kg || p.price,
                              })
                            }
                            className="text-purple-600 hover:text-purple-800 font-semibold underline"
                          >
                            Enquiry
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={modalPage}
                  onPageChange={(page: number) => handleView({ ...filteredRows.find(r => r.sellerId === selectedSellerId)! }, page)}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Enquiry Modal */}
      <Dialog open={isEnquiryModalOpen} onOpenChange={setIsEnquiryModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-2xl p-0 overflow-hidden bg-gradient-to-b from-purple-50 to-white">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-white text-center">
              Enquiry Now
            </DialogTitle>
          </div>

          {selectedRow && (
            <form className="p-6 space-y-4" onSubmit={handleSubmitEnquiry}>
              <p className="text-black">
                <strong>Product:</strong> {selectedRow.productName}
              </p>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Name
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
                  Email
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
                  Mobile
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
                  Message
                </label>
                <textarea
                  name="message"
                  value={enquiryForm.message}
                  onChange={handleEnquiryChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white text-black"
                  placeholder="Write your enquiry..."
                  rows={3}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>



      <div className="mt-12">
        <ReadyToOrder />
        <PartnerWithUs isaboutpage />
        <FaqSection />
      </div>
    </>
  );
}
