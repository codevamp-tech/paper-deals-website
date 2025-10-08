"use client";
import React, { useState } from "react";
// import ProductList from "./AllProduct";
import Advertising from "@/components/advertising/Advertising";
import FaqSection from "@/components/faqSection/FaqSection";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import RequirementModal from "@/components/modal/TellUsModal";
import PriceList from "./ProductListing";

export default function Product() {
  return (
    <div>
      <Advertising />
      {/* <ProductList /> */}
      <PriceList />
      {/* <RequirementModal /> */}
      <ReadyToOrder />
      <PartnerWithUs isaboutpage={undefined} />
      <FaqSection />
      
    </div>
  );
}
