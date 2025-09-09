"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";

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

  // 🔹 Fetch API
  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        setError(null);

        const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/live-stocks/view-live-stockes`;

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

  // 🔹 Filtering & sorting logic
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
      <main className="container mx-auto px-4 py-16 bg-[#fafafa]">
        {/* Hero */}
        <section className="space-y-3 text-center">
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
        <section className="mt-10">
          <Card className="bg-white shadow-sm border border-gray-200 rounded-xl relative">
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

            <CardContent className="overflow-x-auto">
              <div className="min-w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm border-collapse">
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
                        <td colSpan={13} className="py-6 text-center text-gray-500">
                          Loading stocks...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={13} className="py-6 text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-6 text-center text-gray-500">
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
                          <td className="py-3 px-4 text-blue-600 font-medium">{r.location}</td>
                          <td className="py-3 px-4">
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
                          <td className="py-3 px-4 text-orange-600">{r.category}</td>
                          <td className="py-3 px-4 text-indigo-600 font-semibold">{r.productName}</td>
                          <td className="py-3 px-4 text-indigo-500">{r.subProduct}</td>
                          <td className="py-3 px-4 text-pink-600">{r.bf}</td>
                          <td className="py-3 px-4 text-teal-600">{r.gsm}</td>
                          <td className="py-3 px-4 text-purple-600">{r.shade}</td>
                          <td className="py-3 px-4 text-amber-600">{r.size}</td>
                          <td className="py-3 px-4 text-cyan-600">{r.wl}</td>
                          <td className="py-3 px-4 font-bold text-red-600">{r.pricePerKg}</td>
                          <td className="py-3 px-4 font-bold text-red-500">{r.spotPrice}</td>
                          <td className="py-3 px-4 font-bold text-violet-700">{r.quantity}</td>
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

      <div className="mt-12">
        <ReadyToOrder />
        <PartnerWithUs isaboutpage />
        <FaqSection />
      </div>
    </>
  );
}
