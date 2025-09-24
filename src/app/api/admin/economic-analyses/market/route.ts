import { NextResponse } from 'next/server'
import { economicAnalyzer } from '@/lib/risk-management'

// الحصول على تحليل السوق الأوروبي
export async function GET() {
  try {
    const marketAnalysis = await economicAnalyzer.analyzeEuropeanMarket()
    return NextResponse.json(marketAnalysis)
  } catch (error) {
    console.error('Error analyzing European market:', error)
    return NextResponse.json(
      { error: 'Failed to analyze European market' },
      { status: 500 }
    )
  }
}
