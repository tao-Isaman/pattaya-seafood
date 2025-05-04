"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
import Image from "next/image"
import { MenuHeader } from "@/components/menu-header"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getMenuItems } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { MenuItem } from "@/lib/supabase"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadMenuItems() {
      try {
        const items = await getMenuItems()
        setMenuItems(items)
      } catch (error) {
        console.error("Error loading menu items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuItems()
  }, [])

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">เมนูอาหาร</h1>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="ค้นหาเมนูอาหาร..." 
                className="pl-10 border-secondary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="w-full overflow-x-auto">
              <TabsList className="mb-6 bg-secondary p-1 min-w-max flex-nowrap">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  ทั้งหมด
                </TabsTrigger>
                <TabsTrigger value="seafood" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  อาหารทะเล
                </TabsTrigger>
                <TabsTrigger value="appetizers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  อาหารเรียกน้ำย่อย
                </TabsTrigger>
                <TabsTrigger value="soups" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  ต้ม/แกง
                </TabsTrigger>
                <TabsTrigger value="drinks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  เครื่องดื่ม
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seafood" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems
                  .filter((item) => item.category === "seafood")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="appetizers" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems
                  .filter((item) => item.category === "appetizers")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="soups" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems
                  .filter((item) => item.category === "soups")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="drinks" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems
                  .filter((item) => item.category === "drinks")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} พัทยา Sea Food. สงวนลิขสิทธิ์ทั้งหมด.</p>
        </div>
      </footer>
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="overflow-hidden bg-card h-full flex flex-col">
      <div className="h-48 relative">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{getCategoryName(item.category)}</p>
          </div>
          <p className="font-bold text-primary">{item.price} บาท</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-5">{item.description}</p>
        <div className="mt-auto">
          <AddToCartButton item={item} />
        </div>
      </CardContent>
    </Card>
  )
}

function getCategoryName(category: string): string {
  switch (category) {
    case "seafood":
      return "อาหารทะเล"
    case "appetizers":
      return "อาหารเรียกน้ำย่อย"
    case "soups":
      return "ต้ม/แกง"
    case "drinks":
      return "เครื่องดื่ม"
    default:
      return category
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
