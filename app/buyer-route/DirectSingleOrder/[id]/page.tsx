"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

// Step components
import DealDetailsStep from "./components/DealDetailsStep"
import SamplingStep from "./components/SamplingStep"
import VerificationStep from "./components/VerificationStep"
import OrderConfirmationStep from "./components/OrderConfirmationStep"
import PaymentStep from "./components/PaymentStep"
import TransportationStep from "./components/TransportationStep"
import ClosedStep from "./components/ClosedStep"
import StepIndicator from "./components/StepIndicator"

interface Buyer {
  id: string
  name: string
}

interface Seller {
  id: string
  name: string
}

const FORM_STEPS = [
  { id: "deal-details", title: "Deal Details", description: "Basic deal information and contacts" },
  { id: "sampling", title: "Sampling", description: "Sample verification and lab reports" },
  { id: "verification", title: "Verification", description: "Validation and stock approval" },
  { id: "order-confirmation", title: "Order Confirmation", description: "Clearance and pricing details" },
  { id: "payment", title: "Payment", description: "Transaction and banking information" },
  { id: "transportation", title: "Transportation", description: "Shipping and logistics data" },
  { id: "closed", title: "Closed", description: "Final closure and commission details" },
]

// helper: backend → frontend
const mapApiToForm = (data: any) => ({
  id: data.id,
  dealId: data.id,
  enqId: data.enq_id,
  buyerId: data.buyer_id,
  sellerId: data.seller_id,
  buyerUser: data.buyerUser,
  sellerUser: data.sellerUser,
  contactPerson: data.contact_person,
  mobile: data.mobile_no,
  email: data.email_id,
  remarks: data.remarks,
  category: data.category,
  product: data.product_description,
  subProduct: data.sub_product,
  brightness: data.brightness,
  gsm: data.gsm,
  bf: data.bf,
  shade: data.shade,
  hsnNo: data.hsn,
  grain: data.grain,
  sheet: data.sheat, // API typo "sheat"
  wl: data.w_l,
  noOfBundle: data.no_of_bundle,
  noOfRim: data.no_of_rim,
  rimWeight: data.rim_weight,
  sizeInch: data.deal_size,
  stockKg: data.stock_in_kg,
  quantityKg: data.quantity_in_kg,
  priceKg: data.price_per_kg,
  totalAmount: data.deal_amount,
  technicalDataSheet: data.tds,
  technicalDataSheetUrl: data.tds,

  // Sampling
  samplingId: data.sampling?.id,
  dateOfSample: data.sampling?.dos,
  sampleVerification: data.sampling?.sample_verification,
  labReport: data.sampling?.lab_report,
  samplingRemarks: data.sampling?.remarks,
  uploadDocument: data.sampling?.upload_doc,
  uploadDocumentUrl: data.sampling?.upload_doc,
  samplingStatus: data.sampling?.status,

  // Verification
  dov: data.validation?.dov,
  sample: data.validation?.sample,
  stockApproved: data.validation?.stock_approve,
  verificationDoc: data.validation?.upload_docu,
  verificationDocUrl: data.validation?.upload_docu,

  // Clearance / Order Confirmation
  clearanceDate: data.clearance?.doc,
  productPrice: data.clearance?.bill,
  clearanceRemarks: data.clearance?.remarks,
  purchaseOrder: data.clearance?.bill,
  detailsDoc: data.clearance?.ewaybill,
  document3: data.clearance?.stock_statement,
  document4: data.clearance?.bill_t,

  // Payment
  transactionDate: data.payment?.transaction_date,
  transactionId: data.payment?.detail,
  accountNumber: data.payment?.acc_no,
  bank: data.payment?.bank,
  branch: data.payment?.branch,
  amount: data.payment?.ammount,
  paymentDoc: data.payment?.upload_docume,
  paymentDocUrl: data.payment?.upload_docume,

  // Transportation
  transportationDate: data.transportation?.transportation_date,
  transporterName: data.transportation?.transporter_name,
  modeOfTransport: data.transportation?.mot,
  vehicleNo: data.transportation?.vehicle_no,
  freight: data.transportation?.ammount_incured,
  billNo: data.transportation?.bill,
  distance: data.transportation?.distance,
  uploadBill: data.transportation?.upload_documen,
  uploadEwayBill: data.transportation?.ewaybill,
  uploadStockStatement: data.transportation?.stock_statement,
  uploadBillT: data.transportation?.bill_t,

  // Closed
  closedDate: data.close?.close_date,
  closeRemarks: data.close?.remarks,
  productReceivedBy: data.close?.product_recd,
  commission: data.close?.comission,
})

