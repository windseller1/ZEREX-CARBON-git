'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { Tabs } from '@/components/ui/Tabs'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { integrationManager } from '@/lib/integrations'

interface Integration {
  id: string
  name: string
  baseUrl: string
  isActive: boolean
  supportedFeatures: string[]
  rateLimit: {
    requests: number
    window: number
  }
  lastSync?: Date
  status: 'connected' | 'disconnected' | 'error'
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    baseUrl: '',
    apiKey: '',
    supportedFeatures: [] as string[],
    rateLimit: { requests: 100, window: 60000 }
  })

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/integrations')
      const data = await response.json()
      setIntegrations(data)
    } catch (error) {
      console.error('Error loading integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleIntegration = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/integrations/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.id === id 
              ? { ...integration, isActive }
              : integration
          )
        )
      }
    } catch (error) {
      console.error('Error toggling integration:', error)
    }
  }

  const addIntegration = async () => {
    try {
      const response = await fetch('/api/admin/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIntegration)
      })

      if (response.ok) {
        setShowAddModal(false)
        setNewIntegration({
          name: '',
          baseUrl: '',
          apiKey: '',
          supportedFeatures: [],
          rateLimit: { requests: 100, window: 60000 }
        })
        loadIntegrations()
      }
    } catch (error) {
      console.error('Error adding integration:', error)
    }
  }

  const testIntegration = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/integrations/${id}/test`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Test result: ${result.success ? 'Success' : 'Failed'}`)
      }
    } catch (error) {
      console.error('Error testing integration:', error)
    }
  }

  const syncIntegration = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/integrations/${id}/sync`, {
        method: 'POST'
      })

      if (response.ok) {
        alert('Sync completed successfully')
        loadIntegrations()
      }
    } catch (error) {
      console.error('Error syncing integration:', error)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة التكاملات</h1>
          <Button onClick={() => setShowAddModal(true)}>
            إضافة تكامل جديد
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex space-x-4">
            <Tabs.Trigger value="all">جميع التكاملات</Tabs.Trigger>
            <Tabs.Trigger value="active">نشطة</Tabs.Trigger>
            <Tabs.Trigger value="inactive">غير نشطة</Tabs.Trigger>
          </div>

          <Tabs.Content value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <Badge 
                      variant={integration.isActive ? 'success' : 'secondary'}
                    >
                      {integration.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {integration.baseUrl}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">الميزات المدعومة:</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.supportedFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">حد المعدل:</p>
                    <p className="text-sm text-gray-600">
                      {integration.rateLimit.requests} طلب في {integration.rateLimit.window / 1000} ثانية
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={integration.isActive}
                        onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                      />
                      <span className="text-sm text-gray-600">
                        {integration.isActive ? 'مفعل' : 'معطل'}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testIntegration(integration.id)}
                    >
                      اختبار
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncIntegration(integration.id)}
                    >
                      مزامنة
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.filter(i => i.isActive).map((integration) => (
                <Card key={integration.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <Badge variant="success">نشط</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {integration.baseUrl}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">الميزات المدعومة:</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.supportedFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testIntegration(integration.id)}
                    >
                      اختبار
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncIntegration(integration.id)}
                    >
                      مزامنة
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="inactive">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.filter(i => !i.isActive).map((integration) => (
                <Card key={integration.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <Badge variant="secondary">غير نشط</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {integration.baseUrl}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">الميزات المدعومة:</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.supportedFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={integration.isActive}
                        onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                      />
                      <span className="text-sm text-gray-600">
                        {integration.isActive ? 'مفعل' : 'معطل'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Content>
        </Tabs>

        {/* Modal إضافة تكامل جديد */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="إضافة تكامل جديد"
        >
          <div className="space-y-4">
            <Input
              label="اسم المنصة"
              value={newIntegration.name}
              onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: Stripe"
            />

            <Input
              label="رابط API"
              value={newIntegration.baseUrl}
              onChange={(e) => setNewIntegration(prev => ({ ...prev, baseUrl: e.target.value }))}
              placeholder="https://api.example.com"
            />

            <Input
              label="مفتاح API"
              type="password"
              value={newIntegration.apiKey}
              onChange={(e) => setNewIntegration(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="مفتاح API الخاص بك"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الميزات المدعومة
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['payments', 'subscriptions', 'carbon_credits', 'verification', 'market_data'].map((feature) => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newIntegration.supportedFeatures.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewIntegration(prev => ({
                            ...prev,
                            supportedFeatures: [...prev.supportedFeatures, feature]
                          }))
                        } else {
                          setNewIntegration(prev => ({
                            ...prev,
                            supportedFeatures: prev.supportedFeatures.filter(f => f !== feature)
                          }))
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="عدد الطلبات"
                type="number"
                value={newIntegration.rateLimit.requests}
                onChange={(e) => setNewIntegration(prev => ({
                  ...prev,
                  rateLimit: { ...prev.rateLimit, requests: parseInt(e.target.value) }
                }))}
              />

              <Input
                label="النافذة الزمنية (ملي ثانية)"
                type="number"
                value={newIntegration.rateLimit.window}
                onChange={(e) => setNewIntegration(prev => ({
                  ...prev,
                  rateLimit: { ...prev.rateLimit, window: parseInt(e.target.value) }
                }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={addIntegration}>
                إضافة
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
