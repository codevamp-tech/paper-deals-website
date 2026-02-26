import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface VerificationStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function VerificationStep({ form, handleChange, onUpdate }: VerificationStepProps) {
    const docUrl = form.verificationDocUrl || (typeof form.verificationDoc === "string" ? form.verificationDoc : null)

    const handleViewDoc = () => {
        if (docUrl) {
            window.open(docUrl.startsWith("http") ? docUrl : `${process.env.NEXT_PUBLIC_API_URL}/${docUrl}`, "_blank")
        }
    }

    const handleDownloadDoc = () => {
        if (docUrl) {
            const url = docUrl.startsWith("http") ? docUrl : `${process.env.NEXT_PUBLIC_API_URL}/${docUrl}`
            const a = document.createElement("a")
            a.href = url
            a.download = "verification-document"
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Date of Validation</label>
                    <Input
                        type="date"
                        value={form.dov || ""}
                        onChange={(e) => handleChange("dov", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Sample</label>
                    <Input
                        value={form.sample || ""}
                        onChange={(e) => handleChange("sample", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Stock Approved</label>
                    <Input
                        value={form.stockApproved || ""}
                        onChange={(e) => handleChange("stockApproved", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Upload Document</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleChange("verificationDoc", e.target.files?.[0] || null)}
                        className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {docUrl && (
                        <div className="flex items-center gap-2 mt-2">
                            <Button type="button" variant="outline" size="sm" onClick={handleViewDoc} className="flex items-center gap-1">
                                <Eye className="w-4 h-4" /> View
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={handleDownloadDoc} className="flex items-center gap-1">
                                <Download className="w-4 h-4" /> Download
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-start pt-4">
                <Button
                    type="button"
                    onClick={onUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                    Update Verification
                </Button>
            </div>
        </div>
    )
}
