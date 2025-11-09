import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/ads/stats
 * الحصول على إحصائيات شاملة للإعلانات (للأدمن)
 */
export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // الإحصائيات العامة
    const totalViews = await prisma.adWatch.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayViews = await prisma.adWatch.count({
      where: {
        watchedAt: { gte: today }
      }
    });

    const totalRewards = await prisma.adWatch.aggregate({
      _sum: { reward: true }
    });

    // حسب النوع
    const byType = await prisma.adWatch.groupBy({
      by: ['adType'],
      _count: { adType: true },
      _sum: { reward: true }
    });

    // حسب المنصة
    const byPlatform = await prisma.adWatch.groupBy({
      by: ['platform'],
      _count: { platform: true },
      _sum: { reward: true }
    });

    // المستخدمين النشطون
    const activeUsers = await prisma.adWatch.groupBy({
      by: ['userId'],
      where: {
        watchedAt: { gte: today }
      },
      _count: { userId: true }
    });

    // آخر 7 أيام
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const weeklyStats = await prisma.adWatch.findMany({
      where: {
        watchedAt: { gte: last7Days }
      },
      select: {
        watchedAt: true,
        reward: true
      }
    });

    // تجميع البيانات اليومية
    const dailyStats = weeklyStats.reduce((acc: any, watch) => {
      const date = watch.watchedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { views: 0, rewards: 0 };
      }
      acc[date].views += 1;
      acc[date].rewards += watch.reward;
      return acc;
    }, {});

    // أفضل المستخدمين
    const topUsers = await prisma.adWatch.groupBy({
      by: ['userId'],
      _count: { userId: true },
      _sum: { reward: true },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: 10
    });

    // جلب بيانات المستخدمين
    const userIds = topUsers.map(u => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        username: true
      }
    });

    const topUsersWithDetails = topUsers.map(tu => {
      const user = users.find(u => u.id === tu.userId);
      return {
        userId: tu.userId,
        name: user?.firstName || user?.username || 'Unknown',
        views: tu._count.userId,
        totalReward: tu._sum.reward || 0
      };
    });

    // الإيرادات المتوقعة (eCPM estimation)
    const estimatedRevenue = {
      ADMOB: (byPlatform.find(p => p.platform === 'ADMOB')?._count.platform || 0) * 0.005, // $5 eCPM
      UNITY: (byPlatform.find(p => p.platform === 'UNITY')?._count.platform || 0) * 0.003, // $3 eCPM
      FACEBOOK: (byPlatform.find(p => p.platform === 'FACEBOOK')?._count.platform || 0) * 0.008, // $8 eCPM
      APPLOVIN: (byPlatform.find(p => p.platform === 'APPLOVIN')?._count.platform || 0) * 0.004, // $4 eCPM
    };

    const totalEstimatedRevenue = Object.values(estimatedRevenue).reduce((a, b) => a + b, 0);

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalViews,
          todayViews,
          totalRewards: totalRewards._sum.reward || 0,
          activeUsersToday: activeUsers.length,
          avgViewsPerUser: activeUsers.length > 0 
            ? (todayViews / activeUsers.length).toFixed(1) 
            : 0
        },
        byType: byType.map(t => ({
          adType: t.adType,
          views: t._count.adType,
          totalReward: t._sum.reward || 0
        })),
        byPlatform: byPlatform.map(p => ({
          platform: p.platform,
          views: p._count.platform,
          totalReward: p._sum.reward || 0,
          estimatedRevenue: estimatedRevenue[p.platform as keyof typeof estimatedRevenue] || 0
        })),
        dailyStats: Object.entries(dailyStats).map(([date, stats]: [string, any]) => ({
          date,
          views: stats.views,
          rewards: stats.rewards
        })),
        topUsers: topUsersWithDetails,
        revenue: {
          byPlatform: estimatedRevenue,
          total: totalEstimatedRevenue,
          currency: 'USD'
        }
      }
    });
  } catch (error) {
    console.error('Error getting admin ad stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
