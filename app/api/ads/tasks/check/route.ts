import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/ads/tasks/check
 * فحص وإكمال مهام الإعلانات
 */
export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'Missing userId'
      }, { status: 400 });
    }

    // الحصول على عدد الإعلانات اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAdsCount = await prisma.adWatch.count({
      where: {
        userId,
        watchedAt: { gte: today }
      }
    });

    // فحص المهام وإعطاء المكافآت
    const completedTasks = [];

    const tasks = [
      { id: 'ad-task-1', required: 1, reward: 100 },
      { id: 'ad-task-2', required: 3, reward: 300 },
      { id: 'ad-task-3', required: 5, reward: 500 },
      { id: 'ad-task-4', required: 10, reward: 1000 }
    ];

    for (const task of tasks) {
      if (todayAdsCount >= task.required) {
        // فحص إذا تم إكمال المهمة من قبل اليوم
        const taskCompleted = await prisma.taskCompletion.findFirst({
          where: {
            userId,
            taskId: task.id,
            completedAt: { gte: today }
          }
        });

        if (!taskCompleted) {
          // إكمال المهمة وإعطاء المكافأة
          await prisma.$transaction(async (tx) => {
            // تسجيل إكمال المهمة
            await tx.taskCompletion.create({
              data: {
                userId,
                taskId: task.id,
                rewardAmount: task.reward
              }
            });

            // إضافة المكافأة
            await tx.wallet.upsert({
              where: { userId },
              update: {
                balance: { increment: task.reward }
              },
              create: {
                userId,
                balance: task.reward
              }
            });

            // إشعار
            await tx.notification.create({
              data: {
                userId,
                type: 'REWARD_RECEIVED',
                title: 'مهمة مكتملة! 🎉',
                message: `أكملت مهمة الإعلانات! حصلت على ${task.reward.toLocaleString()} عملة`,
                data: {
                  taskId: task.id,
                  reward: task.reward
                }
              }
            });
          });

          completedTasks.push({
            id: task.id,
            reward: task.reward
          });

          console.log(`✅ Task ${task.id} completed for user ${userId}`);
        }
      }
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: {
        completedTasks,
        todayAdsCount
      }
    });
  } catch (error) {
    console.error('Error checking ad tasks:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
