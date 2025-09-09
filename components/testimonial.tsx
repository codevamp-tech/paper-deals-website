"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function TestimonialSection() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]); // array rakho

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

  if (!mounted) return null;
  if (loading) return <p className="text-center mt-10">Loading testimonials...</p>;

  return (
    <div
      style={{
        padding: "40px 20px",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <p
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#fff] text-[6vh] font-[900] mt-1 font-[Poppins]
           flex  justify-center mt-10"
        >
          Testimonials
        </p>
        <p className="flex justify-center text-[3vh] mt-1 mb-11 ">
          Discover what our valued partners and clients have to say about their
          seamless experiences with paperbook.
        </p>
        <div
          style={{
            columnCount: isMobile ? 1 : 3,
            columnGap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {testimonials.length > 0 ? (
            testimonials.map((testimonial: any) => (
              <div
                key={testimonial.id}
                style={{
                  backdropFilter: "blur(48px)",
                  border: "1px solid #fff",
                  color: "#F1F5F9",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "inline-block",
                  width: "100%",
                  marginBottom: "20px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="hover:shadow-lg hover:transform hover:scale-[1.02] bg-testo-gradient"
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      position: "relative",
                      marginRight: "12px",
                    }}
                  >
                    <Image
                      src={testimonial. profile || "/placeholder.svg"}
                      alt={testimonial.writer}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: "0", color: "#333", fontSize: "18px", fontWeight: "600" }}>
                      {testimonial.writer}
                    </h3>
                    <p style={{ margin: "0", color: "gray", fontSize: "14px" }}>
                      {testimonial.post}
                    </p>
                  </div>
                </div>
                <p style={{ color: "#333", fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
                  "{testimonial.para}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No testimonials available</p>
          )}
        </div>
      </div>
    </div>
  );
}
