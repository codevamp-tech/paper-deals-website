"use client";
import React, { useState } from "react";
// import ProductList from "./AllProduct";
import Advertising from "@/components/advertising/Advertising";
import FaqSection from "@/components/faqSection/FaqSection";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import RequirementModal from "@/components/modal/TellUsModal";
import PriceList from "./ProductListing";
import { useTheme } from "@/hooks/use-theme";

export default function Product() {
  const { theme } = useTheme();

  return (
    <div>
      <Advertising />
      {/* <ProductList /> */}
      <div className="border border-red-500 bg-white">
        <PriceList />
      </div>

      {/* <RequirementModal /> */}
      <ReadyToOrder />
      <PartnerWithUs isaboutpage={undefined} />
      <FaqSection />
    </div>
  );
}
