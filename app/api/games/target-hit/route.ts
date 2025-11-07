import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { notifyGameWin } from '@/lib/notifications';
import { checkSpecificAchievement } from '@/lib/achievements';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, score, reward } = body;

    if (!userId || score === undefined || !reward) {
      throw new ApiException('User ID, score and reward are required', 400, 'MISSING_FIELDS');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { telegramId: String(userId) }
    });

    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check daily play limit (10 plays per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPlays = await prisma.gameSession.count({
      where: {
        userId: user.id,
        gameType: 'TARGET_HIT',
        startedAt: { gte: today }
      }
    });

    if (todayPlays >= 10) {
      throw new ApiException('Daily play limit reached (10 plays)', 429, 'RATE_LIMIT');
    }

    // Validate reward (max 500 per game)
    const validatedReward = Math.min(reward, 500);

    // Transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { balance: { increment: validatedReward } }
      });

      await tx.gameSession.create({
        data: {
          userId: user.id,
          gameType: 'TARGET_HIT',
          status: 'COMPLETED',
          score,
          reward: validatedReward,
          completedAt: new Date()
        }
      });

      await tx.rewardLedger.create({
        data: {
          userId: user.id,
          type: 'GAME_WIN',
          amount: validatedReward,
          description: `Target Hit: Score ${score}`,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance
        }
      });

      await tx.userStatistics.upsert({
        where: { userId: user.id },
        update: { gamesPlayed: { increment: 1 } },
        create: { userId: user.id, gamesPlayed: 1 }
      });

      return updatedUser;
    });

    // إرسال إشعار
    await notifyGameWin(user.id, 'Target Hit', validatedReward);
    
    // تحقق من الإنجازات
    await checkSpecificAchievement(user.id, 'gamer', todayPlays + 1);

    return NextResponse.json({
      success: true,
      data: {
        score,
        reward: validatedReward,
        newBalance: result.balance,
        playsRemaining: 10 - todayPlays - 1
      },
      message: 'تم اللعب بنجاح!'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
