import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/supabase/prisma'
import { integrationManager } from '@/lib/integrations'

// الحصول على جميع التكاملات
export async function GET() {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const formattedIntegrations = integrations.map(integration => ({
      id: integration.platformId,
      name: integration.name,
      baseUrl: integration.baseUrl,
      isActive: integration.isActive,
      supportedFeatures: integration.supportedFeatures.split(','),
      rateLimit: JSON.parse(integration.rateLimit),
      lastSync: integration.lastSync,
      status: integration.isActive ? 'connected' : 'disconnected'
    }))

    return NextResponse.json(formattedIntegrations)
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    )
  }
}

// إضافة تكامل جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, baseUrl, apiKey, supportedFeatures, rateLimit } = body

    // التحقق من صحة البيانات
    if (!name || !baseUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // إنشاء التكامل
    const integration = await prisma.integration.create({
      data: {
        platformId: `custom_${Date.now()}`,
        name,
        baseUrl,
        apiKey,
        isActive: true,
        supportedFeatures: supportedFeatures.join(','),
        rateLimit: JSON.stringify(rateLimit)
      }
    })

    return NextResponse.json({
      id: integration.platformId,
      name: integration.name,
      baseUrl: integration.baseUrl,
      isActive: integration.isActive,
      supportedFeatures: integration.supportedFeatures.split(','),
      rateLimit: JSON.parse(integration.rateLimit),
      status: 'connected'
    })
  } catch (error) {
    console.error('Error creating integration:', error)
    return NextResponse.json(
      { error: 'Failed to create integration' },
      { status: 500 }
    )
  }
}
