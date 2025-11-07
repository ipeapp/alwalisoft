import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { notifyAchievementUnlocked } from '@/lib/notifications';

/**
 * POST /api/achievements/[id]/claim
 * المطالبة بمكافأة إنجاز
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: achievementId } = await context.params;
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // جلب الإنجاز
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    });
    
    if (!achievement) {
      throw new ApiException('Achievement not found', 404, 'ACHIEVEMENT_NOT_FOUND');
    }
    
    // جلب تقدم المستخدم
    const userAch = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    });
    
    // التحقق
    if (!userAch) {
      throw new ApiException('Achievement not unlocked', 400, 'NOT_UNLOCKED');
    }
    
    if (!userAch.isUnlocked) {
      throw new ApiException('Achievement not unlocked yet', 400, 'NOT_UNLOCKED');
    }
    
    if (userAch.rewardClaimed) {
      throw new ApiException('Reward already claimed', 400, 'ALREADY_CLAIMED');
    }
    
    // المطالبة بالمكافأة
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    const result = await prisma.$transaction(async (tx) => {
      // تحديث UserAchievement
      await tx.userAchievement.update({
        where: {
          userId_achievementId: {
            userId,
            achievementId
          }
        },
        data: {
          rewardClaimed: true
        }
      });
      
      // إضافة المكافأة
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: achievement.reward
          }
        }
      });
      
      // إضافة في RewardLedger
      await tx.rewardLedger.create({
        data: {
          userId,
          type: 'ACHIEVEMENT',
          amount: achievement.reward,
          description: `Achievement unlocked: ${achievement.name}`,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance
        }
      });
      
      return updatedUser;
    });
    
    // إرسال إشعار
    await notifyAchievementUnlocked(userId, achievement.name, achievement.reward);
    
    return NextResponse.json({
      success: true,
      data: {
        newBalance: result.balance,
        rewardAmount: achievement.reward
      },
      message: 'Achievement reward claimed successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
