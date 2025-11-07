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
    const { userId, score, totalQuestions, reward } = body;

    if (!userId || score === undefined || !totalQuestions || !reward) {
      throw new ApiException('All fields are required', 400, 'MISSING_FIELDS');
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
        gameType: 'QUIZ_CHALLENGE',
        startedAt: { gte: today }
      }
    });

    if (todayPlays >= 10) {
      throw new ApiException('Daily play limit reached (10 plays)', 429, 'RATE_LIMIT');
    }

    // Validate reward (max 500 per game - 5 questions * 100)
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
          gameType: 'QUIZ_CHALLENGE',
          status: 'COMPLETED',
          score,
          reward: validatedReward,
          gameData: { totalQuestions, correctAnswers: score },
          completedAt: new Date()
        }
      });

      await tx.rewardLedger.create({
        data: {
          userId: user.id,
          type: 'GAME_WIN',
          amount: validatedReward,
          description: `Quiz Challenge: ${score}/${totalQuestions} correct`,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance
        }
      });

      await tx.userStatistics.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      });

      return updatedUser;
    });

    // إرسال إشعار
    await notifyGameWin(user.id, 'Quiz Challenge', validatedReward);
    
    // تحقق من الإنجازات
    await checkSpecificAchievement(user.id, 'gamer', todayPlays + 1);
    if (score === totalQuestions) {
      await checkSpecificAchievement(user.id, 'quiz_master', 1);
    }

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalQuestions,
        reward: validatedReward,
        newBalance: result.balance,
        playsRemaining: 10 - todayPlays - 1,
        percentage: ((score / totalQuestions) * 100).toFixed(0)
      },
      message: 'تم اللعب بنجاح!'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
