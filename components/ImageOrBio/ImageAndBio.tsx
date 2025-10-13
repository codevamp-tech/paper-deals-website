import React from "react";
import Image from "next/image";

const BioImageSec: React.FC = () => {
  const stats = [
    {
      icon: "💰",
      value: "400K+",
      label: "Raw Materials Prices",
    },
    {
      icon: "🏭",
      value: "1 Million+",
      label: "SMEs Empowered",
    },
    {
      icon: "🚚",
      value: "500K+",
      label: "Orders Delivered",
    },
    {
      icon: "🌍",
      value: "30+",
      label: "Countries Served",
    },
  ];

  return (
    <div className="relative w-full max-w-[95vw] mx-auto px-4 h-[8vh] ">
      {/* Second Div - Background Image */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 mix-blend-overlay"></div>
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
          {/* <Image
            src="/mainimg.png"
            alt="Premium Paper Products"
            fill
            className="object-cover w-full h-full"
            priority
          /> */}
        </div>
      </div>

      {/* First Div - Overlay Content */}
      {/* First Div - Overlay Content */}
      <div className="absolute top-[-6vh] sm:top-[-10vh] md:top-[-10] left-1/2 transform -translate-x-1/2 z-20 w-full px-2 xs:px-3 sm:px-4">
        <div
          className="rounded-tl-xl rounded-tr-xl shadow-lg p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 max-w-[95vw] mx-auto"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(1px)",
          }}
        >
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-primary-white truncate">
                  {item.value}
                </h4>
                <p className="text-xs xs:text-sm text-white truncate">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="flex justify-center items-center text-center mt-10">
          <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight justify-center w-[80vw] ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#fff]">
              Revolutionize
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#aaa] ">
              Your Business with Premium Solutions
            </span>
          </h1>
        </div> */}
      </div>
    </div>
  );
};

export default BioImageSec;
