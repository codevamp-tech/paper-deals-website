"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ShoppingCart, Trash2, X } from "lucide-react";
import Pagination from "@/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";


function ProductSkeleton() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2 mb-6">
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded"></div>
      </CardContent>
    </Card>
  );
}

export default function PaperProductsComparison() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<string>("All");
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedContactProduct, setSelectedContactProduct] = useState<any>(null);
  const [contactQuantity, setContactQuantity] = useState(1);
  const [contactMessage, setContactMessage] = useState("");

  const router = useRouter();
  const ITEMS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dropdown states
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  // Dropdown refs for outside click
  const priceRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  // ✅ Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target as Node)
      ) {
        setPriceDropdownOpen(false);
      }
      if (
        companyRef.current &&
        !companyRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownOpen(false);
      }
      if (
        productRef.current &&
        !productRef.current.contains(event.target as Node)
      ) {
        setProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/live-price?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
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
          setTotalPages(data.totalPages);
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
  }, [currentPage]);

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
  const cities = ["All", ...Array.from(new Set(products.map((p) => p.city)))];

  // ✅ Filter products first (city, company, product)
  let filteredProducts = products.filter((product) => {
    if (selectedCity !== "All" && product.city !== selectedCity) return false;
    if (selectedCompany !== "All" && product.mill !== selectedCompany)
      return false;
    if (selectedProduct !== "All" && product.name !== selectedProduct)
      return false;
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
    const existingItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));

  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.pricePerKg * item.quantity,
    0
  );

  const handleContactSeller = (product: any) => {
    console.log(`Contacting seller for ${product.name} in ${product.city}`);
  };

  const isProductAdded = (productId: string) => {
    return cart.some((item) => item._id === productId);
  };

  const resetFilters = () => {
    setSelectedPriceRange("All");
    setSelectedCompany("All");
    setSelectedProduct("All");
    setSelectedCity("All");
  };



  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, selectedCompany, selectedProduct, selectedPriceRange]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Paper Products Market
            </h1>

          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare prices across cities and connect with sellers directly
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset All
            </Button>
          </div>

          <div className="flex items-end gap-4 flex-wrap">
            {/* ✅ Price Dropdown */}
            <div ref={priceRef} className="relative flex-1 min-w-[200px]">
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
                        setPriceDropdownOpen(false); // close on click
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${selectedPriceRange === range
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

            {/* ✅ Company Dropdown */}
            <div ref={companyRef} className="relative flex-1 min-w-[200px]">
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
                        setCompanyDropdownOpen(false); // close on click
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${selectedCompany === company
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

            {/* ✅ Product Dropdown */}
            <div ref={productRef} className="relative flex-1 min-w-[200px]">
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
                        setProductDropdownOpen(false); // close on click
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${selectedProduct === productName
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

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // 👇 Show 6 skeleton cards
            Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
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
                      className={`${product.availability === "In Stock"
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



                  <div className="space-y-2 mb-4">

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedContactProduct(product);
                        setContactQuantity(1);
                        setContactMessage("");
                        setContactOpen(true);
                      }}
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
              <Button onClick={resetFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  className={currentPage === page ? "bg-blue-600 text-white" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}


      </div>
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
          </DialogHeader>

          {selectedContactProduct && (
            <div className="space-y-4">
              {/* Product Info */}
              {/* <div className="text-sm">
                <p className="font-semibold">{selectedContactProduct.name}</p>
                <p className="text-gray-500">{selectedContactProduct.mill}</p>
                <p className="text-gray-500">{selectedContactProduct.city}</p>
              </div> */}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity (Kg)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={contactQuantity}
                    onChange={(e) =>
                      setContactQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quantity in Kg"
                  />
                </div>

              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  placeholder="Write your requirement or message to seller..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              className="bg-blue-500 px-4 py-2 text-white"
              onClick={() => {
                console.log("Contact Seller Data:", {
                  product: selectedContactProduct,
                  quantity: contactQuantity,
                  message: contactMessage,
                });

                // later you can call API / WhatsApp / WATI here
                setContactOpen(false);
              }}
            >
              Send Request
            </Button>
            <Button
              variant="outline"
              onClick={() => setContactOpen(false)}
            >
              Cancel
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}
