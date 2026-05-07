"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

type SellerStory = {
  id: number;
  name: string;
  business: string;
  image: string;
  story: string;
};

const sellerStories: SellerStory[] = [
  {
    id: 1,
    name: "Vinay Garg",
    business: "Star Paper Mills",
    image: "/myapp.jpg",
    story:
      "Paper Deals has revolutionized how we sell our Kraft and Duplex boards. We went from managing manual enquiries to fulfilling bulk factory orders for 180 GSM Kraft paper across India. The automated bidding system and instant payments have streamlined our entire supply chain.",
  },
  {
    id: 2,
    name: "Amit Jha",
    business: "Global Paper Traders",
    image: "/myapp.jpg",
    story:
      "Finding consistent buyers for specialized Chromo and Art paper was always a challenge. With Paper Deals, we now connect directly with premium packaging firms and publishing houses. Our monthly turnover has tripled, and the seller dashboard provides invaluable insights into market demand.",
  },
  {
    id: 3,
    name: "Sandeep Mehta",
    business: "EcoPrint Solutions",
    image: "/myapp.jpg",
    story:
      "As a manufacturer of recycled Maplitho and Copier paper, Paper Deals helped us reach environmentally conscious corporate clients. The platform's 'Live Stock' feature allowed us to sell over 20 tonnes of excess inventory in just 48 hours. It's truly a game-changer for the paper industry.",
  },
];

export function StoryCarousel() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sellerStories.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sellerStories.length - 1 : prevIndex - 1
    );

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    // Auto-advance carousel every 5 seconds
    intervalRef.current = setInterval(goToNext, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden py-10">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg w-[95vw]  ">
        <div
          className="flex flex-col md:flex-row items-center p-6 md:p-"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
        >
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner bg-blue-600 flex items-center justify-center">
              <span className="text-6xl font-black text-white">
                {sellerStories[currentIndex].name.charAt(0)}
              </span>
            </div>
          </div>

          <div className=" md:pl-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {sellerStories[currentIndex].name},{" "}
              <span className={`${theme.Text}`}>
                {sellerStories[currentIndex].business}
              </span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {sellerStories[currentIndex].story}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}

      {/* Indicator Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {sellerStories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none ${index === currentIndex
              ? "bg-blue-600 w-8"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
