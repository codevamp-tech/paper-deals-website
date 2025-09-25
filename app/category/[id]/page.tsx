"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  product_name: string;
  sub_product: string;
  price_per_kg: number;
  quantity_in_kg: string;
  image: string | null;
  seller: {
    id: number;
    name: string;
    email_address: string;
    phone_no: string;
  };
};

export default function CategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/category/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducts();
  }, [id]);

  const maskPhoneNumber = (number: string) => {
    if (!number) return "";
    const visible = number.slice(0, 3);
    const masked = "*".repeat(number.length - 3);
    return visible + masked;
  };

  const formatSellerId = (id: number) => {
    return `Seller#${Math.abs(id)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        No products found for this category.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Products in Category {id}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-md p-4 hover:shadow-lg transition"
          >
            {product.image ? (
              product.image.endsWith(".pdf") ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mb-4 block"
                >
                  View PDF
                </a>
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-md mb-4 text-gray-500">
                No Image Available
              </div>
            )}

            <h2 className="text-xl font-semibold mb-2">
              {product.product_name}
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Sub Product: {product.sub_product}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Quantity: {product.quantity_in_kg} kg
            </p>
            <p className="text-lg font-bold text-purple-600 mb-4">
              ₹{product.price_per_kg} per kg
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {formatSellerId(product.seller.id)} |{" "}
              {maskPhoneNumber(product.seller.phone_no)}
            </p>

            {/* ✅ Correct Link inside product card */}
            <Link
              href={`/viewproduct/${product.id}`}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 block text-center"
            >
              View Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
