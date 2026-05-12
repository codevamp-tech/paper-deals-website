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
  const [totalLeads, setTotalLeads] = useState<number>(0);

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
          setTotalLeads(res.total || 0);
        })
        .catch((err) => console.error("Error fetching enquiries:", err));
    }
  }, [userId, token]);


  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>




      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Total Leads Card */}
        <Card className="overflow-hidden border-0 bg-cyan-600 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="relative p-6">
            <div className="relative z-10">
              <div className="text-4xl font-bold text-white">{totalLeads}</div>
              <div className="mt-1 text-white/90 font-medium">Total Leads</div>
            </div>
            <Package className="absolute right-6 top-1/2 h-16 w-16 -translate-y-1/2 text-white/20" />
          </CardContent>
        </Card>

        {/* Pending Leads Card */}
        <Card className="overflow-hidden border-0 bg-amber-500 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="relative p-6">
            <div className="relative z-10">
              <div className="text-4xl font-bold text-white">{pendingEnquiries}</div>
              <div className="mt-1 text-white/90 font-medium">Pending Enquiries</div>
            </div>
            <MessageSquare className="absolute right-6 top-1/2 h-16 w-16 -translate-y-1/2 text-white/20" />
          </CardContent>
        </Card>
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
