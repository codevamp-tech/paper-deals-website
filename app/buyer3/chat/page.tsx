"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Buyer {
  id: string
  name: string
  avatar?: string
}

export default function BuyerList() {
  const [sellers, setSellers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBuyers() {
      try {
        const response = await fetch("http://localhost:5000/api/users/getallsellers?user_type=2")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSellers(data.data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBuyers()
  }, [])

  if (loading) {
    return <div className="text-center">Loading buyers...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full ">
      {sellers.map((seller) => (
        <Link key={seller.id} href={`/buyer3/chat/${seller.id}`} passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={seller.organization?.image_banner || `/placeholder.svg?height=40&width=40&query=${seller.name}`}
                  alt={seller.name}
                />
                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{seller.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Click to chat</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
