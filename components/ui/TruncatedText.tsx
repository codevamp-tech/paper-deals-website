"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface TruncatedTextProps {
    text: string;
    limit?: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, limit = 30 }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!text) return <span>-</span>;

    if (text.length <= limit) {
        return <span>{text}</span>;
    }

    return (
        <>
            <span
                onClick={() => setIsOpen(true)}
                className="cursor-pointer text-blue-600 hover:underline"
                title="Click to view full text"
            >
                {text.substring(0, limit)}...
            </span>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md w-full bg-white text-black p-6 rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Full Details</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="mt-4 text-sm text-gray-700 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                        {text}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TruncatedText;
