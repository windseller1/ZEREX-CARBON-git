import { NextRequest, NextResponse } from 'next/server'
import { riskManager } from '@/lib/risk-management'

// تحديث مخاطر
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const updatedRisk = await riskManager.updateRisk(id, body)
    
    if (!updatedRisk) {
      return NextResponse.json(
        { error: 'Risk not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedRisk)
  } catch (error) {
    console.error('Error updating risk:', error)
    return NextResponse.json(
      { error: 'Failed to update risk' },
      { status: 500 }
    )
  }
}

// حذف مخاطر
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const success = await riskManager.deleteRisk(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete risk' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting risk:', error)
    return NextResponse.json(
      { error: 'Failed to delete risk' },
      { status: 500 }
    )
  }
}
