"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Star, MessageSquare } from "lucide-react";
import WhySellpaperdeals from "./Why-Sell-Paperdeals";
import RegisterNow from "@/components/modal/RegisterNow";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";
import { StoryCarousel } from "./SuccessCarousel";

export default function SellOnlinePage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formReview, setFormReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formReview) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/websiterating/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          rating: formRating,
          review: formReview,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Thank you for your rating & review!");
        setFormName("");
        setFormEmail("");
        setFormRating(5);
        setFormReview("");
        // Dispatch custom event to tell SuccessCarousel to refresh
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("refresh-reviews"));
        }
      } else {
        toast.error(json.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSellerLogin = () => {
    window.location.href = "https://paper-deals-admin.netlify.app/";
  };

  return (
    <div className="min-h-screen font-sans ">

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 text-sm">
        <div className="flex items-center text-black">
          <Link
            href="/"
            className="hover:text-blue-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-black" />
          <span className="text-black font-medium">Sell Online</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-10">

          {/* LEFT CONTENT */}
          <div className="md:w-1/2 mb-8 md:mb-0 space-y-6 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
              Sell Paper Products on{" "}
              <span className={`${theme.Text}`}>PaperDeals</span>
            </h1>

            <p className="text-lg text-gray-800 max-w-lg leading-relaxed">
              Join India’s first dedicated marketplace for the paper industry.
              Whether you are a mill, wholesaler, distributor, or manufacturer —
              PaperDeals helps you grow faster with verified B2B & B2C buyers.
            </p>

            <p className="text-gray-700 text-base leading-relaxed">
              Reach thousands of businesses looking for Kraft Paper, Duplex
              Board, Copier Paper, Tissue Products, Packaging Materials, and
              more — all in one trusted platform.
            </p>

            <div className="flex space-x-4">
              <button
                className="bg-[#0f7aed] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition shadow-lg shadow-blue-500/20 active:scale-95"
                onClick={() => setIsOpen(true)}
              >
                Start Selling
              </button>

              {/* Seller Login */}
              <button
                onClick={handleSellerLogin}
                className="border border-gray-300 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-600 hover:text-blue-600 shadow-md hover:shadow-lg"
              >
                Login as a Seller
              </button>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-96 w-full animate-float">
              <Image
                src="/becomeaseller.png"
                alt="Sell on PaperDeals"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <WhySellpaperdeals />

      {/* CTA Section */}
      <section className="py-16 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
            Ready to Grow Your{" "}
            <span className={`${theme.Text}`}>Paper Business?</span>
          </h2>

          <p className="text-gray-800 max-w-2xl mx-auto mb-8 text-lg font-semibold">
            Join the fastest-growing platform built exclusively for the paper
            and packaging industry. Sell smarter, reach verified buyers, and
            scale your business nationwide.
          </p>

          <button
            className="bg-white text-blue-600 font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-gray-100"
            onClick={() => setIsOpen(true)}
          >
            Register Now – It’s Free!
          </button>
        </div>

        {/* Popup Modal */}
        <RegisterNow visible={isOpen} onClose={() => setIsOpen(false)} />
      </section>

      {/* SUCCESS CAROUSEL */}
      <div className="flex justify-center items-center bg-gray-50/30 border-t border-gray-100">
        <StoryCarousel />
      </div>

      {/* RATING & REVIEW SECTION */}
      <section className="bg-gray-50/50 py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Rate Your <span className={`${theme.Text}`}>Experience</span>
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto mb-8 text-lg font-semibold">
              Share your experience selling on PaperDeals. Your feedback helps us improve our services for all merchants.
            </p>
          </div>

          {/* Submit Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Stars</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      className="focus:outline-none transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= (formHoverRating || formRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50/50 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50/50 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience selling on PaperDeals..."
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50/50 text-slate-800 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

