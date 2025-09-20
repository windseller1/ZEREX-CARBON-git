import { NextResponse } from 'next/server'
import { riskManager } from '@/lib/risk-management'

// الحصول على تحليل المخاطر
export async function GET() {
  try {
    const analysis = await riskManager.analyzeRisks()
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing risks:', error)
    return NextResponse.json(
      { error: 'Failed to analyze risks' },
      { status: 500 }
    )
  }
}
