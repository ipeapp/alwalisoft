import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { validateRequired } from '@/lib/api-helpers';

/**
 * GET /api/notifications
 * جلب إشعارات المستخدم
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const unreadOnly = req.nextUrl.searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // جلب الإشعارات
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }
    
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
    
    // عدد غير المقروءة
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        total: notifications.length
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/notifications
 * إنشاء إشعار جديد (للنظام/الأدمن)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    validateRequired(body, ['userId', 'type', 'title', 'message']);
    
    const { userId, type, title, message, data } = body;
    
    // التحقق من المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // إنشاء الإشعار
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/notifications
 * حذف جميع الإشعارات المقروءة للمستخدم
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const readOnly = req.nextUrl.searchParams.get('readOnly') === 'true';
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    const where: any = { userId };
    if (readOnly) {
      where.isRead = true;
    }
    
    const result = await prisma.notification.deleteMany({
      where
    });
    
    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.count
      },
      message: `Deleted ${result.count} notification(s)`
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
