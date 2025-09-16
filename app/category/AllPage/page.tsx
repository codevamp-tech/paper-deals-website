"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Seller = {
    name: string;
    email_address: string;
    phone_no: string;
};

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    city: string;
    status: string;
    created_at: string;
    seller?: Seller;
};

export default function CategoryProductsPage() {
    const { slug } = useParams();  // yaha id = category_id hoga
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchProducts = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/category/${slug}`
                );

                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!products || products.length === 0)
        return <p className="text-center mt-10">No products found</p>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Products in Category {slug}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="p-4 border rounded-lg shadow bg-white"
                    >
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p className="text-gray-700">{product.description}</p>
                        <p className="text-green-600 font-bold mt-2">₹{product.price}</p>
                        <p className="text-sm text-gray-500">City: {product.city}</p>
                        {product.seller && (
                            <p className="text-sm text-gray-400">
                                Seller: {product.seller.name}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
