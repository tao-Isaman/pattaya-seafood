"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

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
  const [clicked, setClicked] = useState(false)

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

    setClicked(true)
    setTimeout(() => setClicked(false), 200)
  }

  return (
    <Button
      className={`w-full bg-primary hover:bg-primary/90 transition-transform duration-150 ${clicked ? 'scale-95' : ''}`}
      onClick={handleAddToCart}
      disabled={clicked}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      เพิ่มลงตะกร้า
    </Button>
  )
}
