import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/payment/checkout-form"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { package?: string }
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/payment/checkout")
  }

  if (!searchParams.package) {
    redirect("/pricing")
  }

  const { data: packageData } = await supabase
    .from("payment_packages")
    .select("*")
    .eq("id", searchParams.package)
    .eq("is_active", true)
    .single()

  if (!packageData) {
    redirect("/pricing")
  }

  const { data: profile } = await supabase.from("users").select("full_name, email, phone").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
        <CheckoutForm packageData={packageData} user={user} profile={profile} />
      </div>
    </div>
  )
}
