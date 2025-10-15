"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ViewProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/products/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh] text-xl">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-[60vh] text-xl">❌ Product not</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{product.product_name}</h1>

      {product.image ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
          alt={product.product_name}
          className="w-full max-w-md rounded-lg shadow mb-6"
        />
      ) : (
        <div className="w-full max-w-md h-60 flex items-center justify-center bg-gray-200 rounded-lg mb-6">
          No Image Available
        </div>
      )}

      <p className="text-lg mb-2">Sub Product: {product.sub_product}</p>
      <p className="text-lg mb-2">Quantity: {product.quantity_in_kg} kg</p>
      <p className="text-lg font-bold text-purple-600 mb-4">
        ₹{product.price_per_kg} per kg
      </p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Seller Info</h2>
        <p className="text-black">
            <strong>Organization:</strong>{" "}
            {product.seller.organization.organizations}
          </p>
          <p className="text-black">
            <strong>City:</strong> {product.seller.organization.city}
          </p>
         
      </div>
    </div>
  );
}
