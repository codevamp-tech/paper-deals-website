"use client";

import { useState, useMemo } from "react";
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
  bf: string | number;
  gsm: string;
  shade: string;
  size: string;
  wl: string;
  pricePerKg: string;
  quantity: string;
};

const INITIAL: Row[] = [
  {
    location: "kailashi devi , kashipur",
    sellerType: "Manufacturer",
    category: "Duplex Board",
    productName: "SIGMA",
    bf: "0",
    gsm: "425 GSM",
    shade: "",
    size: "22X44",
    wl: "22X44",
    pricePerKg: "35.32 ₹",
    quantity: "1547.1",
  },
  {
    location: "NEW DELHI",
    sellerType: "Distributor",
    category: "Duplex Board",
    productName: "LWC",
    bf: "0",
    gsm: "230",
    shade: "",
    size: "",
    wl: "",
    pricePerKg: "36.6 ₹",
    quantity: "36",
  },
  {
    location: "NEW DELHI",
    sellerType: "Distributor",
    category: "Duplex Board",
    productName: "G.B.",
    bf: "0",
    gsm: "230",
    shade: "",
    size: "",
    wl: "",
    pricePerKg: "38.93 ₹",
    quantity: "38",
  },
  {
    location: "kailashi devi , kashipur",
    sellerType: "Manufacturer",
    category: "Duplex Board",
    productName: "SIGMA",
    bf: "0",
    gsm: "400 GSM",
    shade: "",
    size: "61.3X89",
    wl: "61.3X89",
    pricePerKg: "0 ₹",
    quantity: "7850",
  },
];

export default function LiveStockPage() {
  const [rows] = useState<Row[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Row;
    direction: "asc" | "desc";
  } | null>(null);

  // Filtering & sorting logic
  const filteredRows = useMemo(() => {
    let data = [...rows];

    // search
    if (search) {
      data = data.filter((r) =>
        Object.values(r).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // filter by seller type
    if (filter !== "all") {
      data = data.filter((r) => r.sellerType === filter);
    }

    // sorting
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
            is simulated and updates every few seconds.
          </p>
        </section>

        {/* Table with search/filter/sort */}
        <section className="mt-10">
          <Card className="bg-white shadow-sm border border-gray-200 rounded-xl relative">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 px-4">
              {/* Search + Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="flex items-center w-full sm:w-[300px] md:w-[400px] lg:w-[500px] relative ">
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

                {/* Filter */}
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

            <CardTitle className="text-lg font-semibold text-gray-900 px-4 absolute bottom-[45vh]">
              Market Overview
            </CardTitle>

            <CardContent className="overflow-x-auto">
              <div className="min-w-full overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-600 text-left border-b border-gray-200">
                      {[
                        "location",
                        "sellerType",
                        "category",
                        "productName",
                        "bf",
                        "gsm",
                        "shade",
                        "size",
                        "wl",
                        "pricePerKg",
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
                    {filteredRows.map((r, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="py-3 px-4 text-gray-800 whitespace-nowrap">
                          {r.location}
                        </td>
                        <td className="py-3 px-4 text-gray-800 whitespace-nowrap">
                          {r.sellerType}
                        </td>
                        <td className="py-3 px-4 text-gray-800 whitespace-nowrap">
                          {r.category}
                        </td>
                        <td className="py-3 px-4 text-gray-800 whitespace-nowrap">
                          {r.productName}
                        </td>
                        <td className="py-3 px-4 text-gray-800">{r.bf}</td>
                        <td className="py-3 px-4 text-gray-800">{r.gsm}</td>
                        <td className="py-3 px-4 text-gray-800">{r.shade}</td>
                        <td className="py-3 px-4 text-gray-800">{r.size}</td>
                        <td className="py-3 px-4 text-gray-800">{r.wl}</td>
                        <td className="py-3 px-4 text-gray-800">
                          {r.pricePerKg}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {r.quantity}
                        </td>
                      </tr>
                    ))}
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
