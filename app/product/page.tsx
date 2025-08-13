"use client";
import React, { useState } from "react";
import ProductList from "./AllProduct";
import Advertisement from "./Advertisement";
import PriceList from "./ProductListing";

import FaqSection from "@/components/faqSection/FaqSection";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import Advertising from "@/components/advertising/Advertising";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import RequirementModal from "@/components/modal/TellUsModal";

export default function Product() {
  return (
    <div>
      <Advertisement />
      {/* <ProductList /> */}
      <PriceList />
      {/* <RequirementModal /> */}
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />
      
    </div>
  );
}
