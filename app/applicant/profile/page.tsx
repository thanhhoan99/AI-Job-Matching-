
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/applicant/profile-form"
import { CVParser } from "@/components/applicant/cv-parser"
import styles from "../../../styles/ApplicantProfile.module.css"

import Link from "next/link"

export default async function ApplicantProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  return (
    <>

      <section className={styles.container}>
  {/* <div className={styles.breadcrumbs}>
    <ul>
      <li><Link href="/applicant/dashboard">Dashboard</Link></li>
      <li><span>Hồ sơ của tôi</span></li>
    </ul>
  </div> */}

  <div className={styles.boxHeading}>
    <h3>Hồ sơ của tôi</h3>
    <p>Quản lý thông tin cá nhân và CV của bạn</p>
  </div>

  {/* Phân tích CV */}
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h5>Phân tích CV</h5>
      <p>Tải lên CV của bạn để phân tích và cải thiện</p>
    </div>
    <div className={styles.cardBody}>
      <CVParser userId={user.id} />
    </div>
  </div>

  <div className={styles.divider}></div>

  {/* Thông tin cá nhân */}
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h5>Thông tin cá nhân</h5>
      <p>Cập nhật thông tin cá nhân và hồ sơ của bạn</p>
    </div>
    <div className={styles.cardBody}>
      <ProfileForm profile={profile} applicantProfile={applicantProfile} />
    </div>
  </div>
</section>
    </>
  )
}