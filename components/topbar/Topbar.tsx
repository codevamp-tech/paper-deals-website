"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TopbarWithCategories from "./Categorei"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, User, Store, Menu, X, Search } from "lucide-react"
import RequestCallback from "../modal/RequestCallback"
import SupportModal from "../modal/SupportModal"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
import { getUserFromToken } from "@/hooks/use-token"

const Topbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const mode = localStorage.getItem("mode") === "B2B"
    setEnabled(mode)
  }, [])

  useEffect(() => {
    const token = Cookies.get("token")
    setIsLoggedIn(!!token)
    const currentUser = getUserFromToken()
    setUser(currentUser)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setShowSearch(window.scrollY > 370)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?query=${query}`
        )
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setResults(data.data || [])
      } catch (err) {
        console.error("Search error:", err)
        setResults([])
      }
    }
    fetchResults()
  }, [query])

  const handleLogout = () => {
    Cookies.remove("token")
    setUser(null)
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* 🔹 Main Top Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/" className="flex-shrink-0">
                <img className="h-10 w-auto md:h-12" src="/logomain.png" alt="LOGO" />
              </Link>

              <div className="flex items-center gap-2 bg-gray-300 rounded-full px-3 py-1.5 shadow-sm">
                <Label
                  htmlFor="mode-toggle"
                  className={`cursor-pointer font-semibold text-sm transition-colors ${
                    enabled ? "text-green-600" : "text-black"
                  }`}
                >
                  {enabled ? "B2B" : "B2C"}
                </Label>

                <button
                  id="mode-toggle"
                  onClick={() => {
                    const newValue = !enabled
                    setEnabled(newValue)
                    localStorage.setItem("mode", newValue ? "B2B" : "B2C")
                    router.push("/")
                    window.location.reload()
                  }}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                    enabled ? "bg-green-600" : "bg-black"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                      enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="hidden md:flex items-center flex-1 mx-6 relative">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search sellers, buyers or products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500 transition-all duration-300 ease-in-out"
                  />
                  {results.length > 0 && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {results.map((item: any) => (
                        <Link
                          key={item.id}
                          href={`/user/${item.id}`}
                          className="block px-4 py-2 hover:bg-cyan-50 text-gray-700 text-sm"
                        >
                          {item.user_name || item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Right Section (Login / User) */}
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md">
                  <User className="w-4 h-4" />
                  {user.user_name}
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-sm text-white/80 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
                >
                  <User className="w-4 h-4" />
                  Login
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {!user && isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <Link
                    href="/buyer-login"
                    className="flex items-center gap-3 px-4 py-3 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    Buyer Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-800 hover:text-gray-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Category Navbar */}
      <div className="bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex items-center gap-6">
            <TopbarWithCategories />
            {enabled ? (
              <>
                <Link href="/B2B/consultants" className="text-sm hover:text-cyan-300">
                  Consultants
                </Link>
                <Link href="/B2B/seller" className="text-sm hover:text-cyan-300">
                  Seller
                </Link>
                <Link href="/B2B/become-a-seller" className="text-sm hover:text-cyan-300">
                  Become a Seller
                </Link>
                <Link href="/product" className="text-sm hover:text-cyan-300">
                  Products
                </Link>
                <Link href="/B2B/live-stock" className="text-sm hover:text-cyan-300">
                  Live Stock
                </Link>
                <Link href="/about" className="text-sm hover:text-cyan-300">
                  About Us
                </Link>
                 <Link href="/News" className="text-sm hover:text-cyan-300">
                  News
                </Link>

                {/* ✅ Show only if buyer logged in */}
                {isLoggedIn && (
                  <Link href="/order" className="text-sm hover:text-cyan-300">
                    My Orders
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/B2B/live-stock" className="text-sm hover:text-cyan-300">
                  Live Stock
                </Link>
                <Link href="/product" className="text-sm hover:text-cyan-300">
                  Products
                </Link>
                <Link href="/about" className="text-sm hover:text-cyan-300">
                  About Us
                </Link>
                 <Link href="/News" className="text-sm hover:text-cyan-300">
                  News
                </Link>

                {/* ✅ Show only if buyer logged in */}
                {isLoggedIn && (
                  <Link href="/order" className="text-sm hover:text-cyan-300">
                    My Orders
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <RequestCallback visible={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      <SupportModal visible={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </header>
  )
}

export default Topbar
