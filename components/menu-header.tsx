"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

export function MenuHeader() {
  const { cart } = useCart()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-sky-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="พัทยา Sea Food Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold">พัทยา Sea Food</h1>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-sky-200 transition">
            หน้าหลัก
          </Link>
          <Link href="/menu" className="hover:text-sky-200 transition">
            เมนูอาหาร
          </Link>
          <Link href="/cart" className="hover:text-sky-200 transition">
            ตะกร้าสินค้า
          </Link>
          <Link href="/admin" className="hover:text-sky-200 transition">
            สำหรับร้านอาหาร
          </Link>
        </nav>
        <Link href="/cart">
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-sky-700 relative">
            <ShoppingCart className="h-5 w-5 mr-2" />
            ตะกร้าสินค้า
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
