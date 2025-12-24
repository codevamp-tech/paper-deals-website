"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { toast } from "sonner"
import { getUserFromToken } from "@/hooks/use-token"

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
  dealId: data.deal_id,
  buyerId: data.buyer_id,
  sellerId: data.seller_id,
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
})

// helpers
const mapDealPayload = (form: any) => ({
  deal_id: form.dealId,
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
  dov: form.dov,                           // matches model
  sample: form.sample,                     // matches model
  stock_approve: form.stockApproved,       // ✅ match model "stock_approve"
  upload_docu: form.verificationDoc,       // ✅ match model "upload_docu"
})


// Order Confirmation
const mapClearancePayload = (form: any) => ({
  deal_id: form.dealId,
  clearance_date: form.clearanceDate,
  product_price: form.productPrice,
  remarks: form.clearanceRemarks,
  purchase_order: form.purchaseOrder,
  details_doc: form.detailsDoc,
  document_3: form.document3,
  document_4: form.document4,
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
  payment_doc: form.paymentDoc,
})

// Transportation
const mapTransportationPayload = (form: any) => ({
  deal_id: form.dealId,
  transportation_date: form.transportationDate,
  transporter_name: form.transporterName,
  mode_of_transport: form.modeOfTransport,
  vehicle_no: form.vehicleNo,
  freight: form.freight,
  bill_no: form.billNo,
  distance: form.distance,
  upload_bill: form.uploadBill,
  upload_eway_bill: form.uploadEwayBill,
  upload_stock_statement: form.uploadStockStatement,
  upload_bill_t: form.uploadBillT,
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

  const user = getUserFromToken();
  const userRole = user?.user_role

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      // 1️⃣ Determine the endpoint for the current step
      const endpoints = ["dashboard", "samplings", "validation", "clearance", "payment", "transportation", "close"]
      const endpoint = endpoints[currentStep] || "dashboard"

      // 2️⃣ Build the payload based on the current step
      const payload = getStepPayload(currentStep, form)

      // 3️⃣ Detect if the step has file upload
      const hasFile =
        Boolean(
          (currentStep === 0 && form.technicalDataSheet) ||
          (currentStep === 1 && form.uploadDocument) ||
          (currentStep === 2 && form.verificationDoc)   // ✅ added verification step
        );


      let options: RequestInit
      console.log("hasFile", hasFile)
      if (hasFile) {
        // 4️⃣ Handle FormData for file upload
        const fd = new FormData()
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined && typeof v !== "object") fd.append(k, v as string)
        })

        if (currentStep === 0 && form.technicalDataSheet) {
          fd.append("tds", form.technicalDataSheet);
        }

        if (currentStep === 1 && form.uploadDocument) {
          fd.append("upload_doc", form.uploadDocument);
        }

        if (currentStep === 2 && form.verificationDoc) {
          fd.append("upload_docu", form.verificationDoc); // ✅ match model field
        }

        options = {
          method: endpoint === "dashboard" ? "PUT" : "POST",
          body: fd,
        }
      } else {
        // 5️⃣ Normal JSON payload
        options = {
          method: endpoint === "dashboard" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      }

      // 6️⃣ Construct the API URL
      const url =
        endpoint === "dashboard"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${dealId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`
      console.log("options", options)
      // 7️⃣ Call the API
      const res = await fetch(url, options)
      const data = await res.json()

      // 8️⃣ Handle response
      if (res.ok) {
        toast.success(`Step updated successfully: ${FORM_STEPS[currentStep].title}`)
        setCompletedSteps((prev) => new Set([...prev, currentStep]))
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
      console.log("[v0] Deal data loaded from API")
    } catch (error) {
      console.log("API unavailable")
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`)
      const data = await res.json()
      setCategories(data.categories || data.data || []) // <-- only array goes into state
      console.log("[v0] Categories loaded from API", data)
    } catch (error) {
      console.log("API unavailable,")
    }
  }

  const fetchBuyersAndSellers = async () => {
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getBuyer`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/getActiveSellers`),
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
      case 0: // Deal Details
        return (
          <div className="space-y-6">
            {/* PD Deal Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">PD Deal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deal Id</label>
                  <Input
                    value={form.dealId || ""}
                    onChange={(e) => handleChange("dealId", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Buyer</label>
                  <Input
                    value={form.buyerName || ""}
                    onChange={(e) => handleChange("buyerName", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <Input
                    value={form.buyerContact || ""}
                    onChange={(e) => handleChange("buyerContact", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mobile No.</label>
                  <Input
                    value={form.buyerMobile || ""}
                    onChange={(e) => handleChange("buyerMobile", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">PD Executive</label>
                  <Input
                    value={form.pdExecutive || ""}
                    onChange={(e) => handleChange("pdExecutive", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <Input
                    value={form.pdExecutiveMobile || ""}
                    onChange={(e) => handleChange("pdExecutiveMobile", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={form.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Seller</label>
                  <Input
                    value={form.sellerName || ""}
                    onChange={(e) => handleChange("sellerName", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <Input
                    value={form.sellerContact || ""}
                    onChange={(e) => handleChange("sellerContact", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mobile No.</label>
                  <Input
                    value={form.sellerMobile || ""}
                    onChange={(e) => handleChange("sellerMobile", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity in Kg</label>
                  <Input
                    value={form.quantityKg || ""}
                    onChange={(e) => handleChange("quantityKg", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deal Amount</label>
                  <Input
                    value={form.dealAmount || ""}
                    onChange={(e) => handleChange("dealAmount", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Remarks</label>
                  <Input
                    value={form.remarks || ""}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Products Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Products Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select
                    value={form.category || ""}
                    onValueChange={(v) => handleChange("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No categories found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product</label>
                  <Input
                    value={form.product || ""}
                    onChange={(e) => handleChange("product", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sub Product</label>
                  <Input
                    value={form.subProduct || ""}
                    onChange={(e) => handleChange("subProduct", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brightness</label>
                  <Input
                    value={form.brightness || ""}
                    onChange={(e) => handleChange("brightness", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gsm</label>
                  <Input
                    value={form.gsm || ""}
                    onChange={(e) => handleChange("gsm", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">BF</label>
                  <Input
                    value={form.bf || ""}
                    onChange={(e) => handleChange("bf", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shade</label>
                  <Input
                    value={form.shade || ""}
                    onChange={(e) => handleChange("shade", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hsn No.</label>
                  <Input
                    value={form.hsnNo || ""}
                    onChange={(e) => handleChange("hsnNo", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Grain</label>
                  <Input
                    value={form.grain || ""}
                    onChange={(e) => handleChange("grain", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sheet</label>
                  <Input
                    value={form.sheet || ""}
                    onChange={(e) => handleChange("sheet", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">W * L</label>
                  <Input
                    value={form.wl || ""}
                    onChange={(e) => handleChange("wl", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">No of Bundle</label>
                  <Input
                    value={form.noOfBundle || ""}
                    onChange={(e) => handleChange("noOfBundle", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">No of Rim</label>
                  <Input
                    value={form.noOfRim || ""}
                    onChange={(e) => handleChange("noOfRim", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rim Weight</label>
                  <Input
                    value={form.rimWeight || ""}
                    onChange={(e) => handleChange("rimWeight", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Size in inch</label>
                  <Input
                    value={form.sizeInch || ""}
                    onChange={(e) => handleChange("sizeInch", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock in Kg</label>
                  <Input
                    value={form.stockKg || ""}
                    onChange={(e) => handleChange("stockKg", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity in Kg</label>
                  <Input
                    value={form.quantityKg || ""}
                    onChange={(e) => handleChange("quantityKg", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price in Kg</label>
                  <Input
                    value={form.priceKg || ""}
                    onChange={(e) => handleChange("priceKg", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )


      case 1: // Sampling
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date Of Sample</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={form.dateOfSample || ""}
                    onChange={(e) => handleChange("dateOfSample", e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sample Verification</label>
                <Input
                  placeholder="Sample Verification"
                  value={form.sampleVerification || ""}
                  onChange={(e) => handleChange("sampleVerification", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lab Report</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={form.labReport || ""}
                    onChange={(e) => handleChange("labReport", e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <Input
                  placeholder="Remarks"
                  value={form.samplingRemarks || ""}
                  onChange={(e) => handleChange("samplingRemarks", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Document</label>
                <div className="relative">
                  <Input
                    type="file"
                    onChange={(e) => handleChange("uploadDocument", e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sampling Status</label>
                <select
                  value={form.samplingStatus || 0}
                  onChange={(e) => handleChange("samplingStatus", parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Pending</option>
                  <option value={1}>Approved</option>
                </select>
              </div>
            </div>
          </div>
        )


      case 2: // Verification
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date of Validation</label>
              <Input type="date" onChange={(e) => handleChange("dov", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sample</label>
              <Input onChange={(e) => handleChange("sample", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stock Approved</label>
              <Input onChange={(e) => handleChange("stockApproved", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2"> Upload Document</label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleChange("verificationDoc", e.target.files?.[0] || null)}
              />
            </div>
          </div>
        )

      case 3: // Order Confirmation
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Clearance Date</label>
              <Input type="date" onChange={(e) => handleChange("clearanceDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Price</label>
              <Input onChange={(e) => handleChange("productPrice", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <Input onChange={(e) => handleChange("remarks", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Purchase Order (PO)</label>
              <Input
                type="file"
                onChange={(e) => handleChange("purchaseOrder", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Details</label>
              <Input
                type="file"
                onChange={(e) => handleChange("detailsDoc", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Document 3</label>
              <Input
                type="file"
                onChange={(e) => handleChange("document3", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Document 4</label>
              <Input
                type="file"
                onChange={(e) => handleChange("document4", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        )

      case 4: // Payment
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Transaction Date</label>
              <Input type="date" onChange={(e) => handleChange("transactionDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transaction Id</label>
              <Input onChange={(e) => handleChange("transactionId", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Detail</label>
              <Input onChange={(e) => handleChange("detail", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <Input onChange={(e) => handleChange("accountNumber", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bank</label>
              <Input onChange={(e) => handleChange("bank", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <Input onChange={(e) => handleChange("branch", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input onChange={(e) => handleChange("amount", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Document</label>
              <Input
                type="file"
                onChange={(e) => handleChange("paymentDoc", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        )

      case 5: // Transportation
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Transportation Date</label>
              <Input type="date" onChange={(e) => handleChange("transportationDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transporter Name</label>
              <Input onChange={(e) => handleChange("transporterName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mode Of Transport</label>
              <Input onChange={(e) => handleChange("modeOfTransport", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle No</label>
              <Input onChange={(e) => handleChange("vehicleNo", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Freight</label>
              <Input onChange={(e) => handleChange("freight", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bill/Lading/LR No</label>
              <Input onChange={(e) => handleChange("billNo", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Bill</label>
              <Input
                type="file"
                onChange={(e) => handleChange("uploadBill", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Eway Bill</label>
              <Input
                type="file"
                onChange={(e) => handleChange("uploadEwayBill", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Stock Statement</label>
              <Input
                type="file"
                onChange={(e) => handleChange("uploadStockStatement", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Bill T</label>
              <Input
                type="file"
                onChange={(e) => handleChange("uploadBillT", e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Distance</label>
              <Input onChange={(e) => handleChange("distance", e.target.value)} />
            </div>


          </div>
        )

      case 6: // Closed
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Closed Date</label>
              <Input type="date" onChange={(e) => handleChange("closedDate", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <Input onChange={(e) => handleChange("product", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <Input onChange={(e) => handleChange("remarks", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Received By</label>
              <Input onChange={(e) => handleChange("productReceivedBy", e.target.value)} />
            </div>
            {userRole !== 2 && (
              <div>
                <label className="block text-sm font-medium mb-2">Commission (Amount)</label>
                <Input onChange={(e) => handleChange("commission", e.target.value)} />
              </div>
            )}

          </div>
        )

      default:
        return null
    }
  }


  const getStepEndpoint = () => {
    const endpoints = ["dashboard", "samplings", "validation", "clearance", "payment", "transportation", "close"]
    return endpoints[currentStep] || "dashboard"
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Deal Management</h1>
          <Badge variant="outline">
            Step {currentStep + 1} of {FORM_STEPS.length}
          </Badge>
        </div>

        {/* Step indicators */}
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
                {completedSteps.has(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              <div className="ml-3 min-w-0 flex-1">
                <p className={`text-sm font-medium ${index === currentStep ? "text-blue-600" : "text-gray-900"}`}>
                  {step.title}
                </p>
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
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              <Button onClick={handleSubmit}>
                Update {FORM_STEPS[currentStep].title}
              </Button>


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
