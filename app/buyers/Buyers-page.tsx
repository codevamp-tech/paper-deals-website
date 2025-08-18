"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const buyerRequirements = [
  {
    id: 1,
    buyerName: "Packaging Solutions Pvt Ltd",
    companyType: "Manufacturing",
    location: "Mumbai, Maharashtra",
    contactPerson: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@packagingsolutions.com",
    productRequired: "Kraft Paper",
    specifications: {
      gsm: "120-150 GSM",
      size: "70cm x 100cm",
      shade: "Brown",
      quality: "Virgin Pulp",
      finish: "Smooth",
    },
    quantity: "5000 Kg",
    budgetRange: "₹65-75 per Kg",
    deliveryLocation: "Mumbai, Maharashtra",
    deliveryDate: "15/05/2025",
    orderType: "Regular",
    paymentTerms: "30 Days Credit",
    postedDate: "28/04/2025",
    urgency: "Medium",
    quotationsReceived: 3,
    status: "Active",
    additionalNotes:
      "Looking for long-term supplier. Quality consistency is important.",
  },
  {
    id: 2,
    buyerName: "PrintCraft Industries",
    companyType: "Printing",
    location: "Delhi, NCR",
    contactPerson: "Priya Sharma",
    phone: "+91 87654 32109",
    email: "priya@printcraft.com",
    productRequired: "Newsprint Paper",
    specifications: {
      gsm: "45-48 GSM",
      size: "Various Rolls",
      shade: "White/Off-White",
      quality: "Recycled Content 70%",
      finish: "Standard",
    },
    quantity: "10000 Kg",
    budgetRange: "₹40-50 per Kg",
    deliveryLocation: "Gurgaon, Haryana",
    deliveryDate: "10/05/2025",
    orderType: "Bulk",
    paymentTerms: "Advance Payment",
    postedDate: "27/04/2025",
    urgency: "High",
    quotationsReceived: 7,
    status: "Active",
    additionalNotes:
      "Urgent requirement for ongoing printing project. Flexible on delivery schedule if price is competitive.",
  },
  {
    id: 3,
    buyerName: "EcoBox Manufacturing",
    companyType: "Packaging",
    location: "Bangalore, Karnataka",
    contactPerson: "Amit Patel",
    phone: "+91 76543 21098",
    email: "amit@ecobox.com",
    productRequired: "Corrugated Sheets",
    specifications: {
      gsm: "3mm-5mm",
      size: "Custom Sizes",
      shade: "Brown",
      quality: "Single Wall",
      finish: "Standard",
    },
    quantity: "2000 Sq Ft",
    budgetRange: "₹30-40 per Sq Ft",
    deliveryLocation: "Bangalore, Karnataka",
    deliveryDate: "20/05/2025",
    orderType: "Custom",
    paymentTerms: "50% Advance, 50% on Delivery",
    postedDate: "26/04/2025",
    urgency: "Low",
    quotationsReceived: 2,
    status: "Active",
    additionalNotes:
      "Custom packaging solution required. Open to discussing specifications.",
  },
  {
    id: 4,
    buyerName: "Office Supplies Co.",
    companyType: "Retail",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Lakshmi Iyer",
    phone: "+91 65432 10987",
    email: "lakshmi@officesupplies.com",
    productRequired: "Writing Paper",
    specifications: {
      gsm: "70-80 GSM",
      size: "A4, A3",
      shade: "White",
      quality: "Premium",
      finish: "Smooth",
    },
    quantity: "1500 Kg",
    budgetRange: "₹80-95 per Kg",
    deliveryLocation: "Chennai, Tamil Nadu",
    deliveryDate: "25/05/2025",
    orderType: "Regular",
    paymentTerms: "15 Days Credit",
    postedDate: "25/04/2025",
    urgency: "Medium",
    quotationsReceived: 5,
    status: "Active",
    additionalNotes:
      "Premium quality required for office use. Consistent supply needed.",
  },
  {
    id: 5,
    buyerName: "Green Pack Solutions",
    companyType: "Eco-Packaging",
    location: "Pune, Maharashtra",
    contactPerson: "Vikram Singh",
    phone: "+91 54321 09876",
    email: "vikram@greenpack.com",
    productRequired: "Tissue Paper",
    specifications: {
      gsm: "2-Ply",
      size: "Standard Rolls",
      shade: "White",
      quality: "Virgin Pulp",
      finish: "Soft",
    },
    quantity: "3000 Kg",
    budgetRange: "₹110-130 per Kg",
    deliveryLocation: "Pune, Maharashtra",
    deliveryDate: "18/05/2025",
    orderType: "Bulk",
    paymentTerms: "Cash on Delivery",
    postedDate: "24/04/2025",
    urgency: "High",
    quotationsReceived: 4,
    status: "Negotiating",
    additionalNotes: "Eco-friendly packaging focus. Certifications preferred.",
  },
  {
    id: 6,
    buyerName: "Industrial Papers Ltd",
    companyType: "Industrial",
    location: "Indore, Madhya Pradesh",
    contactPerson: "Suresh Gupta",
    phone: "+91 43210 98765",
    email: "suresh@industrialpapers.com",
    productRequired: "Kraft Liner Board",
    specifications: {
      gsm: "150-200 GSM",
      size: "Custom Requirements",
      shade: "Brown",
      quality: "High Strength",
      finish: "Standard",
    },
    quantity: "8000 Kg",
    budgetRange: "₹85-100 per Kg",
    deliveryLocation: "Indore, Madhya Pradesh",
    deliveryDate: "30/05/2025",
    orderType: "Industrial",
    paymentTerms: "45 Days Credit",
    postedDate: "23/04/2025",
    urgency: "Low",
    quotationsReceived: 1,
    status: "Active",
    additionalNotes:
      "Industrial grade quality required. Long-term partnership opportunity.",
  },
];

