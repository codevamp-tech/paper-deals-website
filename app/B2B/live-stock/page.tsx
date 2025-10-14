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

  const handleView = (row: Row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
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

  return (
    <>
      <main className="w-full min-h-screen bg-[#fafafa] px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="space-y-4 text-center py-8 sm:py-12 md:py-16 max-w-7xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#22d3ee] text-white">
            <span className="font-medium text-sm sm:text-base">Live Stock</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4">
            <span className="text-black">Paper & Packaging</span>{" "}
            <span className="text-gray-700">Market Watch</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-base px-4">
            Real-time styled view of major paper and packaging companies. Data
            comes directly from the server.
          </p>
        </section>

        {/* Table */}
        <section className="max-w-7xl mx-auto pb-8 sm:pb-12 md:pb-16">
          <Card
            className="w-full border-0  rounded-lg sm:rounded-xl overflow-hidden"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            <CardHeader className="flex flex-col gap-4 px-4 sm:px-6">
              {/* Search + Filter */}
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
              <div className="block lg:hidden px-4 pb-4 space-y-4">
                {loading ? (
                  <div className="py-8 text-center text-gray-500">
                    Loading stocks...
                  </div>
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
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            r.sellerType === "Manufacturer"
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
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-1 text-blue-600 font-medium">
                            {r.ProductNew?.seller?.organization?.city || "N/A"}
                          </span>
                        </div>
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
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1 text-amber-600">{r.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">WL:</span>
                          <span className="ml-1 text-cyan-600">{r.wl}</span>
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(r)}
                            className="p-2 hover:bg-gray-100 rounded-full text-blue-500 hover:text-blue-600"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEnquiry(r)}
                            className="text-purple-600 hover:text-purple-800 font-semibold text-sm underline px-2"
                          >
                            Enquiry
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block w-full overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[1400px]">
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
                        "Enquiry",
                      ].map((col) => (
                        <th
                          key={col}
                          onClick={() => handleSort(col)}
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
                          className={`${
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition-colors`}
                        >
                          <td className="py-3 px-3 xl:px-4 text-blue-600 font-medium">
                            {r.ProductNew?.seller?.organization?.city || "N/A"}
                          </td>
                          <td className="py-3 px-3 xl:px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                r.sellerType === "Manufacturer"
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
                          <td className="py-3 px-3 xl:px-4 text-amber-600">
                            {r.size}
                          </td>
                          <td className="py-3 px-3 xl:px-4 text-cyan-600">
                            {r.wl}
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
                          <td className="py-3 px-3 xl:px-4 font-bold text-violet-700">
                            <button
                              onClick={() => handleEnquiry(r)}
                              className="text-purple-600 hover:text-purple-800 font-semibold underline"
                            >
                              Enquiry now
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
      {/* View Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl shadow-2xl p-0 overflow-hidden bg-gradient-to-b from-purple-50 to-white">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-white text-center">
              Stock Details
            </DialogTitle>
          </div>

          {selectedRow && (
            <div className="p-6 space-y-4">
              {[
                { label: "Product", value: selectedRow.productName },
                { label: "Category", value: selectedRow.category },
                { label: "Sub Product", value: selectedRow.subProduct },
                { label: "BF", value: selectedRow.bf },
                { label: "GSM", value: selectedRow.gsm },
                { label: "Shade", value: selectedRow.shade },
                { label: "Size", value: selectedRow.size },
                { label: "WL", value: selectedRow.wl },
                { label: "Price Per Kg", value: selectedRow.pricePerKg },
                { label: "Spot Price", value: selectedRow.spotPrice },
                { label: "Quantity", value: selectedRow.quantity },
                { label: "Seller Type", value: selectedRow.sellerType },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
                >
                  <span className="text-sm font-medium text-gray-600">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enquiry Modal */}
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
            <form className="p-6 space-y-4">
              <p className="text-black">
                <strong>Product:</strong> {selectedRow.productName}
              </p>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Name
                </label>
                <Input
                  className="bg-white text-black border border-gray-300"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Email
                </label>
                <Input
                  type="email"
                  className="bg-white text-black border border-gray-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Mobile
                </label>
                <Input
                  type="tel"
                  className="bg-white text-black border border-gray-300"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Message
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white text-black"
                  placeholder="Write your enquiry..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition"
              >
                Submit Enquiry
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
