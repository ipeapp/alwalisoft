import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, verified = false } = await request.json();
    const taskId = params.id;

    if (!userId || !taskId) {
      return errorResponse('Missing required fields');
    }

    // Get task and user
    const [task, user] = await Promise.all([
      prisma.task.findUnique({ where: { id: taskId } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!task) {
      return errorResponse('Task not found', 404);
    }

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Check if already completed
    const existingCompletion = await prisma.taskCompletion.findFirst({
      where: {
        userId,
        taskId,
      },
    });

    if (existingCompletion) {
      return errorResponse('Task already completed', 409);
    }

    // Complete task and award coins
    const reward = BigInt(task.reward + (task.bonusReward || 0));

    const result = await prisma.$transaction(async (tx) => {
      // Update user balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: reward },
          tasksCompleted: { increment: 1 },
        },
      });

      // Create task completion
      const completion = await tx.taskCompletion.create({
        data: {
          userId,
          taskId,
          rewardAmount: Number(reward),
          verified,
        },
      });

      // Update wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { increment: reward },
          totalEarned: { increment: reward },
        },
      });

      // Create reward ledger entry
      await tx.rewardLedger.create({
        data: {
          userId,
          type: 'TASK_COMPLETION',
          amount: reward,
          description: `Completed task: ${task.name}`,
          balanceBefore: user.balance,
          balanceAfter: user.balance + reward,
        },
      });

      // Update statistics
      await tx.userStatistics.update({
        where: { userId },
        data: {
          dailyEarnings: { increment: reward },
          weeklyEarnings: { increment: reward },
          monthlyEarnings: { increment: reward },
          totalEarnings: { increment: reward },
          lastTaskCompletedAt: new Date(),
        },
      });

      // Update task completions count
      await tx.task.update({
        where: { id: taskId },
        data: {
          completionsCount: { increment: 1 },
        },
      });

      return {
        completion,
        newBalance: updatedUser.balance,
        reward,
      };
    });

    return successResponse({
      rewardAmount: Number(result.reward),
      newBalance: Number(result.newBalance),
      verified,
    }, 'Task completed successfully');
  } catch (error) {
    console.error('POST /api/tasks/[id]/complete error:', error);
    return errorResponse('Internal server error', 500);
  }
}
