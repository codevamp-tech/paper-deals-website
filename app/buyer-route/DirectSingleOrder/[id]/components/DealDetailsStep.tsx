import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Buyer {
    id: string
    name: string
}

interface Seller {
    id: string
    name: string
}

interface DealDetailsStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    buyers: Buyer[]
    sellers: Seller[]
    categories: any[]
    onUpdate?: () => void
}

export default function DealDetailsStep({ form, handleChange, buyers, sellers, categories, onUpdate }: DealDetailsStepProps) {
    const tdsUrl = form.technicalDataSheetUrl || (typeof form.technicalDataSheet === "string" ? form.technicalDataSheet : null)

    const handleViewTds = () => {
        if (tdsUrl) {
            window.open(tdsUrl.startsWith("http") ? tdsUrl : `${process.env.NEXT_PUBLIC_API_URL}/${tdsUrl}`, "_blank")
        }
    }

    const handleDownloadTds = () => {
        if (tdsUrl) {
            const url = tdsUrl.startsWith("http") ? tdsUrl : `${process.env.NEXT_PUBLIC_API_URL}/${tdsUrl}`
            const a = document.createElement("a")
            a.href = url
            a.download = "technical-data-sheet"
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Deal Id</label>
                        <Input value={form.id || ""} disabled />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Enquiry Id</label>
                        <Input value={form.enqId || ""} disabled />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Buyer</label>
                        <Select value={form.buyerId?.toString() || ""} disabled>
                            <SelectTrigger className="bg-gray-100 text-gray-500 border border-gray-300">
                                <SelectValue placeholder="Select Buyer" />
                            </SelectTrigger>
                            <SelectContent>
                                {buyers?.map((b: any) => (
                                    <SelectItem key={b.id} value={b.id?.toString()}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                                {form.buyerUser && !buyers?.some(b => b.id === form.buyerId) && (
                                    <SelectItem value={form.buyerId?.toString() || "temp"}>
                                        {form.buyerUser.name}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Seller</label>
                        <Select value={form.sellerId?.toString() || ""} disabled>
                            <SelectTrigger className="bg-gray-100 text-gray-500 border border-gray-300">
                                <SelectValue placeholder="Select Seller" />
                            </SelectTrigger>
                            <SelectContent>
                                {sellers?.map((s: any) => (
                                    <SelectItem key={s.id} value={s.id?.toString()}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                                {form.sellerUser && !sellers?.some(s => s.id === form.sellerId) && (
                                    <SelectItem value={form.sellerId?.toString() || "temp"}>
                                        {form.sellerUser.name}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input value={form?.buyerUser?.email_address || form.email || ""} disabled />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Remarks</label>
                        <Input value={form.remarks || ""} disabled />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Technical Data Sheet</label>
                        <input
                            type="file"
                            disabled
                            className="block w-full text-sm !text-black border border-gray-300 rounded-lg cursor-not-allowed bg-gray-100"
                        />
                        {tdsUrl && (
                            <div className="flex items-center gap-2 mt-1">
                                <button type="button" onClick={handleViewTds} className="text-sm text-blue-600 hover:underline">
                                    View File
                                </button>
                                <span className="text-gray-400">|</span>
                                <button type="button" onClick={handleDownloadTds} className="text-sm text-blue-600 hover:underline">
                                    Download
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Details */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Products Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select value={form.category?.toString() || ""} disabled>
                            <SelectTrigger className="bg-gray-100 text-gray-500 border border-gray-300">
                                <SelectValue placeholder="--Select Category--" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.isArray(categories) && categories.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {[
                        { key: "product", label: "Product" },
                        { key: "subProduct", label: "Sub Product" },
                        { key: "brightness", label: "Brightness" },
                        { key: "sizeInch", label: "Size in inch" },
                        { key: "quantityKg", label: "Quantity in Kg" },
                        { key: "priceKg", label: "Price in Kg:" },
                        { key: "totalAmount", label: "Total Amount" },
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium mb-2">{field.label}</label>
                            <Input value={form[field.key] || ""} disabled className="bg-gray-100 text-gray-800" />
                        </div>
                    ))}
                </div>
            </div>

            {/* {onUpdate && (
                <div className="flex justify-start pt-4">
                    <Button
                        type="button"
                        onClick={onUpdate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                        Update
                    </Button>
                </div>
            )} */}
        </div>
    )
}
