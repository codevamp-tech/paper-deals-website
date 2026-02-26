import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ClosedStepProps {
    form: any
    handleChange: (field: string, value: any) => void
    onUpdate?: () => void
    userRole?: number
}

export default function ClosedStep({ form, handleChange, onUpdate, userRole }: ClosedStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Closed Date</label>
                    <Input
                        type="date"
                        placeholder="DD-MM-YY"
                        value={form.closedDate || ""}
                        onChange={(e) => handleChange("closedDate", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Product</label>
                    <Input
                        placeholder="Product"
                        value={form.closeProduct || form.product || ""}
                        onChange={(e) => handleChange("closeProduct", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Remarks</label>
                    <Input
                        placeholder="Remarks"
                        value={form.closeRemarks || ""}
                        onChange={(e) => handleChange("closeRemarks", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Product recd. by</label>
                    <Input
                        placeholder="Product recd. by"
                        value={form.productReceivedBy || ""}
                        onChange={(e) => handleChange("productReceivedBy", e.target.value)}
                    />
                </div>

            </div>

            {/* Close Deal Button */}
            <div className="flex justify-start pt-4">
                <Button
                    type="button"
                    onClick={onUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                    Close Deal
                </Button>
            </div>
        </div>
    )
}
