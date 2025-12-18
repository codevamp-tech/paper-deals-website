"use client";
import React, { useState } from "react";
// import ProductList from "./AllProduct";
import FaqSection from "@/components/faqSection/FaqSection";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import RequirementModal from "@/components/modal/TellUsModal";
import PriceList from "./ProductListing";
import { useTheme } from "@/hooks/use-theme";
import PageAdvertising from "@/components/advertising/pageAdvetise";

export default function Product() {
  const { theme } = useTheme();

  return (
    <div>
      <PageAdvertising />
      {/* <ProductList /> */}
      <div className="bg-white">
        <PriceList />
      </div>

      {/* <RequirementModal /> */}
      <ReadyToOrder />
      <PartnerWithUs isaboutpage={undefined} />
      <FaqSection />
    </div>
  );
}
