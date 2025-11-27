"use client"
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder"
import PartnerWithUs from "@/components/partnerwithus/PartnerWith"
import FaqSection from "@/components/faqSection/FaqSection"
import { useTheme } from "@/hooks/use-theme"
import InfiniteCarousel from "./CulturePaperdeals"

export default function AboutUs() {
  const { theme } = useTheme()

  return (
    <section className="w-full bg-[#F8FDFB]">
      {/* Hero Section */}
      <div className="w-full px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-300 to-cyan-300 -z-10"></div>
          <img
            src="/about-us1.png"
            alt="Paper Deals B2B E-commerce Platform - Supply chain workflow visualization showing raw materials, manufacturing, quality checking, platform, logistics, and buyer orders"
            loading="lazy"
            width={1200}
            height={200}
            className="w-full h-auto object-contain  rounded-2xl"
          />
        </div>
      </div>

      {/* Company Background Section */}
      <div className="w-full bg-[#111111] rounded-tl-3xl rounded-tr-3xl">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
              {/* Company Overview */}
              <div className="space-y-6">
                <span
                  className="inline-block px-3 py-1 text-sm font-medium text-white bg-opacity-30 rounded-full"
                  style={{ backgroundColor: theme.bg1 }}
                >
                  About Our Company
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
                  Pioneering <span className={`${theme.Text}`}>Sustainable</span> Paper Solutions
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                  Established in 2022 under the renowned Kay Group, Kay Paper Deals is a next-generation B2B digital
                  marketplace designed to connect paper buyers and sellers across India. With over two decades of legacy
                  from Kay Group (established in 2000), we bring together industry experience and modern technology to
                  create a seamless online ecosystem for the paper and packaging community.
                </p>
              </div>

              {/* Key Offerings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Kraft Paper",
                    description: "Premium quality kraft paper for diverse applications",
                  },
                  {
                    title: "Duplex Boards",
                    description: "High-grade duplex boards for packaging solutions",
                  },
                  {
                    title: "Tissue Products",
                    description: "Sustainable tissue products for various industries",
                  },
                  {
                    title: "Recycled Paper",
                    description: "Eco-friendly recycled paper options",
                  },
                  {
                    title: "Absorbent Paper",
                    description: "Specialized absorbent paper for industrial use",
                  },
                  {
                    title: "Specialty Grades",
                    description: "Custom specialty paper grades for unique needs",
                  },
                ].map((offering, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.bg1 }}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{offering.title}</h4>
                      <p className="text-sm text-gray-400">{offering.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white py-8 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Our Mission & Vision</h2>
              <p className="text-lg text-gray-600">
                Digitizing India's paper supply chain while empowering manufacturers, traders, and recyclers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission Card */}
              <div className="space-y-4 p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.bg1 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To digitize India's paper supply chain while empowering manufacturers, traders, and recyclers with
                  tools to expand their reach, enhance productivity, and promote sustainable practices.
                </p>
              </div>

              {/* Vision Card */}
              <div className="space-y-4 p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.bg1 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To make the paper industry smarter, greener, and globally competitive by blending technology with
                  tradition, creating a seamless online ecosystem for the entire paper and packaging community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Our Core Values</h2>
              <p className="text-lg text-gray-600">
                The principles that guide every decision and action at Kay Paper Deals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Transparency",
                  description: "Building trust through honest and open trade",
                  icon: "🔍",
                },
                {
                  title: "Sustainability",
                  description: "Promoting eco-friendly and recycled paper products",
                  icon: "🌱",
                },
                {
                  title: "Innovation",
                  description: "Leveraging technology to simplify business processes",
                  icon: "⚡",
                },
                {
                  title: "Community",
                  description: "Connecting stakeholders across the paper value chain",
                  icon: "🤝",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Founder's Legacy Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <span
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: theme.bg1, color: "white" }}
                >
                  Founder's Legacy
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  Late Shri Ravi Kumar Agarwal
                </h2>
                <p className="text-lg font-semibold text-gray-700">Founder, Kay Group</p>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The success of Kay Paper Deals Pvt. Ltd. is deeply rooted in the legacy of Late Shri Ravi Kumar
                  Agarwal, the visionary founder of Kay Group. With more than 27 years of expertise in the paper
                  industry, Shri Agarwal laid the groundwork for a company built on quality, integrity, and sustainable
                  growth.
                </p>
                <p>
                  A graduate in Pulp & Paper Engineering (1986), he began his career with Gaurav Paper Mill Ltd.
                  (Nagpur) and went on to serve reputed paper mills including Agarwal Duplex Board Ltd., Cheema Duplex
                  Paper Mill Ltd., and Dev Priya Products Ltd.
                </p>
                <p>
                  His dedication to technical excellence and collaborative growth transformed Kay Group from a small
                  trading unit into a respected national enterprise. His legacy of teamwork, innovation, and ethical
                  leadership continues to inspire Kay Paper Deals' mission to modernize the paper industry while staying
                  true to the timeless values he instilled.
                </p>
              </div>

              {/* Key Achievements */}
              <div className="pt-4 space-y-3">
                <p className="font-semibold text-gray-900">Key Milestones:</p>
                <ul className="space-y-2">
                  {[
                    "27+ years of expertise in paper industry",
                    "Pulp & Paper Engineering graduate (1986)",
                    "Transformed Kay Group into national enterprise",
                    "Built company on quality and integrity",
                  ].map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${theme.Text}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      // style={{ color: theme.Text }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right - Image Placeholder */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <img
                  src="/mainimg.png"
                  alt="Late Shri Ravi Kumar Agarwal - Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Managing Director's Message Section */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Image */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <img
                  src="/mainimg.png"
                  alt="Mr. Tanuj Agarwal - Managing Director"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <span
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: theme.bg1, color: "white" }}
                >
                  Leadership
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  Mr. Tanuj Agarwal
                </h2>
                <p className="text-lg font-semibold text-gray-700">Managing Director, Kay Paper Deals Pvt. Ltd.</p>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A second-generation entrepreneur, Mr. Tanuj Agarwal is the driving force behind Kay Paper Deals Pvt.
                  Ltd. and the visionary behind its digital transformation. With a strong academic foundation — B.Com
                  (Delhi University), BBA (Jodhpur University), MBA (JP School of Business), and a degree in Interior
                  Design (IIFT) — Tanuj combines creativity with strategic business acumen.
                </p>
                <p>
                  Joining the family business in 2010, he played a pivotal role in expanding Kay Group through ventures
                  such as Kay Paper Marketing (2013), Maa Kali Paper Limited (2014), and later Kay Paper Deals Pvt. Ltd.
                  (2022) — a game-changing digital initiative that bridges traditional trading with a modern e-commerce
                  ecosystem.
                </p>
                <p>
                  Under his leadership, PaperDeals.in has become a trusted online platform that connects paper
                  manufacturers, traders, and recyclers, streamlining procurement and sales with transparency and
                  efficiency. His focus on technology, sustainability, and collaboration continues to position Kay Paper
                  Deals at the forefront of India's paper industry transformation.
                </p>
              </div>

              {/* Recognition */}
              <div className="pt-4 space-y-3 p-6 rounded-xl bg-white border border-gray-200">
                <p className="font-semibold text-gray-900">Industry Recognition:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    "FPTA (Federation of Paper Traders Association of India)",
                    "IRPTA (Indian Recycled Paper Traders Association)",
                    "Delhi Paper Recyclers Association",
                  ].map((org, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.Text }}></span>
                      {org}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <InfiniteCarousel /> */}
      <ReadyToOrder />
      <PartnerWithUs />
      <FaqSection />
    </section>
  )
}
