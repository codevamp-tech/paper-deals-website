import React from "react";
import {
  ShoppingCart,
  Settings,
  DollarSign,
  Recycle,
  ArrowRight,
} from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      icon: <ShoppingCart className="text-white" />,
      title: "Buying/Selling",
      description:
        "Get connected to more than 4000+ stakeholders in the Pepar industry.",
      bgGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      hoverGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      iconBg:
        "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600",
    },
    {
      icon: <Settings className="text-white" />,
      title: "Pepar Fabrication",
      description: "Get seamless Pepar fabrication and processing solutions.",
      bgGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      hoverGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      iconBg:
        "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600",
    },
    {
      icon: <DollarSign className="text-white" />,
      title: "Finance",
      description:
        "Tailor-made financing solutions for your ease of transaction.",
      bgGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      hoverGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      iconBg:
        "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600",
    },
    {
      icon: <Recycle className="text-white" />,
      title: "Pepar Recycling",
      description:
        "Aiming to be the most efficient marketplace for secondary Pepars.",
      bgGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      hoverGradient:
        "bg-white backdrop-blur-3xl border border-[#fff] text-[#F1F5F9]",
      iconBg:
        "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600",
    },
  ];

  return (
    <div>
      <p
        className="text-primary-white text-[6vh] font-[900] mt-1 font-[Poppins]
      flex  justify-center"
      >
        Our Services
      </p>
      <p className="flex justify-center text-[3vh]  text-center  pb-4 pt-4 ">
        We are a team of 100+ who are passionate about making the world a better
        place.
      </p>
      <div className="max-w-6xl mx-auto p-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br ${service.bgGradient} ${service.hoverGradient} p-6 border border-gray-100`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${service.iconBg}`}>
                  {service.icon}
                </div>
                <div className="p-2 rounded-full bg-transparent border border-black transition-all cursor-pointer">
                  <ArrowRight className="h-4 w-4 text-[#000]" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-black mb-2">
                {service.title}
              </h3>

              <p className="text-black">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
