import { createClient } from "@supabase/supabase-js"

// ใช้ environment variables ที่มีอยู่แล้ว
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// สร้าง Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ประเภทข้อมูลสำหรับตาราง
export type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  created_at?: string
}

export type OrderItem = {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  price: number
  name: string
}

export type Order = {
  id: number
  customer_name: string
  customer_phone: string
  customer_address?: string
  villa_name?: string
  total: number
  status: "รอดำเนินการ" | "กำลังปรุง" | "เสร็จสิ้น" | "ยกเลิก"
  created_at: string
  items?: OrderItem[]
}

export type DashboardStats = {
  total_revenue: number
  total_orders: number
  new_customers: number
}

// ฟังก์ชันสำหรับดึงข้อมูลเมนูอาหาร
export async function getMenuItems() {
  const { data, error } = await supabase.from("menu_items").select("*").order("id")

  if (error) {
    console.error("Error fetching menu items:", error)
    return []
  }

  return data as MenuItem[]
}

// ฟังก์ชันสำหรับเพิ่มเมนูอาหาร
export async function addMenuItem(item: Omit<MenuItem, "id" | "created_at">) {
  const { data, error } = await supabase.from("menu_items").insert([item]).select()

  if (error) {
    console.error("Error adding menu item:", error)
    throw error
  }

  return data[0] as MenuItem
}

// ฟังก์ชันสำหรับอัพเดทเมนูอาหาร
export async function updateMenuItem(id: number, item: Partial<MenuItem>) {
  const { data, error } = await supabase.from("menu_items").update(item).eq("id", id).select()

  if (error) {
    console.error("Error updating menu item:", error)
    throw error
  }

  return data[0] as MenuItem
}

// ฟังก์ชันสำหรับลบเมนูอาหาร
export async function deleteMenuItem(id: number) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id)

  if (error) {
    console.error("Error deleting menu item:", error)
    throw error
  }

  return true
}

// ฟังก์ชันสำหรับดึงข้อมูลออเดอร์
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        quantity,
        price,
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data.map((order) => ({
    ...order,
    items: order.order_items,
  })) as Order[]
}

// ฟังก์ชันสำหรับอัพเดทสถานะออเดอร์
export async function updateOrderStatus(id: number, status: Order["status"]) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select()

  if (error) {
    console.error("Error updating order status:", error)
    throw error
  }

  return data[0] as Order
}

// ฟังก์ชันสำหรับสร้างออเดอร์ใหม่
export async function createOrder(
  order: {
    customer_name: string
    customer_phone: string
    customer_address?: string
    total: number
    status: Order["status"]
  },
  items: {
    menu_item_id: number
    quantity: number
    price: number
    name: string
  }[],
) {
  // เริ่ม transaction
  const { data: orderData, error: orderError } = await supabase.from("orders").insert([order]).select()

  if (orderError) {
    console.error("Error creating order:", orderError)
    throw orderError
  }

  const orderId = orderData[0].id

  // เพิ่มรายการสินค้าในออเดอร์
  const orderItems = items.map((item) => ({
    order_id: orderId,
    ...item,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error adding order items:", itemsError)
    throw itemsError
  }

  return orderId
}

// ฟังก์ชันสำหรับดึงข้อมูลสถิติสำหรับแดชบอร์ด
export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // ดึงข้อมูลออเดอร์ทั้งหมด
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .gte("created_at", startOfMonth.toISOString())

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
    throw ordersError
  }

  // คำนวณยอดขายตามช่วงเวลา
  const stats = orders.reduce((acc, order) => {
    const orderDate = new Date(order.created_at)
    const isCompleted = order.status === "เสร็จสิ้น"
    
    if (orderDate >= today) {
      acc.todaySales += order.total
    }
    if (orderDate >= startOfWeek) {
      acc.weekSales += order.total
    }
    acc.monthSales += order.total
    
    if (isCompleted) {
      acc.totalRevenue += order.total
    }
    
    return acc
  }, {
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
    totalRevenue: 0
  })

  // ดึงจำนวนออเดอร์ทั้งหมด
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  // ดึงจำนวนลูกค้าใหม่
  const { count: newCustomers } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString())

  return {
    ...stats,
    total_orders: totalOrders || 0,
    new_customers: newCustomers || 0,
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลรายได้รายเดือน
export async function getMonthlyRevenue() {
  // ดึงข้อมูลออเดอร์ที่เสร็จสิ้นในช่วง 8 เดือนล่าสุด
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 7)

  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at")
    .eq("status", "เสร็จสิ้น")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())

  if (error) {
    console.error("Error fetching monthly revenue:", error)
    throw error
  }

  // จัดกลุ่มข้อมูลตามเดือน
  const monthlyData: Record<string, { name: string; amount: number }> = {}

  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]

  // สร้าง object สำหรับเก็บข้อมูลรายเดือน
  for (let i = 0; i < 8; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
    const monthName = thaiMonths[date.getMonth()]
    monthlyData[monthKey] = { name: monthName, amount: 0 }
  }

  // เพิ่มข้อมูลรายได้
  data.forEach((order) => {
    const date = new Date(order.created_at)
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`

    if (monthlyData[monthKey]) {
      monthlyData[monthKey].amount += order.total
    }
  })

  // แปลงเป็น array และเรียงตามเดือน
  return Object.values(monthlyData).reverse()
}

// ฟังก์ชันสำหรับดึงข้อมูลเมนูยอดนิยม
export async function getPopularItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      id,
      name,
      category,
      order_items (
        quantity
      )
    `)

  if (error) {
    console.error("Error fetching popular items:", error)
    throw error
  }

  // Calculate total orders and revenue for each menu item
  const itemStats = data.map(item => {
    const totalOrders = item.order_items?.reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0
    
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      total_orders: totalOrders,
    }
  })

  // Sort by total orders and get top 5
  return itemStats
    .sort((a, b) => b.total_orders - a.total_orders)
    .slice(0, 5)
}

// ฟังก์ชันสำหรับดึงข้อมูลออเดอร์ล่าสุด
export async function getRecentOrders(limit = 4) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_name,
      total,
      status,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent orders:", error)
    throw error
  }

  return data.map((order) => {
    const date = new Date(order.created_at)
    return {
      id: order.id,
      customer: order.customer_name,
      total: order.total,
      status: order.status,
      date: date.toLocaleDateString("th-TH"),
      time: date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
    }
  })
}

// ฟังก์ชันสำหรับดึงหมวดหมู่ทั้งหมดที่เป็นไปได้
export async function getCategories() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("category")
    .order("category")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Get unique categories
  const uniqueCategories = [...new Set(data.map(item => item.category))]
  return uniqueCategories
}

// ฟังก์ชันสำหรับเพิ่มหมวดหมู่ใหม่
export async function addCategory(category: string) {
  // First, check if the category already exists
  const { data: existingCategories } = await supabase
    .from("menu_items")
    .select("category")
    .eq("category", category)
    .limit(1)

  if (existingCategories && existingCategories.length > 0) {
    return category // Category already exists
  }

  // Add a new menu item with this category to create it
  const { error } = await supabase
    .from("menu_items")
    .insert([{
      name: "Category Placeholder",
      description: "This is a placeholder item for the category",
      price: 0,
      category: category,
      image: "/placeholder.svg?height=300&width=400"
    }])

  if (error) {
    console.error("Error adding category:", error)
    throw error
  }

  return category
}
