import { Check } from "lucide-react"

interface StepInfo {
    id: string
    title: string
    description: string
}

interface StepIndicatorProps {
    steps: StepInfo[]
    currentStep: number
    completedSteps: Set<number>
    onStepClick: (stepIndex: number) => void
}

export default function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
    return (
        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <button
                        onClick={() => onStepClick(index)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${index === currentStep
                            ? "border-blue-500 bg-blue-500 text-white"
                            : completedSteps.has(index)
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                            }`}
                    >
                        {completedSteps.has(index) ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                        )}
                    </button>
                    <div className="ml-3 min-w-0 flex-1">
                        <p className={`text-sm font-medium ${index === currentStep ? "text-blue-600" : "text-gray-900"}`}>
                            {step.title}
                        </p>
                        <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4" />}
                </div>
            ))}
        </div>
    )
}
