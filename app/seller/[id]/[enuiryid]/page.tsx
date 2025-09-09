"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Fetch categories from API
    React.useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`); // use the correct backend route
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                const data = await res.json();
                setCategories(data.categories || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategory();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            sellerId: params.id,
            enquiryId: params.enuiryid,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiry/enquiries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const data = await res.json();
            console.log("Enquiry created:", data);

            setFormData({
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
                            <img src="/placeholder.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-black">Profile Information</p>
                            <p className="text-gray-600 mt-2">KPDS_119</p>
                        </div>
                    </div>
                </Card>

                {/* Business Enquiry Form */}
                <Card className="p-6 md:p-10">
                    <h2 className="text-xl font-bold mb-6 text-black">Business Enquiry</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Company *</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Contact Person */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Contact Person *</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Mobile No. *</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Email *</Label>
                            <Input
                                type="email"
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* City */}
                        <div>
                            <Label className="mb-1 block text-gray-700">City *</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
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
                                            value={cat.name}
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
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* GSM */}
                        <div>
                            <Label className="mb-1 block text-gray-700">GSM</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="gsm"
                                value={formData.gsm}
                                onChange={handleChange}
                            />
                        </div>

                        {/* BF */}
                        <div>
                            <Label className="mb-1 block text-gray-700">BF</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="bf"
                                value={formData.bf}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Shade */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Shade</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="shade"
                                value={formData.shade}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Brightness */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Brightness</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="brightness"
                                value={formData.brightness}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Rim */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Rim</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="rim"
                                value={formData.rim}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Sheet */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Sheet</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="sheet"
                                value={formData.sheet}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Size */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Size in Inch</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <Label className="mb-1 block text-gray-700">Quantity in Kg *</Label>
                            <Input
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Remarks */}
                        <div className="md:col-span-2">
                            <Label className="mb-1 block text-gray-700">Remarks</Label>
                            <Textarea
                                className="bg-gray-50 border border-gray-300 rounded-md text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-200 min-h-[80px]"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows={3}
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
