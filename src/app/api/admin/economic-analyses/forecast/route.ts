import { NextRequest, NextResponse } from 'next/server'
import { economicAnalyzer } from '@/lib/risk-management'

// الحصول على توقع الأرباح المستقبلية
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '12')

    const forecast = await economicAnalyzer.forecastProfits(months)
    return NextResponse.json(forecast)
  } catch (error) {
    console.error('Error forecasting profits:', error)
    return NextResponse.json(
      { error: 'Failed to forecast profits' },
      { status: 500 }
    )
  }
}
