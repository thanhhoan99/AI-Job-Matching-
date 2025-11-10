"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Settings, LogOut, Building2 } from "lucide-react"
import { useAuthLoading } from "@/hooks/use-auth-loading"

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/employers", label: "Nhà tuyển dụng", icon: Building2 },
  { href: "/admin/jobs", label: "Công việc", icon: Briefcase },
  { href: "/admin/transactions", label: "Báo cáo", icon: FileText },
  { href: "/admin/analytics", label: "Thống kê", icon: BarChart3 },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
]

export function AdminNav() {
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
    <nav className="flex flex-col gap-2 p-4 border-r min-h-screen w-64 bg-slate-50">
      <div className="mb-6">
        <h2 className="text-lg font-semibold px-2 text-slate-900">Quản trị viên</h2>
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
