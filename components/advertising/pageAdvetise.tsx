"use client";

import { useTheme } from "@/hooks/use-theme";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface Advertisement {
  id: number;
  advertisement_title: string;
  page_type: string;
  image: string;
  created_at: string;
}

const PageAdvertising = () => {
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
    <div className="flex justify-center items-center h-[300px] animate-pulse">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (ads.length === 0) return null;

  const currentAdUrl = getImageUrl(ads[currentIndex]?.image);

  return (
    <div
      className="relative w-full overflow-hidden transition-colors duration-700 py-4"
    // style={{ backgroundColor: theme.bg1 || "#0f172a" }}
    >
      {/* 1. Background Blur Layer - Reduced opacity and scale for performance */}
      <div
        className="absolute inset-0 opacity-20 blur-[60px] scale-110 transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentAdUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative z-10 mx-auto w-[95vw] lg:w-[90vw] max-w-7xl group">

        {/* 2. Main Slider Container - CHANGED HEIGHT from 70vh to fixed pixels/aspect ratio */}
        <div className="relative h-[250px] md:h-[350px] lg:h-[400px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl border border-white/10">

          {/* 3. Image Layer */}
          <div
            className={`w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out ${isTransitioning ? "opacity-0 scale-102" : "opacity-100 scale-100"
              }`}
            style={{ backgroundImage: `url(${currentAdUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* 4. Navigation Dots - Adjusted position */}
          <div className="absolute bottom-4 right-6 flex gap-2">
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
                className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? "bg-white w-6" : "bg-white/40 w-2 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>

          {/* 5. Navigation Arrows - Scaled down */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageAdvertising;