import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const level = searchParams.get('level');

    if (!userId) {
      return errorResponse('User ID is required');
    }

    // Get referral tree
    const referralTree = await prisma.referralTree.findUnique({
      where: { userId },
    });

    // Get detailed referrals
    const where: any = { referrerId: userId };
    if (level) where.level = parseInt(level);

    const referrals = await prisma.referral.findMany({
      where,
      include: {
        referred: {
          select: {
            username: true,
            firstName: true,
            tasksCompleted: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({
      tree: referralTree,
      referrals,
    });
  } catch (error) {
    console.error('GET /api/referrals error:', error);
    return errorResponse('Internal server error', 500);
  }
}
