"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: string
  oldPrice?: string
  period: string
  features: PlanFeature[]
  cta: string
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: "Rs. 0",
    period: "/ Forever",
    features: [
      { name: "All Products Access", included: true },
      { name: "App & Web Access", included: true },
      { name: "Customer Support", included: true },
      { name: "Daily Market Price", included: true },
      { name: "Access User Contacts", included: false },
      { name: "Access User Profile", included: false },
      { name: "Access Direct Chat", included: false },
      { name: "Included Profile Verification", included: false },
      { name: "Upcoming Exhibition Details", included: false },
      { name: "Industry News", included: false },
      { name: "Paid Post For Your Materials", included: false },
      { name: "Advertise on Website", included: false },
      { name: "Social media Promotion", included: false },
      { name: "WhatsApp Community access", included: false },
      { name: "Personal Lead Manager", included: false },
      { name: "Your Company Website", included: false },
      { name: "Dedicated Support", included: false },
    ],
    cta: "Current Plan",
  },
  {
    id: "gold",
    name: "Gold Plan",
    price: "Rs. 3,599",
    oldPrice: "Rs. 5,999",
    period: "/ Year",
    highlighted: true,
    features: [
      { name: "All Products Access", included: true },
      { name: "App & Web Access", included: true },
      { name: "Customer Support", included: true },
      { name: "Daily Market Price", included: true },
      { name: "Access User Contacts", included: true },
      { name: "Access User Profile", included: true },
      { name: "Access Direct Chat", included: true },
      { name: "Included Profile Verification", included: true },
      { name: "Upcoming Exhibition Details", included: true },
      { name: "Industry News", included: true },
      { name: "Paid Post For Your Materials", included: false },
      { name: "Advertise on Website", included: false },
      { name: "Social media Promotion", included: false },
      { name: "WhatsApp Community access", included: false },
      { name: "Personal Lead Manager", included: false },
      { name: "Your Company Website", included: false },
      { name: "Dedicated Support", included: false },
    ],
    cta: "Upgrade Now",
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    price: "Rs. 9,999",
    oldPrice: "Rs. 14,999",
    period: "/ Year",
    features: [
      { name: "All Products Access", included: true },
      { name: "App & Web Access", included: true },
      { name: "Customer Support", included: true },
      { name: "Daily Market Price", included: true },
      { name: "Access User Contacts", included: true },
      { name: "Access User Profile", included: true },
      { name: "Access Direct Chat", included: true },
      { name: "Included Profile Verification", included: true },
      { name: "Upcoming Exhibition Details", included: true },
      { name: "Industry News", included: true },
      { name: "Paid Post For Your Materials", included: true },
      { name: "Advertise on Website", included: true },
      { name: "Social media Promotion", included: true },
      { name: "WhatsApp Community access", included: true },
      { name: "Personal Lead Manager", included: true },
      { name: "Your Company Website", included: true },
      { name: "Dedicated Support", included: true },
    ],
    cta: "Go Premium",
  },
]

export default function SubscriptionPlans() {
  return (
    <div className="w-full bg-white">
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Choose Your Plan</h1>
        <p className="mt-4 text-slate-600">
          Upgrade your experience and unlock exclusive features.
        </p>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col p-6 text-center transition-all hover:shadow-xl ${plan.highlighted
                  ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-blue-50"
                  : "border border-gray-200"
                }`}
            >
              <h2 className="text-2xl font-bold text-emerald-700">{plan.name}</h2>

              <div className="mt-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-slate-900">{plan.price}</div>
                {plan.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">{plan.oldPrice}</span>
                )}
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              <Button
                className={`mt-6 w-full font-semibold ${plan.highlighted
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
              >
                {plan.cta}
              </Button>

              <ul className="mt-8 space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="text-green-500 h-5 w-5" />
                    ) : (
                      <X className="text-gray-300 h-5 w-5" />
                    )}
                    <span
                      className={`text-sm ${feature.included
                          ? "text-slate-700"
                          : "text-slate-400 line-through"
                        }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
