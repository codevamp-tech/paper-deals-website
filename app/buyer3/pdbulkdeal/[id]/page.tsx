"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, Trash2, Download } from "lucide-react"
import { toast } from "sonner"
import { getUserFromToken } from "@/hooks/use-token"

const FORM_STEPS = [
  { id: "deal-details", title: "Deal Details", description: "Basic deal information and contacts" },
  { id: "sampling", title: "Sampling", description: "Sample verification and lab reports" },
  { id: "verification", title: "Verification", description: "Validation and stock approval" },
  { id: "order-confirmation", title: "Order Confirmation", description: "Clearance and pricing details" },
  { id: "payment", title: "Payment", description: "Transaction and banking information" },
  { id: "transportation", title: "Transportation", description: "Shipping and logistics data" },
  { id: "closed", title: "Closed", description: "Final closure and commission details" },
]

const mapApiToForm = (data: any) => ({
  dealId: data.deal_id,
  buyerId: data.buyer_id,
  buyerName: data.buyerUser?.name || "",
  buyerEmail: data.buyerUser?.email_address || "",
  buyerMobile: data.buyerUser?.phone_no || "",
  buyerContact: data.buyerUser?.organization?.contact_person || "",

  sellerId: data.seller_id,
  sellerName: data.sellerUser?.name || "",
  sellerEmail: data.sellerUser?.email_address || "",
  sellerMobile: data.sellerUser?.phone_no || "",
  sellerContact: data.sellerUser?.organization?.contact_person || "",

  pdExecutive: data.user?.name || "",
  pdExecutiveEmail: data.user?.email_address || "",
  pdExecutiveMobile: data.user?.phone_no || "",

  contactPerson: data.contact_person,
  mobile: data.mobile_no,
  mobileAlt: data.mobile_no2 || "",
  email: data.email_id,
  remarks: data.remarks,
  dealAmount: data.deal_amount,
  quantityKg: data.quantity_in_kg,

  commission: data.commission,
  buyerCommission: data.buyer_commission,
  sellerCommission: data.seller_commission,

  category: data.category?.toString() || "",
  categoryName: data.categoryInfo?.name || "",

  product: data.product_description,
  subProduct: data.sub_product,
  brightness: data.brightness,
  gsm: data.gsm,
  bf: data.bf,
  shade: data.shade,
  hsnNo: data.hsn,
  grain: data.grain,
  sheet: data.sheat,
  wl: data.w_l,
  noOfBundle: data.no_of_bundle,
  noOfRim: data.no_of_rim,
  rimWeight: data.rim_weight,
  sizeInch: data.deal_size,
  stockKg: data.stock_in_kg,
  priceKg: data.price_per_kg,
})

const mapDealPayload = (form: any) => ({
  deal_id: form.dealId,
  user_id: form.userId,
  buyer_id: form.buyerId,
  seller_id: form.sellerId,
  contact_person: form.buyerContact,
  mobile_no: form.buyerMobile,
  mobile_no2: form.mobileAlt || null,
  email_id: form.email,
  product_description: form.product,
  deal_size: form.sizeInch,
  deal_amount: form.dealAmount,
  brightness: form.brightness,
  sub_product: form.subProduct,
  gsm: form.gsm,
  bf: form.bf,
  shade: form.shade,
  grain: form.grain,
  hsn: form.hsnNo,
  sheat: form.sheet,
  w_l: form.wl,
  rim_weight: form.rimWeight,
  no_of_bundle: form.noOfBundle,
  no_of_rim: form.noOfRim,
  price_per_kg: form.priceKg,
  quantity_in_kg: form.quantityKg,
  stock_in_kg: form.stockKg,
  category: form.category,
  commission: form.commission,
  buyer_commission: form.buyerCommission,
  seller_commission: form.sellerCommission,
  remarks: form.remarks,
})

