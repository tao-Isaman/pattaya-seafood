import type React from "react"
import { AdminAuthCheck } from "@/components/admin-auth-check"

export default function AdminMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthCheck>{children}</AdminAuthCheck>
}
