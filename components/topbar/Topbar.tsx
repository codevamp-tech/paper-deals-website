"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust the path as needed
import TopbarWithCategories from "./Categorei";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Store, Menu, X } from "lucide-react";

const Topbar = () => {
  const router = useRouter(); // Initialize the router
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                className="w-[20vw] sm:w-[25vw], md:w-[12vw]"
                src="/logomain.png"
                alt="LOGO"
                style={{
                  height: "auto",
                }}
              />
            </Link>
            {/* Desktop Navigation - Hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center gap-8">
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

          {/* Desktop Right Side - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center gap-4">
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              {/* Login Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-200">
                Log in
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
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

          {/* Mobile/Tablet Right Side - Visible only on mobile and tablet */}
          <div className="flex lg:hidden items-center gap-4">
            {/* Mobile Login Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <button className="flex items-center gap-2 px-3 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-200 text-sm">
                Log in
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      href="/buyer-login"
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <User className="w-3 h-3" />
                      Buyer
                    </Link>
                    <hr className="border-gray-100" />
                    <Link
                      href="/seller-login"
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm"
                    >
                      <Store className="w-3 h-3" />
                      Seller
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSignupClick}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-sm px-3 py-2"
            >
              Get Started
            </Button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-black transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu - Only visible when hamburger is clicked */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <TopbarWithCategories />
              </div>
              <Link
                href="/product"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Product
              </Link>
              <Link
                href="/about"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/seller"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Seller
              </Link>
              <Link
                href="/product/detail"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Detail
              </Link>
              <Link
                href="/become-a-seller"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become a Seller
              </Link>
              <Link
                href="/order"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
