import { NextResponse } from 'next/server'
import { climateDataCollector } from '@/lib/climate-data-collector'

// الحصول على تحليل بيانات المناخ
export async function GET() {
  try {
    const analysis = await climateDataCollector.analyzeData()
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing climate data:', error)
    return NextResponse.json(
      { error: 'Failed to analyze climate data' },
      { status: 500 }
    )
  }
}
