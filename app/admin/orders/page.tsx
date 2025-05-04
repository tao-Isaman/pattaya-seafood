"use client"

import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getOrders, updateOrderStatus, type Order } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [printOrder, setPrintOrder] = useState<Order | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // โหลดข้อมูลออเดอร์เมื่อโหลดหน้า
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error loading orders:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลออเดอร์ได้",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [toast])

  // ตั้งค่า real-time subscription สำหรับการอัพเดทออเดอร์
  useEffect(() => {
    const { supabase } = require("@/lib/supabase")

    // สร้าง subscription สำหรับการเพิ่มออเดอร์ใหม่
    const newOrderSubscription = supabase
      .channel("orders-insert")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async () => {
          // โหลดข้อมูลออเดอร์ใหม่
          const data = await getOrders()
          setOrders(data)

          toast({
            title: "มีออเดอร์ใหม่",
            description: "มีออเดอร์ใหม่เข้ามาในระบบ",
          })
        },
      )
      .subscribe()

    // สร้าง subscription สำหรับการอัพเดทออเดอร์
    const updateOrderSubscription = supabase
      .channel("orders-update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        async (payload: any) => {
          // ถ้าไม่ใช่การอัพเดทจากผู้ใช้ปัจจุบัน
          if (isUpdating !== payload.new.id) {
            // โหลดข้อมูลออเดอร์ใหม่
            const data = await getOrders()
            setOrders(data)

            toast({
              title: "ออเดอร์ถูกอัพเดท",
              description: `ออเดอร์ #${payload.new.id} ถูกอัพเดทเป็น "${payload.new.status}"`,
            })
          }
        },
      )
      .subscribe()

    // ยกเลิก subscription เมื่อ component unmount
    return () => {
      supabase.removeChannel(newOrderSubscription)
      supabase.removeChannel(updateOrderSubscription)
    }
  }, [toast, isUpdating])

  const handleStatusChange = async (orderId: number, newStatus: Order["status"]) => {
    setIsUpdating(orderId)

    try {
      await updateOrderStatus(orderId, newStatus)

      // อัพเดทสถานะในข้อมูลท้องถิ่น
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      toast({
        title: "อัพเดทสถานะสำเร็จ",
        description: `อัพเดทสถานะออเดอร์ #${orderId} เป็น "${newStatus}" เรียบร้อยแล้ว`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทสถานะออเดอร์ได้",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const pendingOrders = orders.filter((order) => order.status === "รอดำเนินการ")
  const processingOrders = orders.filter((order) => order.status === "กำลังปรุง")
  const completedOrders = orders.filter((order) => order.status === "เสร็จสิ้น")
  const cancelledOrders = orders.filter((order) => order.status === "ยกเลิก")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
  
        <div className="flex-1">
          <AdminHeader title="จัดการออเดอร์" />
          <main className="p-6 flex justify-center items-center h-[calc(100vh-60px)]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-2" />
              <p>กำลังโหลดข้อมูลออเดอร์...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerContent className="fixed inset-y-0 left-0 top-0 h-full w-64 max-w-full p-0 rounded-none block lg:hidden">
          <DrawerTitle className="sr-only">เมนูนำทาง</DrawerTitle>
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </DrawerContent>
      </Drawer>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1">
        <AdminHeader title="จัดการออเดอร์" onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">รายการออเดอร์</h1>
            <div className="flex gap-2">
              <Badge className="bg-sky-500 text-white">{pendingOrders.length} รอดำเนินการ</Badge>
              <Badge className="bg-sky-400 text-white">{processingOrders.length} กำลังปรุง</Badge>
              <Badge className="bg-sky-600 text-white">{completedOrders.length} เสร็จสิ้น</Badge>
              <Badge className="bg-sky-300 text-white">{cancelledOrders.length} ยกเลิก</Badge>
            </div>
          </div>

          <Tabs defaultValue="pending">
            <TabsList className="bg-sky-100 mb-6">
              <TabsTrigger value="pending" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                รอดำเนินการ
              </TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                กำลังปรุง
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                เสร็จสิ้น
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                ยกเลิก
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                ทั้งหมด
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="grid gap-6">
                {pendingOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">ไม่มีออเดอร์ที่รอดำเนินการ</CardContent>
                  </Card>
                ) : (
                  pendingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdating === order.id}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="processing">
              <div className="grid gap-6">
                {processingOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">ไม่มีออเดอร์ที่กำลังปรุง</CardContent>
                  </Card>
                ) : (
                  processingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdating === order.id}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid gap-6">
                {completedOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">ไม่มีออเดอร์ที่เสร็จสิ้น</CardContent>
                  </Card>
                ) : (
                  completedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdating === order.id}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancelled">
              <div className="grid gap-6">
                {cancelledOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">ไม่มีออเดอร์ที่ยกเลิก</CardContent>
                  </Card>
                ) : (
                  cancelledOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdating === order.id}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="grid gap-6">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">ไม่มีออเดอร์</CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdating === order.id}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Print Receipt Modal */}
          {printOrder && (
            <ReceiptModal order={printOrder} onClose={() => setPrintOrder(null)} />
          )}
        </main>
      </div>
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: number, newStatus: Order["status"]) => void
  isUpdating: boolean
}

function OrderCard({ order, onStatusChange, isUpdating }: OrderCardProps) {
  // แปลง created_at เป็นวันที่และเวลาในรูปแบบไทย
  const date = new Date(order.created_at)
  const formattedDate = date.toLocaleDateString("th-TH")
  const formattedTime = date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น."

  const [showReceipt, setShowReceipt] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>ออเดอร์ #{order.id}</CardTitle>
            <CardDescription>
              {formattedDate} {formattedTime}
            </CardDescription>
          </div>
          <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">ข้อมูลลูกค้า</h3>
            <div className="text-sm">
              <p>
                <span className="font-medium">ชื่อ:</span> {order.customer_name}
              </p>
              <p>
                <span className="font-medium">เบอร์โทร:</span> {order.customer_phone}
              </p>
              {order.customer_address && (
                <p>
                  <span className="font-medium">ที่อยู่:</span> {order.customer_address}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">รายการอาหาร</h3>
            <div className="space-y-2">
              {order.items &&
                order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{item.price * item.quantity} บาท</span>
                  </div>
                ))}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>รวมทั้งสิ้น</span>
                <span>{order.total} บาท</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">สถานะ:</span>
              <Select
                value={order.status}
                onValueChange={(value) => onStatusChange(order.id, value as Order["status"])}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="เลือกสถานะ">
                    {isUpdating ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        กำลังอัพเดท...
                      </div>
                    ) : (
                      order.status
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="รอดำเนินการ">รอดำเนินการ</SelectItem>
                  <SelectItem value="กำลังปรุง">กำลังปรุง</SelectItem>
                  <SelectItem value="เสร็จสิ้น">เสร็จสิ้น</SelectItem>
                  <SelectItem value="ยกเลิก">ยกเลิก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="text-sky-500 border-sky-200 hover:bg-sky-50 hover:text-sky-600"
              onClick={() => setShowReceipt(true)}
            >
              พิมพ์ใบเสร็จ
            </Button>
            {showReceipt && (
              <ReceiptModal order={order} onClose={() => setShowReceipt(false)} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "รอดำเนินการ":
      return "bg-sky-500 text-white"
    case "กำลังปรุง":
      return "bg-sky-400 text-white"
    case "เสร็จสิ้น":
      return "bg-sky-600 text-white"
    case "ยกเลิก":
      return "bg-sky-300 text-white"
    default:
      return "bg-sky-200 text-white"
  }
}

function ReceiptModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative print:w-full print:max-w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 print:hidden"
        >
          ✕
        </button>
        <Receipt order={order} />
        <div className="mt-6 flex justify-end gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            พิมพ์ใบเสร็จ
          </button>
        </div>
      </div>
    </div>
  )
}

function Receipt({ order }: { order: Order }) {
  return (
    <div className="text-black text-sm font-sans bg-white p-4 print:p-0">
      <div className="flex justify-between mb-4">
        <div>
          <div className="font-bold text-lg mb-1">ร้านค้าที่ให้บริการ</div>
          <div>พัทยา Sea Food</div>
          <div>โทร: 038-123-4567</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg mb-1">รายละเอียดลูกค้าสำคัญ</div>
          <div>{order.customer_name}</div>
          <div>{order.customer_phone}</div>
          {order.customer_address && <div>{order.customer_address}</div>}
        </div>
      </div>
      <div className="text-center font-bold text-lg mb-2">ใบเสร็จรับเงิน (Receipt)</div>
      <table className="w-full border-t border-b border-black mb-4">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2 text-left">จำนวน</th>
            <th className="py-2 text-left">รายการสินค้า</th>
            <th className="py-2 text-right">ราคา</th>
          </tr>
        </thead>
        <tbody>
          {order.items && order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-1">{item.quantity}</td>
              <td className="py-1">{item.name}</td>
              <td className="py-1 text-right">{(item.price * item.quantity).toLocaleString()} บาท</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <table>
          <tbody>
            <tr>
              <td className="pr-4">ราคารวม</td>
              <td className="text-right">{order.total.toLocaleString()} บาท</td>
            </tr>
            <tr>
              <td className="pr-4">ค่าจัดส่ง</td>
              <td className="text-right">0.00 บาท</td>
            </tr>
            <tr className="font-bold">
              <td className="pr-4">รวมราคาทั้งสิ้น</td>
              <td className="text-right">{order.total.toLocaleString()} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center">ขอบคุณที่ใช้บริการ (Thank you)</div>
    </div>
  )
}
