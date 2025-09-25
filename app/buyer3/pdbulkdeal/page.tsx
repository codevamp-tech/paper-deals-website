"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Archive, BarChart3 } from 'lucide-react';
import ClosedPdDealsPage from "@/components/currentdeal";
import CurrentPaperDealPage from "@/components/closedeal";

type DealType = "current" | "closed";

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState<DealType>("current");

  return (
    <div className="min-h-screen  text-black ">
      <div className="container mx-auto p-6">

        <div className="flex items-center  justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "current" ? "default" : "outline"}
              onClick={() => setActiveTab("closed")}
              className="transition-all duration-200 ease-in-out text-black bg-white"
            >
              PD Current Deals
            </Button>
            <Button
              variant={activeTab === "closed" ? "default" : "outline"}
              onClick={() => setActiveTab("current")}
              className="transition-all duration-200 ease-in-out text-black bg-white"
            >
              PD  Closed Deals
            </Button>
          </div>
        </div>

        {/* Deal Content with Smooth Transition */}
        <Card>
          <CardContent className="p-0">
            <div className="transition-all duration-300 ease-in-out">
              {activeTab === "current" && (
                <div className="animate-in fade-in-0 duration-300">
                  <CurrentPaperDealPage />
                </div>
              )}
              {activeTab === "closed" && (
                <div className="animate-in fade-in-0 duration-300">
                  <ClosedPdDealsPage />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
