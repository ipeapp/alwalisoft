import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { handleApiError, validateRequired } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let prisma: PrismaClient | null = null;

  try {
    const body = await req.json();
    
    validateRequired(body, ['name', 'description', 'reward', 'difficulty', 'category', 'type']);

    prisma = new PrismaClient();

    const task = await prisma.task.create({
      data: {
        name: body.name,
        description: body.description,
        reward: Number(body.reward),
        bonusReward: Number(body.bonusReward || 0),
        difficulty: body.difficulty,
        category: body.category,
        type: body.type,
        requirement: body.requirement || null,
        verificationData: body.verificationData || null,
        channelId: body.channelId || null,
        channelUsername: body.channelUsername || null,
        groupId: body.groupId || null,
        videoUrl: body.videoUrl || null,
        postUrl: body.postUrl || null,
        isActive: body.isActive !== false,
        isBonus: body.isBonus || false,
        isFeatured: body.isFeatured || false,
        minLevel: body.minLevel || 'BEGINNER',
        maxCompletions: body.maxCompletions || null,
        cooldownMinutes: body.cooldownMinutes || null,
        priority: Number(body.priority || 0),
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
      }
    });

    return NextResponse.json({
      success: true,
      data: task,
      message: 'تم إنشاء المهمة بنجاح'
    });
  } catch (error: any) {
    return handleApiError(error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
