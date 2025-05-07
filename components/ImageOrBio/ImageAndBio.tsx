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
    <div className="relative w-full max-w-[95vw] mx-auto px-4">
      {/* Second Div - Background Image */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 mix-blend-overlay"></div>
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
          <Image
            src="/mainimg.png"
            alt="Premium Paper Products"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <img
            src="/imageflow.png"
            alt="Overlay Image"
            className="absolute z-10 hidden sm:block"
            style={{
              top: "20vh",
              left: "15vw",
              width: "40vw",
              height: "auto",
              objectFit: "cover",
              marginLeft: "25vh",
            }}
          />
        </div>
      </div>

      {/* First Div - Overlay Content */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 w-full px-4">
        <div
          className="rounded-tl-xl rounded-tr-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[95vw] mx-auto"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(1px)",
          }}
        >
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl md:text-4xl">{item.icon}</div>
              <div>
                <h4 className="text-lg md:text-xl font-bold text-primary-white">
                  {item.value}
                </h4>
                <p className="text-sm text-white">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BioImageSec;
