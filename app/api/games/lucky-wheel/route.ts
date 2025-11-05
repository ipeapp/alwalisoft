import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { telegramId: String(userId) }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Generate random reward (100-10000 coins)
    const possibleRewards = [100, 200, 500, 1000, 2000, 5000, 10000];
    const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

    // Update user balance
    await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: user.balance + reward
      }
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'GAME_REWARD',
        amount: reward,
        description: `Lucky Wheel reward: ${reward} coins`
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      reward,
      newBalance: user.balance + reward,
      message: 'Game completed successfully'
    });
  } catch (error) {
    console.error('Error in lucky wheel game:', error);
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: false,
      message: 'An error occurred while playing the game'
    }, { status: 500 });
  }
}
