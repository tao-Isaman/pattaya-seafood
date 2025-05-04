"use client"

import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getDashboardStats, getMonthlyRevenue, getPopularItems, getRecentOrders } from "@/lib/supabase"
import { BarChart3, Loader2, ShoppingBag, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
    totalRevenue: 0,
    total_orders: 0,
    new_customers: 0,
  })
  const [todaySales, setTodaySales] = useState(0)
  const [weekSales, setWeekSales] = useState(0)
  const [monthSales, setMonthSales] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [popularItems, setPopularItems] = useState<any[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // โหลดข้อมูลแดชบอร์ดเมื่อโหลดหน้า
  useEffect(() => {
    setIsClient(true)

    async function loadDashboardData() {
      try {
        // โหลดข้อมูลสถิติ
        const statsData = await getDashboardStats()
        setStats(statsData)
        setTodaySales(statsData.todaySales)
        setWeekSales(statsData.weekSales)
        setMonthSales(statsData.monthSales)
        setTotalSales(statsData.totalRevenue)

        // โหลดข้อมูลออเดอร์ล่าสุด
        const ordersData = await getRecentOrders(4)
        setRecentOrders(ordersData)

        // โหลดข้อมูลเมนูยอดนิยม
        const popularData = await getPopularItems()
        setPopularItems(popularData)

        // โหลดข้อมูลรายได้รายเดือน
        const revenueData = await getMonthlyRevenue()
        setMonthlyRevenue(revenueData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลแดชบอร์ดได้",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isClient) {
      loadDashboardData()
    }
  }, [router, toast, isClient])

  // ตั้งค่า real-time subscription สำหรับการอัพเดทออเดอร์
  useEffect(() => {
    if (!isClient) return

    const { supabase } = require("@/lib/supabase")

    // สร้าง subscription สำหรับการเพิ่มหรืออัพเดทออเดอร์
    const orderSubscription = supabase
      .channel("dashboard-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async () => {
          // โหลดข้อมูลใหม่
          const statsData = await getDashboardStats()
          setStats(statsData)

          const ordersData = await getRecentOrders(4)
          setRecentOrders(ordersData)

          const revenueData = await getMonthlyRevenue()
          setMonthlyRevenue(revenueData)
        },
      )
      .subscribe()

    // สร้าง subscription สำหรับการเพิ่มหรืออัพเดทรายการสินค้าในออเดอร์
    const orderItemsSubscription = supabase
      .channel("dashboard-order-items")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        async () => {
          // โหลดข้อมูลเมนูยอดนิยมใหม่
          const popularData = await getPopularItems()
          setPopularItems(popularData)
        },
      )
      .subscribe()

    // ยกเลิก subscription เมื่อ component unmount
    return () => {
      supabase.removeChannel(orderSubscription)
      supabase.removeChannel(orderItemsSubscription)
    }
  }, [isClient, toast])

  if (!isClient) {
    return null // ป้องกัน hydration errors
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Mobile sidebar */}
        <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <DrawerContent className="fixed inset-y-0 left-0 top-0 h-full w-64 max-w-full p-0 rounded-none block lg:hidden">
            <DrawerTitle className="sr-only">เมนูนำทาง</DrawerTitle>
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </DrawerContent>
        </Drawer>
        {/* Desktop sidebar */}
        <div className="hidden lg:block"><AdminSidebar /></div>
        <div className="flex-1">
          <AdminHeader title="แดชบอร์ด" onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-6 flex justify-center items-center h-[calc(100vh-60px)]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p>กำลังโหลดข้อมูลแดชบอร์ด...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar */}
      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerContent className="fixed inset-y-0 left-0 top-0 h-full w-64 max-w-full p-0 rounded-none block lg:hidden">
          <DrawerTitle className="sr-only">เมนูนำทาง</DrawerTitle>
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </DrawerContent>
      </Drawer>
      {/* Desktop sidebar */}
      <div className="hidden lg:block"><AdminSidebar /></div>
      <div className="flex-1">
        <AdminHeader title="แดชบอร์ด" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">แดชบอร์ด</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">ยอดขายวันนี้</CardTitle>
                  <CardDescription className="text-muted-foreground">รายได้รวมวันนี้</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(todaySales)} บาท</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">ยอดขายสัปดาห์นี้</CardTitle>
                  <CardDescription className="text-muted-foreground">รายได้รวมสัปดาห์นี้</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(weekSales)} บาท</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">ยอดขายเดือนนี้</CardTitle>
                  <CardDescription className="text-muted-foreground">รายได้รวมเดือนนี้</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(monthSales)} บาท</p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">ยอดขายทั้งหมด</CardTitle>
                  <CardDescription className="text-muted-foreground">รายได้รวมทั้งหมด</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalSales)} บาท</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">รายการสั่งซื้อล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium text-foreground">#{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date} {order.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{formatCurrency(order.total)} บาท</p>
                        <p className={`text-sm ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">เมนูยอดนิยม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{getCategoryName(item.category)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{item.total_orders} ครั้ง</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "รอดำเนินการ":
      return "text-sky-500"
    case "กำลังปรุง":
      return "text-sky-400"
    case "เสร็จสิ้น":
      return "text-sky-600"
    case "ยกเลิก":
      return "text-sky-300"
    default:
      return "text-sky-200"
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('฿', '฿ ')
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getCategoryName(category: string): string {
  switch (category) {
    case "seafood":
      return "อาหารทะเล"
    case "appetizer":
      return "อาหารเรียกน้ำย่อย"
    case "soup":
      return "ซุป"
    case "drink":
      return "เครื่องดื่ม"
    default:
      return category
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "รอดำเนินการ"
    case "processing":
      return "กำลังดำเนินการ"
    case "completed":
      return "เสร็จสิ้น"
    case "cancelled":
      return "ยกเลิก"
    default:
      return status
  }
}

