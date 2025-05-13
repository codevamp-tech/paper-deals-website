<<<<<<< HEAD
"use client";
import React, { useState } from "react";
import ProductList from "./AllProduct";
import Advertisement from "./Advertisement";
import PriceList from "./ProductListing";
import Detail from "./detail/page";

export default function Product() {
  return (
    <div>
      <Advertisement />
      <ProductList />
      <PriceList />
      <Detail />
    </div>
  );
}
=======
"use client";
import React, { useState } from "react";
import ProductList from "./AllProduct";
import Advertisement from "./Advertisement";
import PriceList from "./ProductListing";
import Footer from "@/components/footer/Footer";
import FaqSection from "@/components/faqSection/FaqSection";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import Advertising from "@/components/advertising/Advertising";
// import RequirementModal from "@/components/modal/TellUsModal";

export default function Product() {
  return (
    <div>
      <Advertisement />
      {/* <ProductList /> */}
      <PriceList />
      {/* <RequirementModal /> */}
      <Advertising />
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />
      <Footer />
    </div>
  );
}
>>>>>>> 9befba398a387eb889c26a476e570e063c8a48c3
