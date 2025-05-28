import React, { useState } from "react";

export default function Advertisement() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "abs", name: "ABS" },
    { id: "cpvc", name: "CPVC" },
    { id: "hdpe", name: "HDPE" },
    { id: "ldpe", name: "LDPE" },
    { id: "lldpe", name: "LLDPE" },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <section className=" py-12">
      <div className="container mx-auto px-4">
        {/* Category List */}
        <div className="flex gap-6 mb-8 justify-center ">
          {/* Featured Product Area */}
          <div className="relative rounded-xl overflow-hidden w-full md:w-[55vw]  h-[45vh]">
            <img
              src="adimg.webp"
              alt="advertisement"
              className="w-full h-auto"
              style={{
                borderRadius: "20px",
                minHeight: "45vh",
              }}
            />

            <button className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 py-3 rounded-lg md:rounded-full transition-all duration-200">
              Get Quotes
            </button>
          </div>

          {/* App Download Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-xl rounded-2xl p-4 md:p-6 lg:p-8 w-full md:w-3/4 lg:w-1/2 xl:w-1/4 min-h-[45vh] md:h-[45vh]  ">
            <div className="flex flex-col justify-between h-full w-full md:w-auto mb-6 md:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4 md:mb-2 text-center md:text-left">
                Download Our App
              </h3>
              <div className="flex-shrink-0 md:ml-4 self-center mt-4 md:mt-0">
                <img
                  src="/myapp.jpg"
                  alt="App Preview"
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 lg:mr-7 lg:justify-center lg:items-center object-cover rounded-full shadow-lg border-4 border-white mx-auto"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="block w-full md:w-32 hover:scale-105 transition-transform"
                >
                  <img
                    src="/appstore.png"
                    alt="App Store"
                    className="w-full h-auto object-contain"
                  />
                </a>
                <a
                  href="#"
                  className="block w-full md:w-32 hover:scale-105 transition-transform"
                >
                  <img
                    src="/googleplay.png"
                    alt="Google Play"
                    className="w-full h-auto object-contain"
                  />
                </a>
              </div>
            </div>
            {/* Centered Image Container */}
          </div>
        </div>
      </div>
    </section>
  );
}
