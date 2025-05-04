"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/cart-context"

export default function Navbar() {
  const pathname = usePathname()
  const { cart } = useCart()
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  if (pathname.startsWith('/admin/')) return null

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.jpg"
            alt="พัทยา Sea Food Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold">พัทยา Sea Food</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-primary-foreground/80 transition">
            หน้าหลัก
          </Link>
          <Link href="/menu" className="hover:text-primary-foreground/80 transition">
            เมนูอาหาร
          </Link>
          <Link href="/cart" className="hover:text-primary-foreground/80 transition">
            ตะกร้าสินค้า
          </Link>
          <Link href="/admin" className="hover:text-primary-foreground/80 transition">
            สำหรับร้านอาหาร
          </Link>
        </nav>
        <div className="flex space-x-2">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white">
                  {totalCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin" className="hidden md:block">
            <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary/80">
              เข้าสู่ระบบร้านอาหาร
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 