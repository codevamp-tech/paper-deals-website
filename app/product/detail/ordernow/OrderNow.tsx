import React from "react";
import Link from "next/link";

const OrderNow = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2 flex items-center justify-center  p-6">
                    <img
                        src="/shirt.png"
                        alt="T-shirt"
                        className="max-w-full h-auto object-contain rounded-xl "
                    />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 text-black bg-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">T-Shirt/Paper Box</h1>
                    <p className="text-xl md:text-2xl font-semibold text-green-600 mb-4">INR 13</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-md text-gray-700">
                        <div><span className="font-semibold">Size:</span> 10 X 9.5 X 1 Inch</div>
                        <div><span className="font-semibold">Weight Capacity:</span> 5 - 10 Kg</div>
                        <div><span className="font-semibold">Paper Grades:</span> Virgin Kraft Paper</div>
                        <div><span className="font-semibold">Color:</span> Customised</div>
                        <div><span className="font-semibold">Finish:</span> Matte Finish</div>
                        <div><span className="font-semibold">Printing:</span> Lithography/Offset</div>
                        <div><span className="font-semibold">Material Grade:</span> 450 GSM</div>
                        <div><span className="font-semibold">Special Finish:</span> Additional Cut Out</div>
                        <div><span className="font-semibold">Properties:</span> Biodegradable, Moisture Proof</div>
                        <div><span className="font-semibold">Application:</span> Shirt Packaging</div>
                        <div><span className="font-semibold">Origin:</span> Made in India</div>
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
            <div className="py-6 px-4 md:px-10 ">
                <h1 className="text-black text-4xl font-semibold text-center  mb-6 py-10">
                    Find products similar to T Shirt/ Shirt Paper Box
                </h1>

                <div className="flex overflow-x-auto space-x-4 md:space-x-5 px-1   p-10">
                    {[
                        { img: "/1.jpg", title: "Kraft Paper Shirt Saree Packaging Box", brand: "Saraswati Enterprises", price: "10" },
                        { img: "/2.jpg", title: "16.5 X 12 X 3.5 Inch Saree Packing Box", brand: "Tannu Packaging", price: "22" },
                        { img: "/3.jpg", title: "Kraft Paper T Shirt Box", brand: "Vaishali Ads & Prints", price: "7" },
                        { img: "/4.jpg", title: "T Shirt /shirt paper Box", brand: "Print Plus", price: "12" },
                        { img: "/5.jpg", title: "T Shirt Packaging Box", brand: "Colour Drops", price: "9" },
                        { img: "/6.jpg", title: "T Shirt Packaging Box", brand: "SS Creations", price: "18.50" },
                    ].map((product, idx) => (
                        <div
                            key={idx}
                            className="min-w-[180px] sm:min-w-[200px] rounded-lg shadow-md overflow-hidden bg-white flex-shrink-0"
                        >
                            <img src={product.img} alt="box" className="w-full h-48 object-cover" />
                            <button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 w-full text-sm sm:text-lg transition duration-300">
                                Get Best Price
                            </button>
                            <div className="text-sm sm:text-md px-3 text-gray-700">
                                <span className="font-bold block">{product.title}</span>
                                <p>{product.brand}</p>
                                <p className="text-xl font-semibold text-black mb-3">
                                    INR {product.price} <span className="text-gray-400">/Piece</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderNow;
