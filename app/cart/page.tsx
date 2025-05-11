"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/lib/supabase"
import { Loader2, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// List of villa names
const VILLA_NAMES = [
  "จอมเทียน 19",
  "จอมเทียน 17",
  "เดาน่าจอมเทียน",
  "13144",
  "131181",
  "Nina. pool",
  "หน้าร้าน (4 times in วสันต์1)",
  "Magic Time's",
  "Aqua Rich",
  "แก็กม่าย",
  "LAVA (ราวา)",
  "Mavia Fun (มาเวีย)",
  "อู๊ค่า",
  "ขอนหมอ",
  "ซีสัน",
  "ตำหนัก",
  "ชั้นโล",
  "มุมไอน์",
  "B17",
  "Moon light (มูนไลน์)",
  "Star light (สตาไลน์)",
  "นานา",
  "Mina",
  "83/87",
  "\"Je T\"\"aime  (เชอเตม)\"",
  "The Time's",
  "Butter",
  "Terra House",
  "Sky",
  "Signatures",
  "P&P 83/93",
  "P&P 83/92",
  "Nifta",
  "Sonava (โซนาว่า)",
  "อิตเด็ด",
  "Ashy",
  "เดสทีนี",
  "เทคดี้",
  "เดอะ นันทรีวิ",
  "ยูโทเปีย",
  "เพล ซี",
  "เบีย ทีส",
  "I love you (ไอ เลิฟ ยู)",
  "ซีซาร์",
  "ซิส พัทยา",
  "โพธิรมณ",
  "วิลล่า เดอ บุน",
  "blossom",
  "Chloe house",
  "41",
  "Snap stay",
  "Smok. stay",
  "บ้านใหญ่สุด",
  "charlotte house",
  "Hormone",
  "star. say",
  "Luca",
  "RetryPP"
]

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { toast } = useToast()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    villaName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleVillaChange = (value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      villaName: value,
    }))
  }

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.villaName) {
      toast({
        title: "กรุณากรอกข้อมูล",
        description: "กรุณากรอกชื่อ, เบอร์โทรศัพท์ และเลือกชื่อบ้าน",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "ตะกร้าว่างเปล่า",
        description: "กรุณาเลือกรายการอาหารก่อนสั่งซื้อ",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // สร้างข้อมูลออเดอร์
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address || undefined,
        villa_name: customerInfo.villaName,
        total: totalPrice,
        status: "รอดำเนินการ" as const,
      }

      // สร้างข้อมูลรายการสินค้า
      const orderItems = cart.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }))

      // บันทึกข้อมูลลงใน Supabase
      await createOrder(orderData, orderItems)

      toast({
        title: "สั่งซื้อสำเร็จ",
        description: "ขอบคุณสำหรับการสั่งซื้อ เราจะติดต่อกลับโดยเร็วที่สุด",
      })

      clearCart()
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสั่งซื้อได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ตะกร้าสินค้า</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-sky-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">ตะกร้าของคุณว่างเปล่า</h2>
            <p className="text-gray-600 mb-6">เลือกเมนูอาหารที่คุณชื่นชอบและเพิ่มลงในตะกร้า</p>
            <Link href="/menu">
              <Button className="bg-sky-500 hover:bg-sky-600">ดูเมนูอาหาร</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="h-20 w-20 relative flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.price} บาท</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.price * item.quantity} บาท</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 -mr-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">สรุปคำสั่งซื้อ</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ราคารวม</span>
                      <span className="font-medium">{totalPrice} บาท</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>ยอดรวมทั้งสิ้น</span>
                      <span className="text-sky-600">{totalPrice} บาท</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium">ข้อมูลลูกค้า</h3>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          ชื่อ-นามสกุล *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          placeholder="กรุณากรอกชื่อ-นามสกุล"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          เบอร์โทรศัพท์ *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          placeholder="กรุณากรอกเบอร์โทรศัพท์"
                        />
                      </div>
                      <div>
                        <label htmlFor="villaName" className="block text-sm font-medium text-gray-700 mb-1">
                          ชื่อวิลล่า *
                        </label>
                        <Select
                          value={customerInfo.villaName}
                          onValueChange={handleVillaChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกชื่อวิลล่า" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {VILLA_NAMES.map((villa) => (
                              <SelectItem key={villa} value={villa}>
                                {villa}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          ที่อยู่ (ถ้ามี)
                        </label>
                        <Input
                          id="address"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          placeholder="กรุณากรอกที่อยู่"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-sky-500 hover:bg-sky-600"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || !customerInfo.name || !customerInfo.phone || !customerInfo.villaName || cart.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังสั่งซื้อ...
                      </>
                    ) : (
                      "ยืนยันการสั่งซื้อ"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-sky-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} พัทยา Sea Food. สงวนลิขสิทธิ์ทั้งหมด.</p>
        </div>
      </footer>
    </div>
  )
}
