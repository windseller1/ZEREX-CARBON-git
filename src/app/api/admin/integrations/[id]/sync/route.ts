import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/supabase/prisma'
import { integrationService } from '@/lib/integrations'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // الحصول على تفاصيل التكامل
    const integration = await prisma.integration.findFirst({
      where: { platformId: id }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    let syncResult = { success: false, message: '', dataCount: 0 }

    // مزامنة البيانات حسب النوع
    switch (id) {
      case 'stripe':
        try {
          // مزامنة بيانات العملاء
          const customers = await integrationService.processPayment(0, 'usd', 'sync')
          syncResult = { success: true, message: 'Stripe data synced', dataCount: 1 }
        } catch (error) {
          syncResult = { success: false, message: 'Stripe sync failed', dataCount: 0 }
        }
        break

      case 'carbon_interface':
        try {
          // مزامنة بيانات انبعاثات الكربون
          await integrationService.syncData()
          syncResult = { success: true, message: 'Carbon data synced', dataCount: 1 }
        } catch (error) {
          syncResult = { success: false, message: 'Carbon data sync failed', dataCount: 0 }
        }
        break

      case 'eu_ets':
        try {
          // مزامنة أسعار الكربون
          const prices = await integrationService.getCarbonPrices()
          syncResult = { success: true, message: 'EU ETS prices synced', dataCount: 1 }
        } catch (error) {
          syncResult = { success: false, message: 'EU ETS sync failed', dataCount: 0 }
        }
        break

      case 'verra':
        try {
          // مزامنة بيانات رصيد الكربون
          const credits = await integrationService.verifyCarbonCredit('sync', 'verra')
          syncResult = { success: true, message: 'Verra credits synced', dataCount: 1 }
        } catch (error) {
          syncResult = { success: false, message: 'Verra sync failed', dataCount: 0 }
        }
        break

      case 'gold_standard':
        try {
          // مزامنة بيانات رصيد الكربون
          const credits = await integrationService.verifyCarbonCredit('sync', 'gold_standard')
          syncResult = { success: true, message: 'Gold Standard credits synced', dataCount: 1 }
        } catch (error) {
          syncResult = { success: false, message: 'Gold Standard sync failed', dataCount: 0 }
        }
        break

      default:
        // مزامنة عامة للتكاملات المخصصة
        try {
          const response = await fetch(integration.baseUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${integration.apiKey}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const data = await response.json()
            syncResult = { success: true, message: 'Custom integration synced', dataCount: 1 }
          } else {
            syncResult = { success: false, message: 'Custom integration sync failed', dataCount: 0 }
          }
        } catch (error) {
          syncResult = { success: false, message: 'Custom integration sync failed', dataCount: 0 }
        }
    }

    // تحديث آخر مزامنة
    await prisma.integration.updateMany({
      where: { platformId: id },
      data: { lastSync: new Date() }
    })

    return NextResponse.json(syncResult)
  } catch (error) {
    console.error('Error syncing integration:', error)
    return NextResponse.json(
      { error: 'Failed to sync integration' },
      { status: 500 }
    )
  }
}
