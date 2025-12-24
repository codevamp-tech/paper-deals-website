"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import TestimonialsSection from "@/components/testimonial";
import FaqSection from "../components/faqSection/FaqSection";
import SellerOrBuyer from "@/components/sellerOrBuyer/SellerOrBuyer";
import ServicesGrid from "@/components/services/Services";
import ProductInsights from "@/components/insight/Insight";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import Hero from "@/components/herohomepage/Heropage";
import ProductCrousel from "@/components/productForhome/productcrousel";
import Advertising from "@/components/advertising/Advertising";
import AssumptionPartner from "@/components/association/association";
import Categories from "@/components/categories/Categories";



export default function Home() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem("mode")
    setEnabled(savedMode === "B2B" ? true : false)

  }, [])
  return (<div className="min-h-screen">
    {/* Hero Section */}
    <Hero />

    {/* Categories */}
    {enabled &&
      <Categories />
    }

    {enabled &&
      <SellerOrBuyer />
    }

    {enabled &&
      <ProductInsights />
    }

    <Advertising />

    {/* Our Services */}
    <ServicesGrid />

    {/* <ProductCrousel /> */}
    {!enabled &&
      <ProductCrousel />
    }

    {/* Ready To Order */}
    <ReadyToOrder />

    {/* Partner with us */}
    {enabled &&
      <PartnerWithUs />
    }

    {/* Testimonials */}
    <TestimonialsSection />

    {/* AssumptionPartner */}
    <AssumptionPartner />

    {/* FAQ Section */}
    <FaqSection />

  </div>
  );
}
