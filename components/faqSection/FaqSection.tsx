"use client";

import { useTheme } from "@/hooks/use-theme";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

type Mode = "B2B" | "B2C";

export default function FaqSection() {
  const { theme } = useTheme();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("B2C");

  useEffect(() => {
    const storedMode = localStorage.getItem("mode") as Mode;
    if (storedMode === "B2B" || storedMode === "B2C") {
      setMode(storedMode);
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const b2bFaqs = [
    {
      question: "What is the minimum order quantity for bulk purchases?",
      answer:
        "Minimum order quantities vary by product and mill. Typically, bulk orders start from pallet or truckload quantities. Please contact our sales team for exact MOQ details.",
    },
    {
      question: "Do you offer credit terms for B2B buyers?",
      answer:
        "Yes, we offer flexible credit terms for verified B2B buyers, subject to approval. Our team will guide you through the onboarding process.",
    },
    {
      question: "Can I request custom paper specifications?",
      answer:
        "Absolutely. We support custom GSM, sizes, finishes, and packaging tailored to your business requirements.",
    },
    {
      question: "How is logistics handled for bulk shipments?",
      answer:
        "We work with trusted logistics partners to ensure safe, timely, and cost-effective delivery for bulk and nationwide shipments.",
    },
  ];

  const b2cFaqs = [
    {
      question: "What is the minimum order quantity?",
      answer:
        "For most consumer paper products, the minimum order starts at 10 reams. Some products may have lower minimums.",
    },
    {
      question: "Do you offer samples before purchase?",
      answer:
        "Yes, sample packs are available so you can check quality before placing a larger order.",
    },
    {
      question: "What are the delivery timelines?",
      answer:
        "Standard delivery takes 3–5 business days. Express delivery options may be available depending on your location.",
    },
    {
      question: "Can I return or exchange products?",
      answer:
        "Unused and unopened products can be returned within the return window as per our return policy.",
    },
  ];

  const faqs = mode === "B2B" ? b2bFaqs : b2cFaqs;

  return (
    <section
      id="faq"
      className="py-10 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Frequently Asked{" "}
            <span style={{ color: theme.buttoncolor }}>Questions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {mode === "B2B"
              ? "Important information for business buyers and bulk orders"
              : "Everything you need to know about ordering paper online"}
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border-b border-gray-200 pb-4"
            >
              <button
                className="flex justify-between items-center w-full text-left py-4"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-700 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openIndex === index && (
                <div className="pb-4">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
