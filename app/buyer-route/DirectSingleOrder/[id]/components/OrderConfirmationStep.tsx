import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface OrderConfirmationStepProps {
    form: any
    handleChange: (field: string, value: any) => void
}

export default function OrderConfirmationStep({ form, handleChange }: OrderConfirmationStepProps) {

    const documents = [
        { label: "Technical Data Sheet", url: form.technicalDataSheetUrl || form.technicalDataSheet },
        { label: "Sampling Document", url: form.uploadDocumentUrl || (typeof form.uploadDocument === "string" ? form.uploadDocument : null) },
        { label: "Verification Document", url: form.verificationDocUrl || (typeof form.verificationDoc === "string" ? form.verificationDoc : null) },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Clearance Date</label>
                    <Input type="date" value={form.clearanceDate || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Product Price</label>
                    <Input value={form.productPrice || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Remarks</label>
                    <Input value={form.clearanceRemarks || ""} disabled />
                </div>
            </div>

            {/* All Documents Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <div key={doc.label} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <label className="block text-sm font-medium mb-2">{doc.label}</label>
                            {doc.url && typeof doc.url === "string" ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 truncate flex-1">
                                        {doc.url.split("/").pop() || "Document"}
                                    </span>
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleView(doc.url)} className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" /> View
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(doc.url, doc.label)} className="flex items-center gap-1">
                                        <Download className="w-4 h-4" /> Download
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">No document available</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
