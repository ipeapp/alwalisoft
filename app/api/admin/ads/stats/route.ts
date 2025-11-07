import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/ads/stats
 * إحصائيات الإعلانات للأدمن
 */
export async function GET(req: NextRequest) {
  try {
    // إجمالي المشاهدات
    const totalViews = await prisma.adWatch.count();
    
    // المشاهدات اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayViews = await prisma.adWatch.count({
      where: {
        watchedAt: { gte: today }
      }
    });
    
    // إجمالي المكافآت
    const totalRewards = await prisma.adWatch.aggregate({
      _sum: { reward: true }
    });
    
    // إحصائيات حسب النوع
    const statsByType = await prisma.adWatch.groupBy({
      by: ['adType'],
      _count: { adType: true },
      _sum: { reward: true }
    });
    
    // أكثر المستخدمين مشاهدة
    const topWatchers = await prisma.adWatch.groupBy({
      by: ['userId'],
      _count: { userId: true },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        todayViews,
        totalRewards: totalRewards._sum.reward || 0,
        byType: statsByType.map(stat => ({
          adType: stat.adType,
          views: stat._count.adType,
          totalReward: stat._sum.reward || 0
        })),
        topWatchers: topWatchers.map(watcher => ({
          userId: watcher.userId,
          views: watcher._count.userId
        }))
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
