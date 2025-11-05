import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sortBy') || 'balance';
    const limit = parseInt(searchParams.get('limit') || '50');

    let orderBy: any = { balance: 'desc' };
    
    if (sortBy === 'tasks') {
      orderBy = { tasksCompleted: 'desc' };
    }

    const users = await prisma.user.findMany({
      orderBy,
      take: limit,
      select: {
        id: true,
        username: true,
        firstName: true,
        balance: true,
        tasksCompleted: true,
        level: true
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching leaderboard'
    }, { status: 500 });
  }
}
