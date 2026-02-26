import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface TransportationStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function TransportationStep({ form, handleChange, onUpdate }: TransportationStepProps) {
    const uploadFields = [
        { key: "uploadBill", label: "Upload Bill (Image & PDF Only)" },
        { key: "uploadEwayBill", label: "Upload Eway Bill (Image & PDF Only)" },
        { key: "uploadStockStatement", label: "Upload Stock Statement (Image & PDF Only)" },
        { key: "uploadBillT", label: "Upload Bill T (Image & PDF Only)" },
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
                    <label className="block text-sm font-medium mb-2">Transportation Date</label>
                    <Input
                        type="date"
                        placeholder="DD-MM-YY"
                        value={form.transportationDate || ""}
                        onChange={(e) => handleChange("transportationDate", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Transporter Name</label>
                    <Input
                        placeholder="Transporter Name"
                        value={form.transporterName || ""}
                        onChange={(e) => handleChange("transporterName", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Mode Of Transport</label>
                    <Input
                        placeholder="Mean Of Transport"
                        value={form.modeOfTransport || ""}
                        onChange={(e) => handleChange("modeOfTransport", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Vehicle No.</label>
                    <Input
                        placeholder="Vehicle No."
                        value={form.vehicleNo || ""}
                        onChange={(e) => handleChange("vehicleNo", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Freight</label>
                    <Input
                        placeholder="Freight"
                        value={form.freight || ""}
                        onChange={(e) => handleChange("freight", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Bill or Lading/LR-RR No</label>
                    <Input
                        placeholder="Bill or Lading/LR-RR No"
                        value={form.billNo || ""}
                        onChange={(e) => handleChange("billNo", e.target.value)}
                    />
                </div>
            </div>

            {/* Upload Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {uploadFields.map((field) => {
                    const fileUrl = typeof form[field.key] === "string" ? form[field.key] : null
                    return (
                        <div key={field.key}>
                            <label className="block text-sm font-medium mb-2">{field.label}</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleChange(field.key, e.target.files?.[0] || null)}
                                className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {fileUrl && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleView(fileUrl)} className="flex items-center gap-1 text-xs">
                                        <Eye className="w-3 h-3" /> View
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(fileUrl, field.label)} className="flex items-center gap-1 text-xs">
                                        <Download className="w-3 h-3" /> Download
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Distance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Distance (in Km)</label>
                    <Input
                        placeholder="Distance"
                        value={form.distance || ""}
                        onChange={(e) => handleChange("distance", e.target.value)}
                    />
                </div>
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
