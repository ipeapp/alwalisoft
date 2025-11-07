import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

/**
 * PATCH /api/notifications/[id]
 * تحديث إشعار (وضع علامة مقروء)
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    // التحقق من وجود الإشعار
    const notification = await prisma.notification.findUnique({
      where: { id }
    });
    
    if (!notification) {
      throw new ApiException('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    }
    
    // تحديث
    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: body.isRead !== undefined ? body.isRead : true,
        readAt: body.isRead !== false ? new Date() : null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Notification updated successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/notifications/[id]
 * حذف إشعار واحد
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // التحقق من وجود الإشعار
    const notification = await prisma.notification.findUnique({
      where: { id }
    });
    
    if (!notification) {
      throw new ApiException('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    }
    
    // حذف
    await prisma.notification.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
