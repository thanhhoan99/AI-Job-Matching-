"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import Header from "@/components/Layout/Header"
import Footer from "@/components/Layout/Footer"

function SignUpForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"applicant" | "employer">(
    (searchParams.get("role") as "applicant" | "employer") || "applicant",
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      {/* <section className="section-box">
        <div className="banner-hero bg-9">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="block-banner">
                  <h1 className="heading-banner">Đăng Ký</h1>
                  <div className="banner-description mt-20">
                    Tạo tài khoản mới để bắt đầu hành trình tìm việc hoặc tuyển dụng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="section-box mt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8 mx-auto">
              <div className="card-grid-1 bg-9 p-40">
                <div className="text-center">
                  <h3 className="text-24">Tạo Tài Khoản Mới</h3>
                </div>
                <div className="form-contact">
                  <form onSubmit={handleSignUp}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-14">Họ và tên</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-14">Email</label>
                          <input
                            className="form-control"
                            type="email"
                            placeholder="email@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-14">Mật khẩu</label>
                          <input
                            className="form-control"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-14">Loại tài khoản</label>
                          <div className="role-selection mt-2">
                            <div className="row">
                              <div className="col-6">
                                <div 
                                  className={`role-option text-center p-3 border-radius-10 cursor-pointer ${
                                    role === "applicant" 
                                      ? "bg-brand-2 text-white" 
                                      : "bg-15 border"
                                  }`}
                                  onClick={() => setRole("applicant")}
                                >
                                  <div className="fi-rr-user mb-2"></div>
                                  <div className="text-12 font-semibold">Ứng viên tìm việc</div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div 
                                  className={`role-option text-center p-3 border-radius-10 cursor-pointer ${
                                    role === "employer" 
                                      ? "bg-brand-2 text-white" 
                                      : "bg-15 border"
                                  }`}
                                  onClick={() => setRole("employer")}
                                >
                                  <div className="fi-rr-briefcase mb-2"></div>
                                  <div className="text-12 font-semibold">Nhà tuyển dụng</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="col-lg-12">
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        </div>
                      )}
                      
                      <div className="col-lg-12">
                        <div className="form-group">
                          <button 
                            type="submit" 
                            className="btn btn-default btn-brand icon-tick btn-full"
                            disabled={isLoading}
                          >
                            {isLoading ? "Đang tạo tài khoản..." : "Đăng Ký"}
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-lg-12 text-center">
                        <span className="text-mutted">
                          Đã có tài khoản?{" "}
                          <Link href="/auth/login" className="color-brand-1">
                            Đăng nhập
                          </Link>
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="section-box">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-brand-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}