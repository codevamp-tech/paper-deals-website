"use client";

import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";

const TrackingPage = () => {
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
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center space-x-2 text-sm text-white">
        <Link href="/">
          <button className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-lg bg-black hover:bg-gray-800 transition duration-300">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>
        </Link>
        <span className="text-gray-400">Home / Tracking</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Tracking</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Order #{order.id}
              </h3>
              <p className="text-gray-500">{order.items.join(", ")}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-cyan-100 text-cyan-800"
              }`}
            >
              {order.status === "delivered" ? "Delivered" : "Shipped"}
            </span>
          </div>

          {/* Timeline */}
          <div className="relative mt-6">
            <div className="absolute top-3 left-3 h-[calc(100%-1.5rem)] w-0.5 bg-gray-200" />
            {order.steps.map((step, idx) => (
              <div
                key={idx}
                className="relative pl-10 pb-6 last:pb-0 flex items-start"
              >
                <div
                  className={`absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-400 border border-gray-300"
                  }`}
                >
                  {step.completed ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      step.completed ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {step.status.charAt(0).toUpperCase() +
                      step.status.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingPage;
