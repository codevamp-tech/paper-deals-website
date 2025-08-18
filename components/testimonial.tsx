"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function TestimonialSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add responsive handling
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Full Stack Developer",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "The next-saas-stripe-starter repo has truly revolutionized my development workflow. With its comprehensive features and seamless integration with Stripe, I've been able to build and deploy projects faster than ever before. The documentation is clear and concise, making it easy to navigate through the setup process. I highly recommend next-saas-stripe-starter to any developer.",
    },
    {
      id: 2,
      name: "David Johnson",
      role: "DevOps Engineer",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "Thanks to next-saas-stripe-starter, I was able to streamline the entire process and get payments up and running in no time.",
    },
    {
      id: 3,
      name: "Emily Brown",
      role: "Marketing Manager",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "next-saas-stripe-starter has been an invaluable asset in my role as a marketing manager. With its seamless integration with Stripe, I've been able to launch targeted marketing campaigns with built-in payment functionality, allowing us to monetize our products and services more effectively.",
    },
    {
      id: 4,
      name: "Michael Wilson",
      role: "Project Manager",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "I'm impressed by the quality of code and clear documentation of next-saas-stripe-starter. Kudos to the team!",
    },
    {
      id: 5,
      name: "Alice Smith",
      role: "UI/UX Designer",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "Thanks to next-saas-stripe-starter, I've been able to create modern and attractive user interfaces in record time. The starter kit provides a solid foundation for building sleek and intuitive designs, allowing me to focus more on the creative aspects of my work.",
    },
    {
      id: 6,
      name: "Sophia Garcia",
      role: "Data Analyst",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "next-saas-stripe-starter provided me with the tools I needed to efficiently manage user data. Thank you so much!",
    },
    {
      id: 7,
      name: "Jason Stan",
      role: "Web Designer",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "Thanks to next-saas-stripe-starter, I've been able to create modern and attractive user interfaces in record time. The starter kit provides a solid foundation for building sleek and intuitive designs, allowing me to focus more on the creative aspects of my work.",
    },
  ];

  if (!mounted) return null;

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
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              style={{
                // background:
                //   "teso-gradeint",
                backdropFilter: "blur(48px)", // 3xl ≈ 48px
                border: "1px solid #fff",
                color: "#F1F5F9",
                borderRadius: "12px",
                padding: "24px",
                display: "inline-block", // Must be inline-block for column layout
                width: "100%",
                marginBottom: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="hover:shadow-lg hover:transform hover:scale-[1.02] bg-testo-gradient"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
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
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0",
                      color: "#333",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {testimonial.name}
                  </h3>
                  <p style={{ margin: "0", color: "gray", fontSize: "14px" }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p
                style={{
                  color: "#333",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
