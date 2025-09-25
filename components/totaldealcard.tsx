"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCookie } from "./getcookie";

export default function TotalDealsCard() {
  const [filter, setFilter] = useState("Daily");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getCookie("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [directRes, pdRes] = await Promise.all([
          fetch("https://paper-deal-server.onrender.com/api/dashboard/stats", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ added
            },
            credentials: "include",
          }).then((res) => res.json()),

          fetch("https://paper-deal-server.onrender.com/api/pd-deals/graph", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ added
            },
            credentials: "include",
          }).then((res) => res.json()),
        ]);

        let directData: any[] = [];
        let pdData: any[] = [];

        if (filter === "Daily") {
          directData = directRes.dayWise || directRes?.data?.dayWise || [];
          pdData = pdRes.dayWise || pdRes?.data?.dayWise || [];
        } else if (filter === "Weekly") {
          directData = directRes.weekWise || directRes?.data?.weekWise || [];
          pdData = pdRes.weekWise || pdRes?.data?.weekWise || [];
        } else if (filter === "Monthly") {
          directData = directRes.monthWise || directRes?.data?.monthWise || [];
          pdData = pdRes.monthWise || pdRes?.data?.monthWise || [];
        }


        // 📌 Merge datasets by key (day/week/month)
        const map: Record<string, any> = {};

        directData.forEach((d) => {
          const key =
            filter === "Daily"
              ? d.day
              : filter === "Weekly"
                ? d.week
                : d.month;
          map[key] = {
            key,
            direct: d.total_deals, // ✅ Direct API uses "total_deals"
            paper: 0,
          };
        });

        pdData.forEach((d) => {
          const key =
            filter === "Daily"
              ? d.day
              : filter === "Weekly"
                ? d.week
                : d.month;
          if (!map[key]) {
            map[key] = {
              key,
              direct: 0,
              paper: d.total_pdDeal, // ✅ FIX: use total_pdDeal
            };
          } else {
            map[key].paper = d.total_pdDeal; // ✅ FIX
          }
        });

        // Convert object to array & sort
        const mergedData = Object.values(map).sort(
          (a: any, b: any) => a.key - b.key
        );

        setChartData(mergedData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filter]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-3xl">
      {/* Header */}
      <div className="bg-cyan-700 px-4 py-2 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-red-600">Total Deals</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 text-sm"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 0, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="direct"
                name="Direct Order"
                stroke="#f4a300"
                strokeWidth={3}
                dot={{ fill: "#f4a300", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="paper"
                name="Paper Deals"
                stroke="#f76c5e"
                strokeWidth={3}
                dot={{ fill: "#f76c5e", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
