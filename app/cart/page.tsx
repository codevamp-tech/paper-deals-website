"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Trash2, Minus, Plus, ChevronRight, Package, Truck, Send, Loader2 } from "lucide-react";
import EnquiryModal from "@/components/enquiryModal";
import { toast } from "sonner";

interface Product {
  price_per_kg: number;
  id: number;
  seller_id: number;
  product_name: string;
  product_unit: string;
  unit_size: number;
  quantity: number;
  price: number;
  images?: string; // JSON string from API
  seller: { id: number; name: string };
  tax: number;
  select_tax_type: string;
}

interface SellerSectionProps {
  sellerId: number | string;
  items: Product[];
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, change: number) => void;
}

const getFirstImage = (images?: string) => {
  if (!images) return "/mainimg.png";

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed[0]
      : "/mainimg.png";
  } catch {
    return "/mainimg.png";
  }
};

const SellerSection = ({ sellerId, items, onRemove, onUpdateQuantity }: SellerSectionProps) => {
  const sellerName = items[0].seller?.name || "Seller";
  const totalAmount = items.reduce((acc, item) => acc + item.price_per_kg * item.quantity, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Package className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{sellerName}</h2>
          <p className="text-sm text-gray-500">{items.length} product{items.length > 1 ? 's' : ''} in this order</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="relative">
              <img
                src={getFirstImage(item.images)}
                alt={item.product_name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              {item.quantity > 1 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {item.quantity}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">{item.product_name}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded">Unit: {item.product_unit}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.unit_size}</span>
                {/* <span className="bg-gray-100 px-2 py-1 rounded">Tax: {item.tax}%</span> */}
              </div>
              <p className="text-lg font-semibold text-gray-900">
                ₹{(item.price_per_kg * item.quantity).toLocaleString('en-IN')}
                {/* <span className="text-sm font-normal text-gray-500 ml-2">
                  (₹{item.price.toLocaleString('en-IN')} per unit)
                </span> */}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>Shipping: <Truck className="inline w-4 h-4 ml-1" /></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {/* <p>Tax: ₹{taxTotal.toFixed(2)}</p> */}
                {/* <p> {totalAmount.toLocaleString('en-IN')}</p> */}

              </div>
              <div className="text-xl font-bold text-gray-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [productEdits, setProductEdits] = useState<Record<number, any>>({});
  const [enquiryData, setEnquiryData] = useState({
    company_name: "",
    name: "",
    email: "",
    mobile: "",
    city: "",
    remarks: "",
    message: "",
  });

  // Fetch Recommended Products from API
  const fetchRelatedProducts = useCallback(async () => {
    try {
      setLoadingRelated(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/product/by-user-type?user_type=3&page=1&limit=4`);
      const data = await response.json();
      // Assuming data.products or data.data contains the array
      setRecommended(data.products || data.data || []);
    } catch (error) {
      console.error("Failed to fetch related products", error);
    } finally {
      setLoadingRelated(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cart_B2C");
    setCart(saved ? JSON.parse(saved) : []);
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  const groupBySeller = () => {
    const map: Record<string, Product[]> = {};
    cart.forEach((item) => {
      const sellerId = item.seller_id;
      if (!map[sellerId]) map[sellerId] = [];
      map[sellerId].push(item);
    });
    return map;
  };

  const updateLocalStorage = (updatedCart: Product[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart_B2C", JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (productId: number, change: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as Product[];
    updateLocalStorage(updatedCart);
  };

  const handleRemove = (productId: number) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateLocalStorage(updatedCart);
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          images: product.images, // ✅ CRITICAL
          quantity: 1,
          seller_id: product.seller_id || product.seller?.id,
        },
      ];
    }

    updateLocalStorage(updatedCart);
    toast.success("Added to cart!");
  };


  const setProductEdit = (productId: number, patch: Partial<any>) =>
    setProductEdits((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), ...patch },
    }));

  const handleEnquirySubmit = async () => {
    const groupedCart = groupBySeller();

    const enquiries = Object.entries(groupedCart).map(([sellerId, items]) => ({
      seller_id: Number(sellerId),

      product_ids: items.map(item => item.id),

      products: items.map(item => {
        const edit = productEdits[item.id] || {};

        return {
          // ✅ REQUIRED IDS
          product_id: item.id,
          category_id: item.category_id ?? null, // 🔥 FIX

          // ✅ BASE INFO
          product_name: item.product_name,

          // ✅ MERGED FIELDS (edit > original > null)
          quantity_in_kg: edit.quantity_in_kg ?? item.quantity ?? null,
          gsm: edit.gsm ?? item.gsm ?? null,
          size: edit.size ?? item.size ?? null,
          shade: edit.shade ?? item.shade ?? null,
          bf: edit.bf ?? item.bf ?? null,
          rim: edit.rim ?? item.rim ?? null,
          sheat: edit.sheat ?? item.sheat ?? null,
          brightness: edit.brightness ?? item.brightness ?? null,
          weight: edit.weight ?? item.weight ?? null,
          remarks: edit.remarks ?? null,
        };
      }),

      customer_details: enquiryData,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/multiple`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enquiries }),
        }
      );

      if (!response.ok) throw new Error("Failed");

      toast.success("Enquiries sent successfully!");
      updateLocalStorage([]);
      setProductEdits({});
      setIsEnquiryModalOpen(false);
    } catch (error) {
      toast.error("Failed to send enquiry");
      console.error(error);
    }
  };


  const grouped = groupBySeller();
  const cartTotal = cart.reduce((acc, item) => acc + item.price_per_kg * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <p className="text-gray-600 text-center max-w-md mb-8">Browse our collection and find amazing deals.</p>
        <button onClick={() => window.location.href = '/product'} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
            <ChevronRight size={16} />
            <span className="font-bold text-blue-600">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {Object.entries(grouped).map(([sellerId, items]) => (
              <SellerSection
                key={sellerId}
                sellerId={sellerId}
                items={items}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{itemCount} item{itemCount > 1 ? "s" : ""}</span>
                  <span className="font-medium">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Enquiry to Sellers
              </button>
            </div>


          </div>

          {/* Dynamic Related Products Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-600 rounded"></span>
                  Recommended For You
                </h3>

                {loadingRelated ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommended.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <img
                          src={getFirstImage(product.images)}
                          alt={product.product_name || product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">
                            {product.product_name || product.name}
                          </h4>
                          <p className="font-semibold text-gray-900 mt-1">₹{product.price_per_kg}</p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="Add to cart"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEnquiryModalOpen && (
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          enquiryData={enquiryData}
          setEnquiryData={setEnquiryData}
          productEdits={productEdits}
          setProductEdit={setProductEdit}
          groupedCart={grouped}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </div>
  );
}