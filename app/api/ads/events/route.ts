import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/ads/events
 * الحصول على الأحداث الخاصة النشطة
 */
export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // البحث عن الأحداث النشطة
    const activeEvent = await prisma.promotion.findFirst({
      where: {
        type: 'MULTIPLIER_EVENT',
        isActive: true,
        startsAt: { lte: new Date() },
        expiresAt: { gte: new Date() }
      },
      orderBy: {
        multiplier: 'desc' // أعلى مضاعف أولاً
      }
    });

    await prisma.$disconnect();

    if (activeEvent) {
      return NextResponse.json({
        success: true,
        data: {
          active: true,
          name: activeEvent.name,
          description: activeEvent.description,
          multiplier: activeEvent.multiplier,
          startsAt: activeEvent.startsAt,
          endsAt: activeEvent.expiresAt
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        data: {
          active: false
        }
      });
    }
  } catch (error) {
    console.error('Error getting events:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
