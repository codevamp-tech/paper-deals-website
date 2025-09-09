"use client";

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

  // ✅ Fetch API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advertisement`); // 👈 API
        
        const data = await res.json();
        console.log("API Response:", data);
        setAds(data);

      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // ✅ Auto carousel
  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  if (loading) return <p className="text-white">Loading advertisements...</p>;
  if (ads.length === 0) return <p className="text-red-500">No ads found!</p>;

  // ✅ Date formatting function
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-inter overflow-hidden relative">
      <div className="relative rounded-3xl w-[90vw] md:w-[80vw] h-[80vh] bg-white/5 backdrop-blur-[16px] border border-white/20 shadow-2xl overflow-hidden group">
        <div className="relative z-10 p-6 md:p-12 h-full flex flex-col md:flex-row justify-between gap-8">
          {/* Left side - Ads text */}
          <div className="relative w-full md:w-[45%] flex flex-col justify-center">
            <div
              className={`transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-200 uppercase rounded-full bg-white/10">
                {ads[currentIndex]?.page_type || "Advertisement"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text">
                {ads[currentIndex]?.advertisement_title || "No Title"}
              </h1>

              <div className="text-sm text-gray-400 mt-2 font-poppins">
                {formatDate(ads[currentIndex]?.created_at)}
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative w-full md:w-[50%] h-[40vh] md:h-full flex items-center justify-center">
            <div
              className={`relative w-full h-full rounded-2xl overflow-hidden transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/${ads[currentIndex]?.image})`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
