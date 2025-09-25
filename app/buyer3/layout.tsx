"use client"

import { useState } from "react"

// import AdminHeader from "@/components/admin/header"
import AdminSidebar from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 z-30 w-64 bg-gray-900 transition-transform transform md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} /> */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}
