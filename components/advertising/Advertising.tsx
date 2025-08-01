"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample data - replace with your actual data
const testimonials = [
  {
    name: "Sarah Johnson",
    product: "Premium Paper Notebook",
    description:
      "The quality of this notebook exceeded my expectations. Perfect for daily journaling.",
  },
  {
    name: "Michael Chen",
    product: "Recycled Paper Desk Set",
    description:
      "Sustainable and stylish. This desk set has transformed my workspace completely.",
  },
  {
    name: "Aisha Patel",
    product: "Arizona Collection Stationery",
    description:
      "The colors and texture are amazing. My clients love receiving notes on this stationery.",
  },
  {
    name: "David Rodriguez",
    product: "Paper Desk Organizer",
    description:
      "Functional and elegant. This organizer has helped me stay productive and organized.",
  },
];

// Sample video sources - replace with your actual videos
const videos = ["/paper.jpg", "/mainimg.png", "/buyer4.png", "/buyer3.png"];

const Advertising = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 500); // Half a second for transition
    }, 5000); // 4 seconds between transitions

    return () => clearInterval(interval);
  }, []);

  // Manual navigation
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const goToPrevious = () => {
    const newIndex =
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % testimonials.length;
    goToSlide(newIndex);
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-inter overflow-hidden relative ">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative rounded-3xl w-[90vw] md:w-[80vw] h-[80vh] bg-white/5 backdrop-blur-[16px] border border-white/20 shadow-2xl overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>

        <div className="relative z-10 p-6 md:p-12 h-full flex flex-col md:flex-row justify-between gap-8">
          {/* Left side - User testimonial */}
          <div className="relative w-full md:w-[45%] flex flex-col justify-center">
            <div
              className={`transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-200 uppercase rounded-full bg-white/10">
                Advertisment
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text">
                Loved by <br className="hidden md:block" />
                Our Customers
              </h1>

              <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b from-indigo-400 to-purple-500">
                <blockquote className="text-white/90 mb-6">
                  <p className="text-xl md:text-2xl font-light leading-relaxed italic mb-6 font-poppins">
                    "{testimonials[currentIndex].description}"
                  </p>
                  <footer className="not-italic">
                    <div className="text-xl font-semibold text-white font-poppins">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-lg font-medium text-gray-100 font-poppins">
                      {testimonials[currentIndex].product}
                    </div>
                  </footer>
                </blockquote>
              </div>

              {/* Carousel indicators */}
              <div className="flex space-x-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-white w-8"
                        : "bg-white/30 w-4"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentIndex && (
                      <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white animate-ping opacity-75"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Video carousel */}
          <div className="relative w-full md:w-[50%] h-[40vh] md:h-full flex items-center justify-center">
            <div
              className={`relative w-full h-full rounded-2xl overflow-hidden transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Video container with modern frame */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_20px_50px_rgba(124,58,237,0.3)] group-hover:shadow-[0_20px_50px_rgba(124,58,237,0.5)] transition-all duration-500">
                <div
                  className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${videos[currentIndex]})` }}
                >
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all hover:bg-black/30">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red/90 flex items-center justify-center transform transition-all hover:scale-110 hover:bg-white">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-indigo-600 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation arrows - hidden until hover */}
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* <button
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all transform hover:-translate-x-1"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all transform hover:translate-x-1"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Advertising;
