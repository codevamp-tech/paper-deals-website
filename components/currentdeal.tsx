"use client"
import Pagination from "@/components/pagination"
import { getCookie } from "@/components/getcookie"
import { Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

type Deal = {
  dealId: number
  buyerId: number
  sellerId: number
  buyerName: string
  sellerName: string
  productDescription: string | null
  pricePerKg: number | string
  quantityInKg: number | string
  totalAmount: number | string | null
  remarks: string | null
  date: string | null
  status: string
}

const DealsTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const token = getCookie("token")

  // Fetch deals with pagination
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `http://localhost:5000/api/dashboard/current?page=${currentPage}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        )
        if (!res.ok) throw new Error("Failed to fetch deals")
        const data = await res.json()

        const mappedDeals: Deal[] = (data.deals || []).map((d: any) => ({
          dealId: d.deal_id,
          buyerId: d.buyer_id,
          sellerId: d.seller_id,
          buyerName: d.buyerUser?.name || "-",
          sellerName: d.sellerUser?.name || "-",
          productDescription: d.product_description,
          pricePerKg: d.price_per_kg,
          quantityInKg: d.quantity_in_kg,
          totalAmount: d.deal_amount,
          remarks: d.remarks,
          date: d.created_on,
          status: d.deal_status === 7 ? "Closed" : "Active",
        }))

        setDeals(mappedDeals)
        setPagination(data.pagination)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [currentPage, token])

  const handleEdit = (id: number) => {
    router.push(`/admin/directorder/${id}`)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Current Deals</h2>

      <table className="w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Deal ID</th>
            <th className="border p-2">Buyer Id</th>
            <th className="border p-2">Buyer Name</th>
            <th className="border p-2">Seller Name</th>
            <th className="border p-2">Product Description</th>
            <th className="border p-2">Price in Kg</th>
            <th className="border p-2">Quantity in Kg</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Remarks</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {deals.length > 0 ? (
            deals.map((deal) => (
              <tr key={deal.dealId} className="bg-white">
                <td className="border p-2">{deal.dealId}</td>
                <td className="border p-2">KPDB_{deal.buyerId}</td>
                <td className="border p-2">{deal.buyerName}</td>
                <td className="border p-2">{deal.sellerName}</td>
                <td className="border p-2">{deal.productDescription || "-"}</td>
                <td className="border p-2">{deal.pricePerKg}</td>
                <td className="border p-2">{deal.quantityInKg}</td>
                <td className="border p-2">{deal.totalAmount || "-"}</td>
                <td className="border p-2">{deal.remarks || "-"}</td>
                <td className="border p-2">
                  {deal.date ? new Date(deal.date).toLocaleDateString() : "-"}
                </td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      deal.status === "Closed" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {deal.status}
                  </span>
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(deal.dealId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white">
              <td colSpan={11} className="text-center p-4">
                No deals found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          totalPages={pagination.pages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}

export default DealsTable
