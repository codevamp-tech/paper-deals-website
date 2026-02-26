import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface SamplingStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function SamplingStep({ form, handleChange, onUpdate }: SamplingStepProps) {
    const docUrl = form.uploadDocumentUrl || form.uploadDocument

    const handleViewDoc = () => {
        if (docUrl && typeof docUrl === "string") {
            window.open(docUrl.startsWith("http") ? docUrl : `${process.env.NEXT_PUBLIC_API_URL}/${docUrl}`, "_blank")
        }
    }

    const handleDownloadDoc = () => {
        if (docUrl && typeof docUrl === "string") {
            const url = docUrl.startsWith("http") ? docUrl : `${process.env.NEXT_PUBLIC_API_URL}/${docUrl}`
            const a = document.createElement("a")
            a.href = url
            a.download = "sampling-document"
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Date Of Sample</label>
                    <Input type="date" value={form.dateOfSample || ""} disabled />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Sample Verification</label>
                    <Input value={form.sampleVerification || ""} disabled />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Lab Report</label>
                    <Input type="date" value={form.labReport || ""} disabled />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Remarks</label>
                    <Input value={form.samplingRemarks || ""} disabled />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Uploaded Document</label>
                    {docUrl && typeof docUrl === "string" ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 truncate flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                                {docUrl.split("/").pop() || "Document"}
                            </span>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                                <span onClick={handleViewDoc} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                    View File
                                </span>
                                <span className="text-gray-300">|</span>
                                <span onClick={handleDownloadDoc} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                    Download
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">No document uploaded</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Request</label>
                    <select
                        value={form.samplingStatus || 0}
                        onChange={(e) => handleChange("samplingStatus", parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value={0}>Pending</option>
                        <option value={1}>Approved</option>
                    </select>
                </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end pt-4">
                <Button
                    type="button"
                    onClick={onUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                    Update Request
                </Button>
            </div>
        </div>
    )
}
