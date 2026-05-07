"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustration?: string;
  oppositeAction?: {
    text: string;
    linkText: string;
    link: string;
  };
}

export function AuthLayout({
  children,
  title,
  subtitle,
  illustration = "/loginimg.svg",
  oppositeAction,
}: AuthLayoutProps) {
  const { mode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[700px] relative z-10"
      >
        {/* Left Side: Form */}
        <div className="p-8 sm:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="space-y-3">
              <Link href="/">
                <img src="/logomain.png" alt="Logo" className="h-10 w-auto mb-8" />
              </Link>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
              <p className="text-gray-500 font-medium">{subtitle}</p>
            </div>

            <div className="pt-4">{children}</div>

            {oppositeAction && (
              <p className="text-center text-sm text-gray-500 pt-8">
                {oppositeAction.text}{" "}
                <Link
                  href={oppositeAction.link}
                  className="text-primary font-bold hover:underline"
                >
                  {oppositeAction.linkText}
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Visual */}
        <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center p-16">
          {/* Abstract Shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          </div>

          <div className="relative z-10 text-center space-y-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-12 border border-white/20 shadow-2xl"
            >
              <img
                src={illustration}
                alt="Auth Illustration"
                className="w-full h-auto max-h-[350px] object-contain drop-shadow-2xl"
              />
            </motion.div>

            <div className="space-y-4 text-white">
              <h2 className="text-3xl font-black tracking-tight">Paper Deals Marketplace</h2>
              <p className="text-white/80 font-medium text-lg max-w-sm mx-auto">
                Connecting global manufacturers with verified paper buyers through technology.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Links */}
      <div className="mt-8 flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">
        <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
        <Link href="/term" className="hover:text-primary">Terms of Service</Link>
        <Link href="/about" className="hover:text-primary">Help Center</Link>
      </div>
    </div>
  );
}
