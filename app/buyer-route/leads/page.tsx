"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Pagination from "@/components/pagination"
import { getUserFromToken } from "@/hooks/use-token"
import { useRouter } from "next/navigation"
import { getCookie } from "@/components/getcookie";

export default function LeadsPage() {
    const [data, setData] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const router = useRouter();
    const limit = 10
    const token = getCookie("token");
    const user = getUserFromToken();
    const userId = user?.user_id

    // fetch enquiries
    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/lead-sellers?page=${page}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                cache: "no-store",
            }
        )
            .then((res) => res.json())
            .then((res) => {
                console.log("API DATA:", res.messages);
                setData(res.messages || []);
                setTotalPages(res.totalPages || 1);
            });
    }, [page, userId]);

    // filtered
    const filtered = data.filter((row) =>
        row.product?.toLowerCase().includes(search.toLowerCase()) ||
        row.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.enquiry?.category?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="m-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4  p-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">My Leads</h2>
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
                    <table className="w-full border text-sm bg-white shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">ID</th>
                                <th className="border px-3 py-2">Buyer ID</th>
                                <th className="border px-3 py-2">Product</th>
                                <th className="border px-3 py-2">City</th>
                                <th className="border px-3 py-2">Shade</th>
                                <th className="border px-3 py-2">Gsm</th>
                                <th className="border px-3 py-2">Quantity</th>
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
                                    <td className="border px-3 py-2">
                                        {`KPDB_${row.enquiry?.buyer_id}`}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.product}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.enquiry?.city || "N/A"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.enquiry?.shade || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.enquiry?.gsm || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.enquiry?.quantity_in_kg || "-"} {row.enquiry?.quantity_unit || "kg"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.enquiry?.remarks || "-"}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {new Date(row.created_at).toLocaleString()}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {row.status === 0 && (
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                                                Pending
                                            </span>
                                        )}
                                        {row.status === 1 && (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                                Accepted
                                            </span>
                                        )}
                                        {row.status === 2 && (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                                                Lost / Rejected
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        className="border px-3 py-2 text-blue-600 cursor-pointer hover:underline"
                                        onClick={() =>
                                            router.push(`/buyer-route/leads/${row.id}`)
                                        }
                                    >
                                        View & Respond
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="border px-3 py-4 text-center text-gray-500">
                                        No leads found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                )}
            </div>
        </div>
    )
}
