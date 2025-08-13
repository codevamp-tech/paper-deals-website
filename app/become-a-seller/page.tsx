import React from "react";
import SellOnlinePage from "./SellOnlinePage";
import { StoryCarousel } from "./SuccessCarousel";
import FaqSection from "@/components/faqSection/FaqSection";


export default function Product() {
  return (
    <>
      <div>
        <SellOnlinePage />
        <div className="flex justify-center items-center">
          <StoryCarousel />
        </div>
        <FaqSection />
        
      </div>
    </>
  );
}
