'use client'

import { useState } from 'react'
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
  owner: {
    username: string
  }
}

interface NFTCardProps {
  nft: NFT
}

export default function NFTCard({ nft }: NFTCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً')
        return
      }

      const response = await fetch('/api/nfts/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nftId: nft.id })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('تم شراء NFT بنجاح!')
        // Refresh the page or update the state
        window.location.reload()
      } else {
        toast.error(result.error || 'حدث خطأ أثناء الشراء')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الشراء')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return `${price.toFixed(2)} ${currency}`
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(nft.price, nft.currency)}
          </span>
        </div>

        {/* Owner */}
        <div className="text-sm text-gray-500 mb-4">
          المالك: {nft.owner.username}
        </div>

        {/* Buy Button */}
        {nft.status === 'LISTED' && (
          <button
            onClick={handleBuy}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'جاري المعالجة...' : 'شراء الآن'}
          </button>
        )}
      </div>
    </div>
  )
}
