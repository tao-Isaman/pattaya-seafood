import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Utensils, ShoppingCart, ChefHat } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-sky-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="พัทยา Sea Food Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold">พัทยา Sea Food</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-sky-200 transition">
              หน้าหลัก
            </Link>
            <Link href="/menu" className="hover:text-sky-200 transition">
              เมนูอาหาร
            </Link>
            <Link href="/cart" className="hover:text-sky-200 transition">
              ตะกร้าสินค้า
            </Link>
            <Link href="/admin" className="hover:text-sky-200 transition">
              สำหรับร้านอาหาร
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:bg-sky-700">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin" className="hidden md:block">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-sky-700">
                เข้าสู่ระบบร้านอาหาร
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-sky-900/60"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">อาหารทะเลสดใหม่ จากพัทยา</h1>
            <p className="text-xl text-white mb-8">สั่งอาหารทะเลสดใหม่จากร้านพัทยา Sea Food ได้ง่ายๆ เพียงไม่กี่คลิก</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8">
                  <Utensils className="mr-2 h-5 w-5" /> ดูเมนูอาหาร
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-sky-700/30"
                >
                  <ChefHat className="mr-2 h-5 w-5" /> สำหรับร้านอาหาร
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Menu Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">เมนูแนะนำ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <div className="h-48 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sky-600 font-bold text-lg">{item.price} บาท</span>
                      <Link href={`/menu/${item.id}`}>
                        <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                          สั่งเลย
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/menu">
                <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50">
                  ดูเมนูทั้งหมด
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-sky-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">วิธีการสั่งอาหาร</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. เลือกเมนูอาหาร</h3>
                <p className="text-gray-600">เลือกเมนูอาหารทะเลที่คุณชื่นชอบจากรายการอาหารของเรา</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. เพิ่มลงตะกร้า</h3>
                <p className="text-gray-600">เพิ่มรายการอาหารที่คุณต้องการลงในตะกร้าสินค้า</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. ยืนยันการสั่งซื้อ</h3>
                <p className="text-gray-600">ยืนยันการสั่งซื้อและรอรับอาหารทะเลสดใหม่จากทางร้าน</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-sky-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">พัทยา Sea Food</h3>
              <p className="mb-4">ร้านอาหารทะเลสดใหม่ คุณภาพดี ราคาเป็นมิตร</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-sky-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-sky-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">ติดต่อเรา</h3>
              <p className="mb-2">123 ถนนพัทยา, ชลบุรี 20150</p>
              <p className="mb-2">โทร: 038-123-4567</p>
              <p className="mb-2">อีเมล: info@pattayaseafood.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">เวลาทำการ</h3>
              <p className="mb-2">จันทร์ - ศุกร์: 10:00 - 22:00</p>
              <p className="mb-2">เสาร์ - อาทิตย์: 10:00 - 23:00</p>
            </div>
          </div>
          <div className="border-t border-sky-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} พัทยา Sea Food. สงวนลิขสิทธิ์ทั้งหมด.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const featuredItems = [
  {
    id: 1,
    name: "กุ้งเผา",
    description: "กุ้งเผาสดใหม่ เนื้อแน่น หวานกรอบ",
    price: 350,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    name: "ปลากะพงนึ่งมะนาว",
    description: "ปลากะพงนึ่งมะนาว รสชาติเปรี้ยวหวาน",
    price: 450,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    name: "หอยแมลงภู่อบ",
    description: "หอยแมลงภู่อบสมุนไพร หอมกลิ่นเครื่องเทศ",
    price: 220,
    image: "/placeholder.svg?height=300&width=400",
  },
]
