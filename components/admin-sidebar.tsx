"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ChefHat, Home, LogOut, Menu, Package, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function AdminSidebar({ onClose, className }: { onClose?: () => void; className?: string } = {}) {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  return (
    <div className={cn("border-r bg-secondary w-64 h-full", className)}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex items-center border-b px-4 py-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="text-primary">พัทยา Sea Food</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary",
              )}
              onClick={onClose}
            >
              <Home className="h-4 w-4" />
              แดชบอร์ด
            </Link>
            <Link
              href="/admin/orders"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin/orders" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary",
              )}
              onClick={onClose}
            >
              <ShoppingCart className="h-4 w-4" />
              จัดการออเดอร์
            </Link>
            <Link
              href="/admin/menu"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin/menu" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary",
              )}
              onClick={onClose}
            >
              <Menu className="h-4 w-4" />
              จัดการเมนูอาหาร
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-primary"
              onClick={onClose}
            >
              <Package className="h-4 w-4" />
              กลับไปหน้าร้านค้า
            </Link>
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4">
          {user && (
            <div className="mb-2 px-2 py-1">
              <p className="text-xs text-muted-foreground">ล็อกอินเป็น</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          )}
          <Button variant="outline" className="w-full" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </div>
  )
}
