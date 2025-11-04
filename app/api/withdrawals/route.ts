import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { requestedAt: 'desc' },
        include: {
          user: {
            select: {
              username: true,
              telegramId: true,
            },
          },
        },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    return successResponse({
      withdrawals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/withdrawals error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, walletAddress, network = 'TRC20' } = await request.json();

    if (!userId || !amount || !walletAddress) {
      return errorResponse('Missing required fields');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Check balance
    const amountBigInt = BigInt(amount);
    if (user.balance < amountBigInt) {
      return errorResponse('Insufficient balance', 400);
    }

    // Check minimum withdrawal
    const minAmount = BigInt(5000000); // 5 USDT
    if (amountBigInt < minAmount) {
      return errorResponse('Amount is below minimum withdrawal', 400);
    }

    // Calculate USDT amount
    const usdtAmount = Number(amountBigInt) / 1000000;

    // Create withdrawal request
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Lock balance
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: amountBigInt },
        },
      });

      // Update wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          lockedBalance: { increment: amountBigInt },
        },
      });

      // Create withdrawal
      const newWithdrawal = await tx.withdrawal.create({
        data: {
          userId,
          amount: amountBigInt,
          usdtAmount,
          walletAddress,
          network,
          status: 'PENDING',
        },
      });

      return newWithdrawal;
    });

    return successResponse(withdrawal, 'Withdrawal request created successfully');
  } catch (error) {
    console.error('POST /api/withdrawals error:', error);
    return errorResponse('Internal server error', 500);
  }
}
