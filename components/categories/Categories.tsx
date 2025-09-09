"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface Category {
  _id: number | string;
  name: string;
  description: string;
  icon: string;
}

const Categories = ({ title = "Explore Our", subtitle = "Categories" }) => {
  const firstControls = useAnimation();
  const secondControls = useAnimation();
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Resize check for mobile
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch Categories from Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`); // 👈 API URL
        const data = await res.json();
        console.log("Fetched categories:", data);

        // ✅ Handle both { data: [...] } and [...] responses
        const catArray = Array.isArray(data) ? data : data.data || [];
        setCategories(catArray);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Split categories into 2 rows safely
  const firstHalf = categories.slice(0, Math.ceil(categories.length / 2));
  const secondHalf = categories.slice(Math.ceil(categories.length / 2));
  const duplicatedFirstHalf = [...firstHalf, ...firstHalf];
  const duplicatedSecondHalf = [...secondHalf, ...secondHalf];

  // ✅ Animations
  useEffect(() => {
    firstControls.start({
      x: "-50%",
      transition: {
        ease: "linear",
        duration: 40,
        repeat: Infinity,
        repeatType: "loop",
      },
    });

    secondControls.start({
      x: "0%",
      transition: {
        ease: "linear",
        duration: 40,
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  }, [firstControls, secondControls]);

  if (loading) {
    return <p className="text-center text-white">Loading categories...</p>;
  }

  if (categories.length === 0) {
    return <p className="text-center text-red-500">No categories found!</p>;
  }

  return (
    <div className="w-full min-h-screen py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] [background-color:rgba(113,47,255,0.21)] rounded-full blur-[120px]"></div>
      <div className="text-center mb-12">
        <h5 className="text-primary-white text-[6vh] font-[900] font-[Poppins]">
          {title}
        </h5>
        <motion.div className="text-gray-100 text-[6vh] font-[900] mt-1 font-[Poppins]">
          {subtitle}
        </motion.div>
      </div>

      <div className="w-full overflow-hidden">
        {/* First row */}
        {!isMobile && (
          <motion.div
            ref={firstRef}
            initial={{ x: "0%" }}
            animate={firstControls}
            className="flex w-[200%] gap-8"
          >
            {duplicatedFirstHalf.map((cat, index) => (
              <div
                key={`first-${cat._id}-${index}`}
                className="flex-none w-1/6 relative"
              >
                <div className="bg-gray-100 border-2 border-[#0c66e4] text-[#000] rounded-xl p-6 shadow-xl h-56">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-16 h-16 bg-[#E6F6F4] rounded-2xl flex items-center justify-center shadow-md">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${cat.icon}`}
                          alt={cat.name}
                          className="w-auto h-16 rounded-xl"
                        />
                      </div>
                      <div className="ml-3">
                        <h6 className="text-[#000] font-semibold font-[Poppins]">
                          {cat.name}
                        </h6>
                      </div>
                    </div>
                    <p className="text-[#000] text-sm font-[Poppins] font-medium leading-relaxed mt-5">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Second row */}
        <motion.div
          ref={secondRef}
          initial={{ x: "-50%" }}
          animate={secondControls}
          className="flex w-[200%] gap-8 mt-8"
        >
          {duplicatedSecondHalf.map((cat, index) => (
            <div
              key={`second-${cat._id}-${index}`}
              className="md:flex-none sm:w-20 md:w-1/6 md:relative"
            >
              <div className="bg-gray-100 border-2 border-[#0c66e4] text-[#000] rounded-xl p-6 shadow-xl h-56 max-sm:h-[43vh]">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-16 h-16 bg-[#E6F6F4] rounded-2xl flex items-center justify-center shadow-md">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${cat.icon}`}
                        alt={cat.name}
                        className="w-auto h-16 rounded-xl"
                      />
                    </div>
                    <div className="ml-3">
                      <h6 className="text-[#000] font-semibold font-[Poppins]">
                        {cat.name}
                      </h6>
                    </div>
                  </div>
                  <p className="text-[#000] text-sm font-[Poppins] font-medium leading-relaxed mt-5">
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