// helpers
const mapDealPayload = (form: any) => ({
  deal_id: form.dealId,
  enq_id: form.enqId,
  buyer_id: form.buyerId,
  seller_id: form.sellerId,
  contact_person: form.contactPerson,
  mobile_no: form.mobile,
  email_id: form.email,
  remarks: form.remarks,
  category: form.category,
  product_description: form.product,
  sub_product: form.subProduct,
  brightness: form.brightness,
  gsm: form.gsm,
  bf: form.bf,
  shade: form.shade,
  hsn: form.hsnNo,
  grain: form.grain,
  sheat: form.sheet,
  w_l: form.wl,
  no_of_bundle: form.noOfBundle,
  no_of_rim: form.noOfRim,
  rim_weight: form.rimWeight,
  deal_size: form.sizeInch,
  stock_in_kg: form.stockKg,
  quantity_in_kg: form.quantityKg,
  price_per_kg: form.priceKg,
  deal_amount: form.totalAmount,
})

// Sampling
const mapSamplingPayload = (form: any) => ({
  deal_id: form.dealId,
  dos: form.dateOfSample,
  sample_verification: form.sampleVerification,
  lab_report: form.labReport,
  remarks: form.samplingRemarks,
  status: form.samplingStatus,
})

// Verification
const mapVerificationPayload = (form: any) => ({
  deal_id: form.dealId,
  dov: form.dov,
  sample: form.sample,
  stock_approve: form.stockApproved,
  upload_docu: form.verificationDoc,
})

// Order Confirmation
const mapClearancePayload = (form: any) => ({
  deal_id: form.dealId,
  clearance_date: form.clearanceDate,
  product_price: form.productPrice,
  remarks: form.clearanceRemarks,
})

// Payment
const mapPaymentPayload = (form: any) => ({
  deal_id: form.dealId,
  transaction_date: form.transactionDate,
  transaction_id: form.transactionId,
  detail: form.detail,
  account_number: form.accountNumber,
  bank: form.bank,
  branch: form.branch,
  amount: form.amount,
})

// Transportation
const mapTransportationPayload = (form: any) => ({
  deal_id: form.dealId,
  transportation_date: form.transportationDate,
  transporter_name: form.transporterName,
  mot: form.modeOfTransport,
  vehicle_no: form.vehicleNo,
  freight: form.freight,
  bill_or_lading: form.billNo,
  distance: form.distance,
})

// Closed
const mapClosePayload = (form: any) => ({
  deal_id: form.dealId,
  closed_date: form.closedDate,
  product: form.product,
  remarks: form.closeRemarks,
  product_received_by: form.productReceivedBy,
  commission: form.commission,
})

// Dynamic mapper
const getStepPayload = (step: number, form: any) => {
  switch (step) {
    case 0:
      return mapDealPayload(form)
    case 1:
      return mapSamplingPayload(form)
    case 2:
      return mapVerificationPayload(form)
    case 3:
      return mapClearancePayload(form)
    case 4:
      return mapPaymentPayload(form)
    case 5:
      return mapTransportationPayload(form)
    case 6:
      return mapClosePayload(form)
    default:
      return {}
  }
}

