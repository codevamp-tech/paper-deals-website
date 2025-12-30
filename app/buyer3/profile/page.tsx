"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react" // Added X
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getUserFromToken } from "@/hooks/use-token"
import { motion } from "framer-motion" // Added motion
import { Badge } from "@/components/ui/badge" // Added Badge

const states = [
  { id: "1", name: "Andaman and Nicobar Islands" },
  { id: "2", name: "Andhra Pradesh" },
  { id: "3", name: "Arunachal Pradesh" },
  { id: "4", name: "Assam" },
  { id: "5", name: "Bihar" },
  { id: "6", name: "Chhattisgarh" },
  { id: "7", name: "Chandigarh" },
  { id: "8", name: "Daman and Diu" },
  { id: "9", name: "Delhi" },
  { id: "10", name: "Goa" },
  { id: "11", name: "Gujarat" },
  { id: "12", name: "Haryana" },
  { id: "13", name: "Himachal Pradesh" },
  { id: "14", name: "Jammu and Kashmir" },
  { id: "15", name: "Jharkhand" },
  { id: "16", name: "Karnataka" },
  { id: "17", name: "Kerala" },
  { id: "18", name: "Ladakh" },
  { id: "19", name: "Lakshadweep" },
  { id: "20", name: "Madhya Pradesh" },
  { id: "21", name: "Maharashtra" },
  { id: "22", name: "Manipur" },
  { id: "23", name: "Meghalaya" },
  { id: "24", name: "Mizoram" },
  { id: "25", name: "Nagaland" },
  { id: "26", name: "Odisha" },
  { id: "27", name: "Puducherry" },
  { id: "28", name: "Punjab" },
  { id: "29", name: "Rajasthan" },
  { id: "30", name: "Sikkim" },
  { id: "31", name: "Tamil Nadu" },
  { id: "32", name: "Telangana" },
  { id: "33", name: "Tripura" },
  { id: "34", name: "Uttar Pradesh" },
  { id: "35", name: "Uttarakhand" },
  { id: "36", name: "West Bengal" },
]

interface FormData {
  // Seller Edit
  name: string
  email: string
  mobile: string
  joinDate: Date | undefined
  whatsappNo: string
  status: string

  // Company Information
  company: string
  contactPerson: string
  companyEmail: string
  companyMobile: string
  address: string
  city: string
  district: string
  state: string
  pincode: string
  productionCapacity: string
  dealsIn: string | number[] // Updated to handle array or string
  typeOfSeller: string
  description: string

  // Personal Information
  ownerName: string
  designation: string
  ownerAddress: string

  // Documents
  gstNumber: string
  exportImportLicense: string

  price: string
  millsSupported: string
  yearsOfExperience: string
  consultantDescription: string
}

interface FileUploads {
  logo: File | null
  panCard: File | null
  isocertificate: File | null
  certificateOfIncorporation: File | null
  gstCertificate: File | null
}

const initialFormData: FormData = {
  name: "",
  email: "",
  mobile: "",
  joinDate: undefined,
  whatsappNo: "",
  status: "Pending",
  company: "",
  contactPerson: "",
  companyEmail: "",
  companyMobile: "",
  address: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  productionCapacity: "",
  dealsIn: "",
  typeOfSeller: "",
  description: "",
  ownerName: "",
  designation: "",
  ownerAddress: "",
  gstNumber: "",
  exportImportLicense: "",
  price: "",
  millsSupported: "",
  yearsOfExperience: "",
  consultantDescription: "",
}

const initialFileUploads: FileUploads = {
  logo: null,
  panCard: null,
  isocertificate: null,
  certificateOfIncorporation: null,
  gstCertificate: null,
}

