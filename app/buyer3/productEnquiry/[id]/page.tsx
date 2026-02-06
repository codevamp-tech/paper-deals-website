"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/components/getcookie";
import { Toast } from "@/components/ui/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ViewEnquiryPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<any>(null);
  const [status, setStatus] = useState<number>(0);
  const token = getCookie("token");
  const router = useRouter();

  // 🔹 Fetch enquiry
  useEffect(() => {
    if (!id) return;

    const fetchEnquiry = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/enquiry/getbyId/${id}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        console.log("ENQUIRY RESPONSE 👉", data);

        // ✅ CASE 1: API returns array
        if (Array.isArray(data) && data.length > 0) {
          setRow(data[0]);
          setStatus(data[0].status);
          return;
        }

        // ✅ CASE 2: API returns object directly
        if (data && data.id) {
          setRow(data);
          setStatus(data.status);
          return;
        }

        // ❌ No valid data
        setRow(null);
      } catch (err) {
        console.error("Failed to fetch enquiry", err);
        setRow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiry();
  }, [id]);


  const handleUpdate = () => {
    fetch(`http://localhost:5000/api/enquiry/enquiries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(() => {
        setRow((prev: any) => ({ ...prev, status }))
        Toast({ title: "Status updated successfully!" })
        router.push('/buyer3/productEnquiry')
      })
      .catch(err => console.error(err))
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!row) return <p className="p-6">No enquiry found</p>;

  const enquiry = row.enquiry;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">View Enquiry</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">Buyer</label>
            <Input value={row.buyer?.id ? `KPDB_${row.buyer.id}` : "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <Input value={row.company_name || "N/A"} disabled />

          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input value={row.city || "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input value={row.category?.name || "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <Input value={
              row.product ||
              row.productDetails?.product_name ||
              "N/A"
            }
              disabled />
          </div>

          {/* Shade */}
          <div>
            <label className="block text-sm font-medium mb-1">Shade</label>
            <Input value={row.shade ? String(row.shade) : "-"} disabled />
          </div>

          {/* GSM */}
          <div>
            <label className="block text-sm font-medium mb-1">GSM</label>
            <Input value={row.gsm ? String(row.gsm) : "-"} disabled />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <Input value={row.size ? String(row.size) : "-"} disabled />
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <Input value={row.remarks || "-"} disabled />
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center gap-4">
          <div className="w-64">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
            >
              <option value={0}>Pending</option>
              <option value={1}>Accepted</option>
              <option value={2}>Rejected</option>
            </select>
          </div>

          <button
            onClick={handleUpdate}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
