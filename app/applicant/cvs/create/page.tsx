

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CVBuilder } from "@/components/applicant/cv-builder"
import styles from '../../../../styles/NewCVPage.module.css'
import Link from "next/link"

export default async function NewCVPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>
}) {
  const { template } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!applicantProfile) {
    redirect("/applicant/profile")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: selectedTemplate } = template
    ? await supabase.from("cv_templates").select("*").eq("id", template).single()
    : { data: null }

  // Lấy tất cả templates
  const { data: templates } = await supabase.from("cv_templates").select("*").eq("is_active", true)

  return (
     <div className={styles.container}>
        <div style={{ marginBottom: "20px",  padding: "10px" }}  className="breadcrumbs">
            <ul  >
              <li>
                <Link  style={{  fontSize: "12px" }}  href="/applicant/dashboard" className="home-icon">
                  Dashboard
                </Link>
              </li>
              <li>
                <span   style={{  fontSize: "12px" }}>Select Template </span>
              </li>
               <li>
                <span  style={{  fontSize: "12px" }}>Create CV </span>
              </li>
            </ul>
          </div>
      <div>
       
        <p className="text-muted-foreground">Create a professional CV from your profile</p>
      </div>
     
      <CVBuilder 
        profile={profile} 
        applicantProfile={applicantProfile} 
        template={selectedTemplate}
        templates={templates || []}
      />
    </div>
  )
}
