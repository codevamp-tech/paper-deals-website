"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {

    BarChart2,
    ListChecks,
    UserCircle,
    PlusCircle,
    Eye,
    Edit,
    FileCheck,
    FileText,
    Workflow,
    LayoutDashboard,
    Activity,
    Headset,
    CheckCircle,
    Package,
    MessageSquare,
    HelpCircle,
    LifeBuoy,
    Award,
    ImageIcon,

    Settings,
    Megaphone,
    Tv,
    SquareArrowOutUpRight,
    MessageSquareWarning,
    Radio,
    FileBadge,
    History,
    Pi,
    CalendarCheck,
    MessageSquareQuote, ListTree, Image, Video, ImagePlus, Newspaper,
    Bolt,
    MessageSquareText,
    IndianRupee,
    Users,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    PhoneCall,


    CreditCard,
    Store,
    Handshake,
    BarChart3
} from "lucide-react"

import { Button } from "@/components/ui/button"

// ✅ Main Navigation Items (only single-link pages)
const navigation = [
    { name: "Dashboard", href: "/buyer3/dashboard", icon: LayoutDashboard },
    { name: "Enquiry", href: "/buyer3/enquiry", icon: Package },
    { name: "Direct Single Order", href: "/buyer3/DirectSingleOrder", icon: Award },
    { name: "Pd bulk deal", href: "/buyer3/pdbulkdeal", icon: ImageIcon },
    { name: "Profile", href: "/buyer3/profile", icon: Megaphone },
    { name: "Subscriptions", href: "/buyer3/subscriptions", icon: FileBadge },
    { name: "Chat", href: "/buyer3/chat", icon: Pi },
    { name: "Change Password", href: "/buyer3/changepassword", icon: MessageSquareText },

]

// ✅ Dropdown Menu Component
function DropdownMenu({ title, icon: Icon, isOpen, toggle, links }) {
    const pathname = usePathname()
    const isActive = (href) => pathname === href

    return (
        <div>
            <button
                onClick={toggle}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-left rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
            >
                <Icon className="mr-3 h-5 w-5" />
                {title}
                <span className="ml-auto">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
            </button>

            {isOpen && (
                <div className="pl-10 mt-1 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-2 py-2 rounded-md text-sm font-medium ${isActive(link.href)
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <link.icon className="inline-block mr-2 h-4 w-4" />
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function AdminSidebar({ onClose }) {
    const pathname = usePathname()
    const router = useRouter()

    // ✅ Fixed: Added missing state for PD Deals
    const [dashboardOpen, setDashboardOpen] = useState(false)
    const [directsingleorderOpen, setDirectSingleOrderOpen] = useState(false)
    const [enquiryOpen, setenquiryOpen] = useState(false)
    const [pdbulkdealOpen, setPdbulkDealOpen] = useState(false)
    const [profileOpen, setprofileOpen] = useState(false)
    const [directreportOpen, setdirectreportOpen] = useState(false)
    const [chatOpen, setchatOpen] = useState(false)
    const [changepasswordOpen, setchangepasswordOpen] = useState(false)
    const [subscriptionOpen, setsubscriptionsOpen] = useState(false)




    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const isActive = (href) => pathname === href

    return (
        <div className="h-full flex flex-col p-4 text-white bg-blue-500 ">
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center md:hidden mb-6 text-white">
                {/* <div className="text-lg font-bold">Demo Buyer</div> */}
                <button onClick={onClose}>
                    <div className="w-6 h-6" />
                </button>
            </div>

            {/* Logo */}
            <div className="hidden md:flex items-center space-x-2 mb-8">
                {/* <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">PD</div> */}
                <div>
                    {/* <div className="font-bold text-lg">Paper Deals</div>
                    <div className="text-sm text-gray-400">Demo Buyer</div> */}
                </div>
            </div>

            {/* Scrollable Navigation */}
            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto md:overflow-y-hidden space-y-2 pr-2">

                {/* Static Single Links */}
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                            ? "bg-white-600 text-white" // Active link ka background orange
                            : "text-gray-300 hover:bg-white-700 hover:text-white" // Hover bhi orange shade
                            }`}
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <div className="pt-6">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                    Logout
                </Button>
            </div>
        </div>
    )
}
