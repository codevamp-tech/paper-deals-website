"use client";

import { useRouter } from "next/navigation";
import { getCookie } from "@/components/getcookie";
import Pagination from "@/components/pagination";
import React, { useEffect, useState } from "react";
import TruncatedText from "@/components/ui/TruncatedText";

export default function EnquiryShow() {
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const token = getCookie("token");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/enquiries?page=${page}&limit=${entries}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch enquiries");

        const result = await res.json();

        setData(result.data || result.enquiries || []);

        if (result.totalPages) setTotalPages(result.totalPages);
        else if (result.totalCount)
          setTotalPages(Math.ceil(result.totalCount / entries));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, entries]);

  // ✅ Handle View Deal
  const handleViewDeal = async (enquiryId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/by-enquiry/${enquiryId}`
      );
      const result = await res.json();
      if (result.success && result.deal) {
        router.push(`/buyer3/DirectSingleOrder/${result.deal.id}`);
      } else {
        console.warn("No deal found for this enquiry or logic pending.");
      }
    } catch (error) {
      console.error("Error fetching deal:", error);
    }
  };

  // ✅ Search filter
  const filteredData = data.filter((item) => {
    const buyerName = item.buyer?.name?.toLowerCase() || "";
    const city = item.city?.toLowerCase() || "";
    const category = item.category?.name?.toLowerCase() || "";
    const product = item.product?.toLowerCase() || "";
    return (
      buyerName.includes(search.toLowerCase()) ||
      city.includes(search.toLowerCase()) ||
      category.includes(search.toLowerCase()) ||
      product.includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Enquiry Show</h1>
      </header>

      <div className=" p-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3 md:gap-4">
          {/* Entries Select */}
          <div className="flex items-center gap-2 text-sm">
            Show
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1 bg-white text-black text-xs md:text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>

          {/* Search */}
          <div className="text-sm flex items-center gap-2 bg-white text-black">
            Search:
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border rounded px-2 py-1 bg-white text-black w-32 md:w-40 text-xs md:text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              Loading enquiries...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-sm">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No enquiries found.
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "ID",
                    "Seller ID",
                    "Buyer",
                    "Phone",
                    "City",
                    "Category",
                    "Product",
                    "GSM",
                    "Shade",
                    "Quantity (Kg)",
                    "Remarks",
                    "Created At",
                    "Status",
                    "Action",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="border px-3 py-2 text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{row.id}</td>

                    {/* ✅ Seller ID formatted */}
                    <td className="border px-3 py-2">
                      {row.saller ? `KPDS_${row.saller.id}` : "—"}
                    </td>

                    {/* ✅ Buyer name */}
                    <td className="border px-3 py-2">
                      {row.buyer?.name || "—"}
                    </td>

                    <td className="border px-3 py-2">{row.phone}</td>
                    <td className="border px-3 py-2">{row.city}</td>

                    {/* ✅ Category name */}
                    <td className="border px-3 py-2">
                      {row.category?.name || "—"}
                    </td>

                    <td className="border px-3 py-2">{row.product}</td>
                    <td className="border px-3 py-2">{row.gsm}</td>
                    <td className="border px-3 py-2">{row.shade}</td>
                    <td className="border px-3 py-2">
                      {row.quantity_in_kg || "—"}
                    </td>
                    <td className="border px-3 py-2">
                      <TruncatedText text={row.remarks} limit={20} />
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(row.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="border px-3 py-2">
                      {row.status === 1 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Accepted
                        </span>
                      ) : row.status === 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      ) : row.status === 2 ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          Unknown
                        </span>
                      )}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleViewDeal(row.id)}
                        disabled={row.status === 0 || row.status === 2}
                        className={`px-3 py-1 rounded text-xs transition ${row.status === 0 || row.status === 2
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
}
