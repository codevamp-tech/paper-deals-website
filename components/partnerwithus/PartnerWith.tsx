"use client";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";

const stats = [
  {
    value: "1500+",
    title: "Global Suppliers",
    desc: "Access global network of 1500+ suppliers",
  },
  {
    value: "1000+",
    title: "Total SKUs Served",
    desc: "Order from range of 1000+ SKUs",
  },
  {
    value: "350k+ MT",
    title: "Material Delivered",
    desc: "Successfully delivered 350k+ MT till date",
  },
  {
    value: "10+",
    title: "Lending Partners",
    desc: "Onboarded 10+ lending partners",
  },
  {
    value: "60+",
    title: "Logistics Partners",
    desc: "Extensive network of 60+ 3PL partners",
  },
  {
    value: "2500+",
    title: "SMEs & Enterprises Powered",
    desc: "Empowered 2500+ businesses till date",
  },
];

export default function PartnerWithUs({ isaboutpage }) {
  const { theme } = useTheme();

  return (
    <section className="bg-[#111] text-white py-16 px-6 md:px-20 rounded-none">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold  leading-tight text-primary-white mb-4">
          Partner With Us{" "}
          <span
            style={{
              color: theme.Text,
            }}
          >
            To Enjoy
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Find the best deals worldwide from trusted suppliers. Our network
          makes buying and selling simpler, with trusted logistical operations
          and attractive financing deals.
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
            className="relative group bg-white text-black rounded-2xl shadow-lg p-6  overflow-hidden"
            style={{
              borderTop: `8px solid ${theme.Text}`,
            }}
          >
            {/* Stat content */}
            <div
              className="text-3xl font-extrabold "
              style={{
                color: theme.Text,
              }}
            >
              {item.value}
            </div>
            <div className="mt-2 font-semibold">{item.title}</div>
            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>

            {/* Hover Image */}
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
