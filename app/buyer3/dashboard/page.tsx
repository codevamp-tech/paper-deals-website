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
  
  const token = getCookie("token");



  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Cards */}
      {/* Cards (only show if NOT consultant) */}
   
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
