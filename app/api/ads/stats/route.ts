import { NextRequest, NextResponse } from 'next/server';
import { multiPlatformAdManager } from '@/lib/multi-platform-ad-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'Missing userId'
      }, { status: 400 });
    }

    // الحصول على إحصائيات المستخدم من multiPlatformAdManager
    const stats = await multiPlatformAdManager.getUserAdStats(userId);
    
    // الحد الأقصى اليومي (من المتغيرات البيئية أو القيمة الافتراضية)
    const dailyLimit = parseInt(process.env.NEXT_PUBLIC_AD_DAILY_LIMIT || '10');
    
    // حساب المتبقي اليوم
    const remainingToday = Math.max(0, dailyLimit - stats.todayCount);

    // الحصول على السلسلة الحالية
    const userStats = await prisma.userStatistics.findUnique({
      where: { userId },
      select: {
        currentStreak: true,
        longestStreak: true
      }
    });

    const streak = userStats?.currentStreak || 0;
    const longestStreak = userStats?.longestStreak || 0;

    // التحقق من الأحداث الخاصة النشطة
    const activeEvent = await prisma.promotion.findFirst({
      where: {
        type: 'MULTIPLIER_EVENT',
        isActive: true,
        startsAt: { lte: new Date() },
        expiresAt: { gte: new Date() }
      }
    });

    const multiplier = activeEvent?.multiplier || 1.0;

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        dailyLimit,
        remainingToday,
        streak,
        longestStreak,
        multiplier,
        hasActiveEvent: !!activeEvent,
        eventName: activeEvent?.name || null
      }
    });
  } catch (error) {
    console.error('Error getting ad stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
