// "use client"

// import type React from "react"

// import { createClient } from "@/lib/supabase/client"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useState } from "react"
// import Header from "@/components/Layout/Header"
// import Footer from "@/components/Layout/Footer"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const supabase = createClient()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       })

//       if (error) throw error

//       // Get user profile to determine role
//       const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

//       // Redirect based on role
//       if (profile?.role === "applicant") {
//         router.push("/applicant/")
//       } else if (profile?.role === "employer") {
//         router.push("/employer/dashboard")
//       } else if (profile?.role === "admin") {
//         router.push("/admin/dashboard")
//       } else {
//         router.push("/")
//       }
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "Đã xảy ra lỗi")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <Header />

//       <section className="section-box mt-50">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6 col-md-8 mx-auto">
//               <div className="card-grid-1 bg-9 p-40">
//                 <div className="text-center">
//                   <h3 className="text-24">Đăng Nhập Tài Khoản</h3>
//                 </div>
//                 <div className="form-contact">
//                   <form onSubmit={handleLogin}>
//                     <div className="row">
//                       <div className="col-lg-12">
//                         <div className="form-group">
//                           <label className="text-14">Email</label>
//                           <input
//                             className="form-control"
//                             type="email"
//                             placeholder="email@example.com"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-12">
//                         <div className="form-group">
//                           <label className="text-14">Mật khẩu</label>
//                           <input
//                             className="form-control"
//                             type="password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                           />
//                         </div>
//                       </div>
                      
//                       {error && (
//                         <div className="col-lg-12">
//                           <div className="alert alert-danger" role="alert">
//                             {error}
//                           </div>
//                         </div>
//                       )}
                      
//                       <div className="col-lg-12">
//                         <div className="form-group">
//                           <button 
//                             type="submit" 
//                             className="btn btn-default btn-brand icon-tick btn-full"
//                             disabled={isLoading}
//                           >
//                             {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
//                           </button>
//                         </div>
//                       </div>
                      
//                       <div className="col-lg-12 text-center">
//                         <span className="text-mutted">
//                           Chưa có tài khoản?{" "}
//                           <Link 
//                             href="/auth/sign-up"
//                             className="color-brand-1"
//                           >
//                             Đăng ký ngay
//                           </Link>
//                         </span>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   )
// }

// "use client";

// import React, { Suspense, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuthLoading } from "@/hooks/use-auth-loading";
// import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";

// // ==========================
// // Component con: LoginForm
// // (được bao trong Suspense)
// // ==========================
// function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get("redirect") || "/";
//   // const { startAuthLoading, stopAuthLoading } = useAuthLoading();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const supabase = createClient();
//     setIsLoading(true);
//     setError(null);

//     try {
//       // startAuthLoading();

//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       // Lấy role của user từ bảng profiles
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", data.user.id)
//         .single();

//       // Điều hướng dựa vào role
//       let targetPath = redirect;
//       if (redirect === "/") {
//         if (profile?.role === "applicant") targetPath = "/applicant/dashboard";
//         else if (profile?.role === "employer") targetPath = "/employer/dashboard";
//         else if (profile?.role === "admin") targetPath = "/admin/dashboard";
//       }

//       router.push(targetPath);
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
//       setIsLoading(false);
//       // stopAuthLoading();
//     }
//   };

//   return (
//     <section className="section-box mt-50">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-6 col-md-8 mx-auto">
//             <div className="card-grid-1 bg-9 p-40">
//               <div className="text-center mb-4">
//                 <h3 className="text-24 font-semibold">Đăng Nhập Tài Khoản</h3>
//                 <p className="text-muted mt-2">
//                   Nhập email và mật khẩu để truy cập tài khoản của bạn
//                 </p>
//               </div>

//               <form onSubmit={handleLogin}>
//                 <div className="form-group mb-3">
//                   <label className="text-14">Email</label>
//                   <input
//                     className="form-control"
//                     type="email"
//                     placeholder="email@example.com"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>

