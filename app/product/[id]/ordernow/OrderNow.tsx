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
import { CheckCircle2, Mail, Package, ShieldCheck, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  //  Fetch Related Products
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

  // Fetch buyer details from token
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

  //  Fetch product details
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

  //  Fetch related products when product changes
  useEffect(() => {
    if (product?.category?.id) {
      fetchRelated(product.category.id);
    }
  }, [product?.category?.id]);


  const productImages: string[] = React.useMemo(() => {
    if (!product?.images) return [];
    try {
      return JSON.parse(product.images);
    } catch {
      return [];
    }
  }, [product?.images]);

  useEffect(() => {
    setActiveImage(0);
  }, [productImages.length]);

  //  Fetch all categories
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

  //  Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Quantity adjust
  const updateQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
    setFormData((prev) => ({
      ...prev,
      quantity_in_kg: Math.max(1, quantity + delta).toString(),
    }));
  };

  //  Submit Enquiry
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
    // ✅ If backend already sends an array
    if (Array.isArray(images)) {
      return images.length > 0 ? images[0] : "/paper.jpg";
    }

    // ✅ If backend sends JSON string
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch {
        // ignore JSON parse error
      }
    }

    // ✅ Fallback image
    return "/paper.jpg";
  };


  const isProfileIncomplete =
    !formData.company_name?.trim() || !formData.name?.trim();

  if (!product) return <p className="text-center py-10">Loading product...</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Product Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl  shadow-xl border border-slate-200 overflow-hidden">

              {/* Category Badge */}
              <Badge className="absolute top-4 left-4 z-10 bg-blue-600 text-white">
                {product.category?.name}
              </Badge>

              {/* Main Image */}
              <div className="relative aspect-square flex items-center justify-center">
                <img
                  src={productImages[activeImage] || "/paper.jpg"}
                  alt={product.product_name}
                  className="w-full h-full object-contain rounded-xl"
                />

                {/* Left Arrow */}
                {productImages.length > 1 && (
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center"
                  >
                    ‹
                  </button>
                )}

                {/* Right Arrow */}
                {productImages.length > 1 && (
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center"
                  >
                    ›
                  </button>
                )}
              </div>
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3 justify-center pt-1 pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-28 h-28 rounded-lg border-2 overflow-hidden ${activeImage === index
                        ? "border-blue-600"
                        : "border-gray-200"
                        }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Product Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description || "Premium quality product designed to meet all your industrial and commercial needs with excellence."}
              </p>
            </div>
            {/* Price Section */}
            <div className="flex items-baseline gap-3 p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-200">
              <span className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                ₹{product.price_per_kg}
              </span>
              <span className="text-xl text-slate-600 font-semibold">per Kg</span>
            </div>

            {/* Specifications */}
            {specifications.length > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-5 text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-sky-600" />
                  Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {specifications.map((spec) => (
                    <div key={spec.label} className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{spec.label}</span>
                      <p className="font-bold text-slate-900 text-lg">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    onClick={handleEnquiryClick}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-lg py-6 rounded-xl shadow-lg shadow-sky-200 transition-all hover:shadow-xl hover:shadow-sky-300"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Send Enquiry
                  </Button>
                </DialogTrigger>


                <DialogContent className="max-w-3xl bg-white text-black rounded-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-3">
                      Enquiry for {product.product_name}
                    </DialogTitle>
                  </DialogHeader>


                  {isProfileIncomplete && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
                      <p className="text-sm font-medium">
                        Please complete your profile to send an enquiry.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-auto border-red-400 text-red-600"
                        onClick={() => router.push("/buyer3/profile")}
                      >
                        Complete Profile
                      </Button>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >

                    <div>
                      <Label>Company *</Label>
                      <Input name="company_name" value={formData.company_name} readOnly />
                    </div>
                    <div>
                      <Label>Contact Person *</Label>
                      <Input name="name" value={formData.name} readOnly />
                    </div>


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


                    {paperFields.map((field) => (
                      <div key={field.key}>
                        <Label>
                          {field.label}
                          {field.info && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({field.info})
                            </span>
                          )}
                        </Label>

                        <Input
                          name={field.key}
                          value={(formData as any)[field.key]}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-black"
                        />
                      </div>
                    ))}
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
        </div>
      </div>

      {/* Related Products */}
      <div className="py-12 px-4 md:px-10 bg-white">
        <h1 className="text-black text-3xl md:text-4xl font-bold text-center mb-10">
          Related Products in{" "}
          <span className="text-blue-500">{product.category?.name}</span>
        </h1>
        <div className="flex overflow-x-auto scroll-smooth space-x-5 scrollbar-hide px-1">
          {relatedProducts.map((p: any) => (
            <div
              key={p.id}
              className="min-w-[220px] max-w-[220px] rounded-2xl shadow-md overflow-hidden bg-[#fff] flex-shrink-0 border border-blue-500 cursor-pointer hover:shadow-xl transition"
              onClick={() => router.push(`/product/${p.id}`)}
            >
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={getFirstImage(p.images)}
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
    </div >
  );
};

export default OrderNow;
