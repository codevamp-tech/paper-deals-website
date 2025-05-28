import React from "react";
import Link from "next/link";

const OrderNow = () => {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <img
            src="/shirt.png"
            alt="T-shirt"
            className="max-w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 text-black bg-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            T-Shirt/Paper Box
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-green-600 mb-4">
            INR 13
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-md text-gray-700">
            <div>
              <span className="font-semibold">Size:</span> 10 X 9.5 X 1 Inch
            </div>
            <div>
              <span className="font-semibold">Weight Capacity:</span> 5 - 10 Kg
            </div>
            <div>
              <span className="font-semibold">Paper Grades:</span> Virgin Kraft
              Paper
            </div>
            <div>
              <span className="font-semibold">Color:</span> Customised
            </div>
            <div>
              <span className="font-semibold">Finish:</span> Matte Finish
            </div>
            <div>
              <span className="font-semibold">Printing:</span>{" "}
              Lithography/Offset
            </div>
            <div>
              <span className="font-semibold">Material Grade:</span> 450 GSM
            </div>
            <div>
              <span className="font-semibold">Special Finish:</span> Additional
              Cut Out
            </div>
            <div>
              <span className="font-semibold">Properties:</span> Biodegradable,
              Moisture Proof
            </div>
            <div>
              <span className="font-semibold">Application:</span> Shirt
              Packaging
            </div>
            <div>
              <span className="font-semibold">Origin:</span> Made in India
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 py-3 w-full sm:w-1/2 rounded-full text-lg transition duration-300">
              Order Now
            </button>
            <button className="bg-black text-white px-6 py-3 w-full sm:w-1/2 rounded-full text-lg hover:bg-gray-800 transition duration-300">
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="py-12 px-4 md:px-10 bg-black">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-10 relative">
          Find products similar to T Shirt/ Shirt{" "}
          <span className="text-[#8143e7]">Paper Box</span>
        </h1>

        <div className="flex overflow-x-auto scroll-smooth space-x-5 scrollbar-hide px-1">
          {[
            {
              img: "/1.jpg",
              title: "Kraft Paper Shirt Saree Packaging Box",
              brand: "Saraswati Enterprises",
              price: "10",
            },
            {
              img: "/2.jpg",
              title: "16.5 X 12 X 3.5 Inch Saree Packing Box",
              brand: "Tannu Packaging",
              price: "22",
            },
            {
              img: "/3.jpg",
              title: "Kraft Paper T Shirt Box",
              brand: "Vaishali Ads & Prints",
              price: "7",
            },
            {
              img: "/4.jpg",
              title: "T Shirt /shirt paper Box",
              brand: "Print Plus",
              price: "12",
            },
            {
              img: "/5.jpg",
              title: "T Shirt Packaging Box",
              brand: "Colour Drops",
              price: "9",
            },
            {
              img: "/6.jpg",
              title: "T Shirt Packaging Box",
              brand: "SS Creations",
              price: "18.50",
            },
          ].map((product, idx) => (
            <div
              key={idx}
              className="min-w-[220px] max-w-[220px] rounded-2xl shadow-md overflow-hidden bg-[#000] flex-shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-[#8143e7]"
            >
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4 flex flex-col justify-between h-[160px]">
                <div className="mb-2">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-black text-xs mt-1">{product.brand}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-white">
                    ₹{product.price}
                    <span className="text-[#aaa] text-sm font-normal">
                      {" "}
                      /Piece
                    </span>
                  </p>
                  <button className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm py-2 rounded-md transition-all duration-300">
                    Get Best Price
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderNow;
