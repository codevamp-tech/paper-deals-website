import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface OrderConfirmationStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function OrderConfirmationStep({ form, handleChange, onUpdate }: OrderConfirmationStepProps) {
    const docFields = [
        { key: "purchaseOrder", label: "Purchase Order (PO)", formField: "purchaseOrder" },
        { key: "detailsDoc", label: "Details", formField: "detailsDoc" },
        { key: "document3", label: "Document 3", formField: "document3" },
        { key: "document4", label: "Document 4", formField: "document4" },
    ]

    const handleView = (url: string) => {
        if (url) {
            window.open(url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}/${url}`, "_blank")
        }
    }

    const handleDownload = (url: string, name: string) => {
        if (url) {
            const fullUrl = url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}/${url}`
            const a = document.createElement("a")
            a.href = fullUrl
            a.download = name
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Clearance Date</label>
                    <Input
                        type="date"
                        value={form.clearanceDate || ""}
                        onChange={(e) => handleChange("clearanceDate", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Product Price</label>
                    <Input
                        placeholder="Product Price"
                        value={form.productPrice || ""}
                        onChange={(e) => handleChange("productPrice", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Remarks</label>
                    <Input
                        placeholder="Remarks"
                        value={form.clearanceRemarks || ""}
                        onChange={(e) => handleChange("clearanceRemarks", e.target.value)}
                    />
                </div>
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {docFields.map((doc) => {
                    const existingUrl = typeof form[doc.key] === "string" ? form[doc.key] : null
                    return (
                        <div key={doc.key}>
                            <label className="block text-sm font-medium mb-2">{doc.label}</label>
                            <input
                                type="file"
                                onChange={(e) => handleChange(doc.formField, e.target.files?.[0] || null)}
                                className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {existingUrl && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleView(existingUrl)} className="flex items-center gap-1 text-xs">
                                        <Eye className="w-3 h-3" /> View
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(existingUrl, doc.label)} className="flex items-center gap-1 text-xs">
                                        <Download className="w-3 h-3" /> Download
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Update Button */}
            <div className="flex justify-start pt-4">
                <Button
                    type="button"
                    onClick={onUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                    Update
                </Button>
            </div>
        </div>
    )
}
