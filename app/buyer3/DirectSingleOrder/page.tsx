"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CloseDealsPage from "@/components/closedeal"
import DealsTable from "@/components/currentdeal"
import { getCookie } from "@/components/getcookie"

type DealType = "current" | "closed"

export default function DealsPage() {
  const [selectedDealType, setSelectedDealType] = useState<DealType>("current")

  return (
    <div className="min-h-screen bg-white text-black"> {/* ✅ background white + text black */}
      <div className="container mx-auto py-4 px-2 text-black-600">
        <div className="w-full">
          <div>
            {/* Deal Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-white-100 rounded-lg p-1 gap-1"> {/* ✅ toggle bg light */}
                <Button
                  variant={selectedDealType === "current" ? "default" : "ghost"}
                  onClick={() => setSelectedDealType("current")}
                  className={`transition-all duration-200 ease-in-out ${
                    selectedDealType === "current"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Current Direct Deals
                </Button>
                <Button
                  variant={selectedDealType === "closed" ? "default" : "ghost"}
                  onClick={() => setSelectedDealType("closed")}
                  className={`transition-all duration-200 ease-in-out ${
                    selectedDealType === "closed"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Closed Direct Deals
                </Button>
              </div>
            </div>

            {/* Deal Content with Smooth Transition */}
            <div className="transition-all duration-300 ease-in-out">
              {selectedDealType === "current" ? (
                <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
                  <DealsTable />
                </div>
              ) : (
                <div className="animate-in fade-in-0 slide-in-from-left-4 duration-300
                ">
                  <CloseDealsPage />
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}
