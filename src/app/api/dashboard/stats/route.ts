import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/supabase/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get user's NFTs
    const nfts = await prisma.nFT.findMany({
      where: {
        ownerId: userId
      }
    })

    // Calculate stats
    const totalNFTs = nfts.length
    const totalValue = nfts.reduce((sum, nft) => sum + nft.price, 0)
    const totalCo2Offset = nfts.reduce((sum, nft) => sum + nft.co2Offset, 0)

    // Get recent activity (simplified for now)
    const recentActivity = nfts
      .slice(0, 5)
      .map(nft => ({
        description: `تم إنشاء NFT: ${nft.name}`,
        date: new Date(nft.createdAt).toLocaleDateString('ar-SA')
      }))

    const stats = {
      totalNFTs,
      totalValue,
      totalCo2Offset,
      recentActivity
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
