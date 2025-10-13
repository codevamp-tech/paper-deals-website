"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const faqs = [
    {
      question: "What minimum order quantities do you require?",
      answer:
        "Our minimum order quantities very by product type. For standard copy paper, the minimum order is 10 reams. For specialty papers, minimums may be lower. Please contact our sales team for specific product minimums.",
    },
    {
      question: "Do you offer custom paper solutions?",
      answer:
        "Yes, we specialize in custom paper solutions tailored to your specific business needs. Our team can work with you to develop custom sizes, weights, and finishes to meet your exact specifications.",
    },
    {
      question: "What are your delivery timeframes?",
      answer:
        "Standard delivery typically takes 3-5 business days within the continental US. We also offer expedited shipping options for urgent orders, with delivery in as little as 24 hours depending on your location.",
    },
    {
      question: "Do you offer samples before bulk ordering?",
      answer:
        "We provide sample kits for all our paper products so you can test quality and suitability before placing a larger order. Sample kits can be requested through our website or by contacting our sales team.",
    },
  ];

  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-white">
            Frequently Asked <span className="text-gray-100">Questions</span>
          </h2>
          <p className="text-gray-100 max-w-2xl mx-auto">
            Everything you need to know about our paper products and services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-white pb-4">
              <button
                className="flex justify-between items-center w-full text-left py-4"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-white transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="pb-4">
                  <p className="text-white font-normal">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
