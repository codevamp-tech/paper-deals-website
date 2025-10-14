"use client";

import { getUserFromToken } from "@/hooks/use-token";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const B2cOrder = () => {
  const [activeTab, setActiveTab] = useState("tracking");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();
  const buyerId = user?.user_id;

  // ✅ Fetch buyer deals/orders dynamically
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/buyer/${buyerId}`
        );
        if (!res.ok) throw new Error("Failed to fetch buyer data");
        const data = await res.json();
        setOrders(data.data || []); // <-- ✅ your API returns `data: [...]`
      } catch (err) {
        console.error("Error fetching buyer data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) fetchOrders();
  }, [buyerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading buyer data...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row flex-1 rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Main content */}
        <main className="w-full md:flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === "tracking" && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                Order Tracking
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-center">No deals found.</p>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ✅ Reusable Order Card component
// ✅ Reusable Order Card component
// ✅ Reusable Order Card component
const OrderCard = ({ order }: any) => {
  const router = useRouter();

  const statusMap: any = {
    1: "Pending",
    2: "Processing",
    3: "Under Negotiation",
    4: "In Review",
    5: "Confirmed",
    6: "Cancelled",
    7: "Completed",
  };

  const steps = [
    { status: "Deal Created", completed: true },
    { status: "In Progress", completed: order.deal_status >= 3 },
    { status: "Confirmed", completed: order.deal_status >= 5 },
    { status: "Completed", completed: order.deal_status === 7 },
  ];

  // ✅ Handle track order click
  const handleTrackOrder = () => {
    
    // You can later replace alert() with a router push or modal:
 router.push(`/buyer3/order/tracking/${order.deal_id}`);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition duration-300 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Deal #{order.deal_id}
          </h3>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Product:</span>{" "}
            {order.product_description || "N/A"}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Seller:</span>{" "}
            {order.sellerUser?.name || "Unknown"}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Buyer:</span>{" "}
            {order.buyerUser?.name || "Unknown"}
          </p>
        </div>

        <span
          className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${order.deal_status === 7
              ? "bg-green-100 text-green-800"
              : order.deal_status === 6
                ? "bg-red-100 text-red-800"
                : "bg-cyan-100 text-cyan-800"
            }`}
        >
          {statusMap[order.deal_status] || "Unknown"}
        </span>
      </div>

      {/* Deal Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4 text-sm text-gray-700">
        <p>
          <strong>Deal Amount:</strong> ₹{order.deal_amount || "0"}
        </p>
        <p>
          <strong>Quantity:</strong> {order.quantity_in_kg} kg
        </p>
        <p>
          <strong>Price/Kg:</strong> ₹{order.price_per_kg}
        </p>
        <p>
          <strong>Remarks:</strong> {order.remarks || "N/A"}
        </p>
        <p>
          <strong>Updated On:</strong>{" "}
          {order.updated_on
            ? new Date(order.updated_on).toLocaleDateString()
            : "N/A"}
        </p>
        {order.tds && (
          <p>
            <a
              href={order.tds}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View TDS Document
            </a>
          </p>
        )}
      </div>

      {/* Tracking Steps */}
      <div className="relative mt-6">
        <div className="absolute top-3 left-3 h-[calc(100%-1.5rem)] w-0.5 bg-gray-200" />
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-8 pb-4 last:pb-0">
            <div
              className={`absolute top-0 left-0 w-6 h-6 rounded-full flex items-center justify-center ${step.completed
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-100 text-gray-400 border border-gray-300"
                }`}
            >
              {step.completed ? <CheckIcon className="w-4 h-4" /> : idx + 1}
            </div>
            <p
              className={`font-medium ${step.completed ? "text-gray-800" : "text-gray-500"
                }`}
            >
              {step.status}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Track Order Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleTrackOrder}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};


// ✅ SVG Check Icon
const CheckIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export default B2cOrder;
