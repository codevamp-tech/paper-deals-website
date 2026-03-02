"use client";

import { useState, useCallback } from "react";

export interface PasswordStrength {
    score: number; // 0-4
    label: string;
    color: string;
    errors: string[];
}

export function validatePasswordStrength(password: string): PasswordStrength {
    const errors: string[] = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("At least one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        errors.push("At least one special character (!@#$%^&*)");

    const score = 5 - errors.length;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-blue-500",
        "bg-green-500",
    ];

    return {
        score: Math.max(0, Math.min(4, score)),
        label: labels[Math.max(0, Math.min(4, score))],
        color: colors[Math.max(0, Math.min(4, score))],
        errors,
    };
}

export function isPasswordStrong(password: string): boolean {
    return validatePasswordStrength(password).score >= 4;
}

export function usePasswordStrength() {
    const [strength, setStrength] = useState<PasswordStrength>({
        score: 0,
        label: "",
        color: "",
        errors: [],
    });

    const checkStrength = useCallback((password: string) => {
        if (!password) {
            setStrength({ score: 0, label: "", color: "", errors: [] });
            return;
        }
        setStrength(validatePasswordStrength(password));
    }, []);

    return { strength, checkStrength };
}
