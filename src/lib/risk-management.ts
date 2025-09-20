import { prisma } from './supabase/prisma'

// أنواع المخاطر
export enum RiskType {
  MARKET = 'market',
  CREDIT = 'credit',
  OPERATIONAL = 'operational',
  LIQUIDITY = 'liquidity',
  REGULATORY = 'regulatory',
  TECHNOLOGY = 'technology'
}

// مستويات المخاطر
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// واجهة المخاطر
export interface Risk {
  id: string
  type: RiskType
  level: RiskLevel
  description: string
  probability: number // 0-100
  impact: number // 0-100
  mitigation: string
  status: 'active' | 'mitigated' | 'resolved'
  createdAt: Date
  updatedAt: Date
}

// واجهة التحليل الاقتصادي
export interface EconomicAnalysis {
  id: string
  period: string
  revenue: number
  costs: number
  profit: number
  profitMargin: number
  carbonCreditsSold: number
  averagePrice: number
  marketShare: number
  growthRate: number
  createdAt: Date
}

// إدارة المخاطر
export class RiskManager {
  // إضافة مخاطر جديدة
  async addRisk(risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>): Promise<Risk> {
    const newRisk = await prisma.risk.create({
      data: {
        type: risk.type,
        level: risk.level,
        description: risk.description,
        probability: risk.probability,
        impact: risk.impact,
        mitigation: risk.mitigation,
        status: risk.status
      }
    })

    return {
      id: newRisk.id,
      type: newRisk.type as RiskType,
      level: newRisk.level as RiskLevel,
      description: newRisk.description,
      probability: newRisk.probability,
      impact: newRisk.impact,
      mitigation: newRisk.mitigation,
      status: newRisk.status as 'active' | 'mitigated' | 'resolved',
      createdAt: newRisk.createdAt,
      updatedAt: newRisk.updatedAt
    }
  }

  // الحصول على جميع المخاطر
  async getRisks(): Promise<Risk[]> {
    const risks = await prisma.risk.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return risks.map(risk => ({
      id: risk.id,
      type: risk.type as RiskType,
      level: risk.level as RiskLevel,
      description: risk.description,
      probability: risk.probability,
      impact: risk.impact,
      mitigation: risk.mitigation,
      status: risk.status as 'active' | 'mitigated' | 'resolved',
      createdAt: risk.createdAt,
      updatedAt: risk.updatedAt
    }))
  }

  // تحديث مخاطر
  async updateRisk(id: string, updates: Partial<Risk>): Promise<Risk | null> {
    const updatedRisk = await prisma.risk.update({
      where: { id },
      data: {
        type: updates.type,
        level: updates.level,
        description: updates.description,
        probability: updates.probability,
        impact: updates.impact,
        mitigation: updates.mitigation,
        status: updates.status
      }
    })

    return {
      id: updatedRisk.id,
      type: updatedRisk.type as RiskType,
      level: updatedRisk.level as RiskLevel,
      description: updatedRisk.description,
      probability: updatedRisk.probability,
      impact: updatedRisk.impact,
      mitigation: updatedRisk.mitigation,
      status: updatedRisk.status as 'active' | 'mitigated' | 'resolved',
      createdAt: updatedRisk.createdAt,
      updatedAt: updatedRisk.updatedAt
    }
  }

  // حذف مخاطر
  async deleteRisk(id: string): Promise<boolean> {
    try {
      await prisma.risk.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error('Error deleting risk:', error)
      return false
    }
  }

  // تحليل المخاطر
  async analyzeRisks(): Promise<{
    totalRisks: number
    criticalRisks: number
    highRisks: number
    mediumRisks: number
    lowRisks: number
    riskScore: number
  }> {
    const risks = await this.getRisks()
    
    const totalRisks = risks.length
    const criticalRisks = risks.filter(r => r.level === RiskLevel.CRITICAL).length
    const highRisks = risks.filter(r => r.level === RiskLevel.HIGH).length
    const mediumRisks = risks.filter(r => r.level === RiskLevel.MEDIUM).length
    const lowRisks = risks.filter(r => r.level === RiskLevel.LOW).length

    // حساب نقاط المخاطر
    const riskScore = risks.reduce((score, risk) => {
      const levelScore = {
        [RiskLevel.LOW]: 1,
        [RiskLevel.MEDIUM]: 2,
        [RiskLevel.HIGH]: 3,
        [RiskLevel.CRITICAL]: 4
      }[risk.level]

      return score + (levelScore * risk.probability * risk.impact / 10000)
    }, 0)

    return {
      totalRisks,
      criticalRisks,
      highRisks,
      mediumRisks,
      lowRisks,
      riskScore: Math.round(riskScore * 100) / 100
    }
  }

