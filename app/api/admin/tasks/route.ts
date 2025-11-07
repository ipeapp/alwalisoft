import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/tasks
 * إنشاء مهمة جديدة
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      title,
      description,
      reward,
      difficulty,
      category,
      type,
      actionUrl,
      verificationData
    } = body;
    
    if (!title || !description || !reward) {
      throw new ApiException('Required fields missing', 400, 'MISSING_FIELDS');
    }
    
    const task = await prisma.task.create({
      data: {
        name: name || title,
        title,
        description,
        reward: parseInt(reward),
        difficulty: difficulty || 'MEDIUM',
        category: category || 'SOCIAL',
        type: type || 'SOCIAL_FOLLOW',
        actionUrl,
        verificationData: verificationData || {},
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
