"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserFromToken } from "@/hooks/use-token";

interface Category {
  id: number;
  name: string;
}

const OrderNow = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const user = getUserFromToken();

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    company_name: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    category_id: "",
    product_id: "",
    gsm: "",
    bf: "",
    shade: "",
    brightness: "",
    rim: "",
    sheat: "",
    size: "",
    quantity_in_kg: "",
    remarks: "",
  });

  // 🔹 Fetch Related Products
  const fetchRelated = async (category_id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/${category_id}`
      );
      if (!res.ok) throw new Error("Failed to fetch related products");
      const data = await res.json();
      setRelatedProducts(data || []);
    } catch (err) {
      console.error("❌ Error fetching related products:", err);
    }
  };

  // 🔹 Fetch buyer details from token
  useEffect(() => {
    const fetchBuyer = async () => {
      if (!user?.user_id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/buyerbyid/${user.user_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch buyer");
        const data = await res.json();
        const org = data?.organization || {};

        setFormData((prev) => ({
          ...prev,
          company_name: org.organizations || "",
          name: org.contact_person || "",
          email: org.email || "",
          city: org.city || "",
          phone: org.phone?.toString() || data.phone_no || "",
        }));
      } catch (err) {
        console.error("❌ Buyer fetch error:", err);
      }
    };
    fetchBuyer();
  }, [user?.user_id]);

  // 🔹 Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${productId}`
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);

        setFormData((prev) => ({
          ...prev,
          product_id: data.id?.toString() || "",
          category_id: data.category?.id?.toString() || "",
          gsm: data.gsm || "",
          bf: data.bf || "",
          shade: data.shade || "",
          size: data.sizes || "",
          brightness: data.brightness || "",
        }));
      } catch (err) {
        console.error("❌ Product fetch error:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  // 🔹 Fetch related products when product changes
  useEffect(() => {
    if (product?.category?.id) {
      fetchRelated(product.category.id);
    }
  }, [product?.category?.id]);

  // 🔹 Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categiry`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("❌ Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Quantity adjust
  const updateQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
    setFormData((prev) => ({
      ...prev,
      quantity_in_kg: Math.max(1, quantity + delta).toString(),
    }));
  };

  // 🔹 Submit Enquiry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to send enquiry.");
      router.push("/buyer-login");
      return;
    }
    setLoading(true);
    const sellerId = product?.seller_id;

    const payload = {
      ...formData,
      quantity_in_kg: formData.quantity_in_kg || quantity.toString(),
      buyer_id: user?.user_id,
      user_id: sellerId,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/enquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to send enquiry");
      toast.success("Enquiry sent successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Enquiry submit error:", err);
      toast.error("Failed to send enquiry!");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center py-10">Loading product...</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Product Display */}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <img
            src={product.image || "/paper.jpg"}
            alt={product.product_name}
            className="w-full h-[350px] object-contain rounded-xl shadow-lg"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
          <p className="text-xl text-green-600 font-semibold mb-3">
            ₹{product.price_per_kg} / Kg
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Enquiry Now Button */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#38d200] hover:bg-[#2fb600] text-white px-6 py-3 rounded-full text-lg"
              >
                Enquiry Now
              </Button>
            </DialogTrigger>

            {/* Enquiry Modal */}
            <DialogContent className="max-w-3xl bg-white text-black rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-3">
                  Enquiry for {product.product_name}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Company / Name */}
                <div>
                  <Label>Company *</Label>
                  <Input name="company_name" value={formData.company_name} readOnly />
                </div>
                <div>
                  <Label>Contact Person *</Label>
                  <Input name="name" value={formData.name} readOnly />
                </div>

                {/* Contact Info */}
                <div>
                  <Label>Phone *</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input name="email" value={formData.email} readOnly />
                </div>

                <div>
                  <Label>City *</Label>
                  <Input name="city" value={formData.city} onChange={handleChange} />
                </div>

                {/* Category */}
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, category_id: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Details */}
                {["gsm", "bf", "shade", "brightness", "rim", "sheat", "size"].map(
                  (f) => (
                    <div key={f}>
                      <Label className="capitalize">{f}</Label>
                      <Input
                        name={f}
                        value={(formData as any)[f]}
                        onChange={handleChange}
                      />
                    </div>
                  )
                )}

                <div>
                  <Label>Quantity (Kg)</Label>
                  <Input
                    name="quantity_in_kg"
                    value={formData.quantity_in_kg || quantity.toString()}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Remarks</Label>
                  <Textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Add any extra details..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-center mt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 text-white px-8"
                  >
                    {loading ? "Sending..." : "Send Enquiry"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Related Products */}
      <div className="py-12 px-4 md:px-10 bg-white">
        <h1 className="text-black text-3xl md:text-4xl font-bold text-center mb-10">
          Related Products in{" "}
          <span className="text-[#38d200]">{product.category?.name}</span>
        </h1>
        <div className="flex overflow-x-auto scroll-smooth space-x-5 scrollbar-hide px-1">
          {relatedProducts.map((p: any) => (
            <div
              key={p.id}
              className="min-w-[220px] max-w-[220px] rounded-2xl shadow-md overflow-hidden bg-[#fff] flex-shrink-0 border border-[#38d200] cursor-pointer hover:shadow-xl transition"
              onClick={() => router.push(`/product/${p.id}`)}
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
                  <span className="text-gray-700 text-sm font-normal"> /Kg</span>
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
