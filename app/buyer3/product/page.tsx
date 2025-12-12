"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Pagination from "@/components/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserFromToken } from "@/hooks/use-token"
import { getCookie } from "@/components/getcookie"
import ProductForm from "@/components/addProduct"

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [categories, setCategories] = useState<any[]>([])

  // For Edit Dialog
  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [file, setFile] = useState<File | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)


  const fetchProducts = async (pageNumber: number) => {
    try {
      setLoading(true)
      const token = getCookie("token")
      if (!token) throw new Error("No token in cookies")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/get?page=${pageNumber}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      )

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Failed to fetch products")
      }

      const data = await res.json()
      setProducts(data.data || [])
      setTotalPages(data.totalPages || 0)   // <-- FIXED
      setPage(data.page || 1)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categiry`, {
        method: "GET",
      })

      if (!res.ok) throw new Error("Failed to fetch categories")

      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }


  useEffect(() => {
    fetchCategories()
    fetchProducts(page)
  }, [page])

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData(product)
    setFile(null)
    setOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpdate = async () => {
    try {
      const form = new FormData()

      // append all fields
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key] ?? "")
      })

      // append file if selected
      if (file) {
        form.append("image", file)
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/edit/${editingProduct.id}`,
        {
          method: "PUT",
          body: form,
        }
      )

      if (!res.ok) throw new Error("Failed to update product")

      setOpen(false)
      fetchProducts(page)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/delete/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete product")
      fetchProducts(page)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>

        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? "Close Add Product" : "+ Add Product"}
        </Button>

      </div>

      {/* Show Add Product Form if seller clicked the button */}
      {showAddForm && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
          < ProductForm
            onProductAdded={() => fetchProducts(page)} />
        </div>
      )}
      <div>
        <div>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-auto rounded-md border">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Seller Name</th>
                    <th className="px-4 py-2 border">Product Name</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Weight </th>
                    <th className="px-4 py-2 border">Stock</th>
                    <th className="px-4 py-2 border">Shade</th>
                    <th className="px-4 py-2 border">Created At</th>
                    <th className="px-4 py-2 border">Edit</th>
                    <th className="px-4 py-2 border">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="px-4 py-2 border">{product.id}</td>
                        <td className="px-4 py-2 border">{product.seller?.name || "Seller not found"}</td>
                        <td className="px-4 py-2 border">{product.product_name || "-"}</td>
                        <td className="px-4 py-2 border">{product.category?.name || "-"}</td>
                        <td className="px-4 py-2 border">{product.price_per_kg || "-"}</td>
                        <td className="px-4 py-2 border">{product.weights || "-"}</td>
                        <td className="px-4 py-2 border">{product.stock_in_kg || "-"}</td>
                        <td className="px-4 py-2 border">{product.shade || "-"}</td>
                        <td className="px-4 py-2 border">
                          {new Date(product.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 border">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-6 text-center">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          {formData && (
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>

                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id ?? ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>


              {[
                "product_name",
                "product_unit",
                "unit_size",
                "price",
                "select_tax_type",
                "tax",
                "hsn_number",
                "city",
                "mill",
                "shade",
                "gsm",
                "sizes",
                "weights",
                "stock_in_kg",
                "price_per_kg",
                "quantity_in_kg",
                "description",
                "status",
              ].map((field) => (
                <div key={field}>
                  <Label className="capitalize">{field.replace(/_/g, " ")}</Label>
                  {field === "status" ? (
                    <select
                      name={field}
                      value={formData[field] || 1}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  ) : (
                    <Input
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

              {/* Image Upload */}
              <div>
                <Label>Product Image</Label>
                <Input type="file" onChange={handleFileChange} />
                {editingProduct?.image && !file && (
                  <img
                    src={editingProduct.image}
                    alt="Product"
                    className="w-24 h-24 mt-2 rounded object-cover"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
