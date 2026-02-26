import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface SamplingStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function SamplingStep({ form, handleChange, onUpdate }: SamplingStepProps) {
    const docUrl = form.uploadDocumentUrl || (typeof form.uploadDocument === "string" ? form.uploadDocument : null)

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
            a.download = "sampling-document"
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Date Of Sample</label>
                    <Input
                        type="date"
                        value={form.dateOfSample || ""}
                        onChange={(e) => handleChange("dateOfSample", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Sample Verification</label>
                    <Input
                        placeholder="Sample Verification"
                        value={form.sampleVerification || ""}
                        onChange={(e) => handleChange("sampleVerification", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Lab Report</label>
                    <Input
                        type="date"
                        value={form.labReport || ""}
                        onChange={(e) => handleChange("labReport", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Remarks</label>
                    <Input
                        placeholder="Remarks"
                        value={form.samplingRemarks || ""}
                        onChange={(e) => handleChange("samplingRemarks", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Upload Document</label>
                    <input
                        type="file"
                        onChange={(e) => handleChange("uploadDocument", e.target.files?.[0] || null)}
                        className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {docUrl && (
                        <div className="flex items-center gap-2 mt-2 text-sm">
                            <span onClick={handleViewDoc} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                View File
                            </span>
                            <span className="text-gray-300">|</span>
                            <span onClick={handleDownloadDoc} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                Download
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Sampling Status</label>
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
