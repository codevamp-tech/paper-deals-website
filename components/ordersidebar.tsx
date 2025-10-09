"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRightIcon,
  HeartIcon,
  LogOutIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react";

const OrderSidebar = () => {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const menuItems = [
    { id: "orders", label: "Orders", icon: <PackageIcon />, route: "/order" },
    // { id: "favourite", label: "Favorites", icon: <HeartIcon />, route: "/order/favourites" },
    // { id: "logout", label: "Logout", icon: <LogOutIcon />, route: "/logout" },
  ];

  // Automatically detect active tab based on current route
  const activeTab = menuItems.find((item) => pathname.startsWith(item.route))?.id;

  return (
    <nav className="w-full md:w-64 bg-gradient-to-b from-white to-gray-50 flex-shrink-0 flex flex-col overflow-y-auto p-4 border-r border-gray-100">
      <h2 className="mb-6 md:mb-8 px-4 py-2 text-lg md:text-xl font-bold text-gray-800 font-poppins">
        My Account
      </h2>

      {menuItems.map(({ id, label, icon, route }) => (
        <Link href={route} key={id}>
          <button
            onMouseEnter={() => setHoveredTab(id)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3
              text-gray-600 text-sm md:text-base font-medium rounded-xl transition duration-300
              ${
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

            <span
              className={`ml-auto transition-transform duration-300 ${
                activeTab === id
                  ? "translate-x-0 opacity-100"
                  : "translate-x-2 opacity-0"
              }`}
            >
              <ChevronRightIcon />
            </span>
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default OrderSidebar;
