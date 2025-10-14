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
      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen gap-6 md:gap-8 py-10 px-4 bg-white">
        {/* SELLER CARD */}
        <div
          className="w-full max-w-2xl md:w-[40vw] lg:w-[50vw] xl:w-[42vw] bg-white rounded-2xl p-8 transition-all duration-300 flex flex-col"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
        >
          <div className="mb-6 text-center">
            <h1
              className="text-3xl md:text-4xl font-semibold mb-2"
              style={{ color: theme.Text }}
            >
              Become a <span className="text-black">Seller</span>
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Expand your reach with our global buyer <br /> network.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="bg-white p-5 rounded-xl text-center hover:-translate-y-1 transition-transform duration-300"
                style={{
                  boxShadow:
                    "rgba(17, 17, 26, 0.1) 0px 4px 8px, rgba(17, 17, 26, 0.05) 0px 8px 16px",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 mx-auto mb-3"
                />
                <h3 className="text-gray-800 font-semibold text-base">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => router.push("/B2B/become-a-seller")}
              className="mt-6 flex justify-center items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
              style={{backgroundColor:theme.bg1}}
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
