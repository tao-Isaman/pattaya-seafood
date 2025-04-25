"use client"

import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addMenuItem, deleteMenuItem, getMenuItems, type MenuItem, updateMenuItem } from "@/lib/supabase"
import { Edit, Loader2, Plus, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminMenuPage() {
  const { toast } = useToast()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id" | "created_at">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "/placeholder.svg?height=300&width=400",
  })

  // โหลดข้อมูลเมนูอาหารเมื่อโหลดหน้า
  useEffect(() => {
    async function loadMenuItems() {
      try {
        const items = await getMenuItems()
        setMenuItems(items)
      } catch (error) {
        console.error("Error loading menu items:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลเมนูอาหารได้",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuItems()
  }, [toast])

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB')
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(uploadError.message)
      }

      if (!uploadData) {
        throw new Error('ไม่สามารถอัพโหลดไฟล์ได้')
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('ไม่สามารถสร้าง URL สำหรับรูปภาพได้')
      }

      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "ไม่สามารถอัพโหลดรูปภาพได้",
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const addedItem = await addMenuItem(newItem)
      setMenuItems([...menuItems, addedItem])

      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "/placeholder.svg?height=300&width=400",
      })

      setIsAddDialogOpen(false)

      toast({
        title: "เพิ่มเมนูสำเร็จ",
        description: "เพิ่มเมนูใหม่เรียบร้อยแล้ว",
      })
    } catch (error) {
      console.error("Error adding menu item:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มเมนูอาหารได้",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditItem = async () => {
    if (!currentItem || !currentItem.name || !currentItem.price || !currentItem.category) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { id, created_at, ...itemData } = currentItem
      const updatedItem = await updateMenuItem(id, itemData)

      setMenuItems(menuItems.map((item) => (item.id === currentItem.id ? updatedItem : item)))
      setIsEditDialogOpen(false)

      toast({
        title: "แก้ไขเมนูสำเร็จ",
        description: "แก้ไขเมนูเรียบร้อยแล้ว",
      })
    } catch (error) {
      console.error("Error updating menu item:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขเมนูอาหารได้",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteItem = async () => {
    if (!currentItem) return

    setIsSubmitting(true)

    try {
      await deleteMenuItem(currentItem.id)
      setMenuItems(menuItems.filter((item) => item.id !== currentItem.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "ลบเมนูสำเร็จ",
        description: "ลบเมนูเรียบร้อยแล้ว",
      })
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเมนูอาหารได้",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="จัดการเมนูอาหาร" />

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">รายการเมนูอาหาร</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 hover:bg-sky-600">
                  <Plus className="mr-2 h-4 w-4" /> เพิ่มเมนูใหม่
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มเมนูใหม่</DialogTitle>
                  <DialogDescription>กรอกรายละเอียดเมนูอาหารที่ต้องการเพิ่ม</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">ชื่อเมนู</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">คำอธิบาย</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">ราคา</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seafood">อาหารทะเล</SelectItem>
                        <SelectItem value="appetizers">อาหารเรียกน้ำย่อย</SelectItem>
                        <SelectItem value="soups">ต้ม/แกง</SelectItem>
                        <SelectItem value="drinks">เครื่องดื่ม</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">รูปภาพ</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-32 w-32">
                        <Image
                          src={newItem.image}
                          alt="Preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const imageUrl = await handleImageUpload(file)
                              if (imageUrl) {
                                setNewItem({ ...newItem, image: imageUrl })
                              }
                            }
                          }}
                          className="hidden"
                        />
                        <Label
                          htmlFor="image"
                          className="flex items-center justify-center gap-2 cursor-pointer border rounded-md p-2 hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4" />
                          อัพโหลดรูปภาพ
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                    ยกเลิก
                  </Button>
                  <Button className="bg-sky-500 hover:bg-sky-600" onClick={handleAddItem} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังเพิ่ม...
                      </>
                    ) : (
                      "เพิ่มเมนู"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              <span className="ml-2">กำลังโหลดข้อมูล...</span>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-sky-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">ไม่พบเมนูอาหาร</h2>
              <p className="text-gray-600 mb-6">เพิ่มเมนูอาหารใหม่เพื่อเริ่มต้นใช้งาน</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-48 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">{getCategoryName(item.category)}</p>
                      </div>
                      <p className="font-bold text-sky-600">{item.price} บาท</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentItem(item)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        แก้ไข
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCurrentItem(item)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        ลบ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function getCategoryName(category: string): string {
  switch (category) {
    case "seafood":
      return "อาหารทะเล"
    case "appetizers":
      return "อาหารเรียกน้ำย่อย"
    case "soups":
      return "ต้ม/แกง"
    case "drinks":
      return "เครื่องดื่ม"
    default:
      return category
  }
}
