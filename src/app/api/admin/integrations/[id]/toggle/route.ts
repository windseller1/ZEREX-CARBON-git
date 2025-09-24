import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/supabase/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { isActive } = body

    // تحديث حالة التكامل
    const integration = await prisma.integration.updateMany({
      where: { platformId: id },
      data: { isActive }
    })

    if (integration.count === 0) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error toggling integration:', error)
    return NextResponse.json(
      { error: 'Failed to toggle integration' },
      { status: 500 }
    )
  }
}
