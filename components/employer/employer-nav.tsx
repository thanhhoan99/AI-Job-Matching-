"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Building2, Briefcase, Users, CreditCard, LogOut } from "lucide-react"
import { useAuthLoading } from "@/hooks/use-auth-loading"

const navItems = [
  { href: "/employer/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/employer/profile", label: "Thông tin công ty", icon: Building2 },
  { href: "/employer/jobs", label: "Tin tuyển dụng", icon: Briefcase },
  { href: "/employer/applications", label: "Ứng viên", icon: Users },
  { href: "/employer/subscription", label: "Gói dịch vụ", icon: CreditCard },
]

export function EmployerNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
   const { startAuthLoading } = useAuthLoading()

  const handleLogout = async () => {
    startAuthLoading() // Bắt đầu loading không thể dừng
    
    try {
      await supabase.auth.signOut()
      
      // QUAN TRỌNG: Sử dụng replace và không có delay
      window.location.replace("/")
    } catch (error) {
      console.error("Logout error:", error)
      window.location.replace("/")
    }
  }
  return (
    <nav className="flex flex-col gap-2 p-4 border-r min-h-screen w-64">
      <div className="mb-6">
        <h2 className="text-lg font-semibold px-2">Nhà tuyển dụng</h2>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
      <Button variant="ghost" className="justify-start gap-3 mt-auto" onClick={handleLogout}>
        <LogOut className="w-4 h-4" />
        Đăng xuất
      </Button>
    </nav>
  )
}
