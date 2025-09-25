"use client"

import { getUserFromToken } from "@/hooks/use-token"
import { useState } from "react"

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const user = getUserFromToken();
  const userId = user?.user_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const response = await fetch("https://paper-deal-server.onrender.com/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          newPassword,
          confirmPassword,
        }),
      })
      console.log({
        userId,
        newPassword,
        confirmPassword
      })
      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage(`❌ ${data.message || "Something went wrong"}`)
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("❌ Error updating password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-10 p-6 text-black">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
              required

            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
              required

            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded-md`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* Status message */}
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
