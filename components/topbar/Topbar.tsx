"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TopbarWithCategories from "./Categorei";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, Store, Menu, X, Search, LogOut, LayoutDashboard, MessageCircle, CreditCard, Lock, Building2, ShoppingBag } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const Topbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [results, setResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);

  function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  }


  useEffect(() => {
    const mode = localStorage.getItem("mode") === "B2C";
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

  // 🔹 Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/search?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=8`
        );

        const data = await res.json();

        if (data?.success && Array.isArray(data.products)) {
          setResults(
            data.products.map((item: any) => ({
              ...item,
              _type: "product",
            }))
          );
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("❌ Search error:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (item: any) => {
    setQuery("");        // ✅ clear input
    setResults([]);      // ✅ close dropdown
    router.push(`/product/${item.id}`);
  };


  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsLoggedIn(false);
    router.push("/");
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center ">
            {/* Logo + Toggle */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/" className="flex-shrink-0">
                <img
                  className="h-4 w-auto sm:h-5 md:h-10"
                  src="/logomain.png"
                  alt="LOGO"
                />
              </Link>

              <div className="hidden lg:flex items-center gap-6">
                {enabled ? (

                  <>
                    <Link href="/product" className="text-sm">
                      Products
                    </Link>
                    <Link href="/buyer" className="text-sm">
                      Buyers
                    </Link>
                    <Link href="/B2B/seller" className="text-sm">
                      Sellers
                    </Link>
                    <Link href="/about" className="text-sm">
                      About Us
                    </Link>
                    <Link href="/News" className="text-sm">
                      News
                    </Link>
                  </>
                ) : (
                  <>
                    <TopbarWithCategories />
                    <Link href="/B2B/consultants" className="text-sm">
                      Consultants
                    </Link>
                    <Link href="/B2B/become-a-seller" className="text-sm">
                      Become a Seller
                    </Link>
                    <Link href="/B2B/live-stock" className="text-sm">
                      Live Stock
                    </Link>
                    <Link href="/about" className="text-sm">
                      About Us
                    </Link>
                    <Link href="/News" className="text-sm">
                      News
                    </Link>
                  </>
                )}
              </div>
            </div>
            {/* Right Section */}
            <div className="ml-auto flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 justify-center">
                <div className="hidden md:flex items-center flex-1 mx-6 relative">
                  <div className="relative w-full max-w-md" ref={searchRef}>
                    <input
                      type="text"
                      placeholder="Search by product or category..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500 transition-all duration-300 ease-in-out"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer hover:text-cyan-500 transition-colors" />


                    {results.length === 0 && debouncedQuery && (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No products found
                      </div>
                    )}
                    {results.length > 0 && (
                      <ul className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg text-left z-50 max-h-60 overflow-y-auto text-black">
                        {results.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">
                                {item.product_name}
                              </span>
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                Product
                              </span>
                            </div>
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
              </div>
              {/* <div className="flex items-center justify-end gap-1 rounded-full bg-gray-100 p-1 border border-gray-200">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (!enabled) return;
                          setEnabled(false);
                          localStorage.setItem("mode", "B2C");
                          router.push("/");
                          setTimeout(() => window.location.reload(), 500);
                        }}
                        style={{ backgroundColor: !enabled ? theme.toggle : "transparent" }}
                        className={`flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${!enabled ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" /> B2C
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-sm">Switch to Retail (B2C)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (enabled) return;
                          setEnabled(true);
                          localStorage.setItem("mode", "B2B");
                          router.push("/");
                          setTimeout(() => window.location.reload(), 500);
                        }}
                        style={{ backgroundColor: enabled ? theme.toggle : "transparent" }}
                        className={`flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${enabled ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                      >
                        <Building2 className="mr-2 h-4 w-4" /> B2B
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-sm">Switch to <b>B2B</b> (Wholesale & Business Mode)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div> */}

              {/* User/Login */}
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
                      <DropdownMenuContent align="end" className="w-48 rounded-lg border border-gray-200 shadow-md bg-white text-black">
                        <DropdownMenuLabel className="text-sm font-medium bg-white text-black">
                          My Account
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/buyer3/dashboard" className="flex items-center gap-2 w-full text-sm hover:bg-gray-100">
                            <LayoutDashboard className="w-4 h-4 text-gray-600" /> Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buyer3/profile" className="flex items-center gap-2 w-full text-sm hover:bg-gray-100">
                            <User className="w-4 h-4 text-gray-600" /> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buyer3/chat" className="flex items-center gap-2 w-full text-sm hover:bg-gray-100">
                            <MessageCircle className="w-4 h-4 text-gray-600" /> Chat
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buyer3/subscriptions" className="flex items-center gap-2 w-full text-sm hover:bg-gray-100">
                            <CreditCard className="w-4 h-4 text-gray-600" /> Subscription
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/buyer3/changepassword" className="flex items-center gap-2 w-full text-sm hover:bg-gray-100">
                            <Lock className="w-4 h-4 text-gray-600" /> Change Password
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-sm !text-red-500 cursor-pointer hover:bg-gray-100">
                          <LogOut className="w-4 h-4 text-red-500" /> Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/buyer-login" className={`hidden md:flex items-center gap-2 px-5 py-2 text-white rounded-lg  transition-colors duration-200 font-semibold shadow-md`} style={{ backgroundColor: theme.buttoncolor }}>
                      <User className="w-4 h-4" /> Login
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <nav className="relative lg:hidden">
              <div className="flex lg:hidden items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-800 hover:text-gray-600 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50">
                  <div className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <span className="text-lg font-semibold text-gray-800">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* <Link href="/B2B/consultants" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Consultants</Link>
                        <Link href="/B2B/become-a-seller" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Become a Seller</Link> */}
                        <Link href="/product" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                        <Link href="/buyer" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Buyers</Link>
                        <Link href="/B2B/seller" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Sellers</Link>
                        {/* <Link href="/B2B/live-stock" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Live Stock</Link> */}
                        <Link href="/about" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <Link href="/News" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
                        <Link href="/buyer-login" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        {isLoggedIn && (
                          <Link href="/order" className="block py-3 px-4 text-base text-gray-800 hover:text-cyan-500 hover:bg-gray-50 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
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
    </header>
  );
};

export default Topbar;
