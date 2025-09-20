'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface NFT {
  id: string
  tokenId: string
  name: string
  description: string | null
  imageUrl: string
  co2Offset: number
  price: number
  currency: string
  status: string
  createdAt: string
}

interface MyNFTsProps {
  userId: string
}

export default function MyNFTs({ userId }: MyNFTsProps) {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyNFTs()
  }, [userId])

  const fetchMyNFTs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/nfts/my?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setNfts(data.nfts)
      }
    } catch (error) {
      console.error('Error fetching my NFTs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (nftId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/nfts/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nftId, status: newStatus })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('تم تحديث حالة NFT بنجاح')
        fetchMyNFTs() // Refresh the list
      } else {
        toast.error(data.error || 'حدث خطأ أثناء تحديث الحالة')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الحالة')
    }
  }

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">NFTs الخاصة بي</h2>
        <a
          href="/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          إنشاء NFT جديد
        </a>
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد NFTs بعد
          </h3>
          <p className="text-gray-500 mb-4">
            ابدأ بإنشاء أول NFT لرصيد الكربون الخاص بك
          </p>
          <a
            href="/create"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            إنشاء NFT جديد
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* NFT Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nft.status)}`}>
                    {getStatusText(nft.status)}
                  </span>
                </div>
              </div>

              {/* NFT Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {nft.name}
                </h3>
                
                {nft.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {nft.description}
                  </p>
                )}

                {/* CO2 Offset */}
                <div className="flex items-center mb-3">
                  <span className="text-green-600 text-sm font-medium">
                    🌱 {nft.co2Offset} طن CO2
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {nft.price.toFixed(2)} {nft.currency}
                  </span>
                </div>

                {/* Status Actions */}
                <div className="space-y-2">
                  {nft.status === 'LISTED' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(nft.id, 'STAKED')}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        استثمار
                      </button>
                      <button
                        onClick={() => handleStatusChange(nft.id, 'SOLD')}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition text-sm"
                      >
                        تم البيع
                      </button>
                    </div>
                  )}
                  
                  {nft.status === 'STAKED' && (
                    <button
                      onClick={() => handleStatusChange(nft.id, 'LISTED')}
                      className="w-full bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition text-sm"
                    >
                      إعادة للبيع
                    </button>
                  )}
                </div>

                {/* Created Date */}
                <div className="mt-3 text-xs text-gray-500">
                  تم الإنشاء: {new Date(nft.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
