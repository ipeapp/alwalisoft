import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

/**
 * GET /api/achievements
 * جلب جميع الإنجازات مع تقدم المستخدم
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // جلب جميع الإنجازات
    const achievements = await prisma.achievement.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { category: 'asc' },
        { priority: 'desc' },
        { target: 'asc' }
      ]
    });
    
    // جلب تقدم المستخدم
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId }
    });
    
    // دمج البيانات
    const achievementsWithProgress = achievements.map(achievement => {
      const userAch = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      return {
        ...achievement,
        progress: userAch?.progress || 0,
        isUnlocked: userAch?.isUnlocked || false,
        unlockedAt: userAch?.unlockedAt || null,
        rewardClaimed: userAch?.rewardClaimed || false
      };
    });
    
    // إحصائيات
    const unlockedCount = achievementsWithProgress.filter(a => a.isUnlocked).length;
    const totalRewards = achievementsWithProgress
      .filter(a => a.isUnlocked && a.rewardClaimed)
      .reduce((sum, a) => sum + a.reward, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        achievements: achievementsWithProgress,
        stats: {
          total: achievements.length,
          unlocked: unlockedCount,
          totalRewards
        }
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
