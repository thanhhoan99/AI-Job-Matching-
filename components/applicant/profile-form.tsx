"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Profile, ApplicantProfile } from "@/lib/types/database"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import styles from "../../styles/ProfileForm.module.css"


interface ProfileFormProps {
  profile: Profile | null
  applicantProfile: ApplicantProfile | null
}

export function ProfileForm({ profile, applicantProfile }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    bio: applicantProfile?.bio || "",
    current_position: applicantProfile?.current_position || "",
    years_of_experience: applicantProfile?.years_of_experience || 0,
    city: applicantProfile?.city || "",
    address: applicantProfile?.address || "",
    expected_salary_min: applicantProfile?.expected_salary_min || "",
    expected_salary_max: applicantProfile?.expected_salary_max || "",
    skills: applicantProfile?.skills?.join(", ") || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log("Starting profile update...")
      
      // 1. Xác thực người dùng
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error("Không thể xác thực người dùng. Vui lòng đăng nhập lại.")
      }

      console.log("User authenticated:", user.id)

      // 2. Cập nhật bảng profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw new Error(`Lỗi cập nhật profile: ${profileError.message}`)
      }

      console.log("Profile updated successfully")

      // 3. Chuẩn bị dữ liệu applicant profile
      const applicantData = {
        user_id: user.id,
        bio: formData.bio,
        current_position: formData.current_position,
        years_of_experience: Number(formData.years_of_experience),
        city: formData.city,
        address: formData.address,
        expected_salary_min: formData.expected_salary_min ? Number(formData.expected_salary_min) : null,
        expected_salary_max: formData.expected_salary_max ? Number(formData.expected_salary_max) : null,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      }

      console.log("Applicant profile exists:", !!applicantProfile)

      // 4. XỬ LÝ UPSERT ĐÚNG CÁCH - TRÁNH DUPLICATE KEY
      let applicantError = null

      if (applicantProfile) {
        // Nếu đã có profile -> UPDATE
        console.log("Updating existing applicant profile...")
        const { error: updateError } = await supabase
          .from("applicant_profiles")
          .update(applicantData)
          .eq("user_id", user.id)

        applicantError = updateError
      } else {
        // Nếu chưa có profile -> INSERT
        console.log("Creating new applicant profile...")
        const { error: insertError } = await supabase
          .from("applicant_profiles")
          .insert(applicantData)

        applicantError = insertError
      }

      if (applicantError) {
        console.error("Applicant profile error:", applicantError)
        
        // Xử lý lỗi duplicate key cụ thể
        if (applicantError.code === '23505') { // PostgreSQL unique violation
          // Thử update lại nếu bị duplicate
          console.log("Duplicate key detected, trying update instead...")
          const { error: updateError } = await supabase
            .from("applicant_profiles")
            .update(applicantData)
            .eq("user_id", user.id)
          
          if (updateError) {
            throw new Error(`Lỗi trùng lặp hồ sơ: ${updateError.message}`)
          }
        } else {
          throw new Error(`Lỗi cập nhật hồ sơ ứng viên: ${applicantError.message}`)
        }
      }

      console.log("Applicant profile processed successfully")
      setSuccess(true)
      router.refresh()
      
      setTimeout(() => {
        setSuccess(false)
      }, 3000)

    } catch (err: any) {
      console.error("Full error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
 <form onSubmit={handleSubmit} className={styles.form}>
  <Card style={{padding:10}} className={styles.card}>
    <CardHeader className={styles.cardHeader}>
      <CardTitle className={styles.cardTitle}>
        {applicantProfile ? "Cập nhật hồ sơ" : "Tạo hồ sơ ứng viên"}
      </CardTitle>
      <CardDescription className={styles.cardDescription}>
        {applicantProfile 
          ? "Cập nhật thông tin cá nhân và nghề nghiệp của bạn" 
          : "Hoàn tất hồ sơ của bạn để bắt đầu ứng tuyển"}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className={styles.grid}>
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu bản thân</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card style={{padding:10}} className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>
            Thông tin nghề nghiệp
          </CardTitle>
          <CardDescription className={styles.cardDescription}>Cập nhật kinh nghiệm và kỹ năng của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={styles.grid}>
            <div className="space-y-2">
              <Label htmlFor="current_position">Vị trí hiện tại</Label>
              <Input
                id="current_position"
                placeholder="VD: Senior Developer"
                value={formData.current_position}
                onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Số năm kinh nghiệm</Label>
              <Input
                id="years_of_experience"
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => setFormData({ ...formData, years_of_experience: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <Label htmlFor="skills">Kỹ năng (phân cách bằng dấu phẩy)</Label>
            <Input
              id="skills"
              placeholder="VD: JavaScript, React, Node.js"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div className={styles.grid}>
            <div className="space-y-2">
              <Label htmlFor="city">Thành phố</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                  <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <div className="space-y-2">
              <Label htmlFor="expected_salary_min">Mức lương mong muốn (tối thiểu)</Label>
              <Input
                id="expected_salary_min"
                type="number"
                placeholder="VD: 10000000"
                value={formData.expected_salary_min}
                onChange={(e) => setFormData({ ...formData, expected_salary_min: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_salary_max">Mức lương mong muốn (tối đa)</Label>
              <Input
                id="expected_salary_max"
                type="number"
                placeholder="VD: 20000000"
                value={formData.expected_salary_max}
                onChange={(e) => setFormData({ ...formData, expected_salary_max: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className={styles.error}>{error}</p>}
  {success && <p className={styles.success}>Cập nhật thành công!</p>}

  <div className={styles.buttonGroup}>
    <Button type="submit" className={styles.submitButton} disabled={isLoading}>
      {isLoading ? "Đang xử lý..." : applicantProfile ? "Cập nhật hồ sơ" : "Tạo hồ sơ"}
    </Button>

    {applicantProfile && (
      <Button 
        type="button"
        variant="outline"
        className={styles.outlineButton}
        onClick={() => router.push("/applicant/cvs/new-profile")}
      >
        Tạo CV từ hồ sơ
      </Button>
    )}
  </div>
</form>
  )
}
