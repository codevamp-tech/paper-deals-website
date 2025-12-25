"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ViewEnquiryPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<any>(null);
  const [status, setStatus] = useState<number>(0);

  // 🔹 Fetch enquiry
  useEffect(() => {
    if (!id) return;

    const fetchEnquiry = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/enquiry/enquiry-seller/${id}`,
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


  // 🔹 Update status
  const updateStatus = async () => {
    try {
      await fetch(`${API_URL}/api/enquiry/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

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
            <Input value={`KPDB_${enquiry?.buyer?.id || "N/A"}`} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <Input value={enquiry?.company_name || "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input value={enquiry?.city || "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input value={enquiry?.category?.name || "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <Input value={row.product || "N/A"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shade</label>
            <Input value={enquiry?.shade || "-"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GSM</label>
            <Input value={enquiry?.gsm || "-"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <Input value={enquiry?.size || "-"} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <Input value={enquiry?.remarks || "-"} disabled />
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
            onClick={updateStatus}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