export default function DealForm() {
  const params = useParams()
  const dealId = params?.id as string

  const [form, setForm] = useState<any>({})
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const endpoints = ["dashboard", "samplings", "validation", "clearance", "payment", "transportation", "close"]
      const endpoint = endpoints[currentStep] || "dashboard"

      const payload = getStepPayload(currentStep, form)

      const hasFile =
        Boolean(
          (currentStep === 0 && form.technicalDataSheet && typeof form.technicalDataSheet !== "string") ||
          (currentStep === 1 && form.uploadDocument && typeof form.uploadDocument !== "string") ||
          (currentStep === 2 && form.verificationDoc && typeof form.verificationDoc !== "string")
        );

      let options: RequestInit;
      let url =
        endpoint === "dashboard"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${dealId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`;

      if (currentStep === 1) {
        if (!form.samplingId) {
          toast.error("Sampling data not found. Seller must submit first.");
          return;
        }
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/samplings/toggle/${form.samplingId}/status`;
        options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: form.samplingStatus || 0 })
        };
      } else {
        if (hasFile) {
          const fd = new FormData()
          Object.entries(payload).forEach(([k, v]) => {
            if (v !== null && v !== undefined && typeof v !== "object") fd.append(k, v as string)
          })

          if (currentStep === 0 && form.technicalDataSheet && typeof form.technicalDataSheet !== "string") {
            fd.append("tds", form.technicalDataSheet);
          }

          if (currentStep === 1 && form.uploadDocument && typeof form.uploadDocument !== "string") {
            fd.append("upload_doc", form.uploadDocument);
          }

          if (currentStep === 2 && form.verificationDoc && typeof form.verificationDoc !== "string") {
            fd.append("upload_docu", form.verificationDoc);
          }

          options = {
            method: endpoint === "dashboard" ? "PUT" : "POST",
            body: fd,
          }
        } else {
          options = {
            method: endpoint === "dashboard" ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        }
      }
      console.log("options", options)
      const res = await fetch(url, options)
      const data = await res.json()

      if (res.ok) {
        toast.success(`Step updated successfully: ${FORM_STEPS[currentStep].title}`)
        setCompletedSteps((prev) => new Set([...prev, currentStep]))

        let nextStatus = currentStep + 2;
        if (currentStep === 6) nextStatus = 7;

        let shouldUpdateStatus = true;
        if (currentStep === 1 && form.samplingStatus !== 1) { // 1 means Approved
          shouldUpdateStatus = false;
        }

        if (shouldUpdateStatus) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${dealId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deal_status: nextStatus })
          });

          if (currentStep < FORM_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
          }
        }
      } else {
        throw new Error(data.message || "Unknown error")
      }
    } catch (err) {
      console.error(err)
      toast.error(`Failed to update step: ${FORM_STEPS[currentStep].title}`)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const fetchDeal = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/dealbyid/${dealId}`)
      const data = await res.json()
      setForm(mapApiToForm(data))

      let status = data.deal_status || 1;
      let step = status - 1;
      if (step < 0) step = 0;
      if (step > 6) step = 6;

      setCurrentStep(step);

      const completed = new Set<number>();
      for (let i = 0; i < step; i++) {
        completed.add(i);
      }
      setCompletedSteps(completed);

      console.log("[v0] Deal data loaded from API")
    } catch (error) {
      console.log("API unavailable")
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`)
      const data = await res.json()
      setCategories(data.categories || data.data || [])
      console.log("[v0] Categories loaded from API", data)
    } catch (error) {
      console.log("API unavailable,")
    }
  }

  const fetchBuyersAndSellers = async () => {
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getBuyer`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getallsellers?user_type=2`),
      ])
      const buyersData = await buyerRes.json()
      const sellersData = await sellerRes.json()
      setBuyers(buyersData.data)
      setSellers(sellersData.data)
      console.log("[v0] Buyers and sellers loaded from API")
    } catch (error) {
      console.log("API unavailable")
    }
  }

  useEffect(() => {
    fetchDeal()
    fetchBuyersAndSellers()
    fetchCategories()
  }, [dealId])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <DealDetailsStep
            form={form}
            handleChange={handleChange}
            buyers={buyers}
            sellers={sellers}
            categories={categories}
            onUpdate={handleSubmit}
          />
        )
      case 1:
        return <SamplingStep form={form} handleChange={handleChange} onUpdate={handleSubmit} />
      case 2:
        return <VerificationStep form={form} handleChange={handleChange} />
      case 3:
        return <OrderConfirmationStep form={form} handleChange={handleChange} />
      case 4:
        return <PaymentStep form={form} handleChange={handleChange} onUpdate={handleSubmit} />
      case 5:
        return <TransportationStep form={form} handleChange={handleChange} />
      case 6:
        return <ClosedStep form={form} handleChange={handleChange} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black" >Deal Management</h1>
          <Badge variant="default">
            Step {currentStep + 1} of {FORM_STEPS.length}
          </Badge>
        </div>

        {/* Step indicators */}
        <StepIndicator
          steps={FORM_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      <Card className="bg-white text-black border">
        <CardHeader>
          <CardTitle>{FORM_STEPS[currentStep].title}</CardTitle>
          <p className="text-sm">{FORM_STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center bg-white text-black border"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                onClick={nextStep}
                disabled={currentStep === FORM_STEPS.length - 1}
                className="flex items-center bg-white text-black border"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
