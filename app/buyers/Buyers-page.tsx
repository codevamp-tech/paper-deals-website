"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const buyersPerPage = 5;

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/getBuyer`
        );
        const data = await res.json();
        console.log("API Response:", data);

        if (data && Array.isArray(data.data)) {
          setBuyers(data.data);
        } else {
          setBuyers([]);
        }
      } catch (err) {
        console.error("Error fetching buyers:", err);
        setBuyers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastBuyer = currentPage * buyersPerPage;
  const indexOfFirstBuyer = indexOfLastBuyer - buyersPerPage;
  const currentBuyers = buyers.slice(indexOfFirstBuyer, indexOfLastBuyer);
  const totalPages = Math.ceil(buyers.length / buyersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6 max-w-6xl mx-auto">
        {currentBuyers.map((buyer) => {
          const org = buyer.organization;

          return (
            <Card
              key={buyer.id}
              className="flex items-start gap-6 p-6 shadow-md border border-gray-200 bg-white rounded-lg"
            >
              {/* Left Image */}
              <div className="w-40 h-40 bg-gray-100 border flex items-center justify-center">
                {org?.image_banner ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${org.image_banner}`}
                    alt={org.organizations || "Company Logo"}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              {/* Right Content */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {org?.organizations || buyer.name}
                  </h2>
                  <Badge
                    className={`px-3 py-1 rounded-full ${
                      org?.verified
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {org?.verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-800">
                  <p>
                    <span className="font-semibold">Contact Person:</span>{" "}
                    {org?.contact_person || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span>{" "}
                    {org?.city || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">District:</span>{" "}
                    {org?.district || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">State:</span>{" "}
                    {org?.state || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {buyer.email_address}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {buyer.phone_no}
                  </p>
                  <p>
                    <span className="font-semibold">Materials Used:</span>{" "}
                    {org?.materials_used || "N/A"}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-3">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-md"
                   onClick={() => router.push(`/buyers/profile/${buyer.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Pagination Controls */}
        {buyers.length > buyersPerPage && (
          <div className="flex justify-center gap-3 mt-6">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
