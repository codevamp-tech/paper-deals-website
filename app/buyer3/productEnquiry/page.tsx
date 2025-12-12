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

  // fetch enquiries
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/getBuyerEnquiries?user_id=${userId}&page=${page}&limit=${limit}`,
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
      .then((d) => {
        setData(d.enquiries || []);
        setTotalPages(d.totalPages || 1);
      })
      .catch((err) => console.error(err));
  }, [page, userId]);


  // update enquiry
  const handleUpdate = async () => {
    if (!selected) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/enquiries/${selected.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update enquiry");

      // Update UI instantly
      setData(prev =>
        prev.map(item =>
          item.id === selected.id ? { ...item, status } : item
        )
      );

      setSelected(null); // close modal
    } catch (err) {
      console.error(err);
    }
  };


  // filtered
  const filtered = data.filter(
    (row) =>
      row.buyer?.name?.toLowerCase().includes(search.toLowerCase()) || // ✅ check buyer name
      (row.phone && row.phone.toString().includes(search)) ||
      row.city?.toLowerCase().includes(search.toLowerCase())
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
                {isSellerView && (
                  <th className="border px-3 py-2">Seller Id</th>
                )}
                <th className="border px-3 py-2">Buyer</th>
                {isSellerView && (
                  <th className="border px-3 py-2">Phone</th>
                )}
                <th className="border px-3 py-2">City</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Gsm</th>
                <th className="border px-3 py-2">Shade</th>
                <th className="border px-3 py-2">Quantity (Kg)</th>
                <th className="border px-3 py-2">Remarks</th>
                <th className="border px-3 py-2">Created At</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{row.id}</td>
                  {isSellerView && (
                    <td className="border px-3 py-2">KPDS_{row.user_id}</td>
                  )}
                  <td className="border px-3 py-2">
                    {isSellerView
                      ? row.buyer?.name || "N/A"
                      : `KPDB_${row.buyer_id}`}
                  </td>
                  {isSellerView && (
                    <td className="border px-3 py-2">{row.phone}</td>
                  )}
                  <td className="border px-3 py-2">{row.city}</td>
                  <td className="border px-3 py-2">{row.category?.name}</td>
                  <td className="border px-3 py-2">{row.product}</td>
                  <td className="border px-3 py-2">{row.gsm}</td>
                  <td className="border px-3 py-2">{row.shade}</td>
                  <td className="border px-3 py-2">{row.quantity_in_kg}</td>
                  <td className="border px-3 py-2">{row.remarks}</td>
                  <td className="border px-3 py-2">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="border px-3 py-2">
                    {row.status === 1 && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Completed
                      </span>
                    )}
                    {row.status === 0 && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                        Pending
                      </span>
                    )}
                    {row.status === 2 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td
                    className="border px-3 py-2 text-blue-600 cursor-pointer"
                    onClick={() => {
                      setSelected(row);
                      setStatus(row.status); // load current status into modal
                    }}
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

      {/* Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg rounded-xl shadow-xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Enquiry Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 text-sm mt-2">

              {/* GRID SECTION */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">City</p>
                  <p className="font-medium">{selected.city}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Category</p>
                  <p className="font-medium">{selected.category?.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Product</p>
                  <p className="font-medium">{selected.product}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">GSM</p>
                  <p className="font-medium">{selected.gsm}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Shade</p>
                  <p className="font-medium">{selected.shade}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Quantity (Kg)</p>
                  <p className="font-medium">{selected.quantity_in_kg}</p>
                </div>
              </div>

              {/* REMARKS */}
              <div>
                <p className="text-gray-500 text-xs">Remarks</p>
                <p className="font-medium whitespace-pre-wrap">
                  {selected.remarks || "—"}
                </p>
              </div>

              {/* STATUS UPDATE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={1}>Completed</option>
                  <option value={0}>Pending</option>
                  <option value={2}>Rejected</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleUpdate}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}
