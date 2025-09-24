import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/supabase/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minCo2 = searchParams.get('minCo2')
    const maxCo2 = searchParams.get('maxCo2')
    const currency = searchParams.get('currency')

    // Build where clause
    const where: any = {
      status: 'LISTED' // Only show listed NFTs
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (minCo2 || maxCo2) {
      where.co2Offset = {}
      if (minCo2) where.co2Offset.gte = parseFloat(minCo2)
      if (maxCo2) where.co2Offset.lte = parseFloat(maxCo2)
    }

    if (currency && currency !== 'all') {
      where.currency = currency
    }

    const nfts = await prisma.nFT.findMany({
      where,
      include: {
        owner: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      nfts
    })
  } catch (error) {
    console.error('Error fetching NFTs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}
