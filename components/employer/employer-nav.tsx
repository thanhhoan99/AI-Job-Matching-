
// "use client"

// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { useState } from "react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { createClient } from "@/lib/supabase/client"
// import {
//   LayoutDashboard,
//   Building2,
//   Briefcase,
//   Users,
//   CreditCard,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { useAuthLoading } from "@/hooks/use-auth-loading"

// const navItems = [
//   { href: "/employer/dashboard", label: "Tổng quan", icon: LayoutDashboard },
//   { href: "/employer/profile", label: "Thông tin công ty", icon: Building2 },
//   { href: "/employer/jobs", label: "Tin tuyển dụng", icon: Briefcase },
//   { href: "/employer/applications", label: "Ứng viên", icon: Users },
//   { href: "/employer/subscription", label: "Gói dịch vụ", icon: CreditCard },
// ]

// export function EmployerNav() {
//   const pathname = usePathname()
//   const router = useRouter()
//   const supabase = createClient()
//   const { startAuthLoading } = useAuthLoading()

//   const [collapsed, setCollapsed] = useState(false)

//   const handleLogout = async () => {
//     startAuthLoading()
//     try {
//       await supabase.auth.signOut()
//       window.location.replace("/")
//     } catch (error) {
//       console.error("Logout error:", error)
//       window.location.replace("/")
//     }
//   }

//   return (
//     <aside
//       className={cn(
//         "border-r h-screen flex flex-col transition-all duration-300",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       {/* Header + Toggle */}
//       <div className="flex items-center justify-between p-4 border-b">
//         {!collapsed && <h2 className="text-lg font-semibold">Nhà tuyển dụng</h2>}
//         <Button
//           size="icon"
//           variant="ghost"
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           {collapsed ? <ChevronRight /> : <ChevronLeft />}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {navItems.map((item) => {
//           const Icon = item.icon
//           const active = pathname === item.href

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
//                 active
//                   ? "bg-primary text-primary-foreground"
//                   : "hover:bg-accent hover:text-accent-foreground",
//                 collapsed && "justify-center",
//               )}
//             >
//               <Icon className="w-5 h-5 shrink-0" />
//               {!collapsed && item.label}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Logout – sticky bottom */}
//       <div className="sticky bottom-0 border-t p-3 bg-background">
//         <Button
//           variant="ghost"
//           className={cn(
//             "w-full gap-3 justify-start",
//             collapsed && "justify-center",
//           )}
//           onClick={handleLogout}
//         >
//           <LogOut className="w-5 h-5" />
//           {!collapsed && "Đăng xuất"}
//         </Button>
//       </div>
//     </aside>
//   )
// }

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react"
import { useAuthLoading } from "@/hooks/use-auth-loading"
import { Badge } from "@/components/ui/badge"

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

  const [collapsed, setCollapsed] = useState(false)
  const [newApplicationsCount, setNewApplicationsCount] = useState(0)

  useEffect(() => {
    fetchNewApplicationsCount()
    
    // Thiết lập real-time subscription
    const channel = supabase
      .channel('application-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_applications',
        },
        (payload) => {
          fetchNewApplicationsCount()
          // Có thể thêm thông báo push ở đây
          showBrowserNotification("Có ứng viên mới!", "Vừa có ứng viên ứng tuyển vào tin tuyển dụng của bạn.")
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNewApplicationsCount = async () => {
    try {
      const { data: employerProfile } = await supabase
        .from("employer_profiles")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (!employerProfile) return

      const { data: jobPostings } = await supabase
        .from("job_postings")
        .select("id")
        .eq("employer_id", employerProfile.id)

      if (!jobPostings || jobPostings.length === 0) return

      const jobIds = jobPostings.map(job => job.id)

      const { count } = await supabase
        .from("job_applications")
        .select("*", { count: 'exact', head: true })
        .in("job_id", jobIds)
        .eq("status", "pending")

      setNewApplicationsCount(count || 0)
    } catch (error) {
      console.error("Error fetching new applications:", error)
    }
  }

  const showBrowserNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body })
    }
  }

  const handleMarkAsRead = async () => {
    // Đánh dấu tất cả thông báo mới là đã xem
    // Ở đây có thể thêm logic cập nhật vào database
    setNewApplicationsCount(0)
  }

  const handleLogout = async () => {
    startAuthLoading()
    try {
      await supabase.auth.signOut()
      window.location.replace("/")
    } catch (error) {
      console.error("Logout error:", error)
      window.location.replace("/")
    }
  }

  return (
    <aside
      className={cn(
        "border-r h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header + Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Nhà tuyển dụng</h2>}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center",
              )}
              onClick={item.href === "/employer/applications" ? handleMarkAsRead : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && item.label}
              
              {/* Thông báo số lượng đơn mới cho tab Ứng viên */}
              {item.href === "/employer/applications" && newApplicationsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn(
                    "absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center text-xs",
                    collapsed && "top-1 right-1"
                  )}
                >
                  {newApplicationsCount > 9 ? "9+" : newApplicationsCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Thông báo icon */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 justify-start relative",
            collapsed && "justify-center",
          )}
          asChild
        >
          <Link href="/employer/applications" onClick={handleMarkAsRead}>
            <Bell className="w-5 h-5" />
            {!collapsed && "Thông báo"}
            {newApplicationsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {newApplicationsCount > 9 ? "9+" : newApplicationsCount}
              </Badge>
            )}
          </Link>
        </Button>
      </div>

      {/* Logout – sticky bottom */}
      <div className="sticky bottom-0 border-t p-3 bg-background">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 justify-start",
            collapsed && "justify-center",
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Đăng xuất"}
        </Button>
      </div>
    </aside>
  )
}