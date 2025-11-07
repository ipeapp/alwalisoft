import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/users/[id]
 * تحديث حالة المستخدم (تعليق/حظر/تفعيل)
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { action, balance } = body;
    
    if (!id) {
      throw new ApiException('User ID is required', 400, 'MISSING_ID');
    }
    
    // جلب المستخدم
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    let updatedUser;
    
    // تنفيذ الإجراء
    switch (action) {
      case 'ban':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { status: 'BANNED' }
        });
        break;
        
      case 'suspend':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { status: 'SUSPENDED' }
        });
        break;
        
      case 'activate':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { status: 'ACTIVE' }
        });
        break;
        
      case 'update_balance':
        if (balance === undefined) {
          throw new ApiException('Balance is required', 400, 'MISSING_BALANCE');
        }
        updatedUser = await prisma.user.update({
          where: { id },
          data: { balance: parseInt(balance) }
        });
        break;
        
      default:
        throw new ApiException('Invalid action', 400, 'INVALID_ACTION');
    }
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/users/[id]
 * حذف مستخدم
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      throw new ApiException('User ID is required', 400, 'MISSING_ID');
    }
    
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
