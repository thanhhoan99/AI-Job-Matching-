"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function verifyEmployer(employerId: string, status: "verified" | "rejected", notes?: string) {
  const supabase = await createClient()
  
  // Kiểm tra quyền admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()
  
  if (!user || profile?.role !== "admin") {
    throw new Error("Unauthorized: Only admin can verify employers")
  }

  const updateData = {
    verification_status: status,
    verification_notes: notes || null,
    verified_at: status === "verified" ? new Date().toISOString() : null,
    verified_by: user.id,
  }

  console.log("Server Action: Updating employer", employerId, "with:", updateData)

  const { error } = await supabase
    .from("employer_profiles")
    .update(updateData)
    .eq("id", employerId)

  if (error) {
    console.error("Server Action Error:", error)
    throw new Error(`Database error: ${error.message}`)
  }

  // Revalidate the employers page to refresh data
  revalidatePath("/admin/employers")
  
  return { 
    success: true, 
    message: status === "verified" ? "Đã xác minh doanh nghiệp thành công!" : "Đã từ chối xác minh doanh nghiệp!"
  }
}