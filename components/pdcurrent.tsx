"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { getCookie } from "@/components/getcookie"
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";


type Deal = {
  id: number;
  deal_id: string;
  pdExecutive: string;
  mobile_no: string;
  buyer: string;
  buyerNo: string;
  seller: string;
  sellerNo: string;
  product_description: string;
  category: string;
  price_per_kg: number;
  quantity_in_kg: number;
  total_amount: number;
  commission: number;
  buyer_commission: number;
  seller_commission: number;
  remarks: string;
  created_on: string;
  status: number;
};

export default function CurrentPaperDealPage() {
  const [search, setSearch] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  
  const router = useRouter();

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie("token");

        if (!token) throw new Error("No token in cookies");

        const res = await fetch(
          `https://paper-deal-server.onrender.com/api/pd-deals/?page=${page}&limit=10`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const mappedDeals = data.data.map((d: any) => ({
          id: d.id,
          deal_id: d.deal_id,
          pdExecutive: d.user?.name || "N/A",
          mobile_no: d.user?.phone_no || "N/A",
          buyer: d.buyerUser?.name || "N/A",
          buyerNo: d.buyerUser?.phone_no || "N/A",
          seller: d.sellerUser?.name || "N/A",
          sellerNo: d.sellerUser?.phone_no || "N/A",
          product_description: d.product_description || "",
          category: d.categoryInfo?.name || "Not Found",
          price_per_kg: Number(d.price_per_kg || 0),
          quantity_in_kg: Number(d.quantity_in_kg || 0),
          total_amount: Number(d.deal_amount || 0),
          commission: Number(d.commission || 0),
          buyer_commission: Number(d.buyer_commission || 0),
          seller_commission: Number(d.seller_commission || 0),
          remarks: d.remarks || "",
          created_on: d.created_on,
          status: d.status,
        }));

        setDeals(mappedDeals);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [page]);

  const filteredDeals = deals.filter((d) =>
    Object.values(d).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleEdit = (id: number) => {
    router.push(`/admin/pddeal/current/${id}`);
  };

  return (
    <div className="m-6">
      <div className="flex justify-between items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">Current Deals</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
        </div>
      </div>

      <div>
        {loading && <p className="text-center py-4">Loading deals...</p>}
        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm border table-auto">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="border-b">
                    <th className="p-2 border">Sr. NO.</th>
                    <th className="p-2 border">Deal ID</th>
                    <th className="p-2 border">PD Executive</th>
                    <th className="p-2 border">Mobile</th>

                    {/* Show only for role 2 */}
                    
                      <>
                        <th className="p-2 border">Product Description</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Price in Kg</th>
                        <th className="p-2 border">Quantity in Kg</th>
                        <th className="p-2 border">Total Amount</th>
                      </>
                    

                    {/* Show extra for role 4 */}
                    
                      <>
                        <th className="p-2 border">Buyer</th>
                        <th className="p-2 border">Buyer No</th>
                        <th className="p-2 border">Seller</th>
                        <th className="p-2 border">Seller No</th>
                        <th className="p-2 border">Commission</th>
                        <th className="p-2 border">Buyer Commission</th>
                        <th className="p-2 border">Seller Commission</th>
                        <th className="p-2 border">Remarks</th>
                      </>
                    

                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Status</th>
                    
                      <th className="p-2 border">Action</th>
                    
                  </tr>
                </thead>

                <tbody>
                  {filteredDeals.length > 0 ? (
                    filteredDeals.map((d, index) => (
                      <tr key={d.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 border">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="p-2 border">{d.deal_id}</td>
                        <td className="p-2 border">{d.pdExecutive}</td>
                        <td className="p-2 border">{d.mobile_no}</td>

                        
                          <>
                            <td className="p-2 border">
                              {d.product_description}
                            </td>
                            <td className="p-2 border">{d.category}</td>
                            <td className="p-2 border">{d.price_per_kg}</td>
                            <td className="p-2 border">{d.quantity_in_kg}</td>
                            <td className="p-2 border">{d.total_amount}</td>
                          </>
                        

                        
                          <>
                            <td className="p-2 border">{d.buyer}</td>
                            <td className="p-2 border">{d.buyerNo}</td>
                            <td className="p-2 border">{d.seller}</td>
                            <td className="p-2 border">{d.sellerNo}</td>
                            <td className="p-2 border">{d.commission}</td>
                            <td className="p-2 border">{d.buyer_commission}</td>
                            <td className="p-2 border">{d.seller_commission}</td>
                            <td className="p-2 border">{d.remarks}</td>
                          </>
                        

                        <td className="p-2 border">
                          {new Date(d.created_on).toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          {d.status === 1 ? (
                            <span className="px-2 py-1 text-white bg-green-500 rounded">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-white bg-red-500 rounded">
                              Inactive
                            </span>
                          )}
                        </td>
                        
                          <td className="border p-2 text-center">
                            <button
                              onClick={() => handleEdit(d.deal_id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </td>
                        

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={20}
                        className="text-center p-4 text-gray-500"
                      >
                        No deals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(p) => setPage(p)}
            />
          </>
        
      </div>
    </div>
  );
}
