import { NextResponse } from 'next/server'
import { climateDataCollector } from '@/lib/climate-data-collector'

// الحصول على بيانات المناخ
export async function GET() {
  try {
    const data = await climateDataCollector.getStoredData(100)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching climate data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch climate data' },
      { status: 500 }
    )
  }
}

// جمع بيانات المناخ
export async function POST() {
  try {
    const allData = await climateDataCollector.collectAllData()
    const result = await climateDataCollector.saveAllData(allData)
    
    return NextResponse.json({
      success: true,
      saved: result.saved,
      failed: result.failed,
      total: allData.length
    })
  } catch (error) {
    console.error('Error collecting climate data:', error)
    return NextResponse.json(
      { error: 'Failed to collect climate data' },
      { status: 500 }
    )
  }
}
