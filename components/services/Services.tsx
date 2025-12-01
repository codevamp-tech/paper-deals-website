import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Settings,
  DollarSign,
  Recycle,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function ServicesGrid() {
  const { theme } = useTheme();

  const services = [
    {
      icon: <ShoppingCart className="text-white" />,
      title: "Buying/Selling",
      description:
        "Get connected to more than 4000+ stakeholders in the paper industry.",
    },
    {
      icon: <Settings className="text-white" />,
      title: "Paper Fabrication",
      description: "Get seamless paper fabrication and processing solutions.",
    },
    {
      icon: <DollarSign className="text-white" />,
      title: "Finance",
      description:
        "Tailor-made financing solutions for your ease of transaction.",
    },
    {
      icon: <Recycle className="text-white" />,
      title: "Paper Recycling",
      description:
        "Aiming to be the most efficient marketplace for secondary papers.",
    },
  ];

  return (
    <div className={`py-10 ${theme.Bg}`}>
      <p
        className={`text-[6vh] font-[900] mt-1 font-[Poppins] flex justify-center ${theme.Text}`}
      >
        Our Services
      </p>
      <p
        className={`flex justify-center text-[3vh] text-center pb-4 pt-4 ${theme.maintext}`}
      >
        We are a team of 100+ who are passionate about making the world a better
        place.
      </p>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${theme.cardBg} p-6`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${theme.iconBg}`}>
                  {service.icon}
                </div>
                <div
                  className={`p-2 rounded-full bg-transparent border transition-all cursor-pointer $ `}
                >
                  <ArrowRight className={`h-4 w-4 `} />
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-2 ${theme.green}`}>
                {service.title}
              </h3>

              <p className={`${theme.descColor}`}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
