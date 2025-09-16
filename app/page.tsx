"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import TestimonialsSection from "@/components/testimonial";
import FaqSection from "../components/faqSection/FaqSection";
import Categoreie from "@/components/categories/Categories";
import SellerOrBuyer from "@/components/sellerOrBuyer/SellerOrBuyer";
import ServicesGrid from "@/components/services/Services";
import ProductInsights from "@/components/insight/Insight";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import Hero from "@/components/herohomepage/Heropage";

export default function Home() {
  return (<div className="min-h-screen text-white"> {/* Hero Section P2 and add intro below*/}


    {/* Hero Section */}
    <Hero />

    {/* Insight  */}
    <ProductInsights />

    {/* Categories */}
    <Categoreie />

    {/* Products Section */}
    <SellerOrBuyer />

    {/* Our Services */}
    <ServicesGrid />

    {/* Ready To Order */}
    <ReadyToOrder />

    {/* Partner with us */}
    <PartnerWithUs />

    {/* Testimonials */}
    <TestimonialsSection />

    {/* FAQ Section */}
    <FaqSection />
  </div>
  );
}
