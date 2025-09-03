import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReadyToOrder from "@/components/readyToOrder/ReadytoOrder";
import PartnerWithUs from "@/components/partnerwithus/PartnerWith";
import FaqSection from "@/components/faqSection/FaqSection";
import { ConsultantCard } from "./Consultants-Card";

export const metadata: Metadata = {
  title: "Our Experienced Consultants | PaperDeals",
  description:
    "Seasoned B2B paper industry consultants for sourcing, logistics, pricing, and quality.",
};

const consultants = [
  {
    name: "Anita Kumar",
    title: "Senior Sourcing Strategist",
    years: 14,
    specialties: ["Pulp & Paper Sourcing", "Supplier Audits", "RFP Strategy"],
    photoUrl: "/woman-consultant.jpg",
  },
  {
    name: "Rahul Mehta",
    title: "Logistics & Ops Consultant",
    years: 11,
    specialties: ["Supply Chain", "Freight Optimization", "Inventory Planning"],
    photoUrl: "/man-consultant.jpg",
  },
  {
    name: "Sara Lee",
    title: "Pricing & Market Analyst",
    years: 9,
    specialties: ["Market Intelligence", "Pricing Models", "Bid Strategy"],
    photoUrl: "/data-analyst-workspace.png",
  },
  {
    name: "Martin Gomez",
    title: "Quality & Compliance Lead",
    years: 13,
    specialties: ["QC Standards", "Sustainability", "Certifications"],
    photoUrl: "/quality-expert.jpg",
  },
];

const specialBadges = [
  "Paper Grades & Specs",
  "Vendor Development",
  "Global Sourcing",
  "Cost Engineering",
  "Sustainability (FSC/PEFC)",
  "Freight & Warehousing",
];

export default function ConsultantsPage() {
  return (
    <>
      <main className="container mx-auto px-4 py-16 bg-[#fafafa]">
        {/* Hero with gradient badge - matches About page vibe */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#22d3ee] text-white">
            <span className="font-medium">Our Experienced Consultants</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-black">Strategy. Sourcing.</span>{" "}
            <span className="text-gray-700">Execution.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            B2B paper supply-chain expertise for measurable outcomes—optimize
            procurement, logistics, pricing, and quality.
          </p>
        </section>

        {/* Expertise badges */}
        <section className="mt-8">
          <Card
            className="bg-[#fafafa] border border-white/10"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
          >
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {specialBadges.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="text-sm text-gray-700 border-white/20 bg-white/5"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Consultants Grid */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {consultants.map((c) => (
            <ConsultantCard key={c.name} consultant={c} />
          ))}
        </section>

        {/* Common site sections */}
      </main>
      <div className="mt-12">
        <ReadyToOrder />
        <PartnerWithUs isaboutpage />
        <FaqSection />
      </div>
    </>
  );
}
