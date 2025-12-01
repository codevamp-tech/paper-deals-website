"use client";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";

const stats = [
  {
    value: "1200+",
    title: "Paper Mills & Manufacturers",
    desc: "Connect with verified mills, converters, and large-scale producers.",
  },
  {
    value: "850+",
    title: "Active Product SKUs",
    desc: "From Kraft to Duplex to Copier, choose from our wide SKU catalog.",
  },
  {
    value: "300k+ MT",
    title: "Paper Supplied Nationwide",
    desc: "End-to-end trade handling with massive supply capability.",
  },
  {
    value: "15+",
    title: "Financing Providers",
    desc: "Simplified credit access for smoother bulk transactions.",
  },
  {
    value: "70+",
    title: "Logistics & Warehouse Partners",
    desc: "Pan-India logistics for mill-to-doorstep delivery.",
  },
  {
    value: "2000+",
    title: "Businesses Empowered",
    desc: "Serving SMEs, retailers, distributors & large buyers across India.",
  },
];

export default function PartnerWithUs({ isaboutpage }) {
  const { theme } = useTheme();

  return (
    <section className="bg-[#111] text-white py-16 px-6 md:px-20 rounded-none">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-primary-white mb-4">
          Partner With Us{" "}
          <span className={`${theme.Text}`}>
            To Grow
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Join India’s most trusted digital marketplace for the paper &
          packaging industry. We simplify sourcing, logistics, payments and
          supply chain — helping both sellers and buyers scale efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group bg-white text-black rounded-2xl shadow-lg p-6 overflow-hidden"
            style={{
              borderTop: `8px solid ${theme.Text}`,
            }}
          >
            <div
              className="text-3xl font-extrabold"
              style={{
                color: theme.Text,
              }}
            >
              {item.value}
            </div>
            <div className="mt-2 font-semibold">{item.title}</div>
            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>

            <img
              src="/getcredit.png"
              alt="Hover Visual"
              className="absolute bottom-4 right-4 w-16 h-16 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
