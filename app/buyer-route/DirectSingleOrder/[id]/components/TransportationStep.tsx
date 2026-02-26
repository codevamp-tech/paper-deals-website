import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface TransportationStepProps {
    form: any
    handleChange: (field: string, value: any) => void
}

export default function TransportationStep({ form, handleChange }: TransportationStepProps) {
    const uploadFields = [
        { key: "bill", label: "Upload Bill (Image & PDF Only)" },
        { key: "ewayBill", label: "Upload Eway Bill (Image & PDF Only)" },
        { key: "stockStatement", label: "Upload Stock Statement (Image & PDF Only)" },
        { key: "billT", label: "Upload Bill T (Image & PDF Only)" },
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
                    <Input type="date" value={form.transportationDate || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Transporter Name</label>
                    <Input value={form.transporterName || ""} disabled placeholder="Transporter Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Mode Of Transport</label>
                    <Input value={form.modeOfTransport || ""} disabled placeholder="Mean Of Transport" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Vehicle No.</label>
                    <Input value={form.vehicleNo || ""} disabled placeholder="Vehicle No." />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Freight</label>
                    <Input value={form.freight || ""} disabled placeholder="Freight" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Bill or Lading/LR-RR No</label>
                    <Input value={form.billNo || ""} disabled placeholder="Bill or Lading/LR-RR No" />
                </div>
            </div>

            {/* Upload Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {uploadFields.map((field) => {
                    const fileUrl = form[`${field.key}Url`] || (typeof form[field.key] === "string" ? form[field.key] : null)
                    return (
                        <div key={field.key}>
                            <label className="block text-sm font-medium mb-2">{field.label}</label>
                            {fileUrl ? (
                                <div className="space-y-2">
                                    <span className="text-sm text-gray-600 truncate block border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                                        {fileUrl.split("/").pop() || "File"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => handleView(fileUrl)} className="flex items-center gap-1 text-xs">
                                            <Eye className="w-3 h-3" /> View
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(fileUrl, field.label)} className="flex items-center gap-1 text-xs">
                                            <Download className="w-3 h-3" /> Download
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">No file uploaded</p>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Distance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Distance (in Km)</label>
                    <Input value={form.distance || ""} disabled placeholder="Distance" />
                </div>
            </div>
        </div>
    )
}
