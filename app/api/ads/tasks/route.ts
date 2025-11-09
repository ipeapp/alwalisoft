import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/ads/tasks
 * الحصول على مهام الإعلانات للمستخدم
 */
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

    // الحصول على عدد الإعلانات التي شاهدها المستخدم اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAdsCount = await prisma.adWatch.count({
      where: {
        userId,
        watchedAt: { gte: today }
      }
    });

    // مهام الإعلانات الثابتة
    const adTasks = [
      {
        id: 'ad-task-1',
        title: '🎯 أول إعلان اليوم',
        description: 'شاهد إعلانك الأول اليوم',
        reward: 100,
        requiredAds: 1,
        progress: Math.min(todayAdsCount, 1),
        completed: todayAdsCount >= 1
      },
      {
        id: 'ad-task-2',
        title: '⚡ 3 إعلانات',
        description: 'شاهد 3 إعلانات اليوم',
        reward: 300,
        requiredAds: 3,
        progress: Math.min(todayAdsCount, 3),
        completed: todayAdsCount >= 3
      },
      {
        id: 'ad-task-3',
        title: '🔥 5 إعلانات',
        description: 'شاهد 5 إعلانات اليوم',
        reward: 500,
        requiredAds: 5,
        progress: Math.min(todayAdsCount, 5),
        completed: todayAdsCount >= 5
      },
      {
        id: 'ad-task-4',
        title: '🏆 الحد الأقصى',
        description: 'شاهد 10 إعلانات (الحد الأقصى اليومي)',
        reward: 1000,
        requiredAds: 10,
        progress: Math.min(todayAdsCount, 10),
        completed: todayAdsCount >= 10
      }
    ];

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: adTasks
    });
  } catch (error) {
    console.error('Error getting ad tasks:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
