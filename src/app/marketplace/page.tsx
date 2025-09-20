'use client'

import { useState, useEffect } from 'react'
import { prisma } from '@/lib/supabase/prisma'
import NFTCard from '@/components/marketplace/NFTCard'
import SearchFilters from '@/components/marketplace/SearchFilters'

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

export default function MarketplacePage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minCo2: '',
    maxCo2: '',
    currency: 'all'
  })

  useEffect(() => {
    fetchNFTs()
  }, [filters])

  const fetchNFTs = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice)
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice)
      if (filters.minCo2) queryParams.append('minCo2', filters.minCo2)
      if (filters.maxCo2) queryParams.append('maxCo2', filters.maxCo2)
      if (filters.currency !== 'all') queryParams.append('currency', filters.currency)

      const response = await fetch(`/api/nfts?${queryParams.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setNfts(data.nfts)
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">سوق رصيد الكربون</h1>
          <p className="mt-2 text-gray-600">
            اكتشف وتداول رصيد الكربون كـ NFTs في سوق شفاف وآمن
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* NFTs Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : nfts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🌱</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد NFTs متاحة حالياً
                </h3>
                <p className="text-gray-500">
                  تحقق مرة أخرى لاحقاً أو قم بإنشاء NFT جديد
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
