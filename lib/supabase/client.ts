// // lib/supabase/client.ts
// import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

// export function createBrowserClient() {
//   return createSupabaseBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!, 
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// }

// export const createClient = createBrowserClient

// // Thêm các helper functions
// export async function getSession() {
//   const supabase = createBrowserClient()
//   const { data: { session } } = await supabase.auth.getSession()
//   return session
// }

// export async function getUser() {
//   const supabase = createBrowserClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   return user
// }
// lib/supabase/client.ts
// import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

// export function createBrowserClient() {
//   return createSupabaseBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!, 
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//         detectSessionInUrl: false,
//         flowType: 'pkce',
      
//         storage: {
//           getItem: (key) => {
//             try {
//               return localStorage.getItem(key)
//             } catch {
//               return null
//             }
//           },
//           setItem: (key, value) => {
//             try {
//               localStorage.setItem(key, value)
//             } catch {
//               // Ignore errors
//             }
//           },
//           removeItem: (key) => {
//             try {
//               localStorage.removeItem(key)
//             } catch {
//               // Ignore errors
//             }
//           }
//         }
//       },
//       global: {
//         // Thêm timeout cho tất cả requests
//         fetch: (url, options = {}) => {
//           const controller = new AbortController()
//           const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

//           return fetch(url, {
//             ...options,
//             signal: controller.signal
//           }).finally(() => clearTimeout(timeoutId))
//         }
//       }
//     }
//   )
// }

// export const createClient = createBrowserClient

// // Helper functions với error handling tốt hơn
// export async function getSession() {
//   try {
//     const supabase = createBrowserClient()
//     const { data: { session }, error } = await supabase.auth.getSession()
    
//     if (error) {
//       console.error('Get session error:', error)
//       return null
//     }
    
//     return session
//   } catch (error) {
//     console.error('Get session exception:', error)
//     return null
//   }
// }

// export async function getUser() {
//   try {
//     const supabase = createBrowserClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
    
//     if (error) {
//       console.error('Get user error:', error)
//       return null
//     }
    
//     return user
//   } catch (error) {
//     console.error('Get user exception:', error)
//     return null
//   }
// }

// // Hàm refresh session mạnh mẽ
// export async function refreshSession() {
//   try {
//     const supabase = createBrowserClient()
//     const { data: { session }, error } = await supabase.auth.refreshSession()
    
//     if (error) {
//       console.error('Refresh session error:', error)
//       throw error
//     }
    
//     return session
//   } catch (error) {
//     console.error('Refresh session exception:', error)
//     throw error
//   }
// }
// import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

// export function createBrowserClient() {
//   return createSupabaseBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
// }

// export const createClient = createBrowserClient

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
      global: {
        fetch: (...args) => fetch(...args),
      }
    }
  )
}
export const createClient = createBrowserClient