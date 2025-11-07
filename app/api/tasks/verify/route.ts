import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { autoCompleteTask } from '@/lib/task-verification';
import { notifyTaskCompleted } from '@/lib/notifications';
import { checkAchievements } from '@/lib/achievements';

export const dynamic = 'force-dynamic';

/**
 * POST /api/tasks/verify
 * التحقق التلقائي من المهمة وإكمالها
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, taskId, verificationData } = body;
    
    if (!userId || !taskId) {
      throw new ApiException('User ID and Task ID are required', 400, 'MISSING_FIELDS');
    }
    
    // التحقق وإكمال المهمة
    const result = await autoCompleteTask(userId, taskId, verificationData || {});
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }
    
    // إرسال إشعار
    if (result.reward) {
      await notifyTaskCompleted(userId, verificationData.taskName || 'Task', result.reward);
    }
    
    // التحقق من الإنجازات
    await checkAchievements(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        reward: result.reward
      },
      message: result.message
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
