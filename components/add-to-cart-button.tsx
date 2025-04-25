"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { ShoppingCart } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface AddToCartButtonProps {
  item: MenuItem
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })

    toast({
      title: "เพิ่มลงตะกร้าแล้ว",
      description: `เพิ่ม ${item.name} ลงในตะกร้าเรียบร้อยแล้ว`,
    })
  }

  return (
    <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={handleAddToCart}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      เพิ่มลงตะกร้า
    </Button>
  )
}
