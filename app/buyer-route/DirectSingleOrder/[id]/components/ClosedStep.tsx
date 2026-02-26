import { Input } from "@/components/ui/input"

interface ClosedStepProps {
    form: any
    handleChange: (field: string, value: any) => void
}

export default function ClosedStep({ form, handleChange }: ClosedStepProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                "closedDate",
                "product",
                "remarks",
                "productReceivedBy",
            ].map((field) => (
                <div key={field}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <Input disabled />
                </div>
            ))}
        </div>
    )
}
