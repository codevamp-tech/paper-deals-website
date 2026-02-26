import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface PaymentStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function PaymentStep({ form, handleChange, onUpdate }: PaymentStepProps) {
    const receiptUrl = form.paymentReceiptUrl || (typeof form.paymentReceipt === "string" ? form.paymentReceipt : null)

    const handleView = () => {
        if (receiptUrl) {
            window.open(receiptUrl.startsWith("http") ? receiptUrl : `${process.env.NEXT_PUBLIC_API_URL}/${receiptUrl}`, "_blank")
        }
    }

    const handleDownload = () => {
        if (receiptUrl) {
            const url = receiptUrl.startsWith("http") ? receiptUrl : `${process.env.NEXT_PUBLIC_API_URL}/${receiptUrl}`
            const a = document.createElement("a")
            a.href = url
            a.download = "payment-receipt"
            a.click()
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Transaction Date</label>
                    <Input type="date" value={form.transactionDate || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Transaction Id</label>
                    <Input value={form.transactionId || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Detail</label>
                    <Input value={form.detail || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <Input value={form.accountNumber || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Bank</label>
                    <Input value={form.bank || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Branch</label>
                    <Input value={form.branch || ""} disabled />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <Input value={form.amount || ""} disabled />
                </div>
            </div>

            {/* Payment Receipt Upload */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Payment Receipt</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Upload Payment Receipt</label>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleChange("paymentReceipt", e.target.files?.[0] || null)}
                            className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Uploaded Receipt</label>
                        {receiptUrl ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 truncate flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                                    {receiptUrl.split("/").pop() || "Receipt"}
                                </span>
                                <Button type="button" variant="outline" size="sm" onClick={handleView} className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" /> View
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
                                    <Download className="w-4 h-4" /> Download
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">No receipt uploaded</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end pt-4">
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
