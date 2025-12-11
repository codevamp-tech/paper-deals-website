"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopbarWithCategories from "./Categorei";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, Store, Menu, X, Search, LogOut } from "lucide-react";
import RequestCallback from "../modal/RequestCallback";
import SupportModal from "../modal/SupportModal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { getUserFromToken } from "@/hooks/use-token";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";

const Topbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const mode = localStorage.getItem("mode") === "B2B";
    setEnabled(mode);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setShowSearch(window.scrollY > 370);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      console.log("inside")
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/search?query=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        console.log("search data", data)

        if (data?.success && Array.isArray(data.data)) {
          // ✅ Filter products where product_name or category matches query
          const filtered = data.data.filter((item: any) => {
            const productName = item.product_name?.toLowerCase() || "";
            const categoryName =
              item.category?.name?.toLowerCase() ||
              item.category_id?.toLowerCase() ||
              "";
            return (
              productName.includes(query.toLowerCase()) ||
              categoryName.includes(query.toLowerCase())
            );
          });

          // Tag as product type for UI
          const withType = filtered.map((p: any) => ({
            ...p,
            _type: "product",
          }));
          setResults(withType);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  // 🧭 Handle click on search result
  const handleSelect = (item: any) => {
    router.push(`/product/${item.id}`); // Go directly to product details
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsLoggedIn(false);
    router.push("/");
  };


  console.log("user", user)

  // Helper function to get initials from full name
  const getInitials = (fullName: string) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };
  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* 🔹 Main Top Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Toggle */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/" className="flex-shrink-0">
                <img
                  className="h-4 w-auto sm:h-5 md:h-10"
                  src="/logomain.png"
                  alt="LOGO"
                />
              </Link>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-300 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                <Label
                  htmlFor="mode-toggle"
                  className={`cursor-pointer font-semibold text-xs sm:text-sm transition-colors ${enabled ? "text-green-600" : "text-black"
                    }`}
                >
                  {enabled ? "B2B" : "B2C"}
                </Label>

                <button
                  id="mode-toggle"
                  onClick={async () => {
                    const newValue = !enabled;
                    setEnabled(newValue);
                    localStorage.setItem("mode", newValue ? "B2B" : "B2C");
                    router.push("/");
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }}
                  className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-12 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-green-600" : "bg-black"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${enabled
                      ? "translate-x-5 sm:translate-x-6"
                      : "translate-x-0.5 sm:translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 justify-center">
              {showSearch && (
                <div className="hidden md:flex items-center flex-1 mx-6 relative">
                  <div className="relative w-full max-w-md">
                    <input
                      type="text"
                      placeholder="Search by product or category..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500 transition-all duration-300 ease-in-out"
                    />

                    {/* 🔹 Search Icon on Right */}
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer hover:text-cyan-500 transition-colors" />

                    {/* 🔽 Dropdown Results */}
                    {results.length > 0 && (
                      <ul className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg text-left z-50 max-h-60 overflow-y-auto text-black">
                        {results.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                          >
                            {/* 🏷️ Product Name */}
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">
                                {item.product_name}
                              </span>
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                Product
                              </span>
                            </div>

                            {/* 📦 Category Name */}
                            {(item.category?.name || item.category_id) && (
                              <div className="text-sm text-gray-500 mt-1">
                                Category: {item.category?.name || item.category_id}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section (Login / User) */}
            <div className="flex items-end justify-end">
              <div className="flex items-center gap-3 relative">
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                          {getInitials(user?.user_name)}
                        </div>
                        <span className="hidden md:inline text-sm font-medium text-gray-800">
                          {user?.name}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-lg border border-gray-200 shadow-md bg-white text-black"
                    >
                      <DropdownMenuLabel className="text-sm font-medium bg-white text-black">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href="/buyer3/dashboard"
                          className="flex items-center gap-2 w-full text-sm text-black hover:bg-gray-100"
                        >
                          <User className="w-4 h-4 text-gray-600" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-black cursor-pointer hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 text-gray-600" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>

                  </DropdownMenu>
                ) : (
                  <Link
                    href="/buyer-login"
                    className={`hidden md:flex items-center gap-2 px-5 py-2 text-white rounded-lg  transition-colors duration-200 font-semibold shadow-md `}
                    style={{ backgroundColor: theme.buttoncolor }}
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                )}

              </div>

            </div>

            <nav className="relative">
              {/* Your regular desktop navigation */}

              {/* Mobile Menu Button */}
              <div className="flex lg:hidden items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-800 hover:text-gray-600 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50">
                  <div className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                    <div className="flex flex-col h-full">
                      {/* Header with close button */}
                      <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <span className="text-lg font-semibold text-gray-800">
                          Menu
                        </span>
                        <button
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Menu Links */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <Link
                          href="/B2B/consultants"
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Consultants
                        </Link>
                        {/* <Link
                          href="/B2B/seller "
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sellers
                        </Link> */}
                        <Link
                          href="/B2B/become-a-seller"
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Become a Seller
                        </Link>
                        <Link
                          href="/product"
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href="/B2B/live-stock"
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Live Stock
                        </Link>
                        <Link
                          href="/about"
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          About Us
                        </Link>
                        <Link
                          href="/News"
                          className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          News
                        </Link>

                        {/* ✅ Show only if buyer logged in */}
                        {isLoggedIn && (
                          <Link
                            href="/order"
                            className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </nav>
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
                <Link
                  href="/B2B/consultants"
                  className="text-sm hover:text-cyan-300"
                >
                  Consultants
                </Link>

                <Link
                  href="/B2B/become-a-seller"
                  className="text-sm hover:text-cyan-300"
                >
                  Become a Seller
                </Link>
                <Link href="/product" className="text-sm hover:text-cyan-300">
                  Products
                </Link>
                <Link
                  href="/B2B/live-stock"
                  className="text-sm hover:text-cyan-300"
                >
                  Live Stock
                </Link>
                <Link href="/about" className="text-sm hover:text-cyan-300">
                  About Us
                </Link>
                <Link href="/News" className="text-sm hover:text-cyan-300">
                  News
                </Link>

                {/* ✅ Show only if buyer logged in */}

              </>
            ) : (
              <>
                <Link
                  href="/B2B/live-stock"
                  className="text-sm hover:text-cyan-300"
                >
                  Live Stock
                </Link>
                <Link href="/product" className="text-sm hover:text-cyan-300">
                  Products
                </Link>
                <Link
                  href="/B2B/seller"
                  className="text-sm hover:text-cyan-300"
                >
                  Sellers
                </Link>
                <Link href="/about" className="text-sm hover:text-cyan-300">
                  About Us
                </Link>
                <Link href="/News" className="text-sm hover:text-cyan-300">
                  News
                </Link>

                {/* ✅ Show only if buyer logged in */}
                {/* {isLoggedIn && (
                  <Link href="/order" className="text-sm hover:text-cyan-300">
                    My Orders
                  </Link>
                )} */}
              </>
            )}
          </div>
        </div>
      </div>

      <RequestCallback
        visible={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
      <SupportModal
        visible={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </header>
  );
};

export default Topbar;
