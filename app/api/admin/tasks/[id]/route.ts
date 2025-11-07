import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/tasks/[id]
 * تحديث مهمة
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...body,
        reward: body.reward ? parseInt(body.reward) : undefined
      }
    });
    
    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/tasks/[id]
 * حذف مهمة
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    await prisma.task.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
