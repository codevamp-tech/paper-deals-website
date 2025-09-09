"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnquiryDetailPage() {
  const { id } = useParams(); // URL se enquiry ID milegi
  const [enquiry, setEnquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchEnquiry() {
      try {
        const res = await fetch(`http://localhost:5000/api/enquiry/${id}`);
        if (!res.ok) throw new Error("Failed to fetch enquiry");
        const json = await res.json();
        setEnquiry(json.data || null);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchEnquiry();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading enquiry...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!enquiry) return <p className="text-center py-10">Enquiry not found.</p>;

  return (
    <main className="container mx-auto px-4 py-10">
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-md"
      >
        Back
      </button>

      <Card>
        <CardHeader>
          <CardTitle>Enquiry Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>ID:</strong> {enquiry.id}</p>
          <p><strong>Buyer Name:</strong> {enquiry.buyer_name}</p>
          <p><strong>Email:</strong> {enquiry.email}</p>
          <p><strong>Phone:</strong> {enquiry.phone || "-"}</p>
          <p><strong>Message:</strong> {enquiry.message}</p>
          <p><strong>Date:</strong> {new Date(enquiry.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>
    </main>
  );
}
