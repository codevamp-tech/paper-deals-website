"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Categoreis from "@/components/categories/Categories";
import { motion } from "framer-motion";

import Categories from "@/components/categories/Categories";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";
import OrderNow from "./ordernow/OrderNow";


// import DetailWithCategories from "./Categoreis";

const Detail = () => {
  const { id } = useParams();
  console.log("id", id);
  const router = useRouter();

  return (
    <div>
      <OrderNow productId={id as string} />

      <Categories title="Explore" subtitle="Releted Categories" />
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />

    </div>
  );
};

export default Detail;
