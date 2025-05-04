"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Utensils, ShoppingCart, ChefHat } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getMenuItems } from "@/lib/supabase"
import type { MenuItem } from "@/lib/supabase"
import { SITE_NAME, SITE_SLOGAN, SITE_ADDRESS, SITE_PHONE, SITE_EMAIL, SITE_HOURS } from "@/config/site"

export default function Home() {
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([])

  useEffect(() => {
    async function fetchRecommended() {
      const items = await getMenuItems()
      setRecommendedItems(items.slice(0, 3)) // Show first 3 as recommended
    }
    fetchRecommended()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <main>
        {/* Hero Section */}
        <section
          className="py-20 px-4 text-center bg-cover bg-center relative"
          style={{ backgroundImage: "url('/banner-new.png')" }}
        >
          <div className="absolute inset-0 bg-primary/90"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">{SITE_SLOGAN}</h1>
            <p className="text-xl text-primary-foreground mb-8">สั่งอาหารทะเลสดใหม่จากร้าน{SITE_NAME} ได้ง่ายๆ เพียงไม่กี่คลิก</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-white border border-primary text-primary hover:bg-primary/10 px-8">
                  <Utensils className="mr-2 h-5 w-5" /> ดูเมนูอาหาร
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary/80"
                >
                  <ChefHat className="mr-2 h-5 w-5" /> สำหรับร้านอาหาร
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Menu Section */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">เมนูแนะนำ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 h-96"
                >
                  <div className="w-full h-40 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-t-2xl" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-lg mb-1 text-foreground">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="absolute left-0 bottom-0 w-full px-4 py-3 flex justify-between items-center border-t bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-2xl">
                    <span className="text-primary font-bold text-lg">{item.price} บาท</span>
                    <Link href={`/menu/`}>
                      <Button size="sm" className="rounded-full px-5 py-1.5 text-sm font-semibold shadow bg-primary text-primary-foreground hover:bg-primary/90 transition">
                        สั่งเลย
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/menu">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
                  ดูเมนูทั้งหมด
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">วิธีการสั่งอาหาร</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg shadow text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">1. เลือกเมนูอาหาร</h3>
                <p className="text-muted-foreground">เลือกเมนูอาหารทะเลที่คุณชื่นชอบจากรายการอาหารของเรา</p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">2. เพิ่มลงตะกร้า</h3>
                <p className="text-muted-foreground">เพิ่มรายการอาหารที่คุณต้องการลงในตะกร้าสินค้า</p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">3. ยืนยันการสั่งซื้อ</h3>
                <p className="text-muted-foreground">ยืนยันการสั่งซื้อและรอรับอาหารทะเลสดใหม่จากทางร้าน</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{SITE_NAME}</h3>
              <p className="mb-4">ร้านอาหารทะเลสดใหม่ คุณภาพดี ราคาเป็นมิตร</p>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-foreground hover:text-primary-foreground/80">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-primary-foreground hover:text-primary-foreground/80">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">ติดต่อเรา</h3>
              <p className="mb-2">{SITE_ADDRESS}</p>
              <p className="mb-2">โทร: {SITE_PHONE}</p>
              <p className="mb-2">อีเมล: {SITE_EMAIL}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">เวลาทำการ</h3>
              {SITE_HOURS.map((line, idx) => (
                <p className="mb-2" key={idx}>{line}</p>
              ))}
            </div>
          </div>
          <div className="border-t border-primary/80 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}. สงวนลิขสิทธิ์ทั้งหมด.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
