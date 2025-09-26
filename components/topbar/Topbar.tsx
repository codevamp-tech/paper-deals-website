"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TopbarWithCategories from "./Categorei";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Store, Menu, X } from "lucide-react";
import RequestCallback from "../modal/RequestCallback";
import SupportModal from "../modal/SupportModal";

// ✅ Toggle UI imports
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Topbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // ✅ Toggle state
  const [enabled, setEnabled] = useState(false);

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <header className="bg-white">

      {/* 🔵 Top Strip */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          {/* Left Side - Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsSupportOpen(true)}
              className="px-3 py-1 rounded-lg text-sm font-medium hover:underline"
            >
              Support
            </button>
            <button
              onClick={() => setIsRequestOpen(true)}
              className="px-3 py-1 rounded-lg text-sm font-medium hover:underline"
            >
              Request Call
            </button>
          </div>


          {/* Right Side - Phone, Email & Toggle */}
          <div className="flex items-center gap-6">
            {/* Phone */}
            <div className="flex items-center gap-2">
              📞 <span>9837093712</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              ✉️ <span>support@paperdeals.in</span>
            </div>

            {/* ✅ Toggle Section (moved to the end) */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="mode-toggle"
                className={`cursor-pointer font-semibold transition-colors ${enabled ? "text-green-300" : "text-white"
                  }`}
              >
                {enabled ? "B2B" : "B2C"}
              </Label>
              <Switch
                id="mode-toggle"
                checked={enabled}
                onCheckedChange={setEnabled}
                className={`transition-colors ${enabled
                    ? "bg-green-400 data-[state=checked]:bg-green-500"
                    : "bg-white data-[state=unchecked]:bg-gray-200"
                  }`}
              />
            </div>
          </div>

        </div>
      </div>


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
            <div className="hidden lg:flex flex-col items-start">
              {/* Top links row */}
              <div className="flex items-center gap-8">
                <TopbarWithCategories />
                <Link
                  href="/#"
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/live-stock"
                  className="text-sm text-gray-700 hover:text-black transition-colors"                >
                  Live Stock
                </Link>
                <Link
                  href="/consultants"
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Consultants
                </Link>
                <Link
                  href="/product"
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >

                  Products
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
                  href="/buyers"
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Buyer
                </Link>
                    {/* <Link
                href="/product/detail"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Detail
              </Link> */}
                <Link
                  href="/become-a-seller"
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Become a Seller
                </Link>
                {/* <Link
                  href="/order"
                  className="text-sm text-gray-700 hover:text-black transition-colors"
                >
                  Order
                </Link> */}
              </div>


            </div>
          </div>

          {/* Desktop Right Side - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center ">
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              {/* Login Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-200">
                Log in
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute top-full right-0   w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                  className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
                href="/live-stock"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Live Stock
              </Link>


              <Link
                href="/consultants"
                className="text-sm text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                consultants
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
      {/* 🔹 Request Callback Modal */}
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
