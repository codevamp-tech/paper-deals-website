"use client";
import React, { useEffect, useRef } from "react";

export default function InfiniteCarousel() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const Culture = () => {
      // Clone the first few items to create the infinite effect
      const items = carousel.querySelectorAll(".carousel-item");
      const itemWidth = items[0].offsetWidth;
      const itemsToClone = Math.ceil(carousel.offsetWidth / itemWidth);

      for (let i = 0; i < itemsToClone; i++) {
        const clone = items[i].cloneNode(true);
        carousel.appendChild(clone);
      }
    };

    Culture();

    let position = 0;
    const speed = 0.5; // pixels per frame
    const firstItemWidth =
      carousel.querySelector(".carousel-item").offsetWidth + 16; // width + margin

    const animate = () => {
      position += speed;

      // Reset position when we've scrolled the width of one item
      if (position >= firstItemWidth) {
        position = 0;
        // Move first item to the end
        const firstItem = carousel.querySelector(".carousel-item");
        carousel.appendChild(firstItem);
      }

      carousel.style.transform = `translateX(-${position}px)`;
      requestAnimationFrame(animate);
    };

    const animation = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <div className="bg-white py-20 rounded-br-2xl rounded-bl-2xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-black text-center leading-tight pb-10">
        Culture at{" "}
        <span
          style={{
            color: "#8440e8",
          }}
        >
          Paper Deals
        </span>
      </h1>
      <div className="overflow-hidden mx-auto max-w-7xl px-4">
        <div
          ref={carouselRef}
          className="flex transition-transform"
          style={{ willChange: "transform" }}
        >
          {/* Formal event image */}
          <div className="carousel-item flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden mr-6">
            <img
              src="/mainimg.png"
              alt="Formal event"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Team celebration with trophy */}
          <div className="carousel-item flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden mr-6">
            <img
              src="/mainimg.png"
              alt="Team celebration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Award ceremony */}
          <div className="carousel-item flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden mr-6">
            <img
              src="/mainimg.png"
              alt="Award ceremony"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Office team photo */}
          <div className="carousel-item flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden mr-6">
            <img
              src="/mainimg.png"
              alt="Office team"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Game or activity */}
          <div className="carousel-item flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden mr-6">
            <img
              src="/mainimg.png"
              alt="Game activity"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Holiday celebration */}
          <div className="carousel-item flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden mr-6">
            <img
              src="/mainimg.png"
              alt="Holiday celebration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