  // اقتراحات التخفيف من المخاطر
  async getMitigationSuggestions(riskType: RiskType): Promise<string[]> {
    const suggestions: { [key in RiskType]: string[] } = {
      [RiskType.MARKET]: [
        'تنويع محفظة رصيد الكربون',
        'مراقبة أسعار السوق باستمرار',
        'استخدام أدوات التحوط المالي',
        'تطوير استراتيجيات بيع متعددة'
      ],
      [RiskType.CREDIT]: [
        'التحقق من صحة العملاء قبل المعاملات',
        'استخدام ضمانات مالية',
        'تطبيق حدود ائتمانية',
        'مراقبة التدفقات المالية'
      ],
      [RiskType.OPERATIONAL]: [
        'تطوير خطط الطوارئ',
        'تدريب الموظفين على الأمان',
        'استخدام أنظمة النسخ الاحتياطي',
        'مراقبة العمليات باستمرار'
      ],
      [RiskType.LIQUIDITY]: [
        'الحفاظ على احتياطي نقدي',
        'تطوير خطوط ائتمان',
        'تنويع مصادر التمويل',
        'مراقبة التدفقات النقدية'
      ],
      [RiskType.REGULATORY]: [
        'مراقبة التغييرات التنظيمية',
        'الامتثال للمعايير الدولية',
        'تطوير سياسات الامتثال',
        'التواصل مع الجهات التنظيمية'
      ],
      [RiskType.TECHNOLOGY]: [
        'تطبيق أمان متعدد الطبقات',
        'استخدام التشفير المتقدم',
        'مراقبة الأنظمة باستمرار',
        'تطوير خطط الاسترداد'
      ]
    }

    return suggestions[riskType] || []
  }
}

// التحليل الاقتصادي
export class EconomicAnalyzer {
  // إضافة تحليل اقتصادي
  async addAnalysis(analysis: Omit<EconomicAnalysis, 'id' | 'createdAt'>): Promise<EconomicAnalysis> {
    const newAnalysis = await prisma.economicAnalysis.create({
      data: {
        period: analysis.period,
        revenue: analysis.revenue,
        costs: analysis.costs,
        profit: analysis.profit,
        profitMargin: analysis.profitMargin,
        carbonCreditsSold: analysis.carbonCreditsSold,
        averagePrice: analysis.averagePrice,
        marketShare: analysis.marketShare,
        growthRate: analysis.growthRate
      }
    })

    return {
      id: newAnalysis.id,
      period: newAnalysis.period,
      revenue: newAnalysis.revenue,
      costs: newAnalysis.costs,
      profit: newAnalysis.profit,
      profitMargin: newAnalysis.profitMargin,
      carbonCreditsSold: newAnalysis.carbonCreditsSold,
      averagePrice: newAnalysis.averagePrice,
      marketShare: newAnalysis.marketShare,
      growthRate: newAnalysis.growthRate,
      createdAt: newAnalysis.createdAt
    }
  }

  // الحصول على التحليلات الاقتصادية
  async getAnalyses(): Promise<EconomicAnalysis[]> {
    const analyses = await prisma.economicAnalysis.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return analyses.map(analysis => ({
      id: analysis.id,
      period: analysis.period,
      revenue: analysis.revenue,
      costs: analysis.costs,
      profit: analysis.profit,
      profitMargin: analysis.profitMargin,
      carbonCreditsSold: analysis.carbonCreditsSold,
      averagePrice: analysis.averagePrice,
      marketShare: analysis.marketShare,
      growthRate: analysis.growthRate,
      createdAt: analysis.createdAt
    }))
  }

