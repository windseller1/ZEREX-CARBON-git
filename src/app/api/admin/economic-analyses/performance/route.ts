import { NextResponse } from 'next/server'
import { economicAnalyzer } from '@/lib/risk-management'

// الحصول على تحليل الأداء المالي
export async function GET() {
  try {
    const performance = await economicAnalyzer.analyzePerformance()
    return NextResponse.json(performance)
  } catch (error) {
    console.error('Error analyzing performance:', error)
    return NextResponse.json(
      { error: 'Failed to analyze performance' },
      { status: 500 }
    )
  }
}
