"use client";

import Link from "next/link";
import { useState } from "react";

const TrackingPage = () => {
  const [activeTab, setActiveTab] = useState("tracking");
  const [hoveredTab, setHoveredTab] = useState(null);

  const menuItems = [
    { id: "orders", label: "Orders", icon: <PackageIcon /> },
    { id: "tracking", label: "Tracking", icon: <TruckIcon /> },
    { id: "favourite", label: "Favorites", icon: <HeartIcon /> },
    { id: "logout", label: "Logout", icon: <LogoutIcon /> },
  ];

  // Dummy order data
  const orders = [
    {
      id: "ORD-87654",
      status: "delivered",
      date: "2023-11-15",
      items: ["Wireless Earbuds", "Phone Case"],
      deliveryDate: "2023-11-20",
      steps: [
        { status: "ordered", date: "Nov 15", completed: true },
        { status: "processed", date: "Nov 16", completed: true },
        { status: "shipped", date: "Nov 17", completed: true },
        { status: "out for delivery", date: "Nov 20", completed: true },
        { status: "delivered", date: "Nov 20", completed: true },
      ],
    },
    {
      id: "ORD-12345",
      status: "shipped",
      date: "2023-11-25",
      items: ["Smart Watch", "Charging Cable"],
      estimatedDelivery: "2023-12-02",
      steps: [
        { status: "ordered", date: "Nov 25", completed: true },
        { status: "processed", date: "Nov 26", completed: true },
        { status: "shipped", date: "Nov 27", completed: true },
        { status: "out for delivery", date: "Dec 2", completed: false },
        { status: "delivered", date: "", completed: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 ">
      {/* Breadcrumb */}
      <div className="mb-4 md:mb-8 flex items-center space-x-2 md:space-x-4 text-sm text-white">
        <Link href="/#">
          <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 border border-gray-200 rounded-lg bg-black hover:bg-gray-800 transition duration-300">
            <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm">Back</span>
          </button>
        </Link>
        <span className="text-gray-400 text-xs md:text-sm">
          Home / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </span>
      </div>

      {/* Main Container */}
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
              className={`
                relative flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3
                text-gray-600 text-sm md:text-base font-medium rounded-xl
                transition duration-300
                ${
                  activeTab === id
                    ? "bg-cyan-50 text-cyan-600 font-semibold shadow-inner"
                    : "hover:bg-gray-50"
                }
              `}
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
              <span
                className={`ml-auto transition-transform duration-300 ${
                  activeTab === id
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0"
                }`}
              >
                <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="w-full md:flex-1 p-4 md:p-8 bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
          {/* Order Tracking */}
          {activeTab === "tracking" && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                Order Tracking
              </h2>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-300"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm">
                        {order.items.join(", ")}
                      </p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-2 py-0.5 md:px-3 md:py-1
                        rounded-full text-xs md:text-sm font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-cyan-100 text-cyan-800"
                        }`}
                    >
                      {order.status === "delivered" ? "Delivered" : "Shipped"}
                    </span>
                  </div>
                  {/* Timeline */}
                  <div className="relative mt-4 md:mt-6">
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 h-[calc(100%-1.5rem)] w-0.5 bg-gray-200" />
                    {order.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="relative pl-8 md:pl-10 pb-4 md:pb-6 last:pb-0"
                      >
                        <div
                          className={`absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 rounded-full
                            flex items-center justify-center ${
                              step.completed
                                ? "bg-cyan-500 text-white"
                                : "bg-gray-100 text-gray-400 border border-gray-300"
                            }`}
                        >
                          {step.completed ? (
                            <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <span className="text-xs md:text-sm font-bold">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-medium md:text-base ${
                              step.completed ? "text-gray-800" : "text-gray-500"
                            }`}
                          >
                            {step.status.charAt(0).toUpperCase() +
                              step.status.slice(1)}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {step.date}
                          </p>
                          {step.completed && order.status === "delivered" && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs md:text-sm text-green-700">
                              Delivered on {order.deliveryDate}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Orders */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                My Orders
              </h2>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm">
                        Placed on {order.date}
                      </p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-2 py-0.5 md:px-3 md:py-1
                        rounded-full text-xs md:text-sm font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-cyan-100 text-cyan-800"
                        }`}
                    >
                      {order.status === "delivered" ? "Delivered" : "Shipped"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Items</p>
                      <ul className="list-disc list-inside text-xs md:text-sm text-gray-700">
                        {order.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        {order.status === "delivered"
                          ? "Delivered on"
                          : "Estimated delivery"}
                      </p>
                      <p className="text-sm md:text-base font-medium text-gray-800">
                        {order.status === "delivered"
                          ? order.deliveryDate
                          : order.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                    <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50 transition">
                      View Details
                    </button>
                    <button className="w-full sm:w-auto px-4 py-2 bg-cyan-500 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-cyan-600 transition">
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favourites */}
          {activeTab === "favourite" && (
            <div className="flex flex-col justify-center items-center h-full text-center text-gray-500 space-y-6 md:space-y-8">
              <div className="relative">
                <HeartIcon className="w-20 h-20 md:w-24 md:h-24 text-pink-400 opacity-90" />
                <div className="absolute inset-0 bg-pink-400 rounded-full opacity-10 blur-lg animate-pulse" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700">
                No Favorites Yet
              </h3>
              <p className="text-xs md:text-sm max-w-md">
                Save your favorite items to easily find them later.
              </p>
              <button className="px-6 py-2 md:px-8 md:py-3 bg-pink-500 text-sm md:text-base text-white rounded-lg shadow-md hover:bg-pink-600 transition duration-300 hover:shadow-lg">
                Browse Products
              </button>
            </div>
          )}

          {/* Logout */}
          {activeTab === "logout" && (
            <div className="flex flex-col justify-center items-center h-full text-center text-gray-500 space-y-6 md:space-y-8">
              <div className="relative">
                <LogoutIcon className="w-20 h-20 md:w-24 md:h-24 text-red-500 opacity-90" />
                <div className="absolute inset-0 bg-gray-400 rounded-full opacity-10 blur-lg" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-red-500">
                Ready to leave?
              </h3>
              <p className="text-xs md:text-sm max-w-md">
                We hope to see you again soon. Your data will be securely saved
                for your next visit.
              </p>
              <button className="px-6 py-2 md:px-8 md:py-3 bg-red-500 text-sm md:text-base text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 hover:shadow-lg">
                Confirm Logout
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Add the new PackageIcon component
const PackageIcon = () => (
  <svg
    className="w-6 h-6 stroke-current"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v18m-9-9h18M5.4 5.4l13.2 13.2M18.6 5.4L5.4 18.6" />
  </svg>
);

// Add the CheckIcon component
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

// Keep all other icon components the same as before
const ArrowLeftIcon = () => (
  <svg
    className="w-4 h-4 stroke-current"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const TruckIcon = () => (
  <svg
    className="w-6 h-6 stroke-current"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M3 12h15l4 4v5H3v-9z" />
    <circle cx="7.5" cy="17.5" r="2.5" fill="currentColor" />
    <circle cx="18.5" cy="17.5" r="2.5" fill="currentColor" />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="w-6 h-6 stroke-current"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 21C12 21 7 16 4 12a5 5 0 1 1 8-6 5 5 0 1 1 8 6c-3 4-8 9-8 9z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-6 h-6 stroke-current"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-5 h-5 stroke-current"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const BoxIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 64 64"
  >
    <path d="M2 16l30 18 30-18-30-14-30 14z" />
    <path d="M32 34v28M2 16v32l30 16 30-16V16" />
  </svg>
);

export default TrackingPage;
