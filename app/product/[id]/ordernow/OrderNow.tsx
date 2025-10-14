import React, { useEffect, useState } from "react";

const OrderNow = ({ productId }: { productId: string }) => {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setProduct(data.data); // ✅ your API wraps product in { success, data }

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

          {/* ✅ Download Button (bilkul image ke neeche left side) */}
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
            ₹{product.price_per_kg}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="bg-[#38d200] text-white px-6 py-3 w-full sm:w-1/2 rounded-full text-lg">
              Order Now
            </button>
            <button className="bg-transparent border border-[#0f7aed] text-[#0f7aed] px-6 py-3 w-full sm:w-1/2 rounded-full text-lg">
              Add To Cart
            </button>
          </div>
        </div>
      </div>

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
              className="min-w-[220px] max-w-[220px] rounded-2xl shadow-md overflow-hidden bg-[#fff] flex-shrink-0 border border-[#38d200]"
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
