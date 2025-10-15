import React, { useEffect, useState } from "react";

const OrderNow = ({ productId }: { productId: string }) => {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  // 🔹 Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("paperCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 🔹 Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("paperCart", JSON.stringify(cart));
    }
  }, [cart]);

  // 🔹 Fetch single product
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/products/${productId}`
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.data);

        if (data.data?.category_id) {
          fetchRelated(data.data.category_id);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 🔹 Fetch related products by category
  const fetchRelated = async (category_id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/category/${category_id}`
      );
      if (!res.ok) throw new Error("Failed to fetch related products");
      const data = await res.json();
      setRelatedProducts(data || []);
    } catch (err) {
      console.error("❌ Error fetching related products:", err);
    }
  };

  // 🔹 Add to Cart Handler
  const handleAddToCart = () => {
    if (!product) return;

    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          id: product.id,
          product_name: product.product_name,
          price_per_kg: product.price_per_kg,
          image: product.image,
          quantity: quantity,
        },
      ]);
    }

    alert(`Added ${quantity}kg of ${product.product_name} to cart!`);
    setQuantity(1); // Reset quantity
  };

  // 🔹 Order Now Handler
  const handleOrderNow = () => {
    if (!product) return;

    // Add to cart first
    handleAddToCart();

    // Redirect to checkout or cart page
    // window.location.href = "/checkout";
    alert("Proceeding to checkout...");
  };

  // 🔹 Update quantity
  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!product) return <p className="text-center p-6">Product not found.</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-6 relative">
          <img
            src={product.image || "/paper.jpg"}
            alt={product.product_name}
            className="max-w-full h-auto object-contain rounded-xl shadow-lg"
          />

          {/* Download Button */}
          <a
            href={product.image || "/paper.jpg"}
            download
            className="mt-3 bg-[#0f7aed] text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
          >
            ⬇ Download
          </a>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 text-black bg-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.product_name}
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-green-600 mb-4">
            ₹{product.price_per_kg} / Kg
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Kg)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(-1)}
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg font-semibold"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(1)}
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg font-semibold"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Total: ₹{(product.price_per_kg * quantity).toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleOrderNow}
              className="bg-[#38d200] text-white px-6 py-3 w-full sm:w-1/2 rounded-full text-lg hover:bg-[#2fb600] transition"
            >
              Order Now
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-transparent border border-[#0f7aed] text-[#0f7aed] px-6 py-3 w-full sm:w-1/2 rounded-full text-lg hover:bg-blue-50 transition"
            >
              Add To Cart
            </button>
          </div>

          {/* Cart Count Badge */}
          {cart.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowCart(!showCart)}
                className="text-[#0f7aed] font-semibold underline"
              >
                View Cart ({cart.length} items)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mini Cart Display */}
      {showCart && cart.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-4">Your Cart</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "/paper.jpg"}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} kg × ₹{item.price_per_kg}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-lg">
                  ₹{(item.quantity * item.price_per_kg).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center border-t pt-4">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-[#38d200]">
              ₹
              {cart
                .reduce(
                  (total, item) => total + item.quantity * item.price_per_kg,
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="py-12 px-4 md:px-10 bg-white">
        <h1 className="text-black text-3xl md:text-4xl font-bold text-center mb-10">
          Related Products in{" "}
          <span className="text-[#38d200]">{product.category_id}</span>
        </h1>

        <div className="flex overflow-x-auto scroll-smooth space-x-5 scrollbar-hide px-1">
          {relatedProducts.map((p: any) => (
            <div
              key={p.id}
              className="min-w-[220px] max-w-[220px] rounded-2xl shadow-md overflow-hidden bg-[#fff] flex-shrink-0 border border-[#38d200] cursor-pointer hover:shadow-xl transition"
              onClick={() => (window.location.href = `/order/${p.id}`)}
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
              }}
            >
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={p.image || "/paper.jpg"}
                  alt={p.product_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-black text-sm line-clamp-2">
                  {p.product_name}
                </h3>
                <p className="text-lg font-bold text-black mt-2">
                  ₹{p.price_per_kg}
                  <span className="text-gray-700 text-sm font-normal">
                    {" "}
                    /Kg
                  </span>
                </p>
              </div>
            </div>
          ))}
          {relatedProducts.length === 0 && (
            <p className="text-gray-400 text-center w-full">
              No related products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderNow;