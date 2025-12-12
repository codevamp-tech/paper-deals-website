"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Award,
  ImageIcon,
  Megaphone,
  FileBadge,
  MessageSquareText,
  ShoppingCart,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
  icon: any;
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/buyer3/dashboard", icon: LayoutDashboard },
  { name: "My Enquiry", href: "/buyer3/enquiry", icon: Package },
  { name: "Direct Single Order", href: "/buyer3/DirectSingleOrder", icon: Award },
  { name: "Pd bulk deal", href: "/buyer3/pdbulkdeal", icon: ImageIcon },
  { name: "Order", href: "/buyer3/order", icon: ShoppingCart },
  { name: "Products", href: "/buyer3/product", icon: Package },
  { name: "Product's Enquiry", href: "/buyer3/productEnquiry", icon: Package },
  // { name: "Chat", href: "/buyer3/chat", icon: MessageSquareText },
  // { name: "Subscriptions", href: "/buyer3/subscriptions", icon: FileBadge },
  // { name: "Profile", href: "/buyer3/profile", icon: Megaphone },
  // { name: "Change Password", href: "/buyer3/changepassword", icon: Lock },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    // Safely read localStorage (client-only)
    try {
      const m = typeof window !== "undefined" ? localStorage.getItem("mode") : null;
      setMode(m);
    } catch (e) {
      setMode(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // push to home and refresh
      router.push("/");
      // next/navigation router.refresh may be optional depending on next version; keep for safety
      try {
        router.refresh();
      } catch (e) {
        // ignore if not available
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href: string) => {
    // Mark link active if pathname equals or starts with href (handles nested routes)
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
  };

  // Reusable nav link
  const NavLink = ({ href, Icon, children }: { href: string; Icon: any; children: React.ReactNode }) => {
    const active = isActive(href);
    const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors";
    const activeClasses = "bg-white/20 text-white";
    const inactiveClasses = "text-gray-200 hover:bg-white/10 hover:text-white";

    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      >
        <Icon className="mr-3 h-5 w-5" />
        <span className="truncate">{children}</span>
      </Link>
    );
  };

  return (
    <aside className="h-full flex flex-col p-4 text-black bg-sky-500 md:pt-4">
      {/* Mobile Close Button */}
      <div className="flex justify-between items-center md:hidden mb-6 text-white pt-4">
        <div className="text-lg font-semibold">Buyer</div>
        <button
          onClick={() => onClose && onClose()}
          aria-label="Close sidebar"
          className="p-2 rounded-md hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Logo (desktop) */}
      <div className="hidden md:flex items-center space-x-2 mb-4 pt-2">

        <div className="text-white font-bold text-xl">PD Buyer</div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)] space-y-2 pr-2 mt-4 md:mt-0 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
        {/* Render nav items in the new order, but hide product links if B2B */}
        {navigation.map((item) => {
          if (mode === "B2B" &&
            (item.href === "/buyer3/product" || item.href === "/buyer3/productEnquiry")) {
            return null;
          }

          if (mode !== "B2B" && item.href === "/buyer3/pdbulkdeal") {
            return null;
          }

          return (
            <NavLink key={item.name} href={item.href} Icon={item.icon}>
              {item.name}
            </NavLink>
          );
        })}
        <hr className="my-3 border-white/10" />
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-200 hover:bg-white/10 hover:text-white"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
