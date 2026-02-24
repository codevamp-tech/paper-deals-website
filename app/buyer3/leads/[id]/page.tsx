"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getCookie } from "@/components/getcookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ViewLeadPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [row, setRow] = useState<any>(null);
    const [status, setStatus] = useState<number>(0);
    const router = useRouter();

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

    if (loading) return <p className="p-6">Loading...</p>;
    if (!row) return <p className="p-6">No lead found</p>;

    const enquiry = row.enquiry;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-semibold mb-4">View Lead</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">Buyer</label>
                        <Input value={`KPDB_${enquiry?.buyer?.id || "N/A"}`} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <Input value={enquiry?.company_name || "N/A"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <Input value={enquiry?.city || "N/A"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Input value={enquiry?.category?.name || "N/A"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <Input value={row.product || "N/A"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Shade</label>
                        <Input value={enquiry?.shade || "-"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">GSM</label>
                        <Input value={enquiry?.gsm || "-"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Size</label>
                        <Input value={enquiry?.size || "-"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity/Stock</label>
                        <Input value={enquiry?.quantity_in_kg || enquiry?.stock_in_kg || "-"} disabled className="bg-gray-50 text-gray-700" />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium mb-1">Remarks</label>
                        <Input value={enquiry?.remarks || "-"} disabled className="bg-gray-50 text-gray-700" />
                    </div>
                </div>

                {/* Status */}
                <div className="mt-8 pt-6 flex items-center justify-between border-t border-gray-100 gap-4">
                    <div className="w-64">
                        <label className="block text-sm font-medium mb-1">Lead Status</label>
                        <Input
                            value={status === 0 ? "Pending Action" : status === 1 ? "Accepted / Won" : "Rejected/Lost"}
                            disabled
                            className="bg-gray-100 font-semibold"
                        />
                    </div>

                    <div className="flex gap-4">
                        {status !== 0 && (
                            <button
                                onClick={() => router.push('/buyer3/leads')}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Go Back
                            </button>
                        )}

                        {status === 0 && (
                            <button
                                onClick={async () => {
                                    try {
                                        const token = getCookie("token");
                                        const res = await fetch(`${API_URL}/api/enquiry/${enquiry.id}/accept`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                            }
                                        });

                                        const data = await res.json();
                                        if (data.success) {
                                            toast.success(data.message);
                                            setStatus(1);
                                            const redirectUrl = data.dealId ? `/buyer3/product-order/${data.dealId}` : '/buyer3/leads';
                                            setTimeout(() => router.push(redirectUrl), 2000);
                                        } else {
                                            toast.error(data.message || "Failed to accept deal");
                                            setStatus(2); // E.g., if already accepted
                                            setTimeout(() => router.push('/buyer3/leads'), 2000);
                                        }

                                    } catch (error) {
                                        console.error("Deal accept failed", error);
                                        toast.error("An error occurred");
                                    }
                                }}
                                className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 font-medium transition shadow-sm"
                            >
                                Accept Deal
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
