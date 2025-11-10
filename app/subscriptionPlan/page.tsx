"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Toaster, toast } from "sonner"

// --- Helper function to load external scripts ---
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// --- Plan Interfaces (from your original code) ---
interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: string // e.g., "Rs. 3,599"
  oldPrice?: string
  period: string
  features: PlanFeature[]
  cta: string
  highlighted?: boolean
}

// --- Plans Data (from your original code) ---
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
  // State to manage loading, errors, and success messages
  const [loading, setLoading] = useState(null) // Stores the id of the loading plan
  // Removed error and success states

  // Load Razorpay script when component mounts
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js")
  }, [])

  // Helper to parse amount from "Rs. 3,599" to 3599
  const parseAmount = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return Number(priceStr.replace(/[^0-9]/g, ''));
  }

  // --- Main Payment Handler ---
  const handlePayment = async (plan: Plan) => {
    if (plan.id === "free") return // Do nothing for the free plan

    setLoading(plan.id)
    // Removed setError(null) and setSuccess(null)

    const amount = parseAmount(plan.price)
    if (amount <= 0) {
      toast.error("Invalid plan price.")
      setLoading(null)
      return
    }

    try {
      // 1. --- Call your backend to create an order ---
      // IMPORTANT: Replace '/api/razorpay/create-order' with your actual backend URL
      // or ensure your Next.js/React app proxies this request to your backend.
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed")
      }

      const { order, key } = orderData

      // 2. --- Configure and Open Razorpay Checkout ---
      const options = {
        key: key,
        amount: order.amount, // Amount is in currency subunits (paise)
        currency: "INR",
        name: "Your Company Name", // Replace with your company name
        description: `Payment for ${plan.name}`,
        image: "https://placehold.co/100x100/png?text=LOGO", // Replace with your logo URL
        order_id: order.id,

        // 3. --- Handler function to verify payment ---
        handler: async function (response) {
          try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response

            // 4. --- Call your backend to verify the payment ---
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              toast.success(`Payment Successful! Welcome to ${plan.name}.`)
              // TODO: Add any post-payment logic here
              // e.g., redirect to a success page, update user's subscription in your DB
            } else {
              toast.error(verifyData.message || "Payment verification failed.")
            }
          } catch (err) {
            toast.error("Verification request failed. Please contact support.")
          } finally {
            setLoading(null) // Ensure loading is cleared after handler
          }
        },
        prefill: {
          // You can prefill user data here if you have it
          // name: "User Name",
          // email: "user.email@example.com",
          // contact: "9999999999",
        },
        theme: {
          color: "#2563EB", // Brand color
        },
        modal: {
          ondismiss: function () {
            setLoading(null); // Clear loading state if modal is closed
          }
        }
      }

      // Open the Razorpay modal
      const rzp = new window.Razorpay(options)
      rzp.open()

      // Handle payment failure on the modal
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description || 'Unknown Error'}`);
        setLoading(null) // Ensure loading is cleared on failure
      });

    } catch (err) {
      toast.error(err.message || "An error occurred. Please try again.")
      setLoading(null) // Ensure loading is cleared on catch
    } finally {
      // We set loading to null inside the modal.ondismiss or in the handler
      // to keep the button disabled while the modal is open.
      // The state-based 'if (error)' check was removed.
    }
  }

  return (
    <div className="w-full bg-white font-inter">
      <Toaster richColors position="top-center" />
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Choose Your Plan</h1>
        <p className="mt-4 text-slate-600">
          Upgrade your experience and unlock exclusive features.
        </p>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">

        {/* --- Message Display Area (REMOVED) --- */}
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col p-6 text-center transition-all hover:shadow-xl rounded-lg ${plan.highlighted
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
                onClick={() => handlePayment(plan)}
                disabled={plan.id === 'free' || loading === plan.id}
                className={`mt-6 w-full font-semibold rounded-md ${plan.highlighted
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
                  } ${plan.id === 'free' ? 'opacity-50 cursor-not-allowed' : ''}
                  ${loading === plan.id ? 'opacity-75' : ''}
                `}
              >
                {loading === plan.id ? "Processing..." : plan.cta}
              </Button>

              <ul className="mt-8 space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="text-green-500 h-5 w-5 flex-shrink-0" />
                    ) : (
                      <X className="text-gray-300 h-5 w-5 flex-shrink-0" />
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