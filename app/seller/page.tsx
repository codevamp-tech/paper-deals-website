"use client";

import React from "react";
import PriceList from "../../components/sellerListing";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";


const Seller = () => {
  return (
    <div>
      <PriceList />
      {/* <Advertising /> */}
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />
 
    </div>
  );
};

export default Seller;
