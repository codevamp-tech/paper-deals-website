"use client";
import { useTheme } from "@/hooks/use-theme";

export default function ReadyToOrder() {
  const { theme } = useTheme();

  return (
    <div
      className="py-16 px-6 text-white "
      style={{
        backgroundColor: theme.bg1,
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
          Ready to
          <span className="text-white"> Order ?</span>
        </h2>
        <p className="text-lg mb-8">
          Simplify your paper sourcing and Fabrications with paperbook. Order
          now and
          <br />
          experience the difference for yourself !
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-teal-700 transition">
            Schedule a Demo
          </button>
          <button className="bg-black  font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
