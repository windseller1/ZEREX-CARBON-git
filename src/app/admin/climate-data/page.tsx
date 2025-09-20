'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Tabs } from '@/components/ui/Tabs'
import { Alert } from '@/components/ui/Alert'
import { climateDataCollector } from '@/lib/climate-data-collector'

interface ClimateDataPoint {
  id: string
  type: string
  source: string
  timestamp: Date
  location: {
    country: string
    region: string
    latitude: number
    longitude: number
  }
  data: {
    temperature?: number
    humidity?: number
    airQuality?: number
    co2Levels?: number
    renewableEnergy?: number
    carbonCredits?: number
    pricePerTon?: number
  }
  verified: boolean
  createdAt: Date
}

export default function ClimateDataPage() {
  const [dataPoints, setDataPoints] = useState<ClimateDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)
  const [collecting, setCollecting] = useState(false)
  const [lastCollection, setLastCollection] = useState<Date | null>(null)

  useEffect(() => {
    loadData()
    loadAnalysis()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/climate-data')
      const data = await response.json()
      setDataPoints(data)
    } catch (error) {
      console.error('Error loading climate data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalysis = async () => {
    try {
      const response = await fetch('/api/admin/climate-data/analysis')
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error loading analysis:', error)
    }
  }

  const collectData = async () => {
    try {
      setCollecting(true)
      const response = await fetch('/api/admin/climate-data/collect', {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        alert(`تم جمع البيانات بنجاح. محفوظة: ${result.saved}, فشلت: ${result.failed}`)
        setLastCollection(new Date())
        loadData()
        loadAnalysis()
      }
    } catch (error) {
      console.error('Error collecting data:', error)
      alert('حدث خطأ في جمع البيانات')
    } finally {
      setCollecting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number)
  }

  const getDataTypeColor = (type: string) => {
    switch (type) {
      case 'weather': return 'blue'
      case 'carbon_emissions': return 'red'
      case 'air_quality': return 'green'
      case 'renewable_energy': return 'yellow'
      case 'carbon_prices': return 'purple'
      default: return 'gray'
    }
  }

  const getDataTypeLabel = (type: string) => {
    const labels = {
      'weather': 'طقس',
      'carbon_emissions': 'انبعاثات كربون',
      'air_quality': 'جودة هواء',
      'renewable_energy': 'طاقة متجددة',
      'carbon_prices': 'أسعار كربون',
      'climate_indicators': 'مؤشرات مناخ'
    }
    return labels[type as keyof typeof labels] || type
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة بيانات المناخ</h1>
          <div className="flex space-x-4">
            <Button
              onClick={collectData}
              disabled={collecting}
              className="bg-green-600 hover:bg-green-700"
            >
              {collecting ? 'جاري الجمع...' : 'جمع البيانات'}
            </Button>
            <Button
              onClick={loadData}
              variant="outline"
            >
              تحديث
            </Button>
          </div>
        </div>

        {/* إحصائيات البيانات */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي نقاط البيانات</h3>
              <p className="text-3xl font-bold text-blue-600">{analysis.totalDataPoints}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">متوسط درجة الحرارة</h3>
              <p className="text-3xl font-bold text-red-600">{formatNumber(analysis.averageTemperature)}°C</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">متوسط انبعاثات CO2</h3>
              <p className="text-3xl font-bold text-orange-600">{formatNumber(analysis.averageCO2Levels)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">متوسط جودة الهواء</h3>
              <p className="text-3xl font-bold text-green-600">{formatNumber(analysis.averageAirQuality)}</p>
            </Card>
          </div>
        )}

        {/* تحليل البيانات */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">البيانات حسب البلد</h3>
              <div className="space-y-2">
                {Object.entries(analysis.dataByCountry).map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{country}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(count as number / analysis.totalDataPoints) * 100} className="w-20 h-2" />
                      <span className="text-sm font-medium">{count as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">البيانات حسب المصدر</h3>
              <div className="space-y-2">
                {Object.entries(analysis.dataBySource).map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{source}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(count as number / analysis.totalDataPoints) * 100} className="w-20 h-2" />
                      <span className="text-sm font-medium">{count as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* معلومات آخر جمع */}
        {lastCollection && (
          <Alert className="mb-8">
            <div className="flex items-center space-x-2">
              <div className="text-green-600">✓</div>
              <span>آخر جمع للبيانات: {formatDate(lastCollection)}</span>
            </div>
          </Alert>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex space-x-4">
            <Tabs.Trigger value="all">جميع البيانات</Tabs.Trigger>
            <Tabs.Trigger value="weather">طقس</Tabs.Trigger>
            <Tabs.Trigger value="carbon">كربون</Tabs.Trigger>
            <Tabs.Trigger value="air">هواء</Tabs.Trigger>
            <Tabs.Trigger value="renewable">طاقة متجددة</Tabs.Trigger>
          </div>

          <Tabs.Content value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataPoints.map((dataPoint) => (
                <Card key={dataPoint.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDataTypeLabel(dataPoint.type)}
                    </h3>
                    <Badge variant={getDataTypeColor(dataPoint.type) as any}>
                      {dataPoint.type}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>المصدر:</strong> {dataPoint.source}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>الموقع:</strong> {dataPoint.location.country}, {dataPoint.location.region}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>التاريخ:</strong> {formatDate(dataPoint.timestamp)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {dataPoint.data.temperature !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>درجة الحرارة</span>
                        <span>{formatNumber(dataPoint.data.temperature)}°C</span>
                      </div>
                    )}
                    {dataPoint.data.humidity !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>الرطوبة</span>
                        <span>{formatNumber(dataPoint.data.humidity)}%</span>
                      </div>
                    )}
                    {dataPoint.data.airQuality !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>جودة الهواء</span>
                        <span>{formatNumber(dataPoint.data.airQuality)}</span>
                      </div>
                    )}
                    {dataPoint.data.co2Levels !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>انبعاثات CO2</span>
                        <span>{formatNumber(dataPoint.data.co2Levels)}</span>
                      </div>
                    )}
                    {dataPoint.data.renewableEnergy !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>الطاقة المتجددة</span>
                        <span>{formatNumber(dataPoint.data.renewableEnergy)}%</span>
                      </div>
                    )}
                    {dataPoint.data.pricePerTon !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>سعر الكربون</span>
                        <span>{formatNumber(dataPoint.data.pricePerTon)} يورو</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={dataPoint.verified ? 'success' : 'warning'}>
                      {dataPoint.verified ? 'موثق' : 'غير موثق'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(dataPoint.createdAt)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="weather">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataPoints.filter(dp => dp.type === 'weather').map((dataPoint) => (
                <Card key={dataPoint.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">بيانات الطقس</h3>
                    <Badge variant="blue">طقس</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>الموقع:</strong> {dataPoint.location.country}, {dataPoint.location.region}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>التاريخ:</strong> {formatDate(dataPoint.timestamp)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>درجة الحرارة</span>
                      <span>{formatNumber(dataPoint.data.temperature || 0)}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>الرطوبة</span>
                      <span>{formatNumber(dataPoint.data.humidity || 0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>جودة الهواء</span>
                      <span>{formatNumber(dataPoint.data.airQuality || 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={dataPoint.verified ? 'success' : 'warning'}>
                      {dataPoint.verified ? 'موثق' : 'غير موثق'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(dataPoint.createdAt)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="carbon">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataPoints.filter(dp => dp.type === 'carbon_emissions' || dp.type === 'carbon_prices').map((dataPoint) => (
                <Card key={dataPoint.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDataTypeLabel(dataPoint.type)}
                    </h3>
                    <Badge variant="red">كربون</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>الموقع:</strong> {dataPoint.location.country}, {dataPoint.location.region}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>التاريخ:</strong> {formatDate(dataPoint.timestamp)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {dataPoint.data.co2Levels !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>انبعاثات CO2</span>
                        <span>{formatNumber(dataPoint.data.co2Levels)}</span>
                      </div>
                    )}
                    {dataPoint.data.pricePerTon !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>سعر الكربون</span>
                        <span>{formatNumber(dataPoint.data.pricePerTon)} يورو</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={dataPoint.verified ? 'success' : 'warning'}>
                      {dataPoint.verified ? 'موثق' : 'غير موثق'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(dataPoint.createdAt)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="air">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataPoints.filter(dp => dp.type === 'air_quality').map((dataPoint) => (
                <Card key={dataPoint.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">جودة الهواء</h3>
                    <Badge variant="green">هواء</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>الموقع:</strong> {dataPoint.location.country}, {dataPoint.location.region}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>التاريخ:</strong> {formatDate(dataPoint.timestamp)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>جودة الهواء</span>
                      <span>{formatNumber(dataPoint.data.airQuality || 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={dataPoint.verified ? 'success' : 'warning'}>
                      {dataPoint.verified ? 'موثق' : 'غير موثق'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(dataPoint.createdAt)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="renewable">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataPoints.filter(dp => dp.type === 'renewable_energy').map((dataPoint) => (
                <Card key={dataPoint.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">الطاقة المتجددة</h3>
                    <Badge variant="yellow">طاقة متجددة</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>الموقع:</strong> {dataPoint.location.country}, {dataPoint.location.region}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>التاريخ:</strong> {formatDate(dataPoint.timestamp)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>الطاقة المتجددة</span>
                      <span>{formatNumber(dataPoint.data.renewableEnergy || 0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={dataPoint.verified ? 'success' : 'warning'}>
                      {dataPoint.verified ? 'موثق' : 'غير موثق'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(dataPoint.createdAt)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  )
}