//                 <div className="form-group mb-3">
//                   <label className="text-14">Mật khẩu</label>
//                   <input
//                     className="form-control"
//                     type="password"
//                     placeholder="••••••••"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 {error && (
//                   <div className="alert alert-danger text-center mb-3">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   className="btn btn-default btn-brand icon-tick btn-full"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
//                 </button>

//                 <div className="text-center mt-3">
//                   <span className="text-muted">
//                     Chưa có tài khoản?{" "}
//                     <Link
//                       href="/auth/sign-up"
//                       className="color-brand-1"
//                     >
//                       Đăng ký ngay
//                     </Link>
//                   </span>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function LoginPage() {
//   return (
//     <>
//       <Header />

//       {/* Suspense để bọc component có useSearchParams */}
//       <Suspense fallback={<div className="text-center mt-10">Đang tải...</div>}>
//         <LoginForm />
//       </Suspense>

//       <Footer />
//     </>
//   );
// }


// app/auth/login/page.tsx
"use client";

import React, { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthLoading } from "@/hooks/use-auth-loading";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { startAuthLoading } = useAuthLoading();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Bắt đầu loading toàn cục
      startAuthLoading();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Vui lòng xác nhận email trước khi đăng nhập");
        } else {
          throw error;
        }
      }

      if (!data.user) {
        throw new Error("Đăng nhập thất bại");
      }

      // Lấy thông tin profile để xác định role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_verified")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Lỗi khi lấy thông tin profile:", profileError);
      }

      // Điều hướng dựa vào role và redirect
      let targetPath = redirect;
      
      if (redirect === "/" || redirect === "/auth/login") {
        if (profile?.role === "applicant") {
          targetPath = "/applicant/dashboard";
        } else if (profile?.role === "employer") {
          targetPath = "/employer/dashboard";
        } else if (profile?.role === "admin") {
          targetPath = "/admin/dashboard";
        }
      }

      // Loading toàn cục sẽ tự động kết thúc khi trang chuyển hướng
      // Sử dụng window.location.replace để tránh vấn đề cache
      window.location.replace(targetPath);

    } catch (error: unknown) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng nhập");
      setIsLoading(false);
      
      // Trong trường hợp lỗi, reload trang để dừng loading toàn cục
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDemoLogin = (role: "applicant" | "employer") => {
    if (role === "applicant") {
      setEmail("demo_applicant@example.com");
      setPassword("demopassword123");
    } else {
      setEmail("demo_employer@example.com");
      setPassword("demopassword123");
    }
  };

  return (
    <>
      <Header />
      
      <section className="section-box mt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8 mx-auto">
              <div className="card-grid-1 bg-9 p-40">
                <div className="text-center mb-4">
                  <h3 className="text-24 font-semibold">Đăng Nhập</h3>
                  <p className="text-muted mt-2">
                    Đăng nhập để truy cập vào tài khoản của bạn
                  </p>
                </div>

                {/* Demo Accounts - Chỉ hiển thị trong môi trường development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="demo-accounts mb-4 p-3 border rounded">
                    <p className="text-sm font-semibold mb-2">Tài khoản demo:</p>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => handleDemoLogin("applicant")}
                        className="btn btn-sm btn-outline"
                        disabled={isLoading}
                      >
                        Ứng viên Demo
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDemoLogin("employer")}
                        className="btn btn-sm btn-outline"
                        disabled={isLoading}
                      >
                        Nhà tuyển dụng Demo
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-group mb-3">
                    <label className="text-14 font-medium">Email</label>
                    <input
                      className="form-control mt-1"
                      type="email"
                      placeholder="Nhập email của bạn"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="text-14 font-medium">Mật khẩu</label>
                    <input
                      className="form-control mt-1"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-14">Ghi nhớ đăng nhập</span>
                    </label>
                    
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-14 color-brand-1 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {error && (
                    <div className="alert alert-danger text-center mb-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-default btn-brand icon-tick btn-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng Nhập"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Hoặc</span>
                      </div>
                    </div>

                    <p className="text-muted">
                      Chưa có tài khoản?{" "}
                      <Link
                        href="/auth/sign-up"
                        className="color-brand-1 font-semibold hover:underline"
                      >
                        Đăng ký ngay
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner-border text-brand-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}