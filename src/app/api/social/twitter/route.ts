import { NextRequest, NextResponse } from 'next/server';
import { socialMediaManager } from '@/lib/social-integrations';

// إرسال تغريدة
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
      twitter: result.twitter,
      message: 'تم إرسال التغريدة بنجاح'
    });

  } catch (error) {
    console.error('خطأ في إرسال تغريدة:', error);
    return NextResponse.json(
      { error: 'خطأ في إرسال التغريدة' },
      { status: 500 }
    );
  }
}

// الحصول على إحصائيات تويتر
export async function GET() {
  try {
    const stats = await socialMediaManager.getAllStats();
    const twitterStats = stats.find(stat => stat.platform === 'twitter');

    return NextResponse.json({
      success: true,
      stats: twitterStats || null
    });

  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات تويتر:', error);
    return NextResponse.json(
      { error: 'خطأ في الحصول على الإحصائيات' },
      { status: 500 }
    );
  }
}
