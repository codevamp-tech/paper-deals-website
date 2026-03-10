"use client";

import { useTheme } from "@/hooks/use-theme";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface Advertisement {
  id: number;
  advertisement_title: string;
  page_type: string;
  image: string;
  created_at: string;
}

const Advertising = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertisement`);
        const data = await res.json();
        const mode = localStorage.getItem("mode");

        let filteredAds = data;
        if (mode === "B2C") {
          filteredAds = data.filter((ad: Advertisement) => ad.page_type === "buyer");
        } else if (mode === "B2B") {
          filteredAds = data.filter((ad: Advertisement) => ad.page_type === "seller");
        }

        setAds(filteredAds);
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [ads, currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
      setIsTransitioning(false);
    }, 600);
  };

  const getImageUrl = (image: string) => {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
  };

  if (loading) return (
    <div className="relative bg-white flex justify-center items-center h-[50vh] md:h-[70vh] min-h-[400px] overflow-hidden">
      <div className="relative z-10 w-[95vw] lg:w-[85vw] max-w-7xl">
        <div className="relative w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden bg-slate-200 animate-pulse">
          {/* Skeleton elements */}
          <div className="absolute bottom-8 right-12 flex gap-3">
            <div className="w-8 h-1.5 bg-slate-300 rounded-full" />
            <div className="w-4 h-1.5 bg-slate-300 rounded-full" />
            <div className="w-4 h-1.5 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (ads.length === 0) return null;

  const currentAdUrl = getImageUrl(ads[currentIndex]?.image);

  return (
    <div
      className="relative bg-white flex justify-center items-center min-h-screen overflow-hidden transition-colors duration-700"
    // style={{ backgroundColor: theme.bg1 || "#0f172a" }}
    >
      {/* 1. Background Blur Layer (Adds depth) */}
      <div
        className="absolute inset-0 opacity-30 blur-[100px] scale-150 transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentAdUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative z-10 w-[95vw] lg:w-[85vw] max-w-7xl group">

        {/* 2. Main Slider Container */}
        <div className="relative h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">

          {/* 3. Image Layer */}
          <div
            className={`w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out ${isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
            style={{ backgroundImage: `url(${currentAdUrl})` }}
          >
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* 4. Text Content (Optional - if your API provides titles) */}
          {/* <div className={`absolute bottom-12 left-8 md:left-16 transition-all duration-700 delay-100 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
              {ads[currentIndex]?.advertisement_title}
            </h2>
          </div> */}

          {/* 5. Modern Pagination Dots */}
          <div className="absolute bottom-8 right-12 flex gap-3">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(i);
                    setIsTransitioning(false);
                  }, 400);
                }}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? "bg-white w-8" : "bg-white/40 w-4 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* 6. Navigation Buttons (Visible on Hover) */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
        >
          <ChevronLeftIcon className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
};



export default Advertising;