"use client";

import { useRouter } from "next/navigation";
import { getCookie } from "@/components/getcookie";
import Pagination from "@/components/pagination";
import React, { useEffect, useState } from "react";
import TruncatedText from "@/components/ui/TruncatedText";
import { getUserFromToken } from "@/hooks/use-token";
import { Eye, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

type Requirement = {
  id: number;
  product_name: string;
  quantity: number;
  quantity_unit: string;
  phone_no: string;
  email: string;
  pincode: string;
  msg: string;
  status: number;
  created_at: string;
  Category?: Category;
};

export default function TellUsRequirementPage() {
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  
  // Dialog state for full message viewing
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);

  const token = getCookie("token");
  const user = getUserFromToken();

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!user?.user_id) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rquarment/user/${user.user_id}?page=${page}&limit=${entries}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch requirement records.");

        const result = await res.json();
        if (result.success) {
          setData(result.data || []);
          setTotalPages(result.pagination?.totalPages || 1);
        } else {
          throw new Error(result.message || "Failed to fetch requirements");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [page, entries, user?.user_id]);

  // Statistics calculation
  const stats = {
    total: data.length,
    pending: data.filter(item => item.status === 0).length,
    accepted: data.filter(item => item.status === 1).length,
    rejected: data.filter(item => item.status === 2).length,
  };

  // Search filter
  const filteredData = data.filter((item) => {
    const productName = item.product_name?.toLowerCase() || "";
    const categoryName = item.Category?.name?.toLowerCase() || "";
    const msgText = item.msg?.toLowerCase() || "";
    const query = search.toLowerCase();

    return (
      productName.includes(query) ||
      categoryName.includes(query) ||
      msgText.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 text-black">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-200/80">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            Tell Us Requirements
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage your submitted customized paper requirements
          </p>
        </div>
      </header>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Submitted", value: stats.total, color: "border-sky-200 bg-sky-50 text-sky-700", icon: FileText },
          { label: "Pending Approval", value: stats.pending, color: "border-amber-200 bg-amber-50 text-amber-700", icon: AlertCircle },
          { label: "Accepted Requests", value: stats.accepted, color: "border-green-200 bg-green-50 text-green-700", icon: CheckCircle2 },
          { label: "Rejected Requests", value: stats.rejected, color: "border-red-200 bg-red-50 text-red-700", icon: XCircle },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${stat.color}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-85">{stat.label}</p>
                <p className="text-2xl font-black mt-1">{stat.value}</p>
              </div>
              <Icon className="h-7 w-7 opacity-75" />
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Entries Selector */}
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              <option value={10}>10 Entries</option>
              <option value={25}>25 Entries</option>
              <option value={50}>50 Entries</option>
            </select>
          </div>

          {/* Premium Search */}
          <div className="relative flex-1 md:max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, category..."
              className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">🔍</span>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent"></div>
              <span className="text-gray-400 text-sm font-medium">Fetching requirements...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm font-medium">
              ❌ {error}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              No matching requirement submissions found.
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-semibold">
                  {["ID", "Product Name", "Category", "Quantity", "Pincode", "Phone", "Status", "Date", "Action"].map((head, index) => (
                    <th key={index} className="px-4 py-3.5 text-left font-medium first:rounded-l-lg last:rounded-r-lg">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-gray-600 font-mono">#{row.id}</td>
                    <td className="px-4 py-4 font-bold text-gray-800">{row.product_name}</td>
                    <td className="px-4 py-4 text-gray-600">
                      <span className="bg-sky-50 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-sky-100">
                        {row.Category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {row.quantity} <span className="text-gray-500 text-xs font-normal">{row.quantity_unit || "kg"}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 font-mono">{row.pincode}</td>
                    <td className="px-4 py-4 text-gray-600">{row.phone_no}</td>
                    <td className="px-4 py-4">
                      {row.status === 1 ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                        </span>
                      ) : row.status === 2 ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                          <XCircle className="h-3.5 w-3.5" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                          <AlertCircle className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {new Date(row.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedMsg(row.msg || "No details provided.")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-gray-700 hover:text-sky-600 border border-gray-200 shadow-sm transition-all hover:bg-sky-50 hover:border-sky-200"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Premium Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-8 flex justify-center border-t border-gray-50 pt-6">
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          </div>
        )}
      </div>

      {/* Modern Dialog/Modal for Reading Details */}
      {selectedMsg !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <h3 className="font-bold text-lg">Requirement Details</h3>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="text-white/80 hover:text-white text-2xl font-black focus:outline-none transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Submitted Message</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-800 text-sm whitespace-pre-wrap max-h-[50vh] overflow-y-auto leading-relaxed">
                {selectedMsg || "No details provided."}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-5 py-2 text-sm font-bold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
