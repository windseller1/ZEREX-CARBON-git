import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/supabase/prisma'
import { riskManager } from '@/lib/risk-management'

// الحصول على جميع المخاطر
export async function GET() {
  try {
    const risks = await riskManager.getRisks()
    return NextResponse.json(risks)
  } catch (error) {
    console.error('Error fetching risks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch risks' },
      { status: 500 }
    )
  }
}

// إضافة مخاطر جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, level, description, probability, impact, mitigation } = body

    // التحقق من صحة البيانات
    if (!type || !level || !description || probability === undefined || impact === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // إنشاء المخاطر
    const risk = await riskManager.addRisk({
      type,
      level,
      description,
      probability,
      impact,
      mitigation: mitigation || '',
      status: 'active'
    })

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Error creating risk:', error)
    return NextResponse.json(
      { error: 'Failed to create risk' },
      { status: 500 }
    )
  }
}
