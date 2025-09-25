"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Pagination from "@/components/pagination";
import { getCookie } from "@/components/getcookie"

type Deal = {
  id: number;
  deal_id?: string;
  contact_person?: string;
  mobile_no?: string;
  email_id?: string;
  product_description?: string;
  deal_size?: string;
  total_deal_amount?: string;
  balanced_deal_size?: string;
  created_on?: string;
  updated_on?: string;
  status?: number;
  deal_status?: number;
  user?: {
    name: string;
    email_address: string;
    phone_no: string;
  };
  buyerUser?: any;
};

export default function ClosedPdDealsPage() {
  const [search, setSearch] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) throw new Error("No token in cookies");

        const res = await fetch(
          `https://paper-deal-server.onrender.com/api/pd-deals-master/closedpddeals?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch deals");

        const data = await res.json();
        setDeals(data.data || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, [page, limit]);

  const filteredDeals = deals.filter((d) =>
    Object.values(d).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="m-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Closed Deals</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading deals...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 border">Sr. No.</th>
                  <th className="p-2 border">Deal ID</th>
                  <th className="p-2 border">PD Executive</th>
                  <th className="p-2 border">Mobile No</th>
                  <th className="p-2 border">Buyer</th>
                  <th className="p-2 border">Buyer No</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Deal Size</th>
                  <th className="p-2 border">Balanced Deal Size</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((d, index) => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{(page - 1) * limit + index + 1}</td>
                    <td className="p-2 border">{d.deal_id || "-"}</td>
                    <td className="p-2 border">{d.user?.name || "-"}</td>
                    <td className="p-2 border">{d.user?.phone_no || "-"}</td>
                    <td className="p-2 border">{d.buyerUser?.name || "-"}</td>
                    <td className="p-2 border">{d.buyerUser?.phone_no || "-"}</td>
                    <td className="p-2 border">{d.product_description || "-"}</td>
                    <td className="p-2 border">{d.deal_size || "-"}</td>
                    <td className="p-2 border">{d.balanced_deal_size || "-"}</td>
                    <td className="p-2 border">{d.total_deal_amount || "-"}</td>
                    <td className="p-2 border">
                      {new Date(d.created_on).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-white ${d.status === 1 ? "bg-green-500" : "bg-gray-500"
                          }`}
                      >
                        {d.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
}
