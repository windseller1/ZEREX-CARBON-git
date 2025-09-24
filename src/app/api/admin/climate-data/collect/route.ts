import { NextResponse } from 'next/server'
import { climateDataCollector } from '@/lib/climate-data-collector'

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
