import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import Header from '@/components/Layout/Header'
import  Footer  from '@/components/Layout/Footer'
import { AuthProvider } from '@/components/providers/auth-provider'
import { LoadingProvider } from '@/components/providers/loading-provider'
import { GlobalLoading } from '@/components/ui/global-loading'
import { RouteLoading } from '@/components/providers/route-loading'
import { AuthSyncProvider } from '@/components/providers/auth-sync-provider'
import  ChatWidget  from '@/components/chat/ChatWidget'
// import "@/public/assets/css/style.css";

export const metadata: Metadata = {
  title: 'JobConnect - Tìm việc làm & Tuyển dụng',
  description: 'Kết nối nhà tuyển dụng và ứng viên',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        
          <LoadingProvider>
          <AuthProvider>
             <AuthSyncProvider> 
            <GlobalLoading />
           
              {/* <RootHeaderWrapper /> */}
            <main className="min-h-screen">
              {children}
            
            </main>

              <ChatWidget />
            {/* <Footer /> */}
            <Analytics />
              </AuthSyncProvider>
          </AuthProvider>
        </LoadingProvider>
        
      </body>
    </html>
  )
}
// Component wrapper để quyết định có hiển thị Header hay không
