export default function ReadyToOrder() {
  return (
    <div className="border-t border-white border-b border-white  py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#FFF5E1]">
          Ready to
          <span className="text-gray-800"> Order ?</span>
        </h2>
        <p className="text-lg mb-8">
          Simplify your Metal sourcing and Fabrications with Metalbook. Order
          now and
          <br />
          experience the difference for yourself !
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-teal-700 transition">
            Schedule a Demo
          </button>
          <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
