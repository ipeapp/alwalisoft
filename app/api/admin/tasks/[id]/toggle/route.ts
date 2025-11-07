import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/tasks/[id]/toggle
 * تفعيل/تعطيل مهمة
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get current status
    const task = await prisma.task.findUnique({
      where: { id },
      select: { isActive: true }
    });
    
    if (!task) {
      return NextResponse.json({
        success: false,
        message: 'Task not found'
      }, { status: 404 });
    }
    
    // Toggle status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isActive: !task.isActive }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: `Task ${updatedTask.isActive ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
