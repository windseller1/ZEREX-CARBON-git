'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center p-24">
        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">
          Zyra Carbon
        </h1>
        <p className="text-xl text-gray-700 mb-8 text-center max-w-2xl">
          تداول واصنع واستثمر رصيد الكربون كـ NFTs في سوق شفاف وآمن
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/marketplace"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
          >
            استكشاف السوق
          </Link>
          <Link
            href="/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
          >
            إنشاء NFT
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            لماذا Zyra Carbon؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                رصيد كربون موثق
              </h3>
              <p className="text-gray-600">
                جميع NFTs موثقة ومتحققة من مصادر رصيد الكربون المعتمدة
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                أمان وشفافية
              </h3>
              <p className="text-gray-600">
                تقنية البلوك تشين تضمن الأمان والشفافية في جميع المعاملات
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                تداول سهل
              </h3>
              <p className="text-gray-600">
                منصة سهلة الاستخدام لتداول رصيد الكربون بسرعة وأمان
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}