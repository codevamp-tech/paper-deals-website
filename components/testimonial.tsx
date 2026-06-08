"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/hooks/use-theme";
import { Quote } from "lucide-react";

export default function TestimonialSection() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]); // array rakho
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    setMode(storedMode);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonial/testimonials`
        );
        const data = await response.json();
        setTestimonials(data || []); // API ka response state me dal diya
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, []);

  const { theme } = useTheme();

  const SkeletonCard = () => (
    <div className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md flex flex-col">
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col justify-between h-[280px] shadow-sm animate-pulse">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-3"></div>
        </div>
        <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-wider bg-gray-100 text-gray-400">
              Testimonials
            </span>
          </div>
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-3"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-7xl mx-auto px-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const filteredTestimonials = testimonials.filter((t: any) => {
    if (!mode) return true;
    return t.type?.toLowerCase() === mode.toLowerCase();
  });

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 md:py-24 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-12 md:mb-16">
        <div className="inline-block mb-4">
          <span className={`text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-wider ${
            mode === "B2B" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
          }`}>
            Testimonials
          </span>
        </div>

        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-[Poppins] ${
          mode === "B2B"
            ? "bg-gradient-to-r from-blue-600 via-emerald-600 to-green-600 bg-clip-text text-transparent"
            : "text-blue-500"
        }`}>
          What Our Clients Say
        </h2>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Discover what our valued partners and clients have to say about their
          seamless experiences with Paper Deals.
        </p>
      </div>

      {/* Testimonials Grid / Flex Container */}
      <div className="flex flex-wrap justify-center items-start gap-6 md:gap-8 max-w-7xl mx-auto px-4">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((testimonial: any) => (
            <div
              key={testimonial.id}
              className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md"
            >
              {/* Card Item */}
              <div
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200
                           shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8
                           relative overflow-hidden group transform hover:scale-[1.02] hover:-translate-y-1"
              >
                {/* Quote Icon in Background */}
                <div className="absolute right-6 top-6 text-gray-100 transition-colors duration-300 pointer-events-none">
                  <Quote className={`w-12 h-12 opacity-15 transition-all duration-300 group-hover:scale-110 ${
                    mode === "B2B" ? "group-hover:text-green-500 group-hover:opacity-25" : "group-hover:text-blue-500 group-hover:opacity-25"
                  }`} />
                </div>

                <div>
                  {/* Quote text */}
                  <p className="text-gray-600 italic text-base md:text-lg leading-relaxed mb-6 relative z-10">
                    "{testimonial.para}"
                  </p>
                </div>

                {/* Author Details */}
                <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                    <Image
                      src={testimonial.profile || "/placeholder.svg"}
                      alt={testimonial.writer}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">
                      {testimonial.writer}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {testimonial.post}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No testimonials available.</p>
          </div>
        )}
      </div>
    </section>
  );
}

