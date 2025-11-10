// components/providers/loading-provider.tsx
"use client"

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface LoadingContextType {
  isLoading: boolean
  persistentLoading: boolean
  setLoading: (loading: boolean) => void
  startLoading: () => void
  stopLoading: () => void
  startPersistentLoading: () => void
  stopPersistentLoading: () => void
  // Thêm hàm mới để bắt đầu loading mà KHÔNG tự động dừng
  startUnstoppableLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  persistentLoading: false,
  setLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
  startPersistentLoading: () => {},
  stopPersistentLoading: () => {},
  startUnstoppableLoading: () => {}
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [persistentLoading, setPersistentLoading] = useState(false)
  const [unstoppableLoading, setUnstoppableLoading] = useState(false)


   useEffect(() => {
    let timeout: NodeJS.Timeout
    if (unstoppableLoading) {
      // Tự động reset sau 30 giây để tránh treo vĩnh viễn
      timeout = setTimeout(() => {
        console.warn('Unstoppable loading auto-reset after 30s')
        setUnstoppableLoading(false)
      }, 1000)
    }
    return () => clearTimeout(timeout)
  }, [unstoppableLoading])

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const startPersistentLoading = useCallback(() => {
    setPersistentLoading(true)
  }, [])

  const stopPersistentLoading = useCallback(() => {
    setPersistentLoading(false)
  }, [])

  // Loading KHÔNG BAO GIỜ tự động dừng - chỉ dừng khi trang được reload hoặc chuyển hướng hoàn toàn
  const startUnstoppableLoading = useCallback(() => {
    setUnstoppableLoading(true)
  }, [])

  // Kết hợp tất cả các loại loading
  const showLoading = isLoading || persistentLoading || unstoppableLoading

  return (
    <LoadingContext.Provider value={{ 
      isLoading: showLoading,
      persistentLoading,
      setLoading, 
      startLoading, 
      stopLoading,
      startPersistentLoading,
      stopPersistentLoading,
      startUnstoppableLoading
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}