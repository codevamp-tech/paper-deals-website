"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

type Review = {
  id: number;
  name: string;
  email: string;
  rating: number;
  review: string;
  created_at: string;
};

export function StoryCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/websiterating/get`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setReviews(json.data.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching website ratings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const handleRefresh = () => {
      fetchReviews();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("refresh-reviews", handleRefresh);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("refresh-reviews", handleRefresh);
      }
    };
  }, []);

  const goToNext = () => {
    if (reviews.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToPrev = () => {
    if (reviews.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (reviews.length <= 1 || isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Reset auto-play interval when active index changes or reviews load
  useEffect(() => {
    if (reviews.length <= 1) return;

    intervalRef.current = setInterval(goToNext, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reviews.length, currentIndex]);

  if (loading) {
    return (
      <div className="relative overflow-x-hidden py-10 flex justify-center">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg w-[95vw] max-w-5xl animate-pulse">
          <div
            className="flex flex-col md:flex-row items-center p-6 md:p-8"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
              <div className="h-40 w-40 md:h-48 md:w-48 rounded-full bg-gray-200 border-4 border-gray-100 flex items-center justify-center"></div>
            </div>
            <div className="md:w-2/3 md:pl-8 space-y-3 w-full">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-150 rounded w-1/4"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="relative overflow-x-hidden py-10 flex justify-center">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg w-[95vw] max-w-5xl">
          <div
            className="flex flex-col items-center justify-center p-12 text-center"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Star className="w-8 h-8 text-gray-300 animate-spin" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">
              No Seller Reviews Yet
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Be the first to share your experience selling on PaperDeals!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <div className="relative overflow-x-hidden py-10 flex flex-col items-center w-full">
      <div className="relative w-[95vw] max-w-5xl">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div
            className={`flex flex-col md:flex-row items-center p-6 md:p-8 transition-all duration-500 ease-in-out ${
              isAnimating ? "opacity-30 transform scale-95" : "opacity-100 transform scale-100"
            }`}
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            {/* Avatar Circle */}
            <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
              <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner bg-blue-600 flex items-center justify-center select-none">
                <span className="text-6xl font-black text-white uppercase">
                  {currentReview.name ? currentReview.name.charAt(0) : "?"}
                </span>
              </div>
            </div>

            {/* Review Content */}
            <div className="md:w-2/3 md:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-wrap items-center gap-2 mb-2 justify-center md:justify-start">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {currentReview.name}
                </h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  Verified Seller
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, sIdx) => (
                  <Star
                    key={sIdx}
                    className={`w-5 h-5 ${
                      sIdx < currentReview.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed text-sm md:text-base italic">
                "{currentReview.review}"
              </p>

              <span className="text-[11px] text-gray-400 mt-4 block font-medium">
                {new Date(currentReview.created_at || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-[-12px] md:left-[-20px] top-[50%] translate-y-[-50%] bg-white hover:bg-gray-50 text-gray-800 p-2.5 rounded-full shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition focus:outline-none z-10"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-[-12px] md:right-[-20px] top-[50%] translate-y-[-50%] bg-white hover:bg-gray-50 text-gray-800 p-2.5 rounded-full shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition focus:outline-none z-10"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Indicator Dots */}
      {reviews.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {reviews.map((_, index) => (
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
      )}
    </div>
  );
}
