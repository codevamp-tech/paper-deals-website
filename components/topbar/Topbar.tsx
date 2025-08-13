"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust the path as needed
import TopbarWithCategories from "./Categorei";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Store } from "lucide-react";

const Topbar = () => {
  const router = useRouter(); // Initialize the router
  const [isOpen, setIsOpen] = useState(false);

  const handleSignupClick = () => {
    router.push("/signup"); // Navigate programmatically to the signup page
  };

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/">
              <img
                src="/logomain.png"
                alt="LOGO"
                style={{
                  height: "auto",
                  width: "12vw",
                }}
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <TopbarWithCategories />
              <Link
                href="/product"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Product
              </Link>
              <Link
                href="/about"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                About
              </Link>
              <Link
                href="/seller"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Seller
              </Link>
              <Link
                href="/product/detail"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Detail
              </Link>
              <Link
                href="/become-a-seller"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Become a Seller
              </Link>
              <Link
                href="/order"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Order
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              {/* Login Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-200"
              >
                Log in
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      href="/buyer-login"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <User className="w-4 h-4" />
                      Buyer
                    </Link>
                    <hr className="border-gray-100" />
                    <Link
                      href="/seller-login"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <Store className="w-4 h-4" />
                      Seller
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleSignupClick}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Topbar;