export default function BuyersPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("All");
  const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [quotationData, setQuotationData] = useState({
    pricePerUnit: "",
    totalAmount: "",
    deliveryDays: "",
    paymentTerms: "",
    additionalNotes: "",
  });

  const statusFilters = ["All", "Active", "Negotiating", "Closed"];
  const urgencyFilters = ["All", "High", "Medium", "Low"];

  const filteredRequirements = buyerRequirements.filter((req) => {
    const statusMatch =
      selectedFilter === "All" || req.status === selectedFilter;
    const urgencyMatch =
      selectedUrgency === "All" || req.urgency === selectedUrgency;
    return statusMatch && urgencyMatch;
  });

  const handleSubmitQuotation = (buyer: any) => {
    setSelectedBuyer(buyer);
    setShowQuotationModal(true);
  };

  const handleQuotationSubmit = () => {
    console.log(
      "Quotation submitted for:",
      selectedBuyer?.buyerName,
      quotationData
    );
    setShowQuotationModal(false);
    setQuotationData({
      pricePerUnit: "",
      totalAmount: "",
      deliveryDays: "",
      paymentTerms: "",
      additionalNotes: "",
    });
    // Add your quotation submission logic here
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Negotiating":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buyer Requirements
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with buyers looking for paper products and submit your
            competitive quotations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requirements
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {buyerRequirements.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    buyerRequirements.filter((r) => r.status === "Active")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {buyerRequirements.filter((r) => r.urgency === "High").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Quotations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    buyerRequirements.reduce(
                      (acc, r) => acc + r.quotationsReceived,
                      0
                    ) / buyerRequirements.length
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">
                Status:
              </span>
              {statusFilters.map((status) => (
                <Button
                  key={status}
                  variant={selectedFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(status)}
                  className={
                    selectedFilter === status ? "bg-blue-600 text-white" : ""
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">
                Urgency:
              </span>
              {urgencyFilters.map((urgency) => (
                <Button
                  key={urgency}
                  variant={selectedUrgency === urgency ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedUrgency(urgency)}
                  className={
                    selectedUrgency === urgency ? "bg-blue-600 text-white" : ""
                  }
                >
                  {urgency}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Buyer Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequirements.map((requirement) => (
            <Card
              key={requirement.id}
              className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6">
                {/* Header with Status and Urgency */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(requirement.status)}
                    >
                      {requirement.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getUrgencyColor(requirement.urgency)}
                    >
                      {requirement.urgency}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Posted: {requirement.postedDate}
                    </p>
                    <p className="text-xs text-gray-500">
                      {requirement.quotationsReceived} quotations
                    </p>
                  </div>
                </div>

                {/* Company Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {requirement.buyerName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {requirement.companyType} • {requirement.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{requirement.contactPerson}</span>
                    <span>{requirement.phone}</span>
                  </div>
                </div>

                {/* Product Requirements */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {requirement.productRequired}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">GSM:</span>{" "}
                      <span className="font-medium">
                        {requirement.specifications.gsm}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Size:</span>{" "}
                      <span className="font-medium">
                        {requirement.specifications.size}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Shade:</span>{" "}
                      <span className="font-medium">
                        {requirement.specifications.shade}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quality:</span>{" "}
                      <span className="font-medium">
                        {requirement.specifications.quality}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold text-gray-900">
                      {requirement.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-semibold text-green-600">
                      {requirement.budgetRange}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium text-gray-900">
                      {requirement.deliveryDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">
                      {requirement.deliveryLocation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium text-gray-900">
                      {requirement.paymentTerms}
                    </span>
                  </div>
                </div>

                {/* Additional Notes */}
                {requirement.additionalNotes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {requirement.additionalNotes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSubmitQuotation(requirement)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={requirement.status === "Closed"}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Submit Quotation
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quotation Modal */}
        {showQuotationModal && selectedBuyer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Submit Quotation</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQuotationModal(false)}
                  className="p-1"
                >
                  ✕
                </Button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedBuyer.buyerName}</p>
                <p className="text-sm text-gray-600">
                  {selectedBuyer.productRequired} - {selectedBuyer.quantity}
                </p>
                <p className="text-sm text-green-600">
                  Budget: {selectedBuyer.budgetRange}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Unit
                  </label>
                  <input
                    type="text"
                    placeholder="₹ per Kg/Sq Ft"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={quotationData.pricePerUnit}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        pricePerUnit: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="text"
                    placeholder="₹ Total"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={quotationData.totalAmount}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        totalAmount: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Days
                  </label>
                  <input
                    type="text"
                    placeholder="Number of days"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={quotationData.deliveryDays}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        deliveryDays: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 30 Days Credit"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={quotationData.paymentTerms}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        paymentTerms: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Any additional information..."
                    className="w-full p-2 border border-gray-300 rounded-md h-20"
                    value={quotationData.additionalNotes}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        additionalNotes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleQuotationSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Quotation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQuotationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
