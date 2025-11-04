"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getUserFromToken } from "@/hooks/use-token";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
    id: number;
    name: string;
    image?: string;
    status: number;
    date: string;
}

const SellerEnquiryPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const user = getUserFromToken();
    console.log("userss??", user);

    const [formData, setFormData] = useState({
        company_name: "",
        name: "",
        phone: "",
        email: "",
        city: "",
        category_id: "",
        product: "",
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

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);



    // ✅ Fetch Buyer Info
    useEffect(() => {
        const fetchBuyerData = async () => {
            if (!user?.user_id) return;
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/buyerbyid/${user.user_id}`
                );
                if (!res.ok) throw new Error(`Failed to fetch buyer: ${res.status}`);
                const data = await res.json();

                const org = data?.organization || {};
                setFormData((prev) => ({
                    ...prev,
                    company_name: org.organizations || "",
                    name: org.contact_person || "",
                    email: org.email || "",
                    city: org.city || "",
                    phone: org.phone ? org.phone.toString() : data.phone_no || "",
                }));
            } catch (err) {
                console.error("Error fetching buyer details:", err);
            }
        };

        fetchBuyerData();
    }, [user?.user_id]);

    // ✅ Fetch Categories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/categiry`
                );
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                const data = await res.json();
                setCategories(data.categories || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategory();
    }, []);

    // ✅ Handle Input Change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to send an enquiry.");
            router.push("/buyer-login");
            return;
        }
        setLoading(true);

        const payload = {
            ...formData,
            user_id: id,
            buyer_id: user?.user_id,
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

            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const data = await res.json();

            toast.success("Enquiry sent successfully!");

            // ✅ Reset form after successful submission
            setFormData({
                company_name: "",
                name: "",
                phone: "",
                email: "",
                city: "",
                category_id: "",
                product: "",
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

            // ✅ Redirect to seller page
            router.push("/B2B/seller");
        } catch (err) {
            console.error("❌ Error submitting enquiry:", err);
            alert("Failed to send enquiry!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Profile Information */}
                <Card className="mb-8 p-6">
                    <div className="flex items-center gap-6">
                        <div className="w-28 h-28 border rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={"/placeholder.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-black">
                                Profile Information
                            </p>
                            <p className="text-gray-600 mt-2">KPDS_{id}</p>
                        </div>
                    </div>
                </Card>

                {/* Enquiry Form */}
                <Card className="p-6 md:p-10">
                    <h2 className="text-xl font-bold mb-6 text-black">
                        Business Enquiry
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Company */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Company *</Label>
                            <Input
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                readOnly
                                className="bg-gray-100 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* Contact Person */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Contact Person *</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                readOnly
                                className="bg-gray-100 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Mobile No. *</Label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Email *</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly
                                className="bg-gray-100 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* City */}
                        <div>
                            <Label className="mb-1 block text-gray-700">City *</Label>
                            <Input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Category *</Label>
                            <Select
                                value={formData.category_id}
                                onValueChange={(val) =>
                                    setFormData((prev) => ({ ...prev, category_id: val }))
                                }
                            >
                                <SelectTrigger className="bg-white border border-gray-300 rounded-md text-black">
                                    <SelectValue placeholder="--Select Category--" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-black">
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                            className="bg-white text-black hover:bg-gray-100"
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Product */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Product *</Label>
                            <Input
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* Other Fields */}
                        {["gsm", "bf", "shade", "brightness", "rim", "sheat", "size"].map(
                            (field) => (
                                <div key={field}>
                                    <Label className="mb-1 block text-gray-700 capitalize">
                                        {field}
                                    </Label>
                                    <Input
                                        name={field}
                                        value={(formData as any)[field]}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 rounded-md text-black"
                                    />
                                </div>
                            )
                        )}

                        {/* Quantity */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Quantity in Kg *</Label>
                            <Input
                                name="quantity_in_kg"
                                value={formData.quantity_in_kg}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black"
                                required
                            />
                        </div>

                        {/* Remarks */}
                        <div className="md:col-span-2">
                            <Label className="mb-1 block text-gray-700">Remarks</Label>
                            <Textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black min-h-[80px]"
                            />
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2 flex justify-center">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="px-8 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 text-white"
                            >
                                {loading ? "Sending..." : "Send Enquiry"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </main>
    );
};

export default SellerEnquiryPage;
