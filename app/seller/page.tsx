"use client";

import React from "react";
import PriceList from "../product/ProductListing";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";
import Footer from "@/components/footer/Footer";

const Seller = () => {
  return (
    <div>
      <PriceList />
      {/* <Advertising /> */}
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Seller;
