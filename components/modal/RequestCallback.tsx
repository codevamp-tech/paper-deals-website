"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function RequestCallback({ visible, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
   const [form, setForm] = useState({ name: "", phone: "" });

    const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    setMounted(true); // ensure client-side rendering
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
    console.log("strartiing")
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reqcall`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) throw new Error("Failed to submit");

    const data = await res.json();
    console.log("✅ API Response:", data);

    alert("Request submitted successfully!");
    onClose(); // close modal after submit
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Something went wrong, please try again.");
  } finally {
    setLoading(false);
  }
};


  if (!visible || !mounted) return null;
    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
            onClick={onClose} // click outside closes modal
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()} // prevent modal clicks from closing
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-cyan-500 text-white rounded-full"
                >
                    ✕
                </button>

                <h2 className="text-black font-semibold mb-4 border-l-4 border-cyan-500 pl-2">
                    Request Callback
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-cyan-500 outline-none"

                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Mobile"
                        value={form.phone}
                        onChange={handleChange}
                        required
                       className="w-full border rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-cyan-500 outline-none"

                    />

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-5 bg-gradient-to-r from-cyan-300 to-blue-500 text-white py-1.5 rounded-md text-sm font-medium hover:opacity-90"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body // ✅ rendered outside Topbar
    );
}