  // تحليل الأداء المالي
  async analyzePerformance(): Promise<{
    totalRevenue: number
    totalCosts: number
    totalProfit: number
    averageProfitMargin: number
    totalCarbonCreditsSold: number
    averagePrice: number
    marketShare: number
    growthRate: number
    trends: {
      revenue: number[]
      costs: number[]
      profit: number[]
      carbonCredits: number[]
    }
  }> {
    const analyses = await this.getAnalyses()
    
    if (analyses.length === 0) {
      return {
        totalRevenue: 0,
        totalCosts: 0,
        totalProfit: 0,
        averageProfitMargin: 0,
        totalCarbonCreditsSold: 0,
        averagePrice: 0,
        marketShare: 0,
        growthRate: 0,
        trends: {
          revenue: [],
          costs: [],
          profit: [],
          carbonCredits: []
        }
      }
    }

    const totalRevenue = analyses.reduce((sum, analysis) => sum + analysis.revenue, 0)
    const totalCosts = analyses.reduce((sum, analysis) => sum + analysis.costs, 0)
    const totalProfit = analyses.reduce((sum, analysis) => sum + analysis.profit, 0)
    const averageProfitMargin = analyses.reduce((sum, analysis) => sum + analysis.profitMargin, 0) / analyses.length
    const totalCarbonCreditsSold = analyses.reduce((sum, analysis) => sum + analysis.carbonCreditsSold, 0)
    const averagePrice = analyses.reduce((sum, analysis) => sum + analysis.averagePrice, 0) / analyses.length
    const marketShare = analyses[0]?.marketShare || 0
    const growthRate = analyses[0]?.growthRate || 0

    // تحليل الاتجاهات
    const trends = {
      revenue: analyses.map(analysis => analysis.revenue),
      costs: analyses.map(analysis => analysis.costs),
      profit: analyses.map(analysis => analysis.profit),
      carbonCredits: analyses.map(analysis => analysis.carbonCreditsSold)
    }

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      averageProfitMargin,
      totalCarbonCreditsSold,
      averagePrice,
      marketShare,
      growthRate,
      trends
    }
  }

  // توقع الأرباح المستقبلية
  async forecastProfits(months: number = 12): Promise<{
    monthly: number[]
    total: number
    confidence: number
  }> {
    const analyses = await this.getAnalyses()
    
    if (analyses.length < 2) {
      return {
        monthly: new Array(months).fill(0),
        total: 0,
        confidence: 0
      }
    }

    // حساب معدل النمو
    const recentAnalyses = analyses.slice(0, 3)
    const growthRate = recentAnalyses.reduce((sum, analysis) => sum + analysis.growthRate, 0) / recentAnalyses.length

    // توقع الأرباح الشهرية
    const lastProfit = analyses[0]?.profit || 0
    const monthly = []
    let currentProfit = lastProfit

    for (let i = 0; i < months; i++) {
      currentProfit = currentProfit * (1 + growthRate / 100)
      monthly.push(Math.round(currentProfit * 100) / 100)
    }

    const total = monthly.reduce((sum, profit) => sum + profit, 0)
    const confidence = Math.min(95, Math.max(50, 100 - (months * 5)))

    return {
      monthly,
      total: Math.round(total * 100) / 100,
      confidence
    }
  }

  // تحليل السوق الأوروبي
  async analyzeEuropeanMarket(): Promise<{
    marketSize: number
    growthRate: number
    competition: number
    opportunities: string[]
    threats: string[]
  }> {
    // بيانات السوق الأوروبي (تقديرية)
    const marketSize = 50_000_000_000 // 50 مليار يورو
    const growthRate = 15 // 15% سنوياً
    const competition = 75 // 75% من السوق

    const opportunities = [
      'زيادة الطلب على رصيد الكربون',
      'تطوير معايير جديدة',
      'دعم الحكومات الأوروبية',
      'تطوير تقنيات جديدة',
      'توسع السوق التطوعي'
    ]

    const threats = [
      'تقلب الأسعار',
      'منافسة شديدة',
      'تغييرات تنظيمية',
      'تطورات تقنية',
      'عدم الاستقرار الاقتصادي'
    ]

    return {
      marketSize,
      growthRate,
      competition,
      opportunities,
      threats
    }
  }
}

// إنشاء مثيلات من المديرين
export const riskManager = new RiskManager()
export const economicAnalyzer = new EconomicAnalyzer()
