import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * GET /api/games/stats?userId=xxx
 * جلب إحصائيات الألعاب للمستخدم
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count today's plays
    const playsToday = await prisma.gameSession.count({
      where: {
        userId,
        startedAt: { gte: today }
      }
    });
    
    // Get all game sessions count
    const totalGamesPlayed = await prisma.gameSession.count({
      where: { userId }
    });
    
    // Get best reward
    const bestReward = await prisma.gameSession.findFirst({
      where: { userId },
      orderBy: { reward: 'desc' },
      select: { reward: true }
    });
    
    // Get stats per game type
    const gameStats = await prisma.gameSession.groupBy({
      by: ['gameType'],
      where: { userId },
      _count: { gameType: true },
      _sum: { reward: true },
      _max: { reward: true }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        playsToday,
        bestReward: bestReward?.reward || 0,
        totalGamesPlayed,
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
