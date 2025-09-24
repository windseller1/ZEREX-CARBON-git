'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { economicAnalyzer } from '@/lib/risk-management'

interface EconomicAnalysis {
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

export default function EconomicAnalysisPage() {
  const [analyses, setAnalyses] = useState<EconomicAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [performance, setPerformance] = useState<any>(null)
  const [forecast, setForecast] = useState<any>(null)
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null)
  const [newAnalysis, setNewAnalysis] = useState({
    period: '',
    revenue: 0,
    costs: 0,
    profit: 0,
    profitMargin: 0,
    carbonCreditsSold: 0,
    averagePrice: 0,
    marketShare: 0,
    growthRate: 0
  })

  useEffect(() => {
    loadAnalyses()
    loadPerformance()
    loadForecast()
    loadMarketAnalysis()
  }, [])

  const loadAnalyses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/economic-analyses')
      const data = await response.json()
      setAnalyses(data)
    } catch (error) {
      console.error('Error loading analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPerformance = async () => {
    try {
      const response = await fetch('/api/admin/economic-analyses/performance')
      const data = await response.json()
      setPerformance(data)
    } catch (error) {
      console.error('Error loading performance:', error)
    }
  }

  const loadForecast = async () => {
    try {
      const response = await fetch('/api/admin/economic-analyses/forecast')
      const data = await response.json()
      setForecast(data)
    } catch (error) {
      console.error('Error loading forecast:', error)
    }
  }

  const loadMarketAnalysis = async () => {
    try {
      const response = await fetch('/api/admin/economic-analyses/market')
      const data = await response.json()
      setMarketAnalysis(data)
    } catch (error) {
      console.error('Error loading market analysis:', error)
    }
  }

  const addAnalysis = async () => {
    try {
      const response = await fetch('/api/admin/economic-analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnalysis)
      })

      if (response.ok) {
        setShowAddModal(false)
        setNewAnalysis({
          period: '',
          revenue: 0,
          costs: 0,
          profit: 0,
          profitMargin: 0,
          carbonCreditsSold: 0,
          averagePrice: 0,
          marketShare: 0,
          growthRate: 0
        })
        loadAnalyses()
        loadPerformance()
        loadForecast()
      }
    } catch (error) {
      console.error('Error adding analysis:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('ar-SA').format(number)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">التحليل الاقتصادي</h1>
          <Button onClick={() => setShowAddModal(true)}>
            إضافة تحليل جديد
          </Button>
        </div>

        {/* مؤشرات الأداء */}
        {performance && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي الإيرادات</h3>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(performance.totalRevenue)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي التكاليف</h3>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(performance.totalCosts)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي الأرباح</h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(performance.totalProfit)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">متوسط هامش الربح</h3>
              <p className="text-3xl font-bold text-purple-600">
                {performance.averageProfitMargin.toFixed(1)}%
              </p>
            </Card>
          </div>
        )}

        {/* تحليل السوق */}
        {marketAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">حجم السوق</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {formatCurrency(marketAnalysis.marketSize)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">معدل النمو</h3>
              <p className="text-3xl font-bold text-green-600">
                {marketAnalysis.growthRate}%
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">المنافسة</h3>
              <p className="text-3xl font-bold text-orange-600">
                {marketAnalysis.competition}%
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">حصة السوق</h3>
              <p className="text-3xl font-bold text-blue-600">
                {performance?.marketShare?.toFixed(2)}%
              </p>
            </Card>
          </div>
        )}

        {/* توقع الأرباح */}
        {forecast && (
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">توقع الأرباح المستقبلية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">الأرباح الشهرية المتوقعة</h4>
                <div className="space-y-2">
                  {forecast.monthly.slice(0, 6).map((profit: number, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الشهر {index + 1}</span>
                      <span className="font-medium">{formatCurrency(profit)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">الإجمالي المتوقع</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  {formatCurrency(forecast.total)}
                </p>
                <p className="text-sm text-gray-600">
                  مستوى الثقة: {forecast.confidence}%
                </p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="analyses" className="space-y-6">
          <div className="flex space-x-4">
            <Tabs.Trigger value="analyses">التحليلات</Tabs.Trigger>
            <Tabs.Trigger value="trends">الاتجاهات</Tabs.Trigger>
            <Tabs.Trigger value="opportunities">الفرص</Tabs.Trigger>
            <Tabs.Trigger value="threats">التهديدات</Tabs.Trigger>
          </div>

          <Tabs.Content value="analyses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {analysis.period}
                    </h3>
                    <Badge variant="outline">
                      {new Date(analysis.createdAt).toLocaleDateString('ar-SA')}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الإيرادات</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(analysis.revenue)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">التكاليف</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(analysis.costs)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الأرباح</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(analysis.profit)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">هامش الربح</span>
                      <span className="font-medium text-purple-600">
                        {analysis.profitMargin.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">رصيد الكربون المباع</span>
                      <span className="font-medium text-indigo-600">
                        {formatNumber(analysis.carbonCreditsSold)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">متوسط السعر</span>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(analysis.averagePrice)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">حصة السوق</span>
                      <span className="font-medium text-teal-600">
                        {analysis.marketShare.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">معدل النمو</span>
                      <span className="font-medium text-pink-600">
                        {analysis.growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="trends">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اتجاه الإيرادات</h3>
                <div className="space-y-2">
                  {performance?.trends?.revenue?.slice(0, 6).map((revenue: number, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الشهر {index + 1}</span>
                      <span className="font-medium">{formatCurrency(revenue)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اتجاه الأرباح</h3>
                <div className="space-y-2">
                  {performance?.trends?.profit?.slice(0, 6).map((profit: number, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الشهر {index + 1}</span>
                      <span className="font-medium">{formatCurrency(profit)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Tabs.Content>

          <Tabs.Content value="opportunities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketAnalysis?.opportunities?.map((opportunity: string, index: number) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🚀</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">الفرصة {index + 1}</h3>
                      <p className="text-gray-600">{opportunity}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="threats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketAnalysis?.threats?.map((threat: string, index: number) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">التهديد {index + 1}</h3>
                      <p className="text-gray-600">{threat}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>
        </Tabs>

        {/* Modal إضافة تحليل جديد */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="إضافة تحليل اقتصادي جديد"
        >
          <div className="space-y-4">
            <Input
              label="الفترة الزمنية"
              value={newAnalysis.period}
              onChange={(e) => setNewAnalysis(prev => ({ ...prev, period: e.target.value }))}
              placeholder="مثال: يناير 2024"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="الإيرادات (يورو)"
                type="number"
                value={newAnalysis.revenue}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, revenue: parseFloat(e.target.value) }))}
              />

              <Input
                label="التكاليف (يورو)"
                type="number"
                value={newAnalysis.costs}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, costs: parseFloat(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="الأرباح (يورو)"
                type="number"
                value={newAnalysis.profit}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, profit: parseFloat(e.target.value) }))}
              />

              <Input
                label="هامش الربح (%)"
                type="number"
                value={newAnalysis.profitMargin}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, profitMargin: parseFloat(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="رصيد الكربون المباع"
                type="number"
                value={newAnalysis.carbonCreditsSold}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, carbonCreditsSold: parseInt(e.target.value) }))}
              />

              <Input
                label="متوسط السعر (يورو)"
                type="number"
                value={newAnalysis.averagePrice}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, averagePrice: parseFloat(e.target.value) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="حصة السوق (%)"
                type="number"
                value={newAnalysis.marketShare}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, marketShare: parseFloat(e.target.value) }))}
              />

              <Input
                label="معدل النمو (%)"
                type="number"
                value={newAnalysis.growthRate}
                onChange={(e) => setNewAnalysis(prev => ({ ...prev, growthRate: parseFloat(e.target.value) }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={addAnalysis}>
                إضافة
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
