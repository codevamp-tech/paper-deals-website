"use client";

import { getUserFromToken } from "@/hooks/use-token";
import Link from "next/link";
import { useState, useEffect } from "react";

const TrackingPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();
  const buyerId = user?.user_id;

  // Fetch buyer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/dashboard/buyer/${buyerId}`);
        if (!res.ok) throw new Error("Failed to fetch buyer data");

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching buyer data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) fetchOrders();
  }, [buyerId]);

  const menuItems = [
    { id: "orders", label: "Orders", icon: <PackageIcon /> },
    { id: "favourite", label: "Favorites", icon: <HeartIcon /> },
    { id: "logout", label: "Logout", icon: <LogoutIcon /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading buyer data...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-[#111]">
      {/* Breadcrumb */}
      <div className="mb-4 md:mb-8 flex items-center space-x-2 md:space-x-4 text-sm text-white">
        <Link href="/#">
          <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 border border-gray-200 rounded-lg bg-black hover:bg-gray-800 transition duration-300">
            <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm">Back</span>
          </button>
        </Link>
        <span className="text-gray-400 text-xs md:text-sm">
          Home / Buyer / {buyerId}
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 rounded-xl overflow-hidden shadow-lg bg-white">
        {/* Sidebar */}
        <nav className="w-full md:w-64 bg-gradient-to-b from-white to-gray-50 flex-shrink-0 flex flex-col overflow-y-auto p-4 border-r border-gray-100">
          <h2 className="mb-6 md:mb-8 px-4 py-2 text-lg md:text-xl font-bold text-gray-800 font-poppins">
            My Account
          </h2>
          {menuItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              onMouseEnter={() => setHoveredTab(id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`relative flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3 text-gray-600 text-sm md:text-base font-medium rounded-xl transition duration-300 ${
                activeTab === id
                  ? "bg-cyan-50 text-cyan-600 font-semibold shadow-inner"
                  : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${
                  hoveredTab === id || activeTab === id ? "scale-110" : ""
                }`}
              >
                {icon}
              </span>
              <span>{label}</span>
              {activeTab === id && (
                <div className="absolute right-0 top-0 h-full w-1.5 bg-cyan-500 rounded-l-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="w-full md:flex-1 p-4 md:p-8 bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                Orders
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-center">No orders found.</p>
              ) : (
                orders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order }: any) => (
  <div className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
          Order #{order.id}
        </h3>
        <p className="text-gray-500 text-xs md:text-sm">
          {order.items?.join(", ")}
        </p>
      </div>
      <span
        className={`mt-2 sm:mt-0 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${
          order.status === "delivered"
            ? "bg-green-100 text-green-800"
            : "bg-cyan-100 text-cyan-800"
        }`}
      >
        {order.status}
      </span>
    </div>
  </div>
);

// Icons
const PackageIcon = () => (
  <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 3v18m-9-9h18M5.4 5.4l13.2 13.2M18.6 5.4L5.4 18.6" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 21C12 21 7 16 4 12a5 5 0 1 1 8-6 5 5 0 1 1 8 6c-3 4-8 9-8 9z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowLeftIcon = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default TrackingPage;
