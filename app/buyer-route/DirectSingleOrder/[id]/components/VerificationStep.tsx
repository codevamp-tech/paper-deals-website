import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface VerificationStepProps {
    form: any
    handleChange: (field: string, value: any) => void
}

export default function VerificationStep({ form, handleChange }: VerificationStepProps) {
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
                    <Input type="date" value={form.dov || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Sample</label>
                    <Input value={form.sample || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Stock Approved</label>
                    <Input value={form.stockApproved || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Upload Document</label>
                    {docUrl ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 truncate flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                                {docUrl.split("/").pop() || "Document"}
                            </span>
                            <Button type="button" variant="outline" size="sm" onClick={handleViewDoc} className="flex items-center gap-1">
                                <Eye className="w-4 h-4" /> View
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={handleDownloadDoc} className="flex items-center gap-1">
                                <Download className="w-4 h-4" /> Download
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">No document uploaded</p>
                    )}
                </div>
            </div>
        </div>
    )
}
