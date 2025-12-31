import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function calculateExperienceLevel(years: number) {
  if (years < 1) return { label: 'Fresher', variant: 'outline' as const }
  if (years < 3) return { label: 'Junior', variant: 'secondary' as const }
  if (years < 5) return { label: 'Middle', variant: 'default' as const }
  if (years < 8) return { label: 'Senior', variant: 'default' as const }
  return { label: 'Expert', variant: 'default' as const }
}

export function createQueryString(
  params: Record<string, string | number | null>,
  searchParams?: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString())
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, String(value))
    }
  })
  
  return newSearchParams.toString()
}