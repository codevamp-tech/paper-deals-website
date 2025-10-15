"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ShoppingCart, Trash2, X } from "lucide-react";

export default function PaperProductsComparison() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Dropdown states
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  // ✅ Fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/live-price`
        );
        const data = await res.json();

        if (data && Array.isArray(data.data)) {
          const mapped = data.data.map((item: any) => ({
            _id: item.id,
            name: item.name,
            pricePerKg: item.price,
            city: item.location,
            category: "Paper",
            availability: item.status === 0 ? "In Stock" : "Out of Stock",
            mill: item.location.split("(")[0].trim(),
            date: item.updated_at || "—",
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching live prices:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Get unique companies (mills)
  const companies = [
    "All",
    ...Array.from(new Set(products.map((p) => p.mill))).sort(),
  ];

  // ✅ Get unique product names
  const productNames = [
    "All",
    ...Array.from(new Set(products.map((p) => p.name))).sort(),
  ];
// ✅ Price sort options
const priceSortOptions = ["All", "Low to High", "High to Low"];

// ✅ City filter options
const cities = [
  "All",
  ...Array.from(new Set(products.map((p) => p.city))),
];

// ✅ Filter products first (city, company, product)
let filteredProducts = products.filter((product) => {
  if (selectedCity !== "All" && product.city !== selectedCity) return false;
  if (selectedCompany !== "All" && product.mill !== selectedCompany) return false;
  if (selectedProduct !== "All" && product.name !== selectedProduct) return false;
  return true;
});

// ✅ Then apply sorting
if (selectedPriceRange === "Low to High") {
  filteredProducts = [...filteredProducts].sort(
    (a, b) => a.pricePerKg - b.pricePerKg
  );
} else if (selectedPriceRange === "High to Low") {
  filteredProducts = [...filteredProducts].sort(
    (a, b) => b.pricePerKg - a.pricePerKg
  );
}
// If "All" — no sorting is applied

  // ✅ Quantity Update
  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 1) + change),
    }));
  };

  // ✅ Add to cart
  const handleAddToCart = (product: any) => {
    const quantity = quantities[product._id] || 1;
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex > -1) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity }]);
    }
    
    // Reset quantity selector
    setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    
    // Show success message (optional)
    alert(`Added ${quantity}kg of ${product.name} to cart!`);
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  // Update cart quantity
  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.pricePerKg * item.quantity), 0);

  // ✅ Contact Seller
  const handleContactSeller = (product: any) => {
    console.log(`Contacting seller for ${product.name} in ${product.city}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedPriceRange("All");
    setSelectedCompany("All");
    setSelectedProduct("All");
    setSelectedCity("All");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Paper Products Market
            </h1>
            {/* Cart Icon */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare prices across cities and connect with sellers directly
          </p>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCart(false)}
            ></div>
            <div className="relative bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart ({cart.length})
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="mb-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">{item.mill}</p>
                            <p className="text-sm text-gray-500">{item.city}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(item._id, item.quantity - 1)
                              }
                              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="font-medium">{item.quantity} kg</span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item._id, item.quantity + 1)
                              }
                              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              ₹{item.pricePerKg} × {item.quantity}
                            </p>
                            <p className="font-bold text-gray-900">
                              ₹{(item.pricePerKg * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="sticky bottom-0 bg-white border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <Button className="w-full bg-blue-600 text-white py-3 text-lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading live prices...</p>
        ) : (
          <>
            {/* Filter Section */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm"
                >
                  Reset All
                </Button>
              </div>

              <div className="flex items-end gap-4 flex-wrap">
                {/* Price Range Dropdown */}
                <div className="relative flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by Price
                  </label>
                  <button
                    onClick={() => setPriceDropdownOpen(!priceDropdownOpen)}
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="truncate">{selectedPriceRange}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {priceDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {priceSortOptions.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setSelectedPriceRange(range);
                            setPriceDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                            selectedPriceRange === range
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : ""
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company Dropdown */}
                <div className="relative flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company 
                  </label>
                  <button
                    onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="truncate">{selectedCompany}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {companyDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {companies.map((company) => (
                        <button
                          key={company}
                          onClick={() => {
                            setSelectedCompany(company);
                            setCompanyDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                            selectedCompany === company
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : ""
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Name Dropdown */}
                <div className="relative flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <button
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="truncate">{selectedProduct}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {productDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {productNames.map((productName) => (
                        <button
                          key={productName}
                          onClick={() => {
                            setSelectedProduct(productName);
                            setProductDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                            selectedProduct === productName
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : ""
                          }`}
                        >
                          {productName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* City Dropdown */}
                <div className="relative flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="bg-white shadow-sm hover:shadow-lg transition"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50 text-blue-700 font-medium"
                        >
                          {product.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${
                            product.availability === "In Stock"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-orange-200 bg-orange-50 text-orange-700"
                          } text-xs`}
                        >
                          {product.availability}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 font-medium">
                        {product.mill}
                      </p>

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{product.pricePerKg}
                          </span>
                          <span className="text-sm text-gray-500">/ Kg</span>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product._id, -1)}
                        >
                          -
                        </Button>
                        <span>{quantities[product._id] || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product._id, 1)}
                        >
                          +
                        </Button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-blue-600 text-white"
                        >
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => handleContactSeller(product)}
                          variant="outline"
                          className="w-full"
                        >
                          Contact Seller
                        </Button>
                      </div>

                      <div className="pt-4 border-t border-gray-100 text-sm flex justify-between">
                        <span className="font-medium">{product.city}</span>
                        <span className="text-gray-500">{product.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found matching your filters
                  </p>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}