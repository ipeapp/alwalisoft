import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * GET /api/wallet/stats?userId=xxx
 * حساب إحصائيات المحفظة
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // جلب المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, balance: true }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // حساب إجمالي المسحوبات (COMPLETED فقط)
    const completedWithdrawals = await prisma.withdrawal.aggregate({
      where: {
        userId,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });
    
    const totalWithdrawn = completedWithdrawals._sum.amount || 0;
    
    // حساب السحوبات المعلقة
    const pendingWithdrawals = await prisma.withdrawal.count({
      where: {
        userId,
        status: 'PENDING'
      }
    });
    
    // حساب أرباح هذا الأسبوع
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // بداية الأسبوع (الأحد)
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeekRewards = await prisma.rewardLedger.aggregate({
      where: {
        userId,
        amount: { gt: 0 }, // مكافآت موجبة فقط
        createdAt: { gte: weekStart }
      },
      _sum: {
        amount: true
      }
    });
    
    const thisWeekEarnings = thisWeekRewards._sum.amount || 0;
    
    // حساب إجمالي الأرباح (كل الوقت)
    const totalRewards = await prisma.rewardLedger.aggregate({
      where: {
        userId,
        amount: { gt: 0 }
      },
      _sum: {
        amount: true
      }
    });
    
    const totalEarned = totalRewards._sum.amount || 0;
    
    return NextResponse.json({
      success: true,
      data: {
        currentBalance: user.balance,
        totalEarned,
        totalWithdrawn,
        pendingWithdrawals,
        thisWeekEarnings,
        availableBalance: user.balance - (pendingWithdrawals * 1000) // تقدير
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
