import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(2)} ${currency}`
}

export function formatCo2Offset(co2Offset: number): string {
  return `${co2Offset.toFixed(1)} طن CO2`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateTokenId(): string {
  return `CARBON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  // At least 6 characters
  return password.length >= 6
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'LISTED':
      return 'bg-green-100 text-green-800'
    case 'SOLD':
      return 'bg-red-100 text-red-800'
    case 'STAKED':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'LISTED':
      return 'متاح للبيع'
    case 'SOLD':
      return 'تم البيع'
    case 'STAKED':
      return 'مستثمر'
    default:
      return status
  }
}
