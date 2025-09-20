import { NextRequest, NextResponse } from 'next/server';
import { socialMediaManager } from '@/lib/social-integrations';

// إرسال رسالة إلى التلغرام
export async function POST(request: NextRequest) {
  try {
    const { content, media } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'المحتوى مطلوب' },
        { status: 400 }
      );
    }

    const result = await socialMediaManager.broadcastMessage(content, media);

    return NextResponse.json({
      success: true,
      telegram: result.telegram,
      message: 'تم إرسال الرسالة بنجاح'
    });

  } catch (error) {
    console.error('خطأ في إرسال رسالة التلغرام:', error);
    return NextResponse.json(
      { error: 'خطأ في إرسال الرسالة' },
      { status: 500 }
    );
  }
}

// الحصول على إحصائيات التلغرام
export async function GET() {
  try {
    const stats = await socialMediaManager.getAllStats();
    const telegramStats = stats.find(stat => stat.platform === 'telegram');

    return NextResponse.json({
      success: true,
      stats: telegramStats || null
    });

  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات التلغرام:', error);
    return NextResponse.json(
      { error: 'خطأ في الحصول على الإحصائيات' },
      { status: 500 }
    );
  }
}
