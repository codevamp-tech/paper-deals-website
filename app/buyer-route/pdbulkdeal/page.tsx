"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClosedPdDealsPage from "@/components/currentdeal";
import CurrentPaperDealPage from "@/components/closedeal";

type DealType = "current" | "closed";

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<DealType>("current");

  return (
    <div className="min-h-screen text-black">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex gap-2">

            {/* Current Deals Button */}
            <Button
              variant={activeTab === "current" ? "default" : "outline"}
              onClick={() => setActiveTab("closed")}
              className={`transition-all duration-200 ease-in-out ${activeTab === "current"
                ? "bg-white text-black"
                : "bg-black text-white"
                }`}
            >
              PD Current Deals
            </Button>

            {/* Closed Deals Button */}
            <Button
              variant={activeTab === "closed" ? "default" : "outline"}
              onClick={() => setActiveTab("current")}
              className={`transition-all duration-200 ease-in-out ${activeTab === "closed"
                ? "bg-white text-black"
                : "  bg-black text-white"
                }`}
            >
              PD Closed Deals
            </Button>

          </div>
        </div>

        {/* Deal Content with Smooth Transition */}
        <div>
          <div className="p-0">
            <div className="transition-all duration-300 ease-in-out">
              {activeTab === "closed" && (
                <div className="animate-in fade-in-0 duration-300">
                  <ClosedPdDealsPage />
                </div>
              )}
              {activeTab === "current" && (
                <div className="animate-in fade-in-0 duration-300">
                  <CurrentPaperDealPage />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
