"use client";

import { useState } from "react";

export default function ContactSellerModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("India");

  const openModal = () => {
    if (!isSignedIn) {
      setIsModalOpen(true);
    } else {
      // User is signed in, proceed with purchase
      alert("Proceeding with purchase...");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert(`Contact request submitted for mobile: ${mobileNumber}`);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          JCB NXT 225LC M Excavator
        </h1>
        <p className="text-gray-600 mb-6">110 kW - Excellent Condition</p>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">₹ 25,50,000</p>
            <p className="text-sm text-gray-500">Faridabad, Haryana</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setIsSignedIn(!isSignedIn)}
            className={`px-4 py-2 rounded-lg ${
              isSignedIn
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600"
            } text-white transition-colors`}
          >
            {isSignedIn ? "Signed In" : "Signed Out"}
          </button>

          <button
            onClick={openModal}
            className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105"
          >
            Buy
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Click the left button to toggle sign-in status, then try the Buy
          button
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Contact Seller
              </h2>
              <p className="text-gray-600 mb-6">
                Get details on your mobile quickly
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-4 bg-gray-100 rounded-l-lg border border-r-0 border-gray-300">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your mobile"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Your Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Canada</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800">
                    JCB NXT 225LC M Excavator, 110 kW
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sold By - JCB India Limited, Faridabad, Haryana
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
