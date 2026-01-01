"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserFromToken } from "@/hooks/use-token"

interface ProductFormData {
  product_name: string
  product_unit: string
  unit_size: string
  price: string
  select_tax_type: string
  tax: string
  hsn_number: string
  city: string
  mill: string
  shade: string
  gsm: string
  sizes: string
  weights: string
  stock_in_kg: string
  price_per_kg: string
  quantity_in_kg: string
  description: string
  status: string
  images: File[]
  category_id: string
}

export default function ProductForm({ onProductAdded }: { onProductAdded?: () => void }) {
  const { toast } = useToast()
  const user = getUserFromToken()
  const sellerId = user?.user_id
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    product_unit: "",
    unit_size: "",
    price: "",
    select_tax_type: "",
    tax: "",
    hsn_number: "",
    city: "",
    mill: "",
    shade: "",
    gsm: "",
    sizes: "",
    weights: "",
    stock_in_kg: "",
    price_per_kg: "",
    quantity_in_kg: "",
    description: "",
    status: "1",
    images: [],
    category_id: "",
  })

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {}

    if (!formData.product_name.trim()) newErrors.product_name = "Product name is required"
    if (!formData.category_id) newErrors.category_id = "Category is required"
    if (!formData.product_unit.trim()) newErrors.product_unit = "Product unit is required"

    if (!formData.price_per_kg || Number(formData.price_per_kg) <= 0)
      newErrors.price_per_kg = "Price per kg is required"

    if (!formData.images || formData.images.length === 0)
      newErrors.images = "At least one image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Fetch categories on load
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`)
        if (!res.ok) throw new Error("Failed to load categories")
        const data = await res.json()
        setCategories(data.categories)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error",
          description: "Unable to load categories",
          variant: "destructive",
        })
      }
    }
    fetchCategories()
  }, [toast])

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, image: file }))
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []

    if (files.length === 0) return

    // Check total images (existing + new)
    const totalImages = formData.images.length + files.length
    if (totalImages > 5) {
      toast({
        title: "Image limit exceeded",
        description: `You can upload a maximum of 5 images. You're trying to add ${files.length} more to ${formData.images.length} existing images.`,
        variant: "destructive",
      })
      e.target.value = "" // Reset input
      return
    }

    // Create preview URLs for new images
    const newPreviews = files.map(file => URL.createObjectURL(file))

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))

    setImagePreviews(prev => [...prev, ...newPreviews])

    // Clear error
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }))
    }

    // Reset input to allow selecting the same file again
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index])

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))

    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const submitData = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          // Append each image file
          value.forEach((file) => {
            submitData.append("images", file)
          })
        } else if (key !== "images") {
          submitData.append(key, String(value))
        }
      })

      submitData.append("seller_id", String(sellerId))

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
        method: "POST",
        body: submitData,
      })

      if (!res.ok) throw new Error("Failed to save product")

      if (res.ok) {
        toast({ title: "Success", description: "Product added successfully!" });
        onProductAdded?.();
      }
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      setImagePreviews([])
      // Reset form
      setFormData({
        product_name: "",
        product_unit: "",
        unit_size: "",
        price: "",
        select_tax_type: "",
        tax: "",
        hsn_number: "",
        city: "",
        mill: "",
        shade: "",
        gsm: "",
        sizes: "",
        weights: "",
        stock_in_kg: "",
        price_per_kg: "",
        quantity_in_kg: "",
        description: "",
        status: "1",
        images: [],
        category_id: "",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🔽 Your existing product fields continue below 🔽 */}

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Product Name</Label>
            <Input value={formData.product_name} onChange={(e) => handleChange("product_name", e.target.value)} />

            {errors.product_name && (
              <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
            )}
          </div>
          <div>
            <Label>Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleChange("category_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="h-40 overflow-y-scroll">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">No categories found</div>
                )}
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                )}

              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Product Unit</Label>
            <Input value={formData.product_unit} onChange={(e) => handleChange("product_unit", e.target.value)} />
            {errors.unit_size && (
              <p className="text-red-500 text-sm mt-1">{errors.unit_size}</p>
            )}
          </div>


        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Unit Size</Label>
            <Input
              type="number"
              value={formData.unit_size}
              onChange={(e) => handleChange("unit_size", e.target.value)}
            />
          </div>
          <div>
            <Label>Tax Type</Label>
            <Select
              value={formData.select_tax_type}
              onValueChange={(value) => handleChange("select_tax_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tax type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GST">GST</SelectItem>
                <SelectItem value="IGST">IGST</SelectItem>
                <SelectItem value="CGST">CGST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tax %</Label>
            <Input type="number" value={formData.tax} onChange={(e) => handleChange("tax", e.target.value)} />
          </div>

        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div>
            <Label>Price</Label>
            <Input type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} />
          </div> */}
          <div>
            <Label>HSN Number</Label>
            <Input value={formData.hsn_number} onChange={(e) => handleChange("hsn_number", e.target.value)} />
          </div>

          <div>
            <Label>City</Label>
            <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
          </div>

          <div>
            <Label>Mill</Label>
            <Input value={formData.mill} onChange={(e) => handleChange("mill", e.target.value)} />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <Label>Shade</Label>
            <Input value={formData.shade} onChange={(e) => handleChange("shade", e.target.value)} />
          </div>

          <div>
            <Label>GSM</Label>
            <Input value={formData.gsm} onChange={(e) => handleChange("gsm", e.target.value)} />
          </div>

          <div>
            <Label>Sizes</Label>
            <Input value={formData.sizes} onChange={(e) => handleChange("sizes", e.target.value)} />
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <Label>Weights</Label>
            <Input value={formData.weights} onChange={(e) => handleChange("weights", e.target.value)} />
          </div>

          <div>
            <Label>Stock in Kg</Label>
            <Input value={formData.stock_in_kg} onChange={(e) => handleChange("stock_in_kg", e.target.value)} />
          </div>

          <div>
            <Label>Price per Kg</Label>
            <Input value={formData.price_per_kg} onChange={(e) => handleChange("price_per_kg", e.target.value)} />
            {errors.price_per_kg && (
              <p className="text-red-500 text-sm mt-1">{errors.price_per_kg}</p>
            )}
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <Label>Quantity in Kg</Label>
            <Input value={formData.quantity_in_kg} onChange={(e) => handleChange("quantity_in_kg", e.target.value)} />
          </div>

          {/* <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div>
            <Label>Product Images * (Max 5)</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Images ({imagePreviews.length}/5)</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-center mt-1 truncate">
                    {formData.images[index].name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Row 7 */}
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>



        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button disabled={loading} className="w-full md:w-auto bg-blue-500 text-white">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
