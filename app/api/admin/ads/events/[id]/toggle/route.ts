import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * PATCH /api/admin/ads/events/[id]/toggle
 * Toggle event active status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const { id } = params;
    const body = await request.json();
    const { active } = body;

    const event = await prisma.promotion.update({
      where: { id },
      data: { isActive: active }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error toggling event:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
