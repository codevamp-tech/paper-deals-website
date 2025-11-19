import React, { useState, useEffect } from "react";

export default function Advertisement() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentImage, setCurrentImage] = useState(0);


  const images = [
    "/adimg.webp",
    "/banner2.png",
    "/banner3.jpg",
    // add more images as needed
  ];
  const nextSlide = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentImage(index);
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 mb-8 justify-center">
          {/* Carousel Container */}
          <div className="relative rounded-xl overflow-hidden w-full md:w-full h-[55vh] bottom-10">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="advertisement"
                className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
                style={{ borderRadius: "20px" }}
              />
            ))}

            {/* Get Quotes Button */}
            <button className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 py-3 rounded-lg md:rounded-full transition-all duration-200 z-10">
              Get Quotes
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute  top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90   w-10 h-40 flex items-center justify-center transition-all duration-200 z-10"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90  w-10 h-40 flex items-center justify-center transition-all duration-200 z-10"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImage
                      ? "bg-white scale-125"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
