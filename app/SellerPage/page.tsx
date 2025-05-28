import React from "react";
import SellerOnboarding from "./SellerPage";
import FaqSection from "@/components/faqSection/FaqSection";
import Footer from "@/components/footer/Footer";
import SellOnlinePage from "../become-a-seller/SellOnlinePage";
import WhySellpaperdeals from "../become-a-seller/Why-Sell-Paperdeals";

export default function Home() {
  return (
    <div>
      <SellerOnboarding />
      <WhySellpaperdeals />
      <FaqSection />
      <Footer />
    </div>
  );
}
