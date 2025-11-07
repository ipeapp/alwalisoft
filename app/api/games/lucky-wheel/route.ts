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
    const { userId } = body;

    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { telegramId: String(userId) }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 });
    }

    // Check daily play limit (5 plays per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPlays = await prisma.gameSession.count({
      where: {
        userId: user.id,
        gameType: 'LUCKY_WHEEL',
        startedAt: { gte: today }
      }
    });

    if (todayPlays >= 5) {
      throw new ApiException('Daily play limit reached (5 plays)', 429, 'RATE_LIMIT');
    }

    // Generate random reward (100-10000 coins)
    const possibleRewards = [100, 200, 500, 1000, 2000, 5000, 10000];
    const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

    // Transaction: Update balance, create records, update stats
    const result = await prisma.$transaction(async (tx) => {
      // Update user balance
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: reward }
        }
      });

      // Create game session
      await tx.gameSession.create({
        data: {
          userId: user.id,
          gameType: 'LUCKY_WHEEL',
          status: 'COMPLETED',
          score: reward,
          reward,
          completedAt: new Date()
        }
      });

      // Create reward ledger
      await tx.rewardLedger.create({
        data: {
          userId: user.id,
          type: 'GAME_WIN',
          amount: reward,
          description: `Lucky Wheel reward: ${reward} coins`,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance
        }
      });

      // Update statistics
      await tx.userStatistics.upsert({
        where: { userId: user.id },
        update: {
          gamesPlayed: { increment: 1 }
        },
        create: {
          userId: user.id,
          gamesPlayed: 1
        }
      });

      return updatedUser;
    });

    // إرسال إشعار
    await notifyGameWin(user.id, 'Lucky Wheel', reward);

    // تحقق من إنجازات الألعاب
    await checkSpecificAchievement(user.id, 'gamer', todayPlays + 1);
    if (reward >= 10000) {
      await checkSpecificAchievement(user.id, 'lucky', 1);
    }

    return NextResponse.json({
      success: true,
      data: {
        reward,
        newBalance: result.balance,
        playsRemaining: 5 - todayPlays - 1
      },
      message: 'تم اللعب بنجاح!'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
