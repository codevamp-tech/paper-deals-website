"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust the path as needed
import TopbarWithCategories from "./Categorei";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter(); // Initialize the router

  const handleSignupClick = () => {
    router.push("/signup"); // Navigate programmatically to the signup page
  };

  return (
    <header className="border-b border-zinc-800 h-[11vh] bg-black  ">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* <Link href="/" className="text-2xl font-bold tracking-tighter">
              <span className="text-white">Paper </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">
                Deals
              </span>
            </Link> */}
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
              {/* <Link
                href="#products"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Categorei
              </Link> */}
              <TopbarWithCategories />
              <Link
                href="/product"
                className="text-sm text-white hover:text-white transition-colors"
              >
                Product
              </Link>
              <Link
                href="/about"
                className="text-sm text-white hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/seller"
                className="text-sm text-white hover:text-white transition-colors"
              >
                Seller
              </Link>
              <Link
                href="/product/detail"
                className="text-sm text-white hover:text-white transition-colors"
              >
                Detail
              </Link>
              <Link
                href="/become-a-seller"
                className="text-sm text-white hover:text-white transition-colors"
              >
                Become a Seller
              </Link>
              <Link
                href="/order"
                className="text-sm text-white hover:text-white transition-colors"
              >
                Order
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login" // Direct link to the signup page
            >
              <Button
                variant="outline"
                className="hidden md:flex border-zinc-700 text-zinc-300 hover:text-black hover:border-zinc-500"
              >
                Log in
              </Button>
            </Link>

            <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Topbar;
