"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Categoreis from "@/components/categories/Categories";
import { motion } from "framer-motion";
import OrderNow from "./ordernow/OrderNow";
import Categories from "@/components/categories/Categories";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";


// import DetailWithCategories from "./Categoreis";

const Detail = () => {
  const router = useRouter();

  return (
    <div>
      <OrderNow />

      <Categories title="Explore" subtitle="Releted Categories" />
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />
      
    </div>
  );
};

export default Detail;
