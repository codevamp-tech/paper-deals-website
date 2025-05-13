"use client"
import React from 'react';

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-cyan-500">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full px-6 py-12 space-y-6 md:space-y-0 md:space-x-12">
        {/* Left div */}
        <div className="flex justify-center w-full   md:w-1/2 ">
          <img
            src="404.png"
            alt="Page not found"
            className="object-cover w-full h-auto  max-w-2xl   "
          />
        </div>

        {/* Right div */}
        <div className="flex flex-col justify-center items-center text-center md:text-left text-white">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">Oops! Page not found</h1>
          <p className="text-xl mb-6">The page you are looking for might have been moved or deleted.</p>
          <button
            onClick={handleGoBack}
            className=" py-2 px-6 shadow-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-md hover:bg-gradient-to-l hover:from-purple-700 hover:to-cyan-600 transition-all duration-300">
      
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
