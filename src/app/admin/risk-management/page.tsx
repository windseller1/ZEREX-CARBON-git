'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Alert } from '@/components/ui/Alert'
import { Progress } from '@/components/ui/Progress'
import { riskManager, RiskType, RiskLevel } from '@/lib/risk-management'

interface Risk {
  id: string
  type: RiskType
  level: RiskLevel
  description: string
  probability: number
  impact: number
  mitigation: string
  status: 'active' | 'mitigated' | 'resolved'
  createdAt: Date
  updatedAt: Date
}

export default function RiskManagementPage() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null)
  const [newRisk, setNewRisk] = useState({
    type: RiskType.MARKET,
    level: RiskLevel.MEDIUM,
    description: '',
    probability: 50,
    impact: 50,
    mitigation: ''
  })

  useEffect(() => {
    loadRisks()
    loadRiskAnalysis()
  }, [])

  const loadRisks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/risks')
      const data = await response.json()
      setRisks(data)
    } catch (error) {
      console.error('Error loading risks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRiskAnalysis = async () => {
    try {
      const response = await fetch('/api/admin/risks/analysis')
      const data = await response.json()
      setRiskAnalysis(data)
    } catch (error) {
      console.error('Error loading risk analysis:', error)
    }
  }

  const addRisk = async () => {
    try {
      const response = await fetch('/api/admin/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRisk)
      })

      if (response.ok) {
        setShowAddModal(false)
        setNewRisk({
          type: RiskType.MARKET,
          level: RiskLevel.MEDIUM,
          description: '',
          probability: 50,
          impact: 50,
          mitigation: ''
        })
        loadRisks()
        loadRiskAnalysis()
      }
    } catch (error) {
      console.error('Error adding risk:', error)
    }
  }

  const updateRisk = async (id: string, updates: Partial<Risk>) => {
    try {
      const response = await fetch(`/api/admin/risks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        loadRisks()
        loadRiskAnalysis()
      }
    } catch (error) {
      console.error('Error updating risk:', error)
    }
  }

  const deleteRisk = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/risks/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadRisks()
        loadRiskAnalysis()
      }
    } catch (error) {
      console.error('Error deleting risk:', error)
    }
  }

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'success'
      case RiskLevel.MEDIUM: return 'warning'
      case RiskLevel.HIGH: return 'danger'
      case RiskLevel.CRITICAL: return 'destructive'
      default: return 'secondary'
    }
  }

  const getRiskTypeLabel = (type: RiskType) => {
    const labels = {
      [RiskType.MARKET]: 'سوق',
      [RiskType.CREDIT]: 'ائتمان',
      [RiskType.OPERATIONAL]: 'تشغيلي',
      [RiskType.LIQUIDITY]: 'سيولة',
      [RiskType.REGULATORY]: 'تنظيمي',
      [RiskType.TECHNOLOGY]: 'تقني'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة المخاطر</h1>
          <Button onClick={() => setShowAddModal(true)}>
            إضافة مخاطر جديدة
          </Button>
        </div>

        {/* تحليل المخاطر */}
        {riskAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إجمالي المخاطر</h3>
              <p className="text-3xl font-bold text-blue-600">{riskAnalysis.totalRisks}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">مخاطر حرجة</h3>
              <p className="text-3xl font-bold text-red-600">{riskAnalysis.criticalRisks}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">مخاطر عالية</h3>
              <p className="text-3xl font-bold text-orange-600">{riskAnalysis.highRisks}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">نقاط المخاطر</h3>
              <p className="text-3xl font-bold text-purple-600">{riskAnalysis.riskScore}</p>
            </Card>
          </div>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex space-x-4">
            <Tabs.Trigger value="all">جميع المخاطر</Tabs.Trigger>
            <Tabs.Trigger value="active">نشطة</Tabs.Trigger>
            <Tabs.Trigger value="mitigated">مخففة</Tabs.Trigger>
            <Tabs.Trigger value="resolved">محلولة</Tabs.Trigger>
          </div>

          <Tabs.Content value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {risks.map((risk) => (
                <Card key={risk.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getRiskTypeLabel(risk.type)}
                    </h3>
                    <Badge variant={getRiskLevelColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {risk.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>الاحتمالية</span>
                      <span>{risk.probability}%</span>
                    </div>
                    <Progress value={risk.probability} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>التأثير</span>
                      <span>{risk.impact}%</span>
                    </div>
                    <Progress value={risk.impact} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">التخفيف:</p>
                    <p className="text-sm text-gray-600">{risk.mitigation}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{risk.status}</Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRisk(risk)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRisk(risk.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {risks.filter(r => r.status === 'active').map((risk) => (
                <Card key={risk.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getRiskTypeLabel(risk.type)}
                    </h3>
                    <Badge variant={getRiskLevelColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {risk.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>الاحتمالية</span>
                      <span>{risk.probability}%</span>
                    </div>
                    <Progress value={risk.probability} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>التأثير</span>
                      <span>{risk.impact}%</span>
                    </div>
                    <Progress value={risk.impact} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">التخفيف:</p>
                    <p className="text-sm text-gray-600">{risk.mitigation}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{risk.status}</Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRisk(risk)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRisk(risk.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="mitigated">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {risks.filter(r => r.status === 'mitigated').map((risk) => (
                <Card key={risk.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getRiskTypeLabel(risk.type)}
                    </h3>
                    <Badge variant={getRiskLevelColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {risk.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>الاحتمالية</span>
                      <span>{risk.probability}%</span>
                    </div>
                    <Progress value={risk.probability} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>التأثير</span>
                      <span>{risk.impact}%</span>
                    </div>
                    <Progress value={risk.impact} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">التخفيف:</p>
                    <p className="text-sm text-gray-600">{risk.mitigation}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{risk.status}</Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRisk(risk)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRisk(risk.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="resolved">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {risks.filter(r => r.status === 'resolved').map((risk) => (
                <Card key={risk.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getRiskTypeLabel(risk.type)}
                    </h3>
                    <Badge variant={getRiskLevelColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {risk.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>الاحتمالية</span>
                      <span>{risk.probability}%</span>
                    </div>
                    <Progress value={risk.probability} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>التأثير</span>
                      <span>{risk.impact}%</span>
                    </div>
                    <Progress value={risk.impact} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">التخفيف:</p>
                    <p className="text-sm text-gray-600">{risk.mitigation}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{risk.status}</Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRisk(risk)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRisk(risk.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>
        </Tabs>

        {/* Modal إضافة مخاطر جديدة */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="إضافة مخاطر جديدة"
        >
          <div className="space-y-4">
            <Select
              label="نوع المخاطر"
              value={newRisk.type}
              onValueChange={(value) => setNewRisk(prev => ({ ...prev, type: value as RiskType }))}
            >
              <Select.Option value={RiskType.MARKET}>سوق</Select.Option>
              <Select.Option value={RiskType.CREDIT}>ائتمان</Select.Option>
              <Select.Option value={RiskType.OPERATIONAL}>تشغيلي</Select.Option>
              <Select.Option value={RiskType.LIQUIDITY}>سيولة</Select.Option>
              <Select.Option value={RiskType.REGULATORY}>تنظيمي</Select.Option>
              <Select.Option value={RiskType.TECHNOLOGY}>تقني</Select.Option>
            </Select>

            <Select
              label="مستوى المخاطر"
              value={newRisk.level}
              onValueChange={(value) => setNewRisk(prev => ({ ...prev, level: value as RiskLevel }))}
            >
              <Select.Option value={RiskLevel.LOW}>منخفض</Select.Option>
              <Select.Option value={RiskLevel.MEDIUM}>متوسط</Select.Option>
              <Select.Option value={RiskLevel.HIGH}>عالي</Select.Option>
              <Select.Option value={RiskLevel.CRITICAL}>حرج</Select.Option>
            </Select>

            <Textarea
              label="وصف المخاطر"
              value={newRisk.description}
              onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف تفصيلي للمخاطر..."
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="الاحتمالية (%)"
                type="number"
                min="0"
                max="100"
                value={newRisk.probability}
                onChange={(e) => setNewRisk(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
              />

              <Input
                label="التأثير (%)"
                type="number"
                min="0"
                max="100"
                value={newRisk.impact}
                onChange={(e) => setNewRisk(prev => ({ ...prev, impact: parseInt(e.target.value) }))}
              />
            </div>

            <Textarea
              label="خطة التخفيف"
              value={newRisk.mitigation}
              onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation: e.target.value }))}
              placeholder="خطة مفصلة لتخفيف المخاطر..."
            />

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={addRisk}>
                إضافة
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal تعديل المخاطر */}
        {selectedRisk && (
          <Modal
            isOpen={!!selectedRisk}
            onClose={() => setSelectedRisk(null)}
            title="تعديل المخاطر"
          >
            <div className="space-y-4">
              <Select
                label="نوع المخاطر"
                value={selectedRisk.type}
                onValueChange={(value) => setSelectedRisk(prev => prev ? { ...prev, type: value as RiskType } : null)}
              >
                <Select.Option value={RiskType.MARKET}>سوق</Select.Option>
                <Select.Option value={RiskType.CREDIT}>ائتمان</Select.Option>
                <Select.Option value={RiskType.OPERATIONAL}>تشغيلي</Select.Option>
                <Select.Option value={RiskType.LIQUIDITY}>سيولة</Select.Option>
                <Select.Option value={RiskType.REGULATORY}>تنظيمي</Select.Option>
                <Select.Option value={RiskType.TECHNOLOGY}>تقني</Select.Option>
              </Select>

              <Select
                label="مستوى المخاطر"
                value={selectedRisk.level}
                onValueChange={(value) => setSelectedRisk(prev => prev ? { ...prev, level: value as RiskLevel } : null)}
              >
                <Select.Option value={RiskLevel.LOW}>منخفض</Select.Option>
                <Select.Option value={RiskLevel.MEDIUM}>متوسط</Select.Option>
                <Select.Option value={RiskLevel.HIGH}>عالي</Select.Option>
                <Select.Option value={RiskLevel.CRITICAL}>حرج</Select.Option>
              </Select>

              <Textarea
                label="وصف المخاطر"
                value={selectedRisk.description}
                onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="وصف تفصيلي للمخاطر..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="الاحتمالية (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={selectedRisk.probability}
                  onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, probability: parseInt(e.target.value) } : null)}
                />

                <Input
                  label="التأثير (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={selectedRisk.impact}
                  onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, impact: parseInt(e.target.value) } : null)}
                />
              </div>

              <Textarea
                label="خطة التخفيف"
                value={selectedRisk.mitigation}
                onChange={(e) => setSelectedRisk(prev => prev ? { ...prev, mitigation: e.target.value } : null)}
                placeholder="خطة مفصلة لتخفيف المخاطر..."
              />

              <Select
                label="الحالة"
                value={selectedRisk.status}
                onValueChange={(value) => setSelectedRisk(prev => prev ? { ...prev, status: value as 'active' | 'mitigated' | 'resolved' } : null)}
              >
                <Select.Option value="active">نشط</Select.Option>
                <Select.Option value="mitigated">مخفف</Select.Option>
                <Select.Option value="resolved">محلول</Select.Option>
              </Select>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRisk(null)}
                >
                  إلغاء
                </Button>
                <Button onClick={() => {
                  if (selectedRisk) {
                    updateRisk(selectedRisk.id, selectedRisk)
                    setSelectedRisk(null)
                  }
                }}>
                  حفظ
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
