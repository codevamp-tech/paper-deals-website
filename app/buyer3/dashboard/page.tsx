"use client";

import {
  Package,
  MessageSquare,
  Award,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import TotalBusinessCard from "@/components/totalbussinesscard";
import TotalDealsCard from "@/components/totaldealcard";
import { getCookie } from "@/components/getcookie";



import { getUserFromToken } from "@/hooks/use-token";
import Link from "next/link";

export default function AdminDashboard() {

  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10; // default rows per page
  const [paperDeals, setPaperDeals] = useState<any[]>([]);
  const [paperCurrentPage, setPaperCurrentPage] = useState(1);
  const [paperTotalPages, setPaperTotalPages] = useState(1);
  const [prevChats, setPrevChats] = useState<number>(0);
  const [upcomingChats, setUpcomingChats] = useState<number>(0);
  const [pendingEnquiries, setPendingEnquiries] = useState<number>(0);

  const token = getCookie("token");
  const user = getUserFromToken();
  const userId = user?.user_id;

  useEffect(() => {
    if (userId && token) {
      // Fetch Pending Enquiries
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/getBuyerEnquiries?user_id=${userId}&page=1&limit=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setPendingEnquiries(res.pendingCount || 0);
        })
        .catch((err) => console.error("Error fetching enquiries:", err));
    }
  }, [userId, token]);


  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Cards */}
      {/* Cards (only show if NOT consultant) */}

      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Pending Enquiries Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-orange-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Enquiries</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{pendingEnquiries}</h2>
            <Link href="/buyer3/productEnquiry" className="text-sm text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block">
              View details &rarr;
            </Link>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <MessageSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-full">
          <TotalBusinessCard />
        </div>
        <div className="h-full">
          <TotalDealsCard />
        </div>
      </div>

    </div >
  );
}
