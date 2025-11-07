import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * GET /api/games/stats
 * جلب إحصائيات الألعاب للمستخدم
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // عدد الألعاب اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const playsToday = await prisma.gameSession.count({
      where: {
        userId,
        startedAt: { gte: today }
      }
    });
    
    // أفضل مكافأة
    const bestReward = await prisma.gameSession.findFirst({
      where: { userId },
      orderBy: { reward: 'desc' },
      select: { reward: true }
    });
    
    // إحصائيات لكل لعبة
    const gameStats = await prisma.gameSession.groupBy({
      by: ['gameType'],
      where: { userId },
      _count: { gameType: true },
      _sum: { reward: true },
      _max: { reward: true }
    });
    
    // إجمالي الإحصائيات
    const statistics = await prisma.userStatistics.findUnique({
      where: { userId }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        playsToday,
        bestReward: bestReward?.reward || 0,
        totalGamesPlayed: statistics?.gamesPlayed || 0,
        gameStats: gameStats.map(stat => ({
          gameType: stat.gameType,
          plays: stat._count.gameType,
          totalReward: stat._sum.reward || 0,
          bestReward: stat._max.reward || 0
        }))
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
