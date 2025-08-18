import {
  Calendar,
  HeadphonesIcon,
  ShoppingBag,
  TrendingDown,
  Users,
} from "lucide-react";
import React from "react";

export default function WhySellpaperdeals() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20 bg-[#111111]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Why Sell With <span className="text-gray-100">PaperDeals?</span>
        </h2>
        <p className="text-gray-200 max-w-2xl mx-auto">
          We provide everything you need to start, run, and grow your online
          business
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            icon: <Users className="h-8 w-8 text-blue-600" />,
            title: "45 crore+ Flipkart customers",
            desc: "Reach customers across India",
          },
          {
            icon: <Calendar className="h-8 w-8 text-blue-600" />,
            title: "7+ days secure payments",
            desc: "Reliable payment processing",
          },
          {
            icon: <TrendingDown className="h-8 w-8 text-blue-600" />,
            title: "Low business costs",
            desc: "Minimize operational expenses",
          },
          {
            icon: <HeadphonesIcon className="h-8 w-8 text-blue-600" />,
            title: "24/7 Seller Support",
            desc: "One-click assistance for sellers",
          },
          {
            icon: <ShoppingBag className="h-8 w-8 text-blue-600" />,
            title: "Big Billion Days Access",
            desc: "Participate in major sale events",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 hover:border-blue-100"
          >
            <div className="bg-blue-50 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center mx-auto">
              {feature.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-center text-lg">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 text-center">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
