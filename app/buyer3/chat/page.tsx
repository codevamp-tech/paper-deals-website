"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUserFromToken } from "@/hooks/use-token"
import Pagination from "@/components/pagination"

interface User {
  id: string
  name: string
  avatar?: string
  organization?: {
    image_banner?: string
  }
}

type UserType = "seller" | "consultant"

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<UserType>("seller")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        let url = ""
        if (activeTab === "seller") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/getallsellers?user_type=2&page=${currentPage}&limit=9`
        } else if (activeTab === "consultant") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/getallsellers?user_type=5&page=${currentPage}&limit=9`
        }
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUsers(data.data || [])
        setTotalPages(data.totalPages || 1)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [activeTab, currentPage])

  return (
    <div className="w-full space-y-6 bg-blue-600- text-black p-4 rounded-lg">
      {/* Tab Buttons */}
     <div className="flex justify-center space-x-4">
        <div className="flex gap-2">


            <Button
              variant={activeTab === "consultant" ? "default" : "outline"}
              onClick={() => setActiveTab("seller")}
              className="transition-all duration-200 ease-in-out text-black bg-white"
            >
             seller
            </Button>
            <Button
              variant={activeTab === "seller" ? "default" : "outline"}
              onClick={() => setActiveTab("consultant")}
              className="transition-all duration-200 ease-in-out text-black bg-white"
            >
              consultant
            </Button>
            
          </div>
</div>


      {/* Loading / Error States */}
      {loading && <div className="text-center text-black">Loading {activeTab}s...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* User Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {users.map((user) => (
            <Link key={user.id} href={`/buyer3/chat/${user.id}`} passHref>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white text-black border">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        user.organization?.image_banner ||
                        `/placeholder.svg?height=40&width=40&query=${user.name}`
                      }
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gray-200 text-black">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-black">{user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black">Click to chat</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}
