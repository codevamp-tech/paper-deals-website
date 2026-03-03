import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Download, Landmark } from "lucide-react"

interface PaymentStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
}

export default function PaymentStep({ form, handleChange, onUpdate }: PaymentStepProps) {
    const docUrl = form.paymentDocUrl || (typeof form.paymentDoc === "string" ? form.paymentDoc : null)

    // Seller bank details
    const [sellerBank, setSellerBank] = useState<any>(null)

    useEffect(() => {
        if (!form.sellerId) return
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bank-details/${form.sellerId}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setSellerBank(data) })
            .catch(err => console.error("Error fetching seller bank details:", err))
    }, [form.sellerId])

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
            {/* Seller Bank Details */}
            {sellerBank && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
                        <Landmark className="w-5 h-5" />
                        Seller Bank Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Bank Name</label>
                            <p className="text-sm font-medium text-gray-900">{sellerBank.bank_name || "—"}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Account Holder Name</label>
                            <p className="text-sm font-medium text-gray-900">{sellerBank.account_holder_name || "—"}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Account Number</label>
                            <p className="text-sm font-medium text-gray-900">{sellerBank.account_number || "—"}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">IFSC Code</label>
                            <p className="text-sm font-medium text-gray-900">{sellerBank.ifsc_code || "—"}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Branch</label>
                            <p className="text-sm font-medium text-gray-900">{sellerBank.branch_name || "—"}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">UPI ID</label>
                            <p className="text-sm font-medium text-gray-900">{sellerBank.upi_id || "—"}</p>
                        </div>
                    </div>
                </div>
            )}

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
