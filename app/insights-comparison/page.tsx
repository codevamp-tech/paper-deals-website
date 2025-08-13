import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const paperProducts = [
  {
    category: "Primary",
    name: "Newsprint Paper",
    specification: "45 GSM, Recycled Content 70%",
    price: 42.5,
    unit: "/ Kg",
    change: 2.3,
    location: "Mumbai",
    date: "29/04/2025",
  },
  {
    category: "Primary",
    name: "Kraft Paper",
    specification: "120 GSM, Virgin Pulp",
    price: 68.0,
    unit: "/ Kg",
    change: -1.2,
    location: "Delhi",
    date: "29/04/2025",
  },
  {
    category: "Secondary",
    name: "Corrugated Sheets",
    specification: "3mm, Single Wall",
    price: 35.8,
    unit: "/ Sq Ft",
    change: 0.8,
    location: "Chennai",
    date: "29/04/2025",
  },
  {
    category: "Primary",
    name: "Writing Paper",
    specification: "70 GSM, A4 Size",
    price: 85.2,
    unit: "/ Kg",
    change: 1.5,
    location: "Bangalore",
    date: "29/04/2025",
  },
  {
    category: "Secondary",
    name: "Tissue Paper",
    specification: "2-Ply, Virgin Pulp",
    price: 125.0,
    unit: "/ Kg",
    change: -0.5,
    location: "Pune",
    date: "29/04/2025",
  },
]

export default function PaperProductsComparison() {
  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: `radial-gradient(
          circle,
          rgba(0, 212, 255, 0.65) 0%,
          rgba(112, 112, 179, 1) 35%,
          rgba(0, 212, 255, 1) 100%
        )`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Paper Products Insights</h1>
          <p className="text-xl text-white/90">
            Keep up to date with Paper Industry News and Regional Price Variations.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {paperProducts.map((product, index) => (
            <Card
              key={index}
              className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6">
                {/* Category Badge */}
                <div className="flex justify-between items-start mb-4">
                  <Badge
                    variant={product.category === "Primary" ? "default" : "secondary"}
                    className={product.category === "Primary" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"}
                  >
                    {product.category}
                  </Badge>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>

                {/* Specification */}
                <p className="text-sm text-gray-600 mb-4">{product.specification}</p>

                {/* Price and Change */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                    <span className="text-sm text-gray-600">{product.unit}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-medium ${
                        product.change > 0 ? "text-green-600" : product.change < 0 ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {product.change > 0 ? "↗" : product.change < 0 ? "↘" : "→"}
                      {Math.abs(product.change).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Location and Date */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>{product.location}</span>
                  </div>
                  <span>{product.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-3">Market Overview</h2>
            <p className="text-white/90 leading-relaxed">
              Paper product prices vary significantly across different regions due to local demand, transportation
              costs, and raw material availability. Primary products like newsprint and kraft paper show steady demand,
              while secondary products like tissue paper experience seasonal fluctuations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
