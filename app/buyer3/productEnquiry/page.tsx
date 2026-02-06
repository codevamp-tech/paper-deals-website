"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Pagination from "@/components/pagination"
import { getUserFromToken } from "@/hooks/use-token"
import { useRouter } from "next/navigation"
import { getCookie } from "@/components/getcookie"

export default function EnquiryPage() {
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<any | null>(null)
  const [status, setStatus] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter();
  const limit = 10
  const token = getCookie("token");
  const user = getUserFromToken();
  const userRole = user?.user_role;
  const isSellerView = userRole === 1 || userRole === 4
  const userId = user?.user_id
  console.log("userid??>>", userId);

  // fetch enquiries
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/getBuyerEnquiries?user_id=${userId}&page=${page}&limit=${limit}`
      ,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("API DATA:", res.enquiries);
        setData(res.enquiries || []);
        setTotalPages(res.totalPages || 1);
      });
  }, [page, userId]);

  // filtered
  const filtered = data.filter((row) =>
    row.product?.toLowerCase().includes(search.toLowerCase()) ||
    row.city?.toLowerCase().includes(search.toLowerCase()) ||
    String(row.buyer_id)?.includes(search)
  );



  return (
    <div className="m-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4  p-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Enquiry Show</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 md:mt-0 w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Buyer ID</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">City</th>
                {/* <th className="border px-3 py-2">Category</th> */}
                <th className="border px-3 py-2">Shade</th>
                <th className="border px-3 py-2">Gsm</th>
                <th className="border px-3 py-2">Remarks</th>
                <th className="border px-3 py-2">Created At</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {/* 1️⃣ ID */}
                  <td className="border px-3 py-2">{row.id}</td>

                  {/* 2️⃣ Buyer ID */}
                  <td className="border px-3 py-2">
                    {row.buyer_id ? `KPDB_${row.buyer_id}` : "-"}
                  </td>


                  {/* 3️⃣ Product */}
                  <td className="border px-3 py-2">
                    {row.productDetails?.product_name || "-"}
                  </td>

                  {/* 4️⃣ City */}
                  <td className="border px-3 py-2">
                    {row.city || "-"}
                  </td>

                  {/* 5️⃣ Shade */}
                  <td className="border px-3 py-2">
                    {row.shade || "-"}
                  </td>

                  {/* 6️⃣ GSM */}
                  <td className="border px-3 py-2">
                    {row.gsm || "-"}
                  </td>

                  {/* 7️⃣ Remarks */}
                  <td className="border px-3 py-2">
                    {row.remarks || "-"}
                  </td>

                  {/* 8️⃣ Created At */}
                  <td className="border px-3 py-2">
                    {new Date(row.created_at).toLocaleDateString("en-IN")}
                  </td>

                  {/* 9️⃣ Status */}
                  <td className="border px-3 py-2">
                    {row.status === 0 && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    )}
                    {row.status === 1 && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Completed
                      </span>
                    )}
                    {row.status === 2 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* 🔟 Action */}
                  <td
                    className="border px-3 py-2 text-blue-600 cursor-pointer"
                    onClick={() =>
                      router.push(`/buyer3/productEnquiry/${row.id}`)
                    }
                  >
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  )
}
