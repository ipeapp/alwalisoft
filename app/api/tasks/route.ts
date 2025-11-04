import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const active = searchParams.get('active');
    const level = searchParams.get('level');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (category) where.category = category;
    if (type) where.type = type;
    if (active !== null) where.isActive = active === 'true';
    if (level) where.minLevel = level;

    // Only active and not expired tasks
    if (active !== 'false') {
      where.isActive = true;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { priority: 'desc' },
          { reward: 'desc' },
        ],
      }),
      prisma.task.count({ where }),
    ]);

    return successResponse({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      category,
      type,
      difficulty,
      reward,
      bonusReward,
      minLevel,
      maxCompletions,
      requirement,
      verificationData,
      channelId,
      channelUsername,
      groupId,
      videoUrl,
      postUrl,
      isBonus,
      isFeatured,
      startsAt,
      expiresAt,
      cooldownMinutes,
      priority,
    } = body;

    // Validate required fields
    if (!name || !description || !category || !type || !reward) {
      return errorResponse('Missing required fields');
    }

    const task = await prisma.task.create({
      data: {
        name,
        description,
        category,
        type,
        difficulty: difficulty || 'EASY',
        reward,
        bonusReward,
        minLevel: minLevel || 'BEGINNER',
        maxCompletions,
        requirement,
        verificationData,
        channelId,
        channelUsername,
        groupId,
        videoUrl,
        postUrl,
        isBonus: isBonus || false,
        isFeatured: isFeatured || false,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        cooldownMinutes,
        priority: priority || 0,
      },
    });

    return successResponse(task, 'Task created successfully');
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return errorResponse('Internal server error', 500);
  }
}
