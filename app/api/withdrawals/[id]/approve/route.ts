import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { txHash, notes } = await request.json();
    const withdrawalId = params.id;

    if (!txHash) {
      return errorResponse('Transaction hash is required');
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true },
    });

    if (!withdrawal) {
      return errorResponse('Withdrawal not found', 404);
    }

    if (withdrawal.status !== 'PENDING') {
      return errorResponse('Withdrawal is not pending', 400);
    }

    // Update withdrawal and wallet
    const updated = await prisma.$transaction(async (tx) => {
      // Update withdrawal
      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'COMPLETED',
          txHash,
          processorNotes: notes,
          completedAt: new Date(),
        },
      });

      // Update wallet
      await tx.wallet.update({
        where: { userId: withdrawal.userId },
        data: {
          lockedBalance: { decrement: withdrawal.amount },
          totalWithdrawn: { increment: withdrawal.amount },
        },
      });

      // Update user statistics
      await tx.userStatistics.update({
        where: { userId: withdrawal.userId },
        data: {
          totalWithdrawals: { increment: withdrawal.amount },
        },
      });

      return updatedWithdrawal;
    });

    return successResponse(updated, 'Withdrawal approved successfully');
  } catch (error) {
    console.error('POST /api/withdrawals/[id]/approve error:', error);
    return errorResponse('Internal server error', 500);
  }
}
