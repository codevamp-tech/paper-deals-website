// Importing necessary components in your Next.js file
import RequirementModal from "@/components/modal/TellUsModal";
import { useState } from "react";

const categories = [
  { id: "all", name: "All" },
  { id: "kraft-paper", name: "Kraft Paper" },
  { id: "board-paper", name: "Board Paper" },
  { id: "tissue-paper", name: "Tissue Paper" },
  { id: "office-paper", name: "Office Paper" },
  { id: "premium-paper", name: "Premium Paper" },
  { id: "stock-lot", name: "Stock Lot Paper" },
  { id: "writing-printing", name: "Writing & Printing Paper" },
  { id: "adhesive-paper", name: "Gumming / Adhesive Paper" },
  { id: "art-paper", name: "Art Paper" },
  { id: "matt-paper", name: "Matt Paper" },
  { id: "coated-paper", name: "Coated / Cromo Paper" },
  { id: "sbs-paper", name: "SBS Paper" },
  { id: "newsprint", name: "Newsprint Paper" },
];

export default function PriceList() {
  const data = [
    {
      product: "Kraft Paper",
      brand: "FORTUNE",
      location: "EX - Delhi",
      price: "₹50,000 / MT",
      time: "2 hours ago",
      image: "/kraftpaper.jpeg", // Added image path
    },
    {
      product: "Duplex Board",
      brand: "FORTUNE",
      location: "EX - Amritsar",
      price: "₹49,700 / MT",
      time: "2 hours ago",
      image: "/duplexboard.jpeg",
    },
    {
      product: "Jumbo Tissue",
      brand: "MONO",
      location: "EX - Ahmedabad",
      price: "Login To View",
      time: "4 hours ago",
      image: "/jumbo.jpeg",
    },
    {
      product: "Copier Paper - A4",
      brand: "VIBRANT",
      location: "EX - Ahmedabad",
      price: "₹72,000 / MT",
      time: "8 hours ago",
      image: "/a4paper.jpeg",
    },
    {
      product: "Prime Paper",
      brand: "BHAGWATI",
      location: "EX - Nashik",
      price: "Login To View",
      time: "1 hour ago",
      image: "/primepaper.jpeg",
    },
    {
      product: "Stock lot Papers",
      brand: "MOIRA",
      location: "EX - Wada",
      price: "Login To View",
      time: "Yesterday",
      image: "/stockpaper.jpeg",
    },
    {
      product: "Writing & Printing paper",
      brand: "FORTUNE",
      location: "EX - Mumbai",
      price: "₹62,500 / MT",
      time: "3 hours ago",
      image: "/writingpaper.jpeg",
    },
    {
      product: "Gumming Sheets",
      brand: "MONO",
      location: "EX - Surat",
      price: "Login To View",
      time: "6 hours ago",
      image: "/gumming.jpeg",
    },
    {
      product: "Art Paper",
      brand: "VIBRANT",
      location: "EX - Delhi",
      price: "₹78,000 / MT",
      time: "5 hours ago",
      image: "/artpaper.jpeg",
    },
    {
      product: "Matt Paper",
      brand: "BHAGWATI",
      location: "EX - Jaipur",
      price: "₹74,500 / MT",
      time: "2 days ago",
      image: "/mattpaper.jpeg",
    },
    {
      product: "Cromo Paper",
      brand: "MOIRA",
      location: "EX - Pune",
      price: "Login To View",
      time: "7 hours ago",
      image: "/cromopaper.jpeg",
    },
    {
      product: "S.B.S",
      brand: "FORTUNE",
      location: "EX - Hyderabad",
      price: "₹85,000 / MT",
      time: "1 day ago",
      image: "/sbs.jpeg",
    },
    {
      product: "News Print",
      brand: "MONO",
      location: "EX - Kolkata",
      price: "₹42,000 / MT",
      time: "Today",
      image: "/newsprint.jpeg",
    },
    {
      product: "Kraft Paper",
      brand: "VIBRANT",
      location: "EX - Chennai",
      price: "Login To View",
      time: "2 days ago",
      image: "/kraftpaper.jpeg",
    },
    {
      product: "Duplex Board",
      brand: "BHAGWATI",
      location: "EX - Indore",
      price: "₹53,500 / MT",
      time: "5 hours ago",
      image: "/duplexboard.jpeg",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSignedIn, setIsSignedIn] = useState(false); // You would get this from your auth context

  const handleBuyClick = () => {
    if (!isSignedIn) {
      setIsContactModalOpen(true);
    } else {
      // User is signed in, proceed with purchase
      console.log("Proceeding with purchase...");
    }
  };

  const ContactSellerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [mobileNumber, setMobileNumber] = useState("");
    const [country, setCountry] = useState("India");

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
      console.log("Contact form submitted");
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Contact Seller
            </h2>
            <p className="text-gray-600 mb-6">
              Get details on your mobile quickly
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">
                  Mobile Number
                </label>
                <div className="flex">
                  <div className="flex items-center justify-center px-4 bg-gray-100 rounded-l-lg border border-r-0 border-gray-300">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your mobile"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Canada</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800">
                  JCB NXT 225LC M Excavator, 110 kW
                </h3>
                <p className="text-gray-600 text-sm">
                  Sold By - JCB India Limited, Faridabad, Haryana
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="bg-gray-100 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12  ">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Kraft & Board Paper Most Viewed Price
        </h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 mx-auto rounded-full"></div>
      </div>

      {/* Button Group - Now Responsive */}
      <div className="flex flex-wrap justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
            px-4 py-2 
            mx-2 mb-2 
            rounded-lg 
            text-black 
             
            text-sm sm:text-base 
            ${
              selectedCategory === category.id
                ? " text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                : "bg-gray-100 font-medium"
            }
          `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid for Cards - Already Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.product}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{item.time}</span>
                  </div>
                </div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                  {item.brand}
                </span>
              </div>

              {/* Product Image and Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="flex justify-center sm:ml-4 mt-4 sm:mt-0">
                  <img
                    src={item.image || "/mainimg.png"}
                    alt={item.product}
                    style={{
                      width: "auto",
                      height: "20vh",
                      borderRadius: "20px",
                    }}
                  />
                </div>
                <div className="text-center sm:text-left flex flex-col sm:ml-5 mt-5">
                  <div className="flex items-center text-gray-700 justify-center sm:justify-start">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item.location}</span>
                  </div>
                  <div className="mt-3 mb-4">
                    <p
                      className={`text-2xl font-extrabold ${
                        item.price.includes("Login")
                          ? "text-gray-500"
                          : "text-blue-600"
                      }`}
                    >
                      {item.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  onClick={handleBuyClick}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105"
                >
                  Buy
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105 t">
                  Contact
                </button>
              </div>

              {/* Tell Us Button */}
              <div className="flex justify-center items-center mt-3">
                <button
                  className="text-white px-6 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                  onClick={() => setIsModalOpen(true)}
                >
                  Tell Us YOur Requirement
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Modals */}
        <RequirementModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <ContactSellerModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    </div>
  );
}
