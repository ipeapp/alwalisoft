import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * DELETE /api/admin/ads/events/[id]
 * Delete event
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const { id } = params;

    await prisma.promotion.delete({
      where: { id }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