export default function SellerEditForm() {
  const [activeSection, setActiveSection] = useState("seller-edit")
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [fileUploads, setFileUploads] = useState<FileUploads>(initialFileUploads)
  const [loading, setLoading] = useState(false)
  const user = getUserFromToken()
  const userId = user?.user_id
  const [errors, setErrors] = useState({
    gstNumber: "",
    exportImportLicense: "",
    panCard: "",
  });


  // -- NEW STATE FOR CATEGORIES --
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // -- NEW EFFECT: FETCH CATEGORIES --
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Using env variable for consistency with your existing code
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`)
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // -- NEW EFFECT: SYNC SELECTED CATEGORIES WITH FORM DATA --
  useEffect(() => {
    // Sync the array of IDs to the formData "dealsIn" field
    updateFormData("dealsIn", selectedCategories)
  }, [selectedCategories])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [personalRes, docRes, orgRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personal/${userId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/${userId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${userId}`)
        ])

        if (personalRes.ok) {
          const personal = await personalRes.json()
          setFormData((prev) => ({
            ...prev,
            ownerName: personal.per_name || "",
            designation: personal.designation || "",
            ownerAddress: personal.per_address || "",
          }))
        }

        if (docRes.ok) {
          const doc = await docRes.json()
          setFormData((prev) => ({
            ...prev,
            gstNumber: doc.gst_number || "",
            exportImportLicense: doc.export_import_licence || "",
          }))
        }

        if (orgRes.ok) {
          const org = await orgRes.json()
          setFormData((prev) => ({
            ...prev,
            company: org.organizations || "",
            contactPerson: org.contact_person || "",
            companyEmail: org.email || "",
            companyMobile: org.phone?.toString() || "",
            address: org.address || "",
            city: org.city || "",
            district: org.district || "",
            state: org.state?.toString() || "",
            pincode: org.pincode?.toString() || "",
            productionCapacity: org.production_capacity || "",
            dealsIn: org.materials_used || "",
            typeOfSeller: org.organization_type?.toString() || "",
            description: org.description || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching data", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchData()
  }, [userId])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: keyof FileUploads, file: File | null) => {
    setFileUploads((prev) => ({ ...prev, [field]: file }))
  }

  const iecRegex = /^[0-9]{10}$/;
  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const validateForm = () => {
    let newErrors: any = {};

    // GST Validation
    if (!formData.gstNumber) {
      newErrors.gstNumber = "GST number is required";
    } else if (!gstRegex.test(formData.gstNumber.toUpperCase())) {
      newErrors.gstNumber = "Invalid GST number format";
    }

    // IEC Validation
    if (!formData.exportImportLicense) {
      newErrors.exportImportLicense = "IEC number is required";
    } else if (!iecRegex.test(formData.exportImportLicense)) {
      newErrors.exportImportLicense = "IEC must be 10 digits";
    }

    // PAN Card File Validation
    if (!fileUploads.panCard) {
      newErrors.panCard = "PAN card file is required";
    } else if (
      !["image/png", "image/jpeg", "image/jpg"].includes(
        fileUploads.panCard.type
      )
    ) {
      newErrors.panCard = "Only PNG, JPG or JPEG files allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 👉 Save handler (create or update depending on existing record)
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);

      // Check if organization exists
      const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${userId}`);
      const exists = checkRes.ok;

      const method = exists ? "PUT" : "POST";

      // Organization API
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${exists ? userId : ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          organizations: formData.company,
          contact_person: formData.contactPerson,
          email: formData.companyEmail,
          phone: formData.companyMobile,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          production_capacity: formData.productionCapacity,
          materials_used: formData.dealsIn,
          organization_type: formData.typeOfSeller,
          description: formData.description,
          price_range: "",
          production_specification: "",
          verified: 0,
          vip: 0,
          image_banner: fileUploads.logo ? fileUploads.logo.name : null,
          status: 1,
        }),
      });

      // Personal API
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personal/${exists ? userId : ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          per_name: formData.ownerName,
          designation: formData.designation,
          per_address: formData.ownerAddress,
          per_status: 1,
        }),
      });

      // Document API
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/${exists ? userId : ""}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          gst_number: formData.gstNumber,
          export_import_licence: formData.exportImportLicense,
          pan_card_img: fileUploads.panCard ? fileUploads.panCard.name : null,
          voter_id_img: null,
          cert_of_incorp: fileUploads.certificateOfIncorporation ? fileUploads.certificateOfIncorporation.name : null,
          gst_cert: fileUploads.gstCertificate ? fileUploads.gstCertificate.name : null,
          doc_status: 1,
        }),
      });

      alert(`Seller info ${exists ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("Error saving seller info:", error);
      alert("Failed to save seller info.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true)
        let url = "";
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/buyerbyid/${userId}`;
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json()

          const joinDate = data.created_on ? new Date(data.created_on) : undefined
          const validJoinDate = joinDate && !isNaN(joinDate.getTime()) ? joinDate : undefined
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email_address || "",
            mobile: data.phone_no || "",
            joinDate: validJoinDate,
            whatsappNo: data.whatsapp_no || "",
            status: data.approved === 1 ? "Pending" : "Approved",
            price: data.consultant_price || "",
            millsSupported: data.consultantPic?.mills_supported || "",
            yearsOfExperience: data.consultantPic?.years_of_experience || "",
            consultantDescription: data.consultantPic?.description || "",

          }))
        }
      } catch (error) {
        console.error("Error fetching seller:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchSeller()
  }, [userId])


  const allSections = [
    { id: "seller-edit", title: "Profile" },
    { id: "company-info", title: "Company Information" },
    { id: "personal-info", title: "Personal Information (Owner)" },
    { id: "documents", title: "Documents Upload" },
  ]

  // -- NEW LOGIC: PROFILE COMPLETION PERCENTAGE --
  const requiredFields = [
    "company", "contactPerson", "companyEmail", "companyMobile",
    "address", "city", "state", "pincode",
    "ownerName", "designation", "ownerAddress",
    "gstNumber", "exportImportLicense"
  ]

  // Calculate filled fields
  const filledCount = requiredFields.filter(field => {
    const value = formData[field as keyof FormData]
    return value !== "" && value !== null && value !== undefined
  }).length

  const completionPercent = Math.round((filledCount / requiredFields.length) * 100)


  return (
    <div className="container mx-auto p-4 max-w-6xl bg-white text-black">
      {/* Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {allSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => setActiveSection(section.id)}
                className="text-sm text-black bg-white border-gray-300 hover:bg-gray-100"

              >
                {section.title}
              </Button>
            ))}
          </div>

          {/* -- NEW VISUAL: Profile Completion Circle -- */}
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="#3b82f6"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="175"
                strokeDashoffset={175 - (175 * completionPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-semibold text-blue-600">{completionPercent}%</span>
          </div>
        </div>
      </div>

      {/* Seller Edit Section */}
      {activeSection === "seller-edit" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-500 font-medium">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seller Profile (role 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" value={formData.mobile} disabled className="bg-gray-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Join Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-100",
                        !formData.joinDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.joinDate ? format(formData.joinDate, "dd-MM-yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.joinDate} disabled />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp No.</Label>
                <Input id="whatsapp" value={formData.whatsappNo} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} disabled>
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Information Section */}
      {activeSection === "company-info" && (
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-blue-600">
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateFormData("company", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData("contactPerson", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">
                  Email (to be verified) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => updateFormData("companyEmail", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="companyMobile">
                  Mobile (to be verified) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyMobile"
                  value={formData.companyMobile}
                  onChange={(e) => updateFormData("companyMobile", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="district">
                  District <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => updateFormData("district", e.target.value)}
                  className="bg-gray-100 text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => updateFormData("state", value)}
                >
                  <SelectTrigger className="bg-white text-black border-gray-300">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {states.map((state) => (
                      <SelectItem
                        key={state.id}
                        value={state.id}
                        className="text-black"
                      >
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pincode">
                  Pincode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => updateFormData("pincode", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="productionCapacity">
                  Production Capacity (TPM)
                </Label>
                <Input
                  id="productionCapacity"
                  value={formData.productionCapacity}
                  onChange={(e) =>
                    updateFormData("productionCapacity", e.target.value)
                  }
                  className="bg-white text-black border-gray-300"
                />
              </div>

              {/* -- NEW: Deals In Dropdown with Badges -- */}
              <div>
                <Label htmlFor="dealsIn">Deals In (Select Multiple)</Label>
                <Select
                  onValueChange={(value) => {
                    const id = parseInt(value)
                    setSelectedCategories((prev) =>
                      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
                    )
                  }}
                >
                  <SelectTrigger className="bg-white text-black border-gray-300">
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {selectedCategories.includes(cat.id) ? "✅ " : ""} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Show selected category badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((id) => {
                    const cat = categories.find((c) => c.id === id)
                    if (!cat) return null
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {cat.name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() =>
                            setSelectedCategories((prev) => prev.filter((v) => v !== id))
                          }
                        />
                      </Badge>
                    )
                  })}
                </div>
              </div>
              {/* -- END NEW SECTION -- */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Type of Seller <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.typeOfSeller}
                  onValueChange={(value) => updateFormData("typeOfSeller", value)}
                >
                  <SelectTrigger className="bg-white text-black border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="0">Importer</SelectItem>
                    <SelectItem value="1">Wholeseller</SelectItem>
                    <SelectItem value="2">Manufacturer</SelectItem>
                    <SelectItem value="3">Distributor</SelectItem>
                    <SelectItem value="4">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Logo/Image (1357*150)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white text-black">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("logo", e.target.files?.[0] || null)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("logo-upload")?.click()
                    }
                    className="bg-white text-black border-gray-300 hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-700 mt-1">
                    {fileUploads.logo
                      ? fileUploads.logo.name
                      : "No file chosen"}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Download Paper | View Document
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={4}
                className="resize-none bg-white text-black border-gray-300"
              />
            </div>
          </CardContent>
        </Card>
      )}


      {/* Personal Information Section */}
      {activeSection === "personal-info" && (
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-blue-600">
              Personal Information (Owner)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ownerName">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => updateFormData("ownerName", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="designation">
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => updateFormData("designation", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="ownerAddress">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={(e) => updateFormData("ownerAddress", e.target.value)}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Documents Upload Section */}
      {activeSection === "documents" && (
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-blue-600">
              Documents Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gstNumber">
                  GST Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    updateFormData("gstNumber", e.target.value.toUpperCase())
                  }
                />
                {errors.gstNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>
                )}

              </div>
              <div>
                <Label htmlFor="exportImportLicense">
                  Export Import License <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="exportImportLicense"
                  value={formData.exportImportLicense}
                  onChange={(e) =>
                    updateFormData("exportImportLicense", e.target.value)
                  }
                />
                {errors.exportImportLicense && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.exportImportLicense}
                  </p>
                )}

              </div>
              <div>
                <Label>PAN Card (.png, .jpeg, .jpg Only)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white text-black">
                  <input
                    type="file"
                    id="pan-upload"
                    accept=".png,.jpeg,.jpg"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("panCard", e.target.files?.[0] || null)
                    }
                  />
                  {errors.panCard && (
                    <p className="text-red-500 text-sm mt-2">{errors.panCard}</p>
                  )}

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      document.getElementById("pan-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    {fileUploads.panCard
                      ? fileUploads.panCard.name
                      : "No file chosen"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>ISO Certificate (.pdf Only)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white text-black">
                  <input
                    type="file"
                    id="iso-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("isocertificate", e.target.files?.[0] || null)
                    }
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      document.getElementById("iso-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    {fileUploads.isocertificate
                      ? fileUploads.isocertificate.name
                      : "No file chosen"}
                  </p>
                </div>
              </div>
              <div>
                <Label>CERTIFICATE OF INCORPORATION (.pdf Only)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white text-black">
                  <input
                    type="file"
                    id="incorporation-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        "certificateOfIncorporation",
                        e.target.files?.[0] || null
                      )
                    }
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      document.getElementById("incorporation-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    {fileUploads.certificateOfIncorporation
                      ? fileUploads.certificateOfIncorporation.name
                      : "No file chosen"}
                  </p>
                </div>
              </div>
              <div>
                <Label>GST CERTIFICATE (.pdf Only)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white text-black">
                  <input
                    type="file"
                    id="gst-cert-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("gstCertificate", e.target.files?.[0] || null)
                    }
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      document.getElementById("gst-cert-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    {fileUploads.gstCertificate
                      ? fileUploads.gstCertificate.name
                      : "No file chosen"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}