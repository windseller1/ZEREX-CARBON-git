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

    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const co2Offset = parseFloat(formData.get('co2Offset') as string)
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!name || !description || !co2Offset || !price || !currency || !imageFile) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Generate unique token ID
    const tokenId = `CARBON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // For now, we'll use a placeholder image URL
    // In a real app, you'd upload to IPFS or a cloud storage service
    const imageUrl = `https://via.placeholder.com/400x300/10B981/FFFFFF?text=${encodeURIComponent(name)}`

    // Create NFT
    const nft = await prisma.nFT.create({
      data: {
        tokenId,
        name,
        description,
        imageUrl,
        co2Offset,
        price,
        currency,
        ownerId: decoded.userId,
        status: 'LISTED'
      }
    })

    return NextResponse.json({
      success: true,
      nft,
      message: 'NFT created successfully'
    })
  } catch (error) {
    console.error('Error creating NFT:', error)
    return NextResponse.json(
      { error: 'Failed to create NFT' },
      { status: 500 }
    )
  }
}
