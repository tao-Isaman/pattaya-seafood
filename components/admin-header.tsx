import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"

interface AdminHeaderProps {
  title: string
  onMenuClick?: () => void
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
      <Button variant="outline" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline" size="sm" className="hidden md:flex">
            กลับไปหน้าร้านค้า
          </Button>
        </Link>
      </div>
    </header>
  )
}
