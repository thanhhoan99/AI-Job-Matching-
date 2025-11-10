"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet, Building2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface CheckoutFormProps {
  packageData: any
  user: any
  profile: any
}

export function CheckoutForm({ packageData, user, profile }: CheckoutFormProps) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          package_id: packageData.id,
          amount: packageData.price,
          status: "completed", // In production, this would be 'pending' until payment is confirmed
          payment_method: paymentMethod,
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      // Create or update user subscription
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + packageData.duration_days)

      const { error: subscriptionError } = await supabase.from("user_subscriptions").upsert({
        user_id: user.id,
        package_id: packageData.id,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
      })

      if (subscriptionError) throw subscriptionError

      // Update user AI credits
      const { error: creditsError } = await supabase.rpc("increment_ai_credits", {
        user_id: user.id,
        credits: packageData.ai_credits,
      })

      if (creditsError) throw creditsError

      toast.success("Thanh toán thành công!")
      router.push("/payment/success")
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Có lỗi xảy ra khi thanh toán")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
            <CardDescription>Chọn phương thức thanh toán</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5" />
                  <span>Thẻ tín dụng / Ghi nợ</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="e_wallet" id="e_wallet" />
                <Label htmlFor="e_wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Wallet className="h-5 w-5" />
                  <span>Ví điện tử (Momo, ZaloPay)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Building2 className="h-5 w-5" />
                  <span>Chuyển khoản ngân hàng</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "credit_card" && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="card_number">Số thẻ</Label>
                  <Input id="card_number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Ngày hết hạn</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin người mua</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" defaultValue={profile?.full_name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={profile?.email || user.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" defaultValue={profile?.phone || ""} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{packageData.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{packageData.description}</p>
              <ul className="space-y-2 text-sm">
                {packageData.features.slice(0, 3).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Giá gói</span>
                <span>{packageData.price.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT (10%)</span>
                <span>{(packageData.price * 0.1).toLocaleString("vi-VN")}đ</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span>{(packageData.price * 1.1).toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Bằng cách thanh toán, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
