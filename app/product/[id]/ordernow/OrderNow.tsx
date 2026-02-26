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
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    company_name: "",
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

  const fetchRelated = async (category_id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/buyer/${category_id}`
      );
      if (!res.ok) throw new Error("Failed to fetch related products");
      const data = await res.json();
      setRelatedProducts(data.products || []);
    } catch (err) {
      console.error("❌ Error fetching related products:", err);
    }
  };

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

  useEffect(() => {
    if (product?.category?.id) {
      fetchRelated(product.category.id);
    }
  }, [product?.category?.id]);

  const productImages: string[] = React.useMemo(() => {
    if (!product?.images) return [];
    if (Array.isArray(product.images)) return product.images;
    if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [product?.images]);

  useEffect(() => {
    setActiveImage(0);
  }, [productImages.length]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("❌ Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
    setFormData((prev) => ({
      ...prev,
      quantity_in_kg: Math.max(1, quantity + delta).toString(),
    }));
  };

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send broadcast enquiry");
      toast.success("Enquiry broadcasted successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Enquiry submit error:", err);
      toast.error("Failed to send enquiry!");
    } finally {
      setLoading(false);
    }
  };

  const specifications = [
    { label: "GSM", value: product?.gsm },
    { label: "BF", value: product?.bf },
    { label: "Shade", value: product?.shade },
    { label: "Brightness", value: product?.brightness },
    { label: "Size", value: product?.sizes },
  ].filter((spec) => spec.value);

  const paperFields = [
    { key: "gsm", label: "GSM", info: "Grams per Square Meter" },
    { key: "bf", label: "BF", info: "Bursting Factor" },
    { key: "shade", label: "Shade" },
    { key: "brightness", label: "Brightness" },
    { key: "rim", label: "Rim" },
    { key: "sheet", label: "Sheet" },
    { key: "size", label: "Size" },
  ];

  const handleEnquiryClick = () => {
    if (!user) {
      toast.error("Please login to send enquiry");
      router.push("/buyer-login");
      return;
    }
    setIsModalOpen(true);
  };

  const getFirstImage = (images?: string | string[]) => {
    if (Array.isArray(images)) return images.length > 0 ? images[0] : "/paper.jpg";
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch { }
    }
    return "/paper.jpg";
  };

  const isProfileIncomplete = !formData.company_name?.trim();

  if (!product) return <ProductSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 text-black">

      {/* ── Product Section ── */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left: Image */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative aspect-square bg-gray-100">
              <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {product.category?.name}
              </span>
              <img
                src={productImages[activeImage] || "/paper.jpg"}
                alt={product.product_name}
                className="w-full h-full object-contain"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-base transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-base transition-colors"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-2 justify-center py-3 px-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === index
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-3">

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Product Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description ||
                  "Premium quality product designed to meet all your industrial and commercial needs with excellence."}
              </p>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 px-4 py-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-700">
                ₹{product.price_per_kg}
              </span>
              <span className="text-xs font-medium text-gray-500">per Kg</span>
            </div>

            {/* Specifications */}
            {specifications.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Product Details
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
                    >
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {spec.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleEnquiryClick}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send Enquiry
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl bg-white text-black rounded-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-center mb-2">
                    Enquiry for {product.product_name}
                  </DialogTitle>
                </DialogHeader>

                {isProfileIncomplete && (
                  <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                    <p className="text-xs font-medium">
                      Please complete your profile to send an enquiry.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-auto border-red-300 text-red-600 text-xs"
                      onClick={() => router.push("/buyer-route/profile")}
                    >
                      Complete Profile
                    </Button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company *</Label>
                    <Input
                      name="company_name"
                      value={formData.company_name}
                      disabled
                      className="mt-1 h-8 text-xs bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City *</Label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled
                      className="mt-1 h-8 text-xs bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category *</Label>
                    <Input
                      value={product.category?.name || ""}
                      disabled
                      className="mt-1 h-8 text-xs bg-gray-50 border-gray-200"
                    />
                  </div>

                  {paperFields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {field.label}
                        {field.info && (
                          <span className="text-xs text-gray-400 ml-1 normal-case font-normal">
                            ({field.info})
                          </span>
                        )}
                      </Label>
                      <Input
                        name={field.key}
                        value={(formData as any)[field.key]}
                        onChange={handleChange}
                        className="mt-1 h-8 text-xs bg-gray-50 border-gray-200"
                      />
                    </div>
                  ))}

                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity (Kg)</Label>
                    <Input
                      name="quantity_in_kg"
                      value={formData.quantity_in_kg || quantity.toString()}
                      onChange={handleChange}
                      className="mt-1 h-8 text-xs bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</Label>
                    <Textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Add any extra details..."
                      className="mt-1 text-xs bg-gray-50 border-gray-200 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-center mt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-2 rounded-xl transition-colors"
                    >
                      {loading ? "Sending..." : "Send Enquiry"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      <div className="py-8 px-4 md:px-10 bg-white">
        <h2 className="text-gray-900 text-xl font-bold text-center mb-6">
          Related Products in{" "}
          <span className="text-blue-600">{product.category?.name}</span>
        </h2>
        <div className="flex overflow-x-auto scroll-smooth space-x-4 scrollbar-hide px-1">
          {relatedProducts.map((p: any) => (
            <div
              key={p.id}
              className="min-w-[180px] max-w-[180px] rounded-xl shadow-sm overflow-hidden bg-white flex-shrink-0 border border-blue-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
              onClick={() => router.push(`/product/${p.id}`)}
            >
              <div className="relative h-36 overflow-hidden group">
                <img
                  src={getFirstImage(p.images)}
                  alt={p.product_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-xs line-clamp-2">
                  {p.product_name}
                </h3>
                <p className="text-base font-bold text-gray-900 mt-1">
                  ₹{p.price_per_kg}
                  <span className="text-gray-500 text-xs font-normal"> /Kg</span>
                </p>
              </div>
            </div>
          ))}
          {relatedProducts.length === 0 && (
            <p className="text-gray-400 text-sm text-center w-full">
              No related products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderNow;


const ProductSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Image Skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-12 h-12 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Related skeleton */}
      <div className="mt-10">
        <Skeleton className="h-6 w-1/3 mx-auto mb-5" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[180px] h-[240px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};