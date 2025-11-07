import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

/**
 * POST /api/notifications/mark-all-read
 * وضع علامة مقروء على جميع إشعارات المستخدم
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // تحديث جميع الإشعارات غير المقروءة
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        updatedCount: result.count
      },
      message: `Marked ${result.count} notification(s) as read`
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
