"use client";
import React from "react";
import Advertising from "../advertising/Advertising";

const SellerOrBuyer = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen gap-6 md:gap-8 py-10 px-4">
        {/* BUYER CARD
        <div className="w-full max-w-md md:w-[40vw] bg-white  border border-none  rounded-xl p-6  transition-colors h-[70vh] sm:h-[45vh] md:h-[auto] flex flex-col">
          <div className="mb-6">
            <h1 className="text-[#8143e7] text-3xl md:text-4xl font-semibold mb-2">
              Become a <span className="text-black">Buyer</span>
            </h1>
            <p className="text-gray-800">
              Join as a buyer and unlock exclusive paper deals for your
              business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: "/buyer4.png",
                title: "Get Lowest Price",
                desc: "Rates 1% lower than market",
              },
              {
                icon: "/getcredit.png",
                title: "Get Credit",
                desc: "Grow with working capital",
              },
              {
                icon: "/panindia.png",
                title: "Pan India & Global",
                desc: "Worldwide fulfillment",
              },
              {
                icon: "/brandsku.png",
                title: "Multi Brand SKUs",
                desc: "300,000+ SKUs available",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#fff] p-4 rounded-lg "
                style={{
                  boxShadow:
                    "rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-auto h-10 mx-auto mb-3"
                />
                <h3 className="text-gray-800 text-center font-medium">
                  {item.title}
                </h3>
                <p className="text-gray-800 text-xs text-center mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <a href="/buyers">
            <div className="flex justify-center">
              <button className="mt-4 flex justify-center items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
                Become A Seller
              </button>
            </div>
          </a>
        </div> */}

        {/* SELLER CARD */}
        <div className="w-full max-w-2x1 md:w-[40vw]  lg:w-[50vw] xl:w-[42vw] bg-white   rounded-2xl p-8   transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-[#8143e7] text-3xl md:text-4xl font-semibold mb-2">
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

          <a href="/become-a-seller">
            <div className="flex justify-center">
              <button className="mt-4 flex justify-center items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
                Become A Seller
              </button>
            </div>
          </a>
        </div>
      </div>

    </>
  );
};

export default SellerOrBuyer;
