"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  description: string
  price: number
  period: string
  features: PlanFeature[]
  cta: string
  highlighted?: boolean
  badge?: string
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and small projects",
    price: 29,
    period: "/month",
    badge: undefined,
    features: [
      { name: "Up to 5 projects", included: true },
      { name: "5GB storage", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "Custom domain", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: 79,
    period: "/month",
    badge: "Most Popular",
    highlighted: true,
    features: [
      { name: "Unlimited projects", included: true },
      { name: "100GB storage", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Email support", included: true },
      { name: "Custom domain", included: true },
      { name: "Priority support", included: true },
    ],
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large-scale operations and enterprises",
    price: 299,
    period: "/month",
    badge: undefined,
    features: [
      { name: "Unlimited everything", included: true },
      { name: "Unlimited storage", included: true },
      { name: "Custom analytics", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Multiple custom domains", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
  },
]

export default function SubscriptionPlans() {
  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block">
            <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-emerald-600 border border-emerald-200">
              Simple, Transparent Pricing
            </span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Choose Your Perfect Plan
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Select the plan that best fits your needs. Upgrade or downgrade anytime with no hidden fees.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-blue-50 lg:scale-105 shadow-lg"
                    : "border border-slate-200 bg-white"
                }`}
              >
                {plan.badge && (
                  <div className="absolute right-0 top-0">
                    <div className="rounded-bl-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Content */}
                <div className="flex flex-1 flex-col p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-emerald-600">${plan.price}</span>
                      <span className="text-slate-600">{plan.period}</span>
                    </div>
                  </div>

                  <Button
                    className={`mb-8 w-full font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What's included</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check
                            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                              feature.included ? "text-emerald-500" : "text-slate-300"
                            }`}
                          />
                          <span
                            className={`text-sm ${feature.included ? "text-slate-700" : "text-slate-400 line-through"}`}
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-slate-200 px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-emerald-600 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all plans come with a 14-day free trial. No credit card required to get started.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0">
                <h3 className="font-semibold text-blue-600 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
