import { supabase } from "./supabase"

export type AuthUser = {
  id: string
  email: string
  role?: string
}

// ฟังก์ชันสำหรับการล็อกอิน
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// ฟังก์ชันสำหรับการล็อกเอาท์
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

// ฟังก์ชันสำหรับการตรวจสอบสถานะการล็อกอิน
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return null
  }

  const { data: userData, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.session.user.id)
    .single()

  if (error || !userData) {
    return {
      id: data.session.user.id,
      email: data.session.user.email || "",
    }
  }

  return {
    id: data.session.user.id,
    email: data.session.user.email || "",
    role: userData.role,
  }
}

// ฟังก์ชันสำหรับการตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}
