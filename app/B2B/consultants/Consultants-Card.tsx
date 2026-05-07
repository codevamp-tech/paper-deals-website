"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Clock, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export type Consultant = {
  id: string | number;
  name: string;
  title: string;
  years: number;
  millsSupported?: string;
  description?: string;
  specialties: string[];
  photoAlt?: string;
  photoUrl?: string;
};

export function ConsultantCard({ consultant }: { consultant: Consultant }) {
  const {
    id,
    name,
    title,
    years,
    photoAlt,
    photoUrl,
    millsSupported,
    description,
  } = consultant;
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const handleBook = () => {
    router.push(`/B2B/consultants/${id}`);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-white border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Simple Header */}
        <div className="h-24 bg-gray-50 flex items-end px-6 relative">
          <div className="absolute top-4 right-6">
            <div className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
              <span className="text-[10px] font-bold text-green-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Available
              </span>
            </div>
          </div>
          
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white -mb-10 z-10 flex items-center justify-center">
            {photoUrl && !photoUrl.includes("placeholder") && !imgError ? (
              <Image
                src={photoUrl}
                alt={photoAlt || name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                {initials}
              </div>
            )}
          </div>
        </div>

        <CardHeader className="pt-14 pb-4 px-6">
          <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
            {name}
          </CardTitle>
          <p className="text-sm font-medium text-primary uppercase tracking-wide">{title || "Industry Expert"}</p>
        </CardHeader>

        <CardContent className="px-6 space-y-5 flex-1">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Experience</span>
              <span className="text-sm font-bold text-gray-800">{years}+ Years</span>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Mills</span>
              <span className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{millsSupported || "Multiple"}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 italic">
            "{description || "Dedicated professional providing expert consulting services for the paper and packaging industry."}"
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto">
          <Button
            onClick={handleBook}
            className="w-full bg-[#38d200] hover:bg-[#2fb000] text-white font-bold py-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
          >
            <span>Book Consultant</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
