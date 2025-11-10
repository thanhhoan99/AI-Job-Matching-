// // components/providers/auth-provider.tsx
// "use client"

// import { createContext, useContext, useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import type { User } from '@supabase/supabase-js'
// import { useLoading } from './loading-provider'

// interface AuthUser {
//   user: User | null
//   role: string | null
//   profile: any | null
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthUser>({
//   user: null,
//   role: null,
//   profile: null,
//   isLoading: true
// })

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [role, setRole] = useState<string | null>(null)
//   const [profile, setProfile] = useState<any | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const supabase = createClient()
// const { stopPersistentLoading } = useLoading()

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         // Get initial session
//         const { data: { session } } = await supabase.auth.getSession()
//         setUser(session?.user ?? null)

//         if (session?.user) {
//           // Get user profile and role
//           const { data: userProfile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single()
          
//           setProfile(userProfile)
//           setRole(userProfile?.role || 'applicant')
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error)
//       } finally {
//         setIsLoading(false)
//            setTimeout(stopPersistentLoading, 1000)
//       }
//     }

//     initializeAuth()

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null)
        
//         if (session?.user) {
//           // Optimistically set role from user_metadata first
//           const metadataRole = session.user.user_metadata?.role
//           setRole(metadataRole || 'applicant')
          
//           // Then fetch actual profile
//           const { data: userProfile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single()
          
//           setProfile(userProfile)
//           setRole(userProfile?.role || metadataRole || 'applicant')
//         } else {
//           setRole(null)
//           setProfile(null)
//         }
//         setIsLoading(false)
//           setTimeout(stopPersistentLoading, 1000)
//       }
//     )

//    return () => subscription.unsubscribe()
//   }, [supabase, stopPersistentLoading])


//   return (
//     <AuthContext.Provider value={{ user, role, profile, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
// components/providers/auth-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { useLoading } from './loading-provider'

interface AuthUser {
  user: User | null
  role: string | null
  profile: any | null
  isLoading: boolean
  session: Session | null
  refreshAuth: () => Promise<void> // Thêm hàm refresh
}

const AuthContext = createContext<AuthUser>({
  user: null,
  role: null,
  profile: null,
  isLoading: true,
  session: null,
  refreshAuth: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { stopPersistentLoading } = useLoading()

  // Hàm refresh auth - có thể gọi từ bất kỳ đâu
// Thêm vào auth-provider.tsx
let refreshTimeout: NodeJS.Timeout | null = null

const refreshAuth = async () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
  
  refreshTimeout = setTimeout(async () => {
    try {
      console.log('Manual auth refresh triggered')
      const { data: { session: newSession } } = await supabase.auth.getSession()
      
      // Chỉ update nếu session thực sự thay đổi
      if (newSession?.access_token !== session?.access_token) {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id)
        } else {
          setRole(null)
          setProfile(null)
        }
      }
    } catch (error) {
      console.error('Auth refresh error:', error)
    } finally {
      refreshTimeout = null
    }
  }, 500) // Debounce 500ms
}
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      setProfile(userProfile)
      setRole(userProfile?.role || 'applicant')
      return userProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // FORCE refresh session mỗi lần initialize
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)

          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
          setTimeout(stopPersistentLoading, 500)
        }
      }
    }

    initializeAuth()

    // Auth state change listener với debounce
    let refreshTimeout: NodeJS.Timeout

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return

        console.log('Auth state changed:', event)
        
        // Clear previous timeout
        if (refreshTimeout) clearTimeout(refreshTimeout)
        
        // Debounce để tránh multiple rapid updates
        refreshTimeout = setTimeout(() => {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
          
          if (currentSession?.user) {
            fetchUserProfile(currentSession.user.id)
          } else {
            setRole(null)
            setProfile(null)
          }
          
          setIsLoading(false)
          stopPersistentLoading()
        }, 100)
      }
    )

    // Cross-tab synchronization
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key?.startsWith('sb-') && event.newValue) {
        console.log('Auth state changed in another tab, refreshing...')
        refreshAuth()
      }
    }

    // Tab focus detection
  const handleVisibilityChange = () => {
  if (!document.hidden && mounted) {
    // Chỉ refresh nếu đã qua một khoảng thời gian nhất định
    const lastAuthCheck = localStorage.getItem('last_auth_check')
    const now = Date.now()
    
    if (!lastAuthCheck || (now - parseInt(lastAuthCheck)) > 30000) { // 30 giây
      console.log('Tab refocused, checking auth state...')
      localStorage.setItem('last_auth_check', now.toString())
      refreshAuth()
    }
  }
}


    window.addEventListener('storage', handleStorageSync)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      window.removeEventListener('storage', handleStorageSync)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (refreshTimeout) clearTimeout(refreshTimeout)
    }
  }, [supabase, stopPersistentLoading])

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      profile, 
      isLoading, 
      session,
      refreshAuth 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}