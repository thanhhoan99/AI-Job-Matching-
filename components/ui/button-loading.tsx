// components/ui/button-loading.tsx
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ButtonLoadingProps {
  isLoading?: boolean
  children: React.ReactNode
  [key: string]: any
}

export function ButtonLoading({ isLoading, children, ...props }: ButtonLoadingProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        children
      )}
    </Button>
  )
}