const mapSamplingPayload = (form: any) => ({
  deal_id: form.dealId,
  dos: form.dateOfSample,
  sample_verification: form.sampleVerification,
  lab_report: form.labReport,
  remarks: form.samplingRemarks,
  status: form.samplingStatus,
  type: 2,
})

const mapVerificationPayload = (form: any) => ({
  deal_id: form.dealId,
  dov: form.dov,
  sample: form.sample,
  stock_approve: form.stockApproved,
  type: 2,
})

const mapClearancePayload = (form: any) => ({
  deal_id: form.dealId,
  doc: form.clearanceDate,
  product: form.productPrice,
  remarks: form.clearanceRemarks,
  type: 2,
})

const mapPaymentPayload = (form: any) => ({
  deal_id: form.dealId,
  transaction_date: form.transactionDate,
  product: form.transactionId,
  details: form.detail,
  acc_no: form.accountNumber,
  bank: form.bank,
  branch: form.branch,
  ammount: form.amount,
  type: 2,
})

const mapTransportationPayload = (form: any) => ({
  deal_id: form.dealId,
  transportation_date: form.transportationDate,
  transporter_name: form.transporterName,
  mot: form.modeOfTransport,
  vehicle_no: form.vehicleNo,
  ammount_incured: form.freight,
  bill_or_lading: form.billNo,
  distance: form.distance,
  type: 2,
})

const mapClosePayload = (form: any) => ({
  deal_id: form.dealId,
  closed_date: form.closedDate,
  product: form.product,
  remarks: form.closeRemarks,
  product_received_by: form.productReceivedBy,
  commission: form.commission,
})

const getStepPayload = (step: number, form: any) => {
  switch (step) {
    case 0: return mapDealPayload(form)
    case 1: return mapSamplingPayload(form)
    case 2: return mapVerificationPayload(form)
    case 3: return mapClearancePayload(form)
    case 4: return mapPaymentPayload(form)
    case 5: return mapTransportationPayload(form)
    case 6: return mapClosePayload(form)
    default: return {}
  }
}

