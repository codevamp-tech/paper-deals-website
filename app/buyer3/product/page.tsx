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
  const [isApproved, setIsApproved] = useState(false);
  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [file, setFile] = useState<File | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);

  useEffect(() => {
    const checkUserStatus = () => {
      const user = getUserFromToken();
      // Robust check for string "1", number 1, or boolean true
      const approved = user?.approved == 1 || user?.approved === "1";
      setIsApproved(approved);
    };
    checkUserStatus();
  }, []);

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
          onClick={() => {
            if (!isApproved) {
              setShowBlockedDialog(true);
              return;
            }
            setShowAddForm((prev) => !prev)
          }}
          className={`text-white ${isApproved
            ? "!bg-blue-500 hover:!bg-blue-600"
            : "!bg-gray-400 cursor-not-allowed"
            }`}
        >
          {showAddForm ? "Close Add Product" : "+ Add Product"}
        </Button>
      </div>

      {/* Show Add Product Form if seller clicked the button */}
      {showAddForm && isApproved && (
        <div className="mb-6  p-4 bg-gray-50">
          < ProductForm
            onProductAdded={() => fetchProducts(page)} />
        </div>
      )}

      <div>
        <div>
          {products.length > 0 ? (
            <div className="overflow-auto ">
              <table className="w-full border-collapse border border-gray-300 bg-white min-w-[800px]">
                <thead >
                  <tr className="bg-gray-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Seller Name</th>
                    <th className="p-2 border">Product Name</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Weight </th>
                    <th className="p-2 border">Stock</th>
                    <th className="p-2 border">Shade</th>
                    <th className="p-2 border">Created At</th>
                    <th className="p-2 border">Edit</th>
                    <th className="p-2 border">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="p-2 border">{product.id}</td>
                      <td className="p-2 border">{product.seller?.name || "Seller not found"}</td>
                      <td className="p-2 border">{product.product_name || "-"}</td>
                      <td className="p-2 border">{product.category?.name || "-"}</td>
                      <td className="p-2 border">{product.price_per_kg || "-"}</td>
                      <td className="p-2 border">{product.weights || "-"}</td>
                      <td className="p-2 border">{product.stock_in_kg || "-"}</td>
                      <td className="p-2 border">{product.shade || "-"}</td>
                      <td className="p-2 border">
                        {new Date(product.created_at).toLocaleString()}
                      </td>
                      <td className="p-2 border">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td className=" p-2 border ">
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 ">
              <p className="text-lg font-medium">
                You have not listed any products yet
              </p>
              <p className="text-sm mt-1">
                Click <span className="font-semibold">“Add Product”</span> to create your first product.
              </p>
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

      {/* Block Product Button Dialog */}
      <Dialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
        <DialogContent className="max-w-sm text-center bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Account Deactivated
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-600 mt-2 items-start">
            Your account has been deactivated by the admin.
            <br />
            Please contact your admin to enable product access.
          </p>

          <div className="mt-4 flex justify-center">
            <Button className="bg-blue-500 px-4 py-2 text-white" onClick={() => setShowBlockedDialog(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
