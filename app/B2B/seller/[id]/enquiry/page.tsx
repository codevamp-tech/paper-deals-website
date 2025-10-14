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
import { useParams } from "next/navigation";

interface SellerEnquiryPageProps {
    params: {
        id: string;
        enuiryid: string;
    };
}

interface Category {
    id: number;
    name: string;
    image?: string;
    status: number;
    date: string;
}

const SellerEnquiryPage: React.FC<SellerEnquiryPageProps> = ({ params }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        company: "",
        contactPerson: "",
        mobile: "",
        email: "",
        city: "",
        category: "",
        product: "",
        gsm: "",
        bf: "",
        shade: "",
        brightness: "",
        rim: "",
        sheet: "",
        size: "",
        quantity: "",
        remarks: "",
    });

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [buyerData, setBuyerData] = useState<any>(null);

    const user = getUserFromToken();
    console.log("user??", user);

    // ✅ Fetch buyer and organization info
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
                setBuyerData(data);

                // ✅ Auto-fill fields from organization
                setFormData((prev) => ({
                    ...prev,
                    company: org.organizations || "",
                    contactPerson: org.contact_person || "",
                    email: org.email || "",
                    city: org.city || "",
                    mobile: org.phone ? org.phone.toString() : data.phone_no || "",
                }));
            } catch (err) {
                console.error("Error fetching buyer details:", err);
            }
        };

        fetchBuyerData();
    }, [user?.user_id]);

    // ✅ Fetch categories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`);
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                const data = await res.json();
                setCategories(data.categories || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategory();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const data = await res.json();
            console.log("Enquiry created:", data);

            alert("Enquiry submitted successfully!");
        } catch (err) {
            console.error("Error submitting enquiry:", err);
            alert("Something went wrong while submitting your enquiry.");
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
                                src={
                                    "/placeholder.png"
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-black">Profile Information</p>
                            {/* seller id  */}
                            <p className="text-gray-600 mt-2">
                                KPDS_{id}
                            </p>

                        </div>
                    </div>
                </Card>

                {/* Business Enquiry Form */}
                <Card className="p-6 md:p-10">
                    <h2 className="text-xl font-bold mb-6 text-black">Business Enquiry</h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Company */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Company *</Label>
                            <Input
                                name="company"
                                value={formData.company}
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
                                name="contactPerson"
                                value={formData.contactPerson}
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
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) =>
                                    setFormData((prev) => ({ ...prev, category: val }))
                                }
                            >
                                <SelectTrigger className="bg-white border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200">
                                    <SelectValue placeholder="--Select Category--" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-black">
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.name || `category-${cat.id}`}
                                            className="bg-white text-black hover:bg-gray-100"
                                        >
                                            {cat.name || `Category ${cat.id}`}
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
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                required
                            />
                        </div>

                        {/* GSM */}
                        <div>
                            <Label className="mb-1 block text-gray-700">GSM</Label>
                            <Input
                                name="gsm"
                                value={formData.gsm}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* BF */}
                        <div>
                            <Label className="mb-1 block text-gray-700">BF</Label>
                            <Input
                                name="bf"
                                value={formData.bf}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* Shade */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Shade</Label>
                            <Input
                                name="shade"
                                value={formData.shade}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* Brightness */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Brightness</Label>
                            <Input
                                name="brightness"
                                value={formData.brightness}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* Rim */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Rim</Label>
                            <Input
                                name="rim"
                                value={formData.rim}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* Sheet */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Sheet</Label>
                            <Input
                                name="sheet"
                                value={formData.sheet}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* Size */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Size in Inch</Label>
                            <Input
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Quantity in Kg *</Label>
                            <Input
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200 min-h-[80px]"
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
