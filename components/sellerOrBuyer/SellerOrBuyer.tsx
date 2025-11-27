"use client";
import React from "react";
import Advertising from "../advertising/Advertising";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "next/navigation";

const SellerOrBuyer = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen w-full bg-white flex items-center justify-center py-10 px-4">
        {/* SELLER CARD - Full Viewport Design */}
        <div
          className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-6 md:p-8 transition-all duration-300"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 10px 25px, rgba(0, 0, 0, 0.04) 0px 5px 10px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1
              className={`text-2xl md:text-3xl  lg:text-4xl font-semibold mb-3 ${theme.Text}`}
            // style={{ color: theme.Text }}

            >
              Become a Seller
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Expand your reach with our global buyer network and grow your
              business exponentially
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              {
                icon: "/growbusiness.png",
                title: "Grow Business",
                desc: "Expand 3x with our network",
              },
              {
                icon: "/order.png",
                title: "High Order Volumes",
                desc: "Large consistent orders",
              },
              {
                icon: "/payment.png",
                title: "Advance Payments",
                desc: "Get paid upfront",
              },
              {
                icon: "/service.png",
                title: "Fulfillment Services",
                desc: "End-to-end logistics",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl text-center hover:-translate-y-1 transition-all duration-300"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 4px 12px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 mx-auto mb-3"
                />
                <h3 className="text-gray-800 font-medium text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => router.push("/B2B/become-a-seller")}
              className="text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 text-base"
              style={{ backgroundColor: theme.bg1 }}
            >
              Become A Seller
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerOrBuyer;
