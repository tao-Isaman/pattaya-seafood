import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "พัทยา Sea Food - ร้านอาหารทะเลสดใหม่",
  description: "ร้านอาหารทะเลสดใหม่ พัทยา Sea Food สั่งอาหารออนไลน์ได้ง่ายๆ",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  // For SSR/SSG, fallback to rendering navbar (or usePathname in client only)
  const isAdminDashboard = pathname === "/admin/dashboard"

  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {/* Conditionally render navbar */}
              {typeof window !== "undefined" ? !isAdminDashboard && (
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
                      <Link href="/cart">
                        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                          <ShoppingCart className="h-5 w-5" />
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
              ) : (
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
                      <Link href="/cart">
                        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                          <ShoppingCart className="h-5 w-5" />
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
              )}
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
