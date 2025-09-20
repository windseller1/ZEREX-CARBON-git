'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
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
    router.push('/')
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-700">Zyra Carbon</h1>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-700">
              Zyra Carbon
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/marketplace"
              className="text-gray-700 hover:text-green-600 transition"
            >
              السوق
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/create"
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  إنشاء NFT
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  لوحة التحكم
                </Link>
                
                {/* قائمة الإدارة */}
                <div className="relative group">
                  <button className="text-gray-700 hover:text-green-600 transition flex items-center">
                    الإدارة
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link href="/admin/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        محفظة الإدمن
                      </Link>
                      <Link href="/admin/integrations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        التكاملات
                      </Link>
                      <Link href="/admin/risk-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        إدارة المخاطر
                      </Link>
                  <Link href="/admin/economic-analysis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    التحليل الاقتصادي
                  </Link>
                  <Link href="/admin/climate-data" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    بيانات المناخ
                  </Link>
                  <Link href="/admin/social-media" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    وسائل التواصل الاجتماعي
                  </Link>
                    </div>
                  </div>
                </div>
                
                <span className="text-sm text-gray-600">مرحباً، {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
