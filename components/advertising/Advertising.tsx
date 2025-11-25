"use client";

import { useTheme } from "@/hooks/use-theme";
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
        setAds(data);
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [ads]);

  const getImageUrl = (image: string) => {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-lg">
        Loading advertisements...
      </div>
    );

  if (ads.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        No ads found!
      </div>
    );

  return (
    <div
      className="flex justify-center items-center min-h-screen overflow-hidden px-4"
      style={{ backgroundColor: theme.bg1 }}
    >
      <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:w-[85vw] lg:w-[80vw] h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div
          className={`w-full h-full bg-contain bg-center bg-no-repeat transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          style={{ backgroundImage: `url(${getImageUrl(ads[currentIndex]?.image)})` }}
        ></div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-white w-4" : "bg-gray-400/50"
                }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advertising;
