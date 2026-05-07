"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  Package,
  Building2
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { getUserFromToken } from "@/hooks/use-token";
import { useTheme } from "@/hooks/use-theme";
import { ListingProductCard } from "@/components/product/ListingProductCard";

interface Category {
  id: number;
  name: string;
}

const OrderNow = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const user = getUserFromToken();
  const { mode } = useTheme();

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
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
    quantity_unit: "Kg",
    remarks: "",
  });

  const fetchRelated = async (category_id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/buyer/${category_id}`);
      if (!res.ok) throw new Error("Failed to fetch related products");
      const data = await res.json();
      setRelatedProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  useEffect(() => {
    const fetchBuyer = async () => {
      if (!user?.user_id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/buyerbyid/${user.user_id}`);
        if (!res.ok) throw new Error("Failed to fetch buyer");
        const data = await res.json();
        const org = data?.organization || {};
        setFormData((prev) => ({
          name: org.contact_person || data.name || "",
          email: org.email || data.email_address || "",
          mobile: org.phone ? org.phone.toString() : data.phone_no || "",
          company_name: org.organizations || "",
          city: org.city || "",
        }));
      } catch (err) {
        console.error("Buyer fetch error:", err);
      }
    };
    fetchBuyer();
  }, [user?.user_id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${productId}`);
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
        console.error("Product fetch error:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product?.category?.id) fetchRelated(product.category.id);
  }, [product?.category?.id]);

  const productImages: string[] = useMemo(() => {
    if (!product?.images) return ["/paper.jpg"];
    if (Array.isArray(product.images)) return product.images.length > 0 ? product.images : ["/paper.jpg"];
    if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["/paper.jpg"];
      } catch { return ["/paper.jpg"]; }
    }
    return ["/paper.jpg"];
  }, [product?.images]);

  const specifications = [
    { label: "GSM", value: product?.gsm, icon: <Package className="w-4 h-4" /> },
    { label: "BF", value: product?.bf, icon: <ShieldCheck className="w-4 h-4" /> },
    { label: "Shade", value: product?.shade, icon: <Info className="w-4 h-4" /> },
    { label: "Brightness", value: product?.brightness, icon: <Clock className="w-4 h-4" /> },
    { label: "Size", value: product?.sizes || product?.size, icon: <Truck className="w-4 h-4" /> },
    { label: "Origin", value: product?.city || "India", icon: <MapPin className="w-4 h-4" /> },
  ].filter(spec => spec.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to send enquiry.");
      router.push("/buyer-login");
      return;
    }

    setLoading(true);
    const sellerId = product?.seller_id || product?.user_id;
    const currentMode = localStorage.getItem("mode") || "B2C";

    try {
      const endpoint = currentMode === "B2B" ? "/api/enquiry/enquiries" : "/api/enquiry/broadcast";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, buyer_id: user.user_id, user_id: sellerId, mode: currentMode }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      toast.success(currentMode === "B2B" ? "Enquiry sent successfully!" : "Enquiry broadcasted successfully!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to send enquiry!");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <ProductDetailSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left: Premium Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl group"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={productImages[activeImage]}
                  alt={product.product_name}
                  className="w-full h-full object-contain p-8"
                />
              </AnimatePresence>

              {productImages.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveImage(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                    className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setActiveImage(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                    className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </motion.div>

            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative min-w-[100px] h-[100px] rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                  {product.category?.name}
                </Badge>
                <h1 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {product.product_name}
                </h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-medium">{product.city || "Pan India Delivery"}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <CheckCircle2 size={18} />
                    <span className="font-bold">Verified Manufacturer</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Starting from</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-primary">₹{product.price_per_kg}</span>
                    <span className="text-lg font-bold text-gray-400">/ Kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block mb-2">Best Price Guaranteed</div>
                  <p className="text-[10px] text-gray-400 font-medium">*Prices subject to volume</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                      {spec.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{spec.label}</p>
                      <p className="text-sm font-bold text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Info size={20} className="text-primary" />
                  Product Overview
                </h3>
                <p className="text-gray-500 leading-relaxed text-base">
                  {product.description || "Premium industrial grade paper solution engineered for high-performance applications. Ensuring consistent quality and superior finish for all your professional needs."}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 bg-primary text-white">
                      <Mail className="w-6 h-6" />
                      Request Factory Quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-8 text-white relative">
                      <DialogTitle className="text-2xl font-black">Quick Enquiry</DialogTitle>
                      <p className="text-primary-foreground/80 mt-2">Enquire about {product.product_name}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="bg-white flex flex-col max-h-[80vh]">
                      <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        {/* <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Contact Person</Label>
                            <Input name="name" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} placeholder="Contact Name" className="rounded-xl bg-gray-50 border-gray-100 focus:ring-primary h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Mobile</Label>
                            <Input name="mobile" value={formData.mobile} onChange={(e) => setFormData(p => ({...p, mobile: e.target.value}))} placeholder="Mobile Number" className="rounded-xl bg-gray-50 border-gray-100 focus:ring-primary h-12" />
                          </div>
                        </div> */}

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-gray-400 uppercase">Company Name</Label>
                          <Input name="company_name" value={formData.company_name} onChange={(e) => setFormData(p => ({ ...p, company_name: e.target.value }))} placeholder="Company Name" className="rounded-xl bg-gray-50 border-gray-100 focus:ring-primary h-12" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Quantity</Label>
                            <Input name="quantity_in_kg" value={formData.quantity_in_kg} onChange={(e) => setFormData(p => ({ ...p, quantity_in_kg: e.target.value }))} placeholder="e.g. 500" className="rounded-xl bg-gray-50 border-gray-100 focus:ring-primary h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Unit</Label>
                            <Select value={formData.quantity_unit} onValueChange={(v) => setFormData(p => ({ ...p, quantity_unit: v }))}>
                              <SelectTrigger className="rounded-xl bg-gray-50 border-gray-100 h-12"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                <SelectItem value="Kg">Kilograms (Kg)</SelectItem>
                                <SelectItem value="Ton">Metric Tons (Ton)</SelectItem>
                                <SelectItem value="Piece">Piece</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">GSM</Label>
                            <Input value={formData.gsm} onChange={(e) => setFormData(p => ({ ...p, gsm: e.target.value }))} placeholder="GSM" className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">BF</Label>
                            <Input value={formData.bf} onChange={(e) => setFormData(p => ({ ...p, bf: e.target.value }))} placeholder="BF" className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Shade</Label>
                            <Input value={formData.shade} onChange={(e) => setFormData(p => ({ ...p, shade: e.target.value }))} placeholder="Shade" className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Size</Label>
                            <Input value={formData.size} onChange={(e) => setFormData(p => ({ ...p, size: e.target.value }))} placeholder="Size" className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase">Brightness</Label>
                            <Input value={formData.brightness} onChange={(e) => setFormData(p => ({ ...p, brightness: e.target.value }))} placeholder="Brightness" className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-gray-400 uppercase">Requirements / Remarks</Label>
                          <Textarea name="remarks" value={formData.remarks} onChange={(e) => setFormData(p => ({ ...p, remarks: e.target.value }))} placeholder="Detail your specific needs..." className="rounded-xl bg-gray-50 border-gray-100 focus:ring-primary min-h-[100px] resize-none" />
                        </div>
                      </div>

                      <div className="p-8 pt-0 bg-white">
                        <Button type="submit" disabled={loading} className="w-full py-6 rounded-xl font-bold bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all">
                          {loading ? "Processing..." : "Submit Quote Request"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>


            </motion.div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24 space-y-12">
          <div className="flex items-end justify-between border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900">Related Collections</h2>
              <p className="text-gray-500 font-medium">Explore more products in <span className="text-primary font-bold">{product.category?.name}</span></p>
            </div>
            <Button variant="link" className="text-primary font-bold gap-2 text-lg group">
              View All <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.slice(0, 4).map((p) => (
              <ListingProductCard
                key={p.id}
                item={p}
                mode={mode}
                isInCart={() => false}
                addToCart={() => router.push(`/product/${p.id}`)}
                openEnquiry={() => router.push(`/product/${p.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-white py-12">
    <div className="max-w-[1440px] mx-auto px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 animate-pulse">
      <div className="lg:col-span-7 bg-gray-50 rounded-[2.5rem] aspect-[4/3]" />
      <div className="lg:col-span-5 space-y-8">
        <div className="h-8 w-32 bg-gray-100 rounded-full" />
        <div className="h-24 w-full bg-gray-100 rounded-3xl" />
        <div className="h-32 w-full bg-gray-100 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-50 rounded-2xl" />)}
        </div>
      </div>
    </div>
  </div>
);

export default OrderNow;
