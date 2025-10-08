import React from "react";
import SellerOnboarding from "./SellerPage";
import FaqSection from "@/components/faqSection/FaqSection";

import SellOnlinePage from "../B2B/become-a-seller/SellOnlinePage";
import WhySellpaperdeals from "../B2B/become-a-seller/Why-Sell-Paperdeals";

export default function Home() {
  return (
    <div>
      <SellerOnboarding />
      <WhySellpaperdeals />
      <FaqSection />
      
    </div>
  );
}
