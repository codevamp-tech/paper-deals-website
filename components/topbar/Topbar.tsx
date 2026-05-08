"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TopbarWithCategories from "./Categorei";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  User,
  Menu,
  X,
  Search,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  CreditCard,
  Lock,
  Building2,
  ShoppingBag,
  FileText,
  Plus,
  ShieldCheck,
  Bell,
  SearchIcon,
  Package,
  Settings
} from "lucide-react";
import RequestCallback from "../modal/RequestCallback";
import SupportModal from "../modal/SupportModal";
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
import { motion, AnimatePresence } from "framer-motion";

const Topbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [results, setResults] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);

  function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  }

  useEffect(() => {
    let mode = localStorage.getItem("mode");
    if (!mode) {
      mode = "B2C";
      localStorage.setItem("mode", "B2C");
    }
    const isB2B = mode === "B2B";
    setEnabled(isB2B);
    document.documentElement.classList.remove("theme-b2b", "theme-b2c");
    document.documentElement.classList.add(isB2B ? "theme-b2b" : "theme-b2c");
  }, []);

  useEffect(() => {
    const loadCart = () => {
      const mode = localStorage.getItem("mode") || "B2C";
      const cart = JSON.parse(localStorage.getItem(`cart_${mode}`) || "[]");
      const totalQty = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(totalQty);
    };
    loadCart();
    window.addEventListener("storage", loadCart);
    window.addEventListener("cart-updated", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, [pathname]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      try {
        const userType = enabled ? 2 : 3;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/search?q=${encodeURIComponent(debouncedQuery)}&user_type=${userType}&limit=8`
        );
        const data = await res.json();
        if (data?.success && Array.isArray(data.products)) {
          setResults(data.products.map((item: any) => ({ ...item, _type: "product" })));
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

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
    <header className="bg-white sticky top-0 z-50">
      <div className="border-b border-gray-100 backdrop-blur-md bg-white/95">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-8">

          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex-shrink-0 transition-transform active:scale-95">
              <img
                className="h-8 md:h-12 w-auto"
                src="/logomain.png"
                alt="PaperDeals"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative group" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, grades, or manufacturers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-gray-900 placeholder-gray-400 shadow-sm"
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {debouncedQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Search Results</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{results.length} Found</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {results.length === 0 ? (
                      <div className="p-12 text-center text-gray-400">
                        <Package size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="font-bold">No results for "{debouncedQuery}"</p>
                      </div>
                    ) : (
                      results.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            router.push(`/product/${item.id}`);
                            setQuery("");
                          }}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4 border-b border-gray-50 last:border-none group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <Package size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-gray-900">{item.product_name}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">{item.category?.name || "Uncategorized"}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Mode Switcher */}
            <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200">
              <button
                onClick={() => {
                  if (!enabled) return;
                  localStorage.setItem("mode", "B2C");
                  window.location.reload();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!enabled ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                Retail
              </button>
              <button
                onClick={() => {
                  if (enabled) return;
                  localStorage.setItem("mode", "B2B");
                  window.location.reload();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${enabled ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                Wholesale
              </button>
            </div>

            {/* Cart & User */}
            <div className="flex items-center gap-1 md:gap-3 border-l border-gray-100 pl-4 md:pl-6">
              <Link href="/cart">
                <button className="relative p-3 rounded-xl hover:bg-gray-50 transition-all group">
                  <ShoppingBag size={22} className="text-gray-700 group-hover:text-primary transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-1 pr-3 rounded-full bg-gray-50 border border-gray-200 hover:border-primary/20 transition-all group">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-lg transition-transform group-hover:scale-105 ${enabled ? "bg-green-600" : "bg-primary"}`}>
                        {getInitials(user?.name || user?.user_name)}
                      </div>
                      <div className="hidden lg:flex flex-col text-left">
                        <span className="text-xs font-black text-gray-900 truncate max-w-[100px]">{user?.name}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">My Account</span>
                      </div>
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-900" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white">
                    <div className="px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                      <p className="text-xs font-black text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/buyer-route/dashboard" className="flex items-center gap-3 py-2.5 font-bold text-gray-700 hover:text-primary">
                        <LayoutDashboard size={18} /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/buyer-route/profile" className="flex items-center gap-3 py-2.5 font-bold text-gray-700 hover:text-primary">
                        <User size={18} /> Profile
                      </Link>
                    </DropdownMenuItem>


                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link
                        href="/buyer-route/enquiry"
                        className="flex items-center gap-3 py-2.5 font-bold text-gray-700 hover:text-primary"
                      >
                        <FileText size={18} /> Enquiries
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/buyer-route/chat" className="flex items-center gap-3 py-2.5 font-bold text-gray-700 hover:text-primary">
                        <MessageCircle size={18} /> Message Center
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
                      <Link href="/buyer-route/subscriptions" className="flex items-center gap-3 py-2.5 font-bold text-gray-700 hover:text-primary">
                        <CreditCard size={18} /> Subscription
                      </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem asChild>
                      <Link href="/buyer-route/changepassword" className="flex items-center gap-3 py-2.5 font-bold text-gray-700 hover:text-primary">
                        <Lock size={18} /> Change Password
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100 my-2" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 font-bold py-2.5">
                      <LogOut size={18} className="mr-3" /> Logout Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/buyer-login">
                  <button className={`px-6 py-2.5 rounded-xl text-white font-black text-sm shadow-xl transition-all active:scale-95 ${enabled ? "bg-green-600 shadow-green-600/20" : "bg-primary shadow-primary/20 hover:opacity-90"}`}>
                    Sign In
                  </button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-header - Desktop */}
      <div className="hidden lg:block bg-gray-900 border-b border-white/5 py-1.5">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {enabled ? (
              <>
                <TopbarWithCategories />
                <Link href="/B2B/consultants" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Consultants</Link>
                <Link href="/B2B/become-a-seller" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Become a Seller</Link>
                <Link href="/B2B/live-stock" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Live Stock</Link>
              </>
            ) : (
              <>
                <Link href="/product" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Marketplace</Link>
                <Link href="/seller" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Verified Sellers</Link>
                <Link href="/News" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">News Hub</Link>
              </>
            )}
            <Link href="/about" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Our Vision</Link>
          </div>
          <div className="flex items-center gap-6">
            {!enabled && (
              <Link
                href="/buyer-route/product"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-all bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20"
              >
                <Plus size={14} /> Sell Products
              </Link>
            )}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <ShieldCheck size={14} className="text-green-500" /> Secure Payments
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white z-[60] lg:hidden p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <img src="/logomain.png" className="h-8 w-auto" alt="Logo" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-xl text-gray-500">
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-6">
                <div className="pb-6 border-b border-gray-100 mb-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Browse Portal</p>
                  <Link href="/product" className="block text-xl font-black text-gray-900 hover:text-primary transition-colors py-2">Products</Link>
                  <Link href="/seller" className="block text-xl font-black text-gray-900 hover:text-primary transition-colors py-2">Sellers</Link>
                  <Link href="/about" className="block text-xl font-black text-gray-900 hover:text-primary transition-colors py-2">About Us</Link>
                  <Link href="/News" className="block text-xl font-black text-gray-900 hover:text-primary transition-colors py-2">Industry News</Link>
                  {!enabled && (
                    <Link href="/buyer-route/product" className="block text-xl font-black text-primary transition-colors py-2">Sell Products</Link>
                  )}
                </div>

                {!isLoggedIn && (
                  <Link href="/buyer-login">
                    <button className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20">Sign In Now</button>
                  </Link>
                )}

                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <ShieldCheck size={20} className="text-green-500" />
                    <span className="text-xs font-bold text-gray-600">Secure Enterprise Portal</span>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Topbar;
