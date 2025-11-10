import type React from "react"
import { EmployerNav } from "@/components/employer/employer-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ToastContainer } from "react-toastify"

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
       redirect("/auth/login?redirect=/employer/dashboard")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "employer") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <EmployerNav />
      <main className="flex-1 p-8">{children}
        <ToastContainer />
      </main>
     
    </div>
  )
}
