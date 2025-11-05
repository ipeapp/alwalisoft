import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason, notes } = await request.json();
    const withdrawalId = params.id;

    if (!reason) {
      return errorResponse('Rejection reason is required');
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return errorResponse('Withdrawal not found', 404);
    }

    if (withdrawal.status !== 'PENDING') {
      return errorResponse('Withdrawal is not pending', 400);
    }

    // Update withdrawal and restore balance
    const updated = await prisma.$transaction(async (tx) => {
      // Update withdrawal
      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'REJECTED',
          failureReason: reason,
          processorNotes: notes,
        },
      });

      // Restore user balance
      await tx.user.update({
        where: { id: withdrawal.userId },
        data: {
          balance: { increment: withdrawal.amount },
        },
      });

      // Update wallet
      await tx.wallet.update({
        where: { userId: withdrawal.userId },
        data: {
          lockedBalance: { decrement: withdrawal.amount },
        },
      });

      return updatedWithdrawal;
    });

    return successResponse(updated, 'Withdrawal rejected');
  } catch (error) {
    console.error('POST /api/withdrawals/[id]/reject error:', error);
    return errorResponse('Internal server error', 500);
  }
}
