"use client";

import React from "react";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";
import SellerList from "../../../components/sellerListing";


const Seller = () => {
  return (
    <div>
      <SellerList />
      {/* <Advertising /> */}
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />

    </div>
  );
};

export default Seller;
