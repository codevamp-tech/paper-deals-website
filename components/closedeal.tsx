"use client";

import Pagination from "@/components/pagination";
import { getCookie } from "@/components/getcookie";

import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Deal = {
  id: number;
  deal_id: string;
  buyer_id: string;
  seller_id: string;
  product_description: string;
  price_per_kg: number;
  quantity_in_kg: number;
  deal_amount: number;
  remarks: string;
  created_on: string;
  buyerUser?: { name: string };
  sellerUser?: { name: string };
};

export default function CloseDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getCookie("token");
  console.log("token", token);

  // Fetch deals API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/closed?page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.success) {
          setDeals(data.deals || []);
          setTotalPages(data.pagination?.pages || 1);
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [page]);

  // Search filter
  const filteredDeals = deals.filter((deal) =>
    Object.values(deal).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sorting
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof Deal];
    const bValue = b[sortField as keyof Deal];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    const aStr = aValue?.toString().toLowerCase() || "";
    const bStr = bValue?.toString().toLowerCase() || "";

    return sortDirection === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/buyer3/DirectSingleOrder/${id}`);
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Closed  Deals</h2>
      <div>
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white min-w-[800px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="p-2 border text-left cursor-pointer"
                      onClick={() => handleSort("deal_id")}
                    >
                      Deal ID
                    </th>

                    {/* 👇 Conditional Columns */}

                    <th className="p-2 border">Buyer ID</th>

                    <>
                      <th className="p-2 border">Buyer Name</th>
                      <th className="p-2 border">
                        Seller Name
                      </th>
                    </>

                    <th className="p-2 border">
                      Product Description
                    </th>
                    <th className="p-2 border">Price in Kg</th>
                    <th className="p-2 border">
                      Quantity in Kg
                    </th>
                    <th className="p-2 border">Total Amount</th>
                    <th className="p-2 border">Remarks</th>
                    <th className="p-2 border">Date</th>

                    <>
                      <th className="p-2 border">Action</th>
                    </>
                  </tr>
                </thead>
                <tbody>
                  {sortedDeals.map((deal, index) => (
                    <tr
                      key={deal.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-2 border ">
                        {deal.deal_id}
                      </td>

                      {/* 👇 Conditional Cells */}

                      <td className="p-2 border ">
                        KPDB_{deal.buyer_id}
                      </td>

                      <>
                        <td className="p-2 border ">
                          {deal.buyerUser?.name || "Unknown"}
                        </td>
                        <td className="p-2 border ">
                          {deal.sellerUser?.name || "Unknown"}
                        </td>
                      </>

                      <td className="p-2 border ">
                        {deal.product_description}
                      </td>
                      <td className="p-2 border ">
                        {deal.price_per_kg}
                      </td>
                      <td className="p-2 border ">
                        {deal.quantity_in_kg?.toLocaleString()}
                      </td>
                      <td className="p-2 border ">
                        {deal.deal_amount?.toLocaleString()}
                      </td>
                      <td className="p-2 border ">
                        {deal.remarks}
                      </td>
                      <td className="p-2 border ">
                        {new Date(deal.created_on).toLocaleString()}
                      </td>

                      <>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleEdit(deal.deal_id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedDeals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No deals found matching your search criteria.
              </div>
            )}

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
}
