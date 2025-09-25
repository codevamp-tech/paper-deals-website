"use client";

import React, { useState } from "react";

export default function EnquiryShowDummy() {
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const dummyData = [
    { id: 138, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "tezpur", category: "Duplex Board", product: "prisma", gsm: "200", shade: "grey back", qty: "3600", remarks: "ok", created: "2025-07-31 14:59:15", status: "Pending" },
    { id: 137, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "tezpur", category: "Cromo Paper", product: "10", gsm: "200", shade: "grey back", qty: "10", remarks: "ok", created: "2025-07-31 14:43:18", status: "Completed" },
    { id: 136, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "firozabad", category: "Stock lot Papers", product: "duplex", gsm: "0", shade: "white back", qty: "50000", remarks: "mix gsm", created: "2025-07-08 13:03:15", status: "Completed" },
    { id: 135, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "siliguri", category: "Copier Paper - A4", product: "jk", gsm: "75", shade: "", qty: "10000", remarks: "copier a4", created: "2025-07-08 11:54:27", status: "Completed" },
    { id: 134, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "ghaziabad", category: "Duplex Board", product: "kraft paper roll", gsm: "450", shade: "golden yellow", qty: "20000", remarks: "kailashi devi", created: "2025-07-03 16:17:25", status: "Completed" },
    { id: 133, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "ghaziabad", category: "Duplex Board", product: "duplex board", gsm: "450", shade: "grey back", qty: "25000", remarks: "dev product", created: "2025-07-03 12:22:50", status: "Completed" },
    { id: 132, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "ghaziabad", category: "Duplex Board", product: "prisma", gsm: "500", shade: "grey back", qty: "70000", remarks: "kailashi devi alfa", created: "2025-07-01 15:31:24", status: "Completed" },
    { id: 131, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "ghaziabad", category: "Duplex Board", product: "prisma", gsm: "250", shade: "white back", qty: "15000", remarks: "duplex board kailashi devi", created: "2025-07-01 15:08:22", status: "Pending" },
    { id: 128, seller: "KPDS_8", buyer: "manoj rana", phone: "8445549289", city: "meerut", category: "Duplex Board", product: "prisma", gsm: "250", shade: "grey back", qty: "60000", remarks: "dev priya product", created: "2025-06-21 17:26:18", status: "Pending" },
    { id: 125, seller: "KPDS_75", buyer: "manoj rana", phone: "8445549289", city: "Ghaziabad", category: "Kraft Paper", product: "VIRGIN KRAFT", gsm: "230", shade: "", qty: "50000", remarks: "", created: "2024-12-11 15:36:23", status: "Pending" },
  ];

  const totalPages = 7;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">  {/* <-- yaha add kiya */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Enquiry Show</h1> {/* text-gray-800 hata diya */}
      </header>

      <div className="bg-white shadow-sm rounded border p-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            Show
            <select value={entries} onChange={(e) => setEntries(Number(e.target.value))} className="border rounded px-2 py-1 bg-white text-black">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-gray-100 rounded text-sm">Copy</button>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm">CSV</button>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm">Excel</button>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm">PDF</button>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm">Print</button>
          </div>

          <div className="text-sm flex items-center gap-2 bg-white text-black">
            Search:
            <input
              type="text"
              className="border rounded px-2 py-1 bg-white text-black"
            />
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {["ID", "Seller Id", "Buyer", "Phone", "City", "Category", "Product", "Gsm", "Shade", "Quantity in Kg", "Remarks", "Created At", "Status", "Action"].map((h, i) => (
                  <th key={i} className="border px-3 py-2 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{row.id}</td>
                  <td className="border px-3 py-2">{row.seller}</td>
                  <td className="border px-3 py-2">{row.buyer}</td>
                  <td className="border px-3 py-2">{row.phone}</td>
                  <td className="border px-3 py-2">{row.city}</td>
                  <td className="border px-3 py-2">{row.category}</td>
                  <td className="border px-3 py-2">{row.product}</td>
                  <td className="border px-3 py-2">{row.gsm}</td>
                  <td className="border px-3 py-2">{row.shade}</td>
                  <td className="border px-3 py-2">{row.qty}</td>
                  <td className="border px-3 py-2">{row.remarks}</td>
                  <td className="border px-3 py-2">{row.created}</td>
                  <td className="border px-3 py-2">
                    {row.status === "Completed" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Completed ✓</span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Pending ⏳</span>
                    )}
                  </td>
                  <td className="border px-3 py-2 text-blue-600 cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div>Showing 1 to {entries} of 63 entries</div>
          <div className="flex gap-1">
            <button className="px-2 py-1 border rounded disabled:opacity-50" disabled={page === 1}>Previous</button>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`px-3 py-1 border rounded ${page === n ? "bg-blue-500 text-white" : "bg-white"}`}>{n}</button>
            ))}
            <button className="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
