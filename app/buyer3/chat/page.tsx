"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Loader2 } from "lucide-react"
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
          // } else if (activeTab === "consultant") {
          //   url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/getallsellers?user_type=5&page=${currentPage}&limit=9`
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Sellers</h1>
          <p className="text-lg text-gray-600 text-balance">Connect with verified sellers and start a conversation</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading {activeTab}s...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center px-6 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* User Cards Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Link key={user.id} href={`/buyer3/chat/${user.id}`} passHref>
                  <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300">

                          {/* Show image only if available */}
                          {user.organization?.image_banner ? (
                            <AvatarImage
                              src={user.organization.image_banner}
                              alt={user.name}
                            />
                          ) : (
                            <AvatarImage src="" alt="" className="hidden" /> // Forces fallback
                          )}

                          {/* Fallback shows first letter */}
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-500 text-white text-lg font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                            {user.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600 font-medium group-hover:text-blue-600 transition-colors duration-300">
                          Start a conversation
                        </span>
                        <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex flex-col items-center space-y-3">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">No {activeTab}s found</p>
                  <p className="text-gray-500 text-sm">Check back later for new listings</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && users.length > 0 && (
          <div className="flex justify-center pt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
