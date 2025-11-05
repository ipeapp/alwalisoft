import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const level = searchParams.get('level');

    if (!userId) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
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

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: {
        tree: referralTree,
        referrals,
      }
    });
  } catch (error) {
    console.error('GET /api/referrals error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
