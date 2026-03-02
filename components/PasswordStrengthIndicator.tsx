"use client";

import { PasswordStrength } from "@/lib/passwordStrength";

interface Props {
    strength: PasswordStrength;
}

export default function PasswordStrengthIndicator({ strength }: Props) {
    if (!strength.label) return null;

    return (
        <div className="mt-1 space-y-1">
            {/* Strength bar */}
            <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>

            {/* Label */}
            <p
                className={`text-xs font-medium ${strength.score <= 1
                        ? "text-red-600"
                        : strength.score <= 2
                            ? "text-yellow-600"
                            : strength.score <= 3
                                ? "text-blue-600"
                                : "text-green-600"
                    }`}
            >
                {strength.label}
            </p>

            {/* Error list */}
            {strength.errors.length > 0 && (
                <ul className="text-xs text-red-500 space-y-0.5 list-disc pl-4">
                    {strength.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
