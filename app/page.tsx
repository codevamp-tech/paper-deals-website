"use client"

import { useEffect, useState } from "react"
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
import ProductCrousel from "@/components/productForhome/productcrousel";
import Advertising from "@/components/advertising/Advertising";
import AssumptionPartner from "@/components/association/association";



export default function Home() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem("mode")
    setEnabled(savedMode === "B2B" ? true : false)

  }, [])
  return (<div className="min-h-screen"> {/* Hero Section P2 and add intro below*/}


    {/* Hero Section */}
    <Hero />

    {/* Insight  */}

    <ProductInsights />


    {/* Categories */}
    {/* <Categoreie /> */}


    {/* Products Section */}
    {enabled &&
      <SellerOrBuyer />
    }
    <Advertising />
    {/* <ProductCrousel /> */}
    {/* Our Services */}
    <ServicesGrid />
    {!enabled &&
      <ProductCrousel />
    }
    {/* Ready To Order */}
    <ReadyToOrder />

    {/* Partner with us */}
    <PartnerWithUs />

    {/* Testimonials */}
    <TestimonialsSection />



    {/* AssumptionPartner */}
    <AssumptionPartner />

    {/* FAQ Section */}
    <FaqSection />
  </div>
  );
}
