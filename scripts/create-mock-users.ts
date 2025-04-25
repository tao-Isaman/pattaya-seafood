// ไฟล์นี้เป็นตัวอย่างการใช้ Supabase Admin API เพื่อสร้างผู้ใช้จำลอง
// ในการใช้งานจริง คุณสามารถสร้างผู้ใช้ผ่าน Supabase Dashboard ได้

import { createClient } from "@supabase/supabase-js"

// ต้องใช้ service_role key ไม่ใช่ anon key
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function createMockUsers() {
  try {
    // สร้างผู้ใช้ admin
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@pattayaseafood.com",
      password: "password123",
      email_confirm: true,
    })

    if (adminError) {
      throw adminError
    }

    // อัพเดท role เป็น admin
    const { error: adminProfileError } = await supabaseAdmin
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", adminData.user.id)

    if (adminProfileError) {
      throw adminProfileError
    }

    console.log("Created admin user:", adminData.user.email)

    // สร้างผู้ใช้ staff
    const { data: staffData, error: staffError } = await supabaseAdmin.auth.admin.createUser({
      email: "staff@pattayaseafood.com",
      password: "password123",
      email_confirm: true,
    })

    if (staffError) {
      throw staffError
    }

    // อัพเดท role เป็น staff
    const { error: staffProfileError } = await supabaseAdmin
      .from("profiles")
      .update({ role: "staff" })
      .eq("id", staffData.user.id)

    if (staffProfileError) {
      throw staffProfileError
    }

    console.log("Created staff user:", staffData.user.email)

    console.log("Mock users created successfully!")
  } catch (error) {
    console.error("Error creating mock users:", error)
  }
}

createMockUsers()
