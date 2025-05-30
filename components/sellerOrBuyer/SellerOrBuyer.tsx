"use client";
import React from "react";
import Advertising from "../advertising/Advertising";

// const isMobile = window.matchMedia("(max-width: 768px)").matches;

const SellerOrBuyer = () => {
  return (
    <>
      <div className="flex justify-center items-center gap-16 min-h-screen font-inter overflow-hidden relative flex-col md:flex-row">
        {/* LEFT BOX */}
        <div className="relative rounded-2xl h-auto md:h-[90vh] w-[95%] md:w-[35.5vw] bg-black border-white/10 shadow-lg overflow-hidden border p-5 md:p-7 mx-auto">
          <div className="relative">
            <h1 className="text-[#8143e7] text-3xl sm:text-4xl md:text-[6vh] font-[500] font-[Poppins] mb-3">
              Become a <span className="text-white">Buyer</span>
            </h1>
            <p className="text-base sm:text-lg overflow-hidden max-h-20">
              Join as a buyer and unlock exclusive paper deals for your
              business. Start saving today!
            </p>
          </div>

          {/* main div 4 box */}
          <div className="flex flex-col md:flex-row justify-center mt-5 md:mt-7 gap-2">
            <div className="flex flex-col w-full md:w-1/2">
              {/* Top-left box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/buyer4.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Get Lowest Price
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-4">
                    Get rates at least 1% lower than the existing market rates
                  </p>
                </div>
              </div>

              {/* Bottom-left box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/getcredit.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Get Credit
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-5">
                    Do not worry about working capital. Grow with our credit
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-1/2">
              {/* Top-right box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/panindia.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Pan India & Global
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-4 font-light text-white">
                    World-class fulfillment for domestic and international
                    markets
                  </p>
                </div>
              </div>

              {/* Bottom-right box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/brandsku.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Multi Brand SKUs
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-5 font-light">
                    One stop shop for 3L+ SKU from multiple brands
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating image */}
          <div className="hidden md:flex absolute right-[20%] bottom-[-15%] h-[90%] md:h-[60%] w-[60%] md:w-[70%] bg-cover bg-center bg-[url('/image/carousel3.png')] drop-shadow-2xl animate-float"></div>
        </div>

        {/* RIGHT BOX */}
        <div className="p-5 md:p-7 relative rounded-2xl h-auto md:h-[90vh] w-[95%] md:w-[35.5vw] bg-black border-white/10 shadow-lg overflow-hidden border mx-auto">
          <div className="relative">
            <h1 className="text-[#8143e7] text-3xl sm:text-4xl md:text-[6vh] font-[500] font-[Poppins] mb-3">
              Become a <span className="text-white">Seller</span>
            </h1>
            <p className="text-base sm:text-lg overflow-hidden max-h-20">
              One stop shop for 3L+ SKU from multiple brands
            </p>
          </div>

          {/* main div 4 box */}
          <div className="flex flex-col md:flex-row justify-center mt-5 md:mt-7 gap-2">
            <div className="flex flex-col w-full md:w-1/2">
              {/* Top-left box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl max-h-52 h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/growbusiness.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Grow Business
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-4">
                    Get access to a global buyer base and grow 3x and more
                  </p>
                </div>
              </div>

              {/* Bottom-left box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/order.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[19px] font-normal leading-tight text-center flex justify-center mt-2">
                    High Order Volumes
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-4 font-light">
                    Get bigger order volumes from our large global buyer base
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-1/2">
              {/* Top-right box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/payment.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Advance Payments
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-5 font-light">
                    Get your payments upfront and let us worry about the credit
                  </p>
                </div>
              </div>

              {/* Bottom-right box */}
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-3xl h-44 p-3 m-1 rounded-2xl overflow-hidden">
                <div>
                  <img
                    className="w-[7vh] h-[7vh] object-cover mx-auto mt-2"
                    src="/service.png"
                    alt="paper about"
                  />
                  <span className="text-white text-sm sm:text-base md:text-[20px] font-normal leading-tight text-center flex justify-center mt-2">
                    Fulfillment Services
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-center mt-5 font-light">
                    End-to-end managed logistics while you focus on business
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating image */}
          <div className="hidden md:flex absolute right-[20%] bottom-[-15%] h-[90%] md:h-[60%] w-[60%] md:w-[70%] bg-cover bg-center bg-[url('/image/carousel3.png')] drop-shadow-2xl animate-float"></div>
        </div>
      </div>
      <Advertising />
    </>
  );
};

export default SellerOrBuyer;
