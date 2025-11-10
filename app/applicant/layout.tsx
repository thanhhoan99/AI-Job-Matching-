import type React from "react"
import ApplicantHeader from "@/components/applicant/applicant-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import "@/public/assets/css/style.css";
import "@/styles/globals.css";
import Footer from "@/components/Layout/Footer";
import ApplicantFooter from "@/components/applicant/ApplicantFooter";


export default async function ApplicantLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
   redirect("/auth/login?redirect=/applicant/dashboard")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "applicant") {
    redirect("/")
  }

  return ( 
  
    // <div className=" min-h-screen">
    //   {/* <ApplicantNav /> */}
    //   <main className="flex-1 p-8">{children}</main>
    // </div>
  <div >
       <ApplicantHeader />
      {/* KHÔNG có Header ở đây - Header đã có trong RootLayout */}
      <div className="min-h-screen"> {/* Thêm padding-top để tránh bị Header che mất nội dung */}
        {children}
      </div>
      <ApplicantFooter />
    </div>


   
  )
}
