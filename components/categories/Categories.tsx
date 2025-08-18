"use client";
import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

const dummyData = [
  {
    _id: 1,
    name: "Kraft Paper",
    description:
      "Kraft paper is strong and eco-friendly.Perfect for wrapping, packaging, and crafts.",
    icon: "/kraftpaper.jpeg",
  },
  {
    _id: 2,
    name: "Duplex Board",
    description:
      "Duplex board is a sturdy, coated paperboard.Ideal for packaging boxes, cartons, and covers.",
    icon: "/duplexboard.jpeg",
  },
  {
    _id: 3,
    name: "Jumbo Tissue",
    description:
      "Jumbo tissue rolls are large parent tissue reels.Used to produce toilet paper, napkins, and facial tissues.",
    icon: "/jumbo.jpeg",
  },
  {
    _id: 4,
    name: "Copier Paper - A4",
    description:
      "A4 paper is a standard-sized sheet (210×297 mm).Commonly used for printing, writing, and office work.",
    icon: "/a4paper.jpeg",
  },
  {
    _id: 5,
    name: "Prime Paper",
    description:
      "Prime paper is high-quality, first-grade paper.Ideal for premium printing, packaging, and publishing.",
    icon: "/primepaper.jpeg",
  },
  {
    _id: 6,
    name: "Stock lot Papers",
    description:
      "Stock lot paper refers to surplus or overrun paper.Often sold at discounted prices for various commercial uses.",
    icon: "/stockpaper.jpeg",
  },
  {
    _id: 7,
    name: "Writing & Printing paper",
    description:
      "Writing and printing paper is designed for smooth, high-quality print results.Ideal for letters, documents, and professional printing projects.",
    icon: "/writingpaper.jpeg",
  },
  {
    _id: 8,
    name: "Gumming Sheets",
    description:
      "Gumming sheets are coated with adhesive for easy bonding.Used in labeling, packaging, and crafting applications.",
    icon: "/gumming.jpeg",
  },
  {
    _id: 9,
    name: "Art Paper",
    description:
      "Art paper is a smooth, high-quality paper ideal for artistic projects.Perfect for printing, sketching, and fine art applications.",
    icon: "/artpaper.jpeg",
  },
  {
    _id: 10,
    name: "Matt Paper",
    description:
      "Matte paper has a non-glossy, smooth finish.Ideal for prints with a soft, elegant look and minimal glare",
    icon: "/mattpaper.jpeg",
  },
  {
    _id: 11,
    name: "Cromo Paper",
    description:
      "Cromo paper is a high-quality coated paper with a glossy finish.Perfect for vibrant printing, brochures, and high-end packaging.",
    icon: "/cromopaper.jpeg",
  },
  {
    _id: 12,
    name: "S.B.S",
    description:
      "S.B.S. paper is a premium, bleached paperboard with a smooth, white surface.Ideal for packaging, labels, and high-quality printing applications.",
    icon: "/sbs.jpeg",
  },
  {
    _id: 13,
    name: "News Print",
    description:
      "Newsprint paper is a lightweight, inexpensive paper typically used for newspapers.Ideal for high-volume printing with quick turnaround times.",
    icon: "/newsprint.jpeg",
  },
];

const Categories = ({ title = "Explore Our", subtitle = "Categories" }) => {
  const router = useRouter();
  const firstControls = useAnimation();
  const secondControls = useAnimation();
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const firstHalfSymptoms = dummyData.slice(0, 5);
  const secondHalfSymptoms = dummyData.slice(5, 12);
  const duplicatedFirstHalf = [...firstHalfSymptoms, ...firstHalfSymptoms];
  const duplicatedSecondHalf = [...secondHalfSymptoms, ...secondHalfSymptoms];
  const animationDuration = 15;

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

  return (
    <div className="w-full min-h-screen    py-12 *:">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  h-[500px] [background-color:rgba(113,47,255,0.21)] rounded-full blur-[120px]"></div>
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
            onMouseEnter={() => firstControls.stop()}
            onMouseLeave={() =>
              firstControls.start({
                x: "-50%",
                transition: {
                  ease: "linear",
                  duration: animationDuration,
                  repeat: Infinity,
                  repeatType: "loop",
                },
              })
            }
          >
            {duplicatedFirstHalf.map((symptom, index) => (
              <div
                key={`first-${symptom._id}-${index}`}
                className="flex-none w-1/6 relative"
              >
                <div className="bg-gray-100 backdrop-blur-3xl  border-2 border-[#0c66e4]  text-[#000] rounded-xl  p-6  transition-transform duration-300  shadow-xl h-56 ">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-16 h-16 bg-[#E6F6F4] rounded-2xl flex items-center justify-center shadow-md">
                        <img
                          src={symptom.icon}
                          alt={symptom.name}
                          className="w-auto h-16 rounded-xl"
                        />
                      </div>
                      <div className="ml-3">
                        <h6 className="text-[#000] font-semibold font-[Poppins]">
                          {symptom.name}
                        </h6>
                      </div>
                    </div>
                    <p className="text-[#000] text-sm font-[Poppins] font-medium leading-relaxed mt-5">
                      {symptom.description}
                    </p>
                  </div>
                </div>
                {/* <button
                  onClick={() => handleConsult(symptom.name)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-[20px] shadow-md py-2 hover:-translate-y-1 transition"
                >
                  Consult Now
                </button> */}
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
          onMouseEnter={() => secondControls.stop()}
          onMouseLeave={() =>
            secondControls.start({
              x: "0%",
              transition: {
                ease: "linear",
                duration: animationDuration,
                repeat: Infinity,
                repeatType: "loop",
              },
            })
          }
        >
          {duplicatedSecondHalf.map((symptom, index) => (
            <div
              key={`second-${symptom._id}-${index}`}
              className="md:flex-none sm:w-20 md:w-1/6 md:relative"
            >
              <div className="sm:grid-cols-1 md:grid-cols-3">
                <div className="bg-gray-100 backdrop-blur-lg border-2 border-[#0c66e4] text-[#000] rounded-xl p-6 transition-transform duration-300 shadow-xl h-56 max-sm:h-[43vh] max-md:w-[50vw] max-sm:p-4">
                  <div className="p-4 max-sm:p-2">
                    <div className="flex items-center mb-3 max-sm:flex-col max-sm:items-start">
                      <div className="w-16 h-16 bg-[#E6F6F4] rounded-2xl flex items-center justify-center shadow-md max-sm:mb-2">
                        <img
                          src={symptom.icon}
                          alt={symptom.name}
                          className="w-auto h-16 rounded-xl"
                        />
                      </div>
                      <div className="ml-3 max-sm:ml-0">
                        <h6 className="text-[#000] font-semibold font-[Poppins]">
                          {symptom.name}
                        </h6>
                      </div>
                    </div>
                    <p className="text-[#000] text-sm font-[Poppins] font-medium leading-relaxed mt-5 max-sm:mt-2">
                      {symptom.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* <button
                onClick={() => handleConsult(symptom.name)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-[20px] shadow-md py-2 hover:-translate-y-1 transition"
              >
                Consult Now
              </button> */}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
