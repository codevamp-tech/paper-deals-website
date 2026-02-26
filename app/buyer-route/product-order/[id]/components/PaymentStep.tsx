import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface PaymentStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function PaymentStep({ form, handleChange, onUpdate }: PaymentStepProps) {
    const docUrl = form.paymentDocUrl || (typeof form.paymentDoc === "string" ? form.paymentDoc : null)

    const handleView = () => {
        if (docUrl) {
            window.open(docUrl.startsWith("http") ? docUrl : `${process.env.NEXT_PUBLIC_API_URL}/${docUrl}`, "_blank")
        }
    }

    const handleDownload = () => {
        if (docUrl) {
            const url = docUrl.startsWith("http") ? docUrl : `${process.env.NEXT_PUBLIC_API_URL}/${docUrl}`
            const a = document.createElement("a")
            a.href = url
            a.download = "payment-document"
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Transaction Date</label>
                    <Input
                        type="date"
                        value={form.transactionDate || ""}
                        onChange={(e) => handleChange("transactionDate", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Transaction Id</label>
                    <Input
                        value={form.transactionId || ""}
                        onChange={(e) => handleChange("transactionId", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Detail</label>
                    <Input
                        value={form.detail || ""}
                        onChange={(e) => handleChange("detail", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <Input
                        value={form.accountNumber || ""}
                        onChange={(e) => handleChange("accountNumber", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Bank</label>
                    <Input
                        value={form.bank || ""}
                        onChange={(e) => handleChange("bank", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Branch</label>
                    <Input
                        value={form.branch || ""}
                        onChange={(e) => handleChange("branch", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <Input
                        value={form.amount || ""}
                        onChange={(e) => handleChange("amount", e.target.value)}
                    />
                </div>
            </div>

            {/* Upload Document - Disabled */}
            <div>
                <label className="block text-sm font-medium mb-2">Upload Document</label>
                <input
                    type="file"
                    disabled
                    className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-not-allowed bg-gray-100"
                />
                {docUrl && (
                    <div className="flex items-center gap-2 mt-2">
                        <Button type="button" variant="outline" size="sm" onClick={handleView} className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> View
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
                            <Download className="w-4 h-4" /> Download
                        </Button>
                    </div>
                )}
            </div>

            {/* Update Button */}
            <div className="flex justify-start pt-4">
                <Button
                    type="button"
                    onClick={onUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                    Update Payment
                </Button>
            </div>
        </div>
    )
}