export default function DealForm() {
  const params = useParams()
  const dealId = params?.id as string

  const [form, setForm] = useState<any>({})
  const [categories, setCategories] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [givenQuantity, setGivenQuantity] = useState<number>(0)
  const [remainingQuantity, setRemainingQuantity] = useState<number>(0)
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [partialChecked, setPartialChecked] = useState(false)

  // Listings for payment and transportation
  const [paymentList, setPaymentList] = useState<any[]>([])
  const [transportList, setTransportList] = useState<any[]>([])

  const user = getUserFromToken();
  const user_role = user?.user_role
  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const endpoints = ["pd-deals", "pdSampling", "pdValidation", "pdClearance", "pdPayment", "pdTransportations", "pdClose"]
      const endpoint = endpoints[currentStep] || "pd-deals"
      const payload = getStepPayload(currentStep, form)

      const hasFile = Boolean(
        (currentStep === 1 && form.uploadDocument) ||
        (currentStep === 2 && form.verificationDoc) ||
        (currentStep === 3 && (form.purchaseOrder || form.detailsDoc || form.document3 || form.document4)) ||
        (currentStep === 4 && form.paymentDoc) ||
        (currentStep === 5 && (form.uploadBill || form.uploadEwayBill || form.uploadStockStatement || form.uploadBillT))
      )

      let options: RequestInit

      if (hasFile) {
        const fd = new FormData()
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined && typeof v !== "object") fd.append(k, v as string)
        })

        if (currentStep === 1 && form.uploadDocument) fd.append("upload_doc", form.uploadDocument)
        if (currentStep === 2 && form.verificationDoc) fd.append("upload_docu", form.verificationDoc)
        if (currentStep === 3) {
          if (form.purchaseOrder) fd.append("bill", form.purchaseOrder)
          if (form.detailsDoc) fd.append("ewaybill", form.detailsDoc)
          if (form.document3) fd.append("stock_statement", form.document3)
          if (form.document4) fd.append("bill_t", form.document4)
        }
        if (currentStep === 4 && form.paymentDoc) fd.append("upload_docume", form.paymentDoc)
        if (currentStep === 5) {
          if (form.uploadBill) fd.append("bill", form.uploadBill)
          if (form.uploadEwayBill) fd.append("ewaybill", form.uploadEwayBill)
          if (form.uploadStockStatement) fd.append("stock_statement", form.uploadStockStatement)
          if (form.uploadBillT) fd.append("bill_t", form.uploadBillT)
        }

        options = { method: "POST", body: fd }
      } else {
        options = {
          method: currentStep === 0 ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      }

      const url = currentStep === 0
        ? `http://localhost:5000/api/pd-deals/${dealId}`
        : `http://localhost:5000/api/${endpoint}`

      const res = await fetch(url, options)
      const data = await res.json()

      if (res.ok) {
        toast.success(`${FORM_STEPS[currentStep].title} saved successfully!`)
        setCompletedSteps((prev) => new Set([...prev, currentStep]))

        // Refresh listings
        if (currentStep === 4) fetchPaymentList()
        if (currentStep === 5) fetchTransportList()

        // Clear form after successful submission
        resetStepForm()
      } else {
        throw new Error(data.message || "Unknown error")
      }
    } catch (err) {
      console.error(err)
      toast.error(`Failed to save: ${FORM_STEPS[currentStep].title}`)
    }
  }

  const resetStepForm = () => {
    if (currentStep === 4) {
      setForm(prev => ({
        ...prev,
        transactionDate: "",
        transactionId: "",
        detail: "",
        accountNumber: "",
        bank: "",
        branch: "",
        amount: "",
        paymentDoc: null
      }))
    } else if (currentStep === 5) {
      setForm(prev => ({
        ...prev,
        transportationDate: "",
        transporterName: "",
        modeOfTransport: "",
        vehicleNo: "",
        freight: "",
        billNo: "",
        distance: "",
        uploadBill: null,
        uploadEwayBill: null,
        uploadStockStatement: null,
        uploadBillT: null
      }))
    }
  }

  const goToStep = (stepIndex: number) => setCurrentStep(stepIndex)
  const nextStep = () => { if (currentStep < FORM_STEPS.length - 1) setCurrentStep(currentStep + 1) }
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1) }

  const fetchDeal = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/pd-deals/${dealId}`)
      const result = await res.json()
      if (result.success && result.data) {
        setForm(mapApiToForm(result.data))
      }
    } catch (error) {
      console.error("Failed to fetch deal", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categiry")
      const data = await res.json()
      setCategories(data.categories || data.data || [])
    } catch (error) {
      console.error("Failed to fetch categories", error)
    }
  }

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/dealQuantity/deal-quantities/${dealId}`)
      const data = await res.json()
      if (res.ok && data) {
        setDeliveries(data.deliveries || [])
        const totalDelivered = (data.deliveries || []).reduce((sum, d) => sum + d.quantity, 0)
        setRemainingQuantity(form.quantityKg - totalDelivered)
      }
    } catch (error) {
      console.error("Failed to load deliveries", error)
    }
  }

  const fetchPaymentList = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/pdPayment/payment/${dealId}`)
      const data = await res.json()
      if (data.success && data.data) {
        setPaymentList(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch payments", error)
    }
  }

  const fetchTransportList = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/pdTransportations/transportation/${dealId}`)
      const data = await res.json()
      if (data.success && data.data) {
        setTransportList(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch transportations", error)
    }
  }

  const handleDeliverySubmit = async () => {
    if (!givenQuantity || givenQuantity <= 0) {
      toast.error("Please enter a valid delivery quantity")
      return
    }
    if (givenQuantity > remainingQuantity) {
      toast.error("Delivered quantity cannot exceed remaining quantity")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/dealQuantity/deal-quantities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: dealId,
          given_quantity: givenQuantity,
          remaining_quantity: remainingQuantity - givenQuantity,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(`Delivered ${givenQuantity} Kg`)
        fetchDeliveries()
        setGivenQuantity(0)
      } else {
        throw new Error(data.error || "Failed to save delivery")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error submitting delivery")
    }
  }

  const mapStepDataToForm = (stepIndex: number, data: any) => {
    if (!data) return {}

    // Get first item if it's an array
    const item = Array.isArray(data) ? data[0] : data
    if (!item) return {}

    switch (stepIndex) {
      case 1:
        return {
          dateOfSample: item.dos || "",
          sampleVerification: item.sample_verification || "",
          labReport: item.lab_report || "",
          samplingRemarks: item.remarks || "",
          samplingStatus: item.status || "",
        }
      case 2:
        return {
          dov: item.dov || "",
          sample: item.sample || "",
          stockApproved: item.stock_approve || "",
        }
      case 3:
        return {
          clearanceDate: item.doc || "",
          productPrice: item.product || "",
          clearanceRemarks: item.remarks || "",
        }
      case 4:
        return {
          transactionDate: item.transaction_date || "",
          transactionId: item.product || "",
          detail: item.details || "",
          accountNumber: item.acc_no || "",
          bank: item.bank || "",
          branch: item.branch || "",
          amount: item.ammount || "",
        }
      case 5:
        return {
          transportationDate: item.transportation_date || "",
          transporterName: item.transporter_name || "",
          modeOfTransport: item.mot || "",
          vehicleNo: item.vehicle_no || "",
          freight: item.ammount_incured || "",
          billNo: item.bill_or_lading || "",
          distance: item.distance || "",
        }
      case 6:
        return {
          closedDate: item.closed_date || "",
          product: item.product || "",
          closeRemarks: item.remarks || "",
          productReceivedBy: item.product_received_by || "",
          commission: item.commission || "",
        }
      default:
        return {}
    }
  }

  const fetchStepData = async (stepIndex: number) => {
    if (!dealId) return null

    const endpoints = [
      null,
      `http://localhost:5000/api/pdSampling/sampling/${dealId}`,
      `http://localhost:5000/api/pdValidation/validation/${dealId}`,
      `http://localhost:5000/api/pdClearance/clearance/${dealId}`,
      `http://localhost:5000/api/pdPayment/payment/${dealId}`,
      `http://localhost:5000/api/pdTransportations/transportation/${dealId}`,
      `http://localhost:5000/api/pdClose/close/${dealId}`
    ]

    if (!endpoints[stepIndex]) return null

    try {
      const res = await fetch(endpoints[stepIndex]!)
      if (res.ok) {
        const result = await res.json()
        return result.data || result
      }
      return null
    } catch (error) {
      console.error(`Error fetching step ${stepIndex} data:`, error)
      return null
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (form?.quantityKg) {
      fetchDeliveries()
    }
  }, [form.quantityKg])

  useEffect(() => {
    const loadStepData = async () => {
      await fetchDeal()

      if (currentStep > 0) {
        const stepData = await fetchStepData(currentStep)
        if (stepData) {
          const mappedData = mapStepDataToForm(currentStep, stepData)
          setForm(prev => ({ ...prev, ...mappedData }))
        }
      }

      // Load listings
      if (currentStep === 4) fetchPaymentList()
      if (currentStep === 5) fetchTransportList()
    }

    if (dealId) {
      loadStepData()
    }
  }, [dealId, currentStep])

  const deletePayment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    try {
      const res = await fetch(`http://localhost:5000/api/pdPayment/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Payment deleted")
        fetchPaymentList()
      }
    } catch (error) {
      toast.error("Failed to delete payment")
    }
  }

  const deleteTransport = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transportation?")) return

    try {
      const res = await fetch(`http://localhost:5000/api/pdTransportations/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Transportation deleted")
        fetchTransportList()
      }
    } catch (error) {
      toast.error("Failed to delete transportation")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">PD Deal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deal Id</label>
                  <Input value={form.dealId || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Buyer</label>
                  <Input value={form.buyerName || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <Input value={form.buyerContact || ""} onChange={(e) => handleChange("buyerContact", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile No.</label>
                  <Input value={form.buyerMobile || ""} onChange={(e) => handleChange("buyerMobile", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">PD Executive</label>
                  <Input value={form.pdExecutive || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <Input value={form.pdExecutiveMobile || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Seller</label>
                  <Input value={form.sellerName || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <Input value={form.sellerContact || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile No.</label>
                  <Input value={form.sellerMobile || ""} disabled className="bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity in Kg</label>
                  <Input value={form.quantityKg || ""} onChange={(e) => handleChange("quantityKg", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Deal Amount</label>
                  <Input value={form.dealAmount || ""} onChange={(e) => handleChange("dealAmount", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Remarks</label>
                  <Input value={form.remarks || ""} onChange={(e) => handleChange("remarks", e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Products Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={form.category || ""} onValueChange={(v) => handleChange("category", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product</label>
                  <Input value={form.product || ""} onChange={(e) => handleChange("product", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sub Product</label>
                  <Input value={form.subProduct || ""} onChange={(e) => handleChange("subProduct", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brightness</label>
                  <Input value={form.brightness || ""} onChange={(e) => handleChange("brightness", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gsm</label>
                  <Input value={form.gsm || ""} onChange={(e) => handleChange("gsm", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">BF</label>
                  <Input value={form.bf || ""} onChange={(e) => handleChange("bf", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shade</label>
                  <Input value={form.shade || ""} onChange={(e) => handleChange("shade", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hsn No.</label>
                  <Input value={form.hsnNo || ""} onChange={(e) => handleChange("hsnNo", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Grain</label>
                  <Input value={form.grain || ""} onChange={(e) => handleChange("grain", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sheet</label>
                  <Input value={form.sheet || ""} onChange={(e) => handleChange("sheet", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">W * L</label>
                  <Input value={form.wl || ""} onChange={(e) => handleChange("wl", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">No of Bundle</label>
                  <Input value={form.noOfBundle || ""} onChange={(e) => handleChange("noOfBundle", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">No of Rim</label>
                  <Input value={form.noOfRim || ""} onChange={(e) => handleChange("noOfRim", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rim Weight</label>
                  <Input value={form.rimWeight || ""} onChange={(e) => handleChange("rimWeight", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Size in inch</label>
                  <Input value={form.sizeInch || ""} onChange={(e) => handleChange("sizeInch", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock in Kg</label>
                  <Input value={form.stockKg || ""} onChange={(e) => handleChange("stockKg", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity in Kg</label>
                  <Input value={form.quantityKg || ""} onChange={(e) => handleChange("quantityKg", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price in Kg</label>
                  <Input value={form.priceKg || ""} onChange={(e) => handleChange("priceKg", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date Of Sample</label>
                <Input type="date" value={form.dateOfSample || ""} onChange={(e) => handleChange("dateOfSample", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sample Verification</label>
                <Input value={form.sampleVerification || ""} onChange={(e) => handleChange("sampleVerification", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lab Report</label>
                <Input type="date" value={form.labReport || ""} onChange={(e) => handleChange("labReport", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <Input value={form.samplingRemarks || ""} onChange={(e) => handleChange("samplingRemarks", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Document</label>
                <Input type="file" onChange={(e) => handleChange("uploadDocument", e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sampling Status</label>
                <Input value={form.samplingStatus || ""} onChange={(e) => handleChange("samplingStatus", e.target.value)} />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date of Validation</label>
              <Input type="date" value={form.dov || ""} onChange={(e) => handleChange("dov", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sample</label>
              <Input value={form.sample || ""} onChange={(e) => handleChange("sample", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock Approved</label>
              <Input value={form.stockApproved || ""} onChange={(e) => handleChange("stockApproved", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Document</label>
              <Input type="file" onChange={(e) => handleChange("verificationDoc", e.target.files?.[0] || null)} />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Clearance Date</label>
              <Input type="date" value={form.clearanceDate || ""} onChange={(e) => handleChange("clearanceDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Price</label>
              <Input value={form.productPrice || ""} onChange={(e) => handleChange("productPrice", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <Input value={form.clearanceRemarks || ""} onChange={(e) => handleChange("clearanceRemarks", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Purchase Order (PO)</label>
              <Input type="file" onChange={(e) => handleChange("purchaseOrder", e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Details</label>
              <Input type="file" onChange={(e) => handleChange("detailsDoc", e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Document 3</label>
              <Input type="file" onChange={(e) => handleChange("document3", e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Document 4</label>
              <Input type="file" onChange={(e) => handleChange("document4", e.target.files?.[0] || null)} />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Transaction Date</label>
                <Input type="date" value={form.transactionDate || ""} onChange={(e) => handleChange("transactionDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Transaction Id</label>
                <Input value={form.transactionId || ""} onChange={(e) => handleChange("transactionId", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Detail</label>
                <Input value={form.detail || ""} onChange={(e) => handleChange("detail", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <Input value={form.accountNumber || ""} onChange={(e) => handleChange("accountNumber", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bank</label>
                <Input value={form.bank || ""} onChange={(e) => handleChange("bank", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <Input value={form.branch || ""} onChange={(e) => handleChange("branch", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input value={form.amount || ""} onChange={(e) => handleChange("amount", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Document</label>
                <Input type="file" onChange={(e) => handleChange("paymentDoc", e.target.files?.[0] || null)} />
              </div>
            </div>

            {/* Payment Listing */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Payment History</h3>
              {paymentList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Transaction ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Bank</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Branch</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentList.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{payment.transaction_date}</td>
                          <td className="border border-gray-300 px-4 py-2">{payment.product}</td>
                          <td className="border border-gray-300 px-4 py-2">{payment.details}</td>
                          <td className="border border-gray-300 px-4 py-2">{payment.bank}</td>
                          <td className="border border-gray-300 px-4 py-2">{payment.branch}</td>
                          <td className="border border-gray-300 px-4 py-2">₹{payment.ammount}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {payment.upload_docume ? (
                              <a href={payment.upload_docume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                <Download className="w-4 h-4" /> View
                              </a>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <Button variant="destructive" size="sm" onClick={() => deletePayment(payment.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payment records found</p>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Transportation Date</label>
                <Input type="date" value={form.transportationDate || ""} onChange={(e) => handleChange("transportationDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Transporter Name</label>
                <Input value={form.transporterName || ""} onChange={(e) => handleChange("transporterName", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mode Of Transport</label>
                <Input value={form.modeOfTransport || ""} onChange={(e) => handleChange("modeOfTransport", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle No</label>
                <Input value={form.vehicleNo || ""} onChange={(e) => handleChange("vehicleNo", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Freight</label>
                <Input value={form.freight || ""} onChange={(e) => handleChange("freight", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bill/Lading/LR No</label>
                <Input value={form.billNo || ""} onChange={(e) => handleChange("billNo", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Bill</label>
                <Input type="file" onChange={(e) => handleChange("uploadBill", e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Eway Bill</label>
                <Input type="file" onChange={(e) => handleChange("uploadEwayBill", e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Stock Statement</label>
                <Input type="file" onChange={(e) => handleChange("uploadStockStatement", e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Bill T</label>
                <Input type="file" onChange={(e) => handleChange("uploadBillT", e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Distance</label>
                <Input value={form.distance || ""} onChange={(e) => handleChange("distance", e.target.value)} />
              </div>
            </div>

            {/* Partial Delivery */}
            <div className="col-span-full mt-6 border p-4 rounded-md">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={partialChecked} onChange={(e) => setPartialChecked(e.target.checked)} />
                Allow Partial Delivery
              </label>

              {partialChecked && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Given Quantity (Kg)</label>
                    <Input type="number" value={givenQuantity} onChange={(e) => setGivenQuantity(parseInt(e.target.value) || 0)} />
                  </div>
                  <p className="text-sm text-gray-600">
                    Remaining Quantity: <strong>{remainingQuantity}</strong> Kg
                  </p>
                  <Button onClick={handleDeliverySubmit}>Submit Delivery</Button>

                  {deliveries.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm">Delivery History</h4>
                      <ul className="list-disc list-inside text-sm">
                        {deliveries.map((d, i) => (
                          <li key={i}>Delivered {d.quantity} Kg</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Transportation Listing */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Transportation History</h3>
              {transportList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Transporter</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Vehicle No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Mode</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Distance</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Freight</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Documents</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transportList.map((transport) => (
                        <tr key={transport.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{transport.transportation_date}</td>
                          <td className="border border-gray-300 px-4 py-2">{transport.transporter_name}</td>
                          <td className="border border-gray-300 px-4 py-2">{transport.vehicle_no}</td>
                          <td className="border border-gray-300 px-4 py-2">{transport.mot}</td>
                          <td className="border border-gray-300 px-4 py-2">{transport.distance}</td>
                          <td className="border border-gray-300 px-4 py-2">₹{transport.ammount_incured}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex flex-col gap-1">
                              {transport.bill && (
                                <a href={transport.bill} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                                  <Download className="w-3 h-3" /> Bill
                                </a>
                              )}
                              {transport.ewaybill && (
                                <a href={transport.ewaybill} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                                  <Download className="w-3 h-3" /> E-way
                                </a>
                              )}
                              {transport.stock_statement && (
                                <a href={transport.stock_statement} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                                  <Download className="w-3 h-3" /> Stock
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <Button variant="destructive" size="sm" onClick={() => deleteTransport(transport.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No transportation records found</p>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Closed Date</label>
              <Input type="date" value={form.closedDate || ""} onChange={(e) => handleChange("closedDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <Input value={form.product || ""} onChange={(e) => handleChange("product", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <Input value={form.closeRemarks || ""} onChange={(e) => handleChange("closeRemarks", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Received By</label>
              <Input value={form.productReceivedBy || ""} onChange={(e) => handleChange("productReceivedBy", e.target.value)} />
            </div>
            {user_role !== 2 && (
              <div>
                <label className="block text-sm font-medium mb-2">Commission (Amount)</label>
                <Input
                  value={form.commission || ""}
                  onChange={(e) => handleChange("commission", e.target.value)}
                />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Deal Management</h1>
          <Badge variant="outline">Step {currentStep + 1} of {FORM_STEPS.length}</Badge>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
          {FORM_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(index)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${index === currentStep
                  ? "border-blue-500 bg-blue-500 text-white"
                  : completedSteps.has(index)
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                  }`}
              >
                {completedSteps.has(index) ? <Check className="w-5 h-5" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </button>
              <div className="ml-3 min-w-0 flex-1">
                <p className={`text-sm font-medium ${index === currentStep ? "text-blue-600" : "text-gray-900"}`}>{step.title}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
              </div>
              {index < FORM_STEPS.length - 1 && <div className="w-8 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{FORM_STEPS[currentStep].title}</CardTitle>
          <p className="text-sm text-muted-foreground">{FORM_STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="flex items-center bg-transparent">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              {!(currentStep === 6 && user_role === 2) && (
                <Button onClick={handleSubmit}>Save {FORM_STEPS[currentStep].title}</Button>
              )}
              {/* <Button onClick={handleSubmit}>Save {FORM_STEPS[currentStep].title}</Button> */}
              <Button onClick={nextStep} disabled={currentStep === FORM_STEPS.length - 1} className="flex items-center">
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