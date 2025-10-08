"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    business: "Activa & Digi Smart",
    image: "/myapp.jpg",
    story:
      "When moving from offline to online business, our aim was to sell 300 orders per month. Today, we sell more than 700 orders per day and this has been possible because of the growth features on the Flipkart seller dashboard, Flipkart Ads and regular payments.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    business: "Elegance Apparel",
    image: "/myapp.jpg",
    story:
      "Starting with just 5 products on Flipkart, we've expanded to over 200 SKUs in just 18 months. The seller dashboard analytics helped us identify trending products, and Flipkart's logistics support made scaling our business seamless.",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    business: "TechGadgets India",
    image: "/myapp.jpg",
    story:
      "As a small electronics retailer, competing with big brands seemed impossible. With Flipkart's platform, we reached customers nationwide and grew our revenue by 300% in just one year. The promotional events like Big Billion Days were game-changers for our business.",
  },
];

export function StoryCarousel() {
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
    <div className="relative overflow-x-hidden ">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg w-[95vw]  ">
        <div className="flex flex-col md:flex-row items-center p-6 md:p-8 border border-blue-600">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-blue-100">
              <Image
                src={sellerStories[currentIndex].image || "/placeholder.svg"}
                alt={sellerStories[currentIndex].name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className=" md:pl-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {sellerStories[currentIndex].name},{" "}
              <span className="text-blue-600">
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
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none ${
              index === currentIndex
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
