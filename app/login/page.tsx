"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const LoginSignup = () => {
    const [isSignup, setIsSignup] = useState(false); // State to toggle between Login and Signup
    const [isSignupFormVisible, setIsSignupFormVisible] = useState(false);

    const handleSignupClick = () => {
        setIsSignup(true);
        setIsSignupFormVisible(true);
    };

    const handleLoginClick = () => {
        setIsSignup(false);
        setIsSignupFormVisible(false);
    };

    return (
        <div className="signup-container flex items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-cyan-500">
            <div className=" absolute top-0 left-0 p-4 " >
            
            </div>

            <div
                className={`flex py-5 w-4/5 sm:w-3/4 lg:w-2/3 transition-all duration-500 ease-in-out ${isSignupFormVisible ? 'flex-row-reverse' : 'flex-row'
                    }`}
            >
                {/* Left Div - Image */}
                <div
                    className={`left-side w-full sm:w-2/5 bg-white p-5 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isSignupFormVisible ? 'translate-x-10' : '-translate-x-10'
                        }`}
                >
                    <img
                        src="/login.png"
                        alt="Signup Image"
                        className="object-cover w-full h-96 rounded-lg"
                    />
                </div>

                {/* Right Div - Form */}
                <div className="right-side w-full sm:w-3/5 bg-white  rounded-lg shadow-lg flex justify-center items-center p-5">
                    <div className="w-full sm:w-3/4 md:w-2/3">
                        <h1 className="text-3xl text-gray-800 font-bold text-center pb-10">{isSignup ? 'Create Account' : 'Log In'}</h1>

                        {/* Toggle between Login and Signup Forms */}
                        {isSignup ? (
                            <form className="signup-form space-y-2">
                                <div>
                                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullname"
                                        className="w-full p-4 bg-white border border-gray-300 text-black rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full p-4 bg-white border border-gray-300 text-black rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full p-4 bg-white border border-gray-300 text-black rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-md hover:bg-gradient-to-l hover:from-purple-700 hover:to-cyan-600 transition-all duration-300"
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                <p className="text-center text-black   py-2  text-sm">
                                    Already have an account?{' '}
                                    <span
                                        onClick={handleLoginClick}
                                        className="text-purple-600 cursor-pointer hover:underline ml-2"
                                    >
                                        Log in
                                    </span>
                                </p>
                            </form>
                        ) : (
                            <form className="login-form space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full p-4 bg-white border border-gray-300 text-black rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full p-4 bg-white border border-gray-300 text-black rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-md hover:bg-gradient-to-l hover:from-purple-700 hover:to-cyan-600 transition-all duration-300"
                                    >
                                        Login
                                    </button>
                                </div>

                                <p className="text-center text-black text-sm">
                                    Don't have an account?{' '}
                                    <span
                                        onClick={handleSignupClick}
                                        className="text-purple-600 cursor-pointer hover:underline ml-2"
                                    >
                                        Sign up
                                    </span>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
