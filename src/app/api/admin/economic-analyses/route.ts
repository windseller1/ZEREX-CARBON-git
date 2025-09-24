import { NextRequest, NextResponse } from 'next/server'
import { economicAnalyzer } from '@/lib/risk-management'

// الحصول على جميع التحليلات الاقتصادية
export async function GET() {
  try {
    const analyses = await economicAnalyzer.getAnalyses()
    return NextResponse.json(analyses)
  } catch (error) {
    console.error('Error fetching economic analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch economic analyses' },
      { status: 500 }
    )
  }
}

// إضافة تحليل اقتصادي جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { period, revenue, costs, profit, profitMargin, carbonCreditsSold, averagePrice, marketShare, growthRate } = body

    // التحقق من صحة البيانات
    if (!period || revenue === undefined || costs === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // حساب الأرباح وهامش الربح إذا لم يتم توفيرها
    const calculatedProfit = profit !== undefined ? profit : revenue - costs
    const calculatedProfitMargin = profitMargin !== undefined ? profitMargin : (calculatedProfit / revenue) * 100

    // إنشاء التحليل الاقتصادي
    const analysis = await economicAnalyzer.addAnalysis({
      period,
      revenue,
      costs,
      profit: calculatedProfit,
      profitMargin: calculatedProfitMargin,
      carbonCreditsSold: carbonCreditsSold || 0,
      averagePrice: averagePrice || 0,
      marketShare: marketShare || 0,
      growthRate: growthRate || 0
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error creating economic analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create economic analysis' },
      { status: 500 }
    )
  }
}
