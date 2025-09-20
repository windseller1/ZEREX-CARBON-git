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

    let testResult = { success: false, message: '' }

    // اختبار التكامل حسب النوع
    switch (id) {
      case 'stripe':
        try {
          await integrationService.processPayment(1, 'usd', 'test_customer')
          testResult = { success: true, message: 'Stripe integration working' }
        } catch (error) {
          testResult = { success: false, message: 'Stripe test failed' }
        }
        break

      case 'carbon_interface':
        try {
          await integrationService.estimateCarbonFootprint('electricity', 100, 'kwh')
          testResult = { success: true, message: 'Carbon Interface integration working' }
        } catch (error) {
          testResult = { success: false, message: 'Carbon Interface test failed' }
        }
        break

      case 'eu_ets':
        try {
          await integrationService.getCarbonPrices()
          testResult = { success: true, message: 'EU ETS integration working' }
        } catch (error) {
          testResult = { success: false, message: 'EU ETS test failed' }
        }
        break

      case 'verra':
        try {
          await integrationService.verifyCarbonCredit('test_credit_id', 'verra')
          testResult = { success: true, message: 'Verra integration working' }
        } catch (error) {
          testResult = { success: false, message: 'Verra test failed' }
        }
        break

      case 'gold_standard':
        try {
          await integrationService.verifyCarbonCredit('test_credit_id', 'gold_standard')
          testResult = { success: true, message: 'Gold Standard integration working' }
        } catch (error) {
          testResult = { success: false, message: 'Gold Standard test failed' }
        }
        break

      default:
        // اختبار عام للتكاملات المخصصة
        try {
          const response = await fetch(integration.baseUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${integration.apiKey}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            testResult = { success: true, message: 'Custom integration working' }
          } else {
            testResult = { success: false, message: 'Custom integration test failed' }
          }
        } catch (error) {
          testResult = { success: false, message: 'Custom integration test failed' }
        }
    }

    // تحديث آخر اختبار
    await prisma.integration.updateMany({
      where: { platformId: id },
      data: { lastTest: new Date() }
    })

    return NextResponse.json(testResult)
  } catch (error) {
    console.error('Error testing integration:', error)
    return NextResponse.json(
      { error: 'Failed to test integration' },
      { status: 500 }
    )
  }
}
