import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/ads/events
 * Get all events (for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const events = await prisma.promotion.findMany({
      where: {
        type: 'MULTIPLIER_EVENT'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map isActive to active for frontend
    const formattedEvents = events.map(event => ({
      ...event,
      active: event.isActive
    }));

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: formattedEvents
    });
  } catch (error) {
    console.error('Error getting events:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/ads/events
 * Create new event
 */
export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const body = await request.json();
    const {
      name,
      description,
      multiplier,
      startDate,
      endDate,
      active = true
    } = body;

    if (!name || !startDate || !endDate || !multiplier) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const event = await prisma.promotion.create({
      data: {
        name,
        description: description || '',
        type: 'MULTIPLIER_EVENT',
        multiplier: parseFloat(multiplier),
        isActive: active,
        startsAt: new Date(startDate),
        expiresAt: new Date(endDate)
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
