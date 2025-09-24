import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/supabase/prisma'

export async function POST(request: NextRequest) {
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

    const { nftId, status } = await request.json()

    if (!nftId || !status) {
      return NextResponse.json(
        { error: 'NFT ID and status are required' },
        { status: 400 }
      )
    }

    // Check if NFT exists and belongs to user
    const nft = await prisma.nFT.findFirst({
      where: {
        id: nftId,
        ownerId: decoded.userId
      }
    })

    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update NFT status
    const updatedNFT = await prisma.nFT.update({
      where: {
        id: nftId
      },
      data: {
        status
      }
    })

    return NextResponse.json({
      success: true,
      nft: updatedNFT,
      message: 'NFT status updated successfully'
    })
  } catch (error) {
    console.error('Error updating NFT status:', error)
    return NextResponse.json(
      { error: 'Failed to update NFT status' },
      { status: 500 }
    )
  }
}
