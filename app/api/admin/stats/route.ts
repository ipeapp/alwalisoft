import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  let prisma: PrismaClient | null = null;

  try {
    prisma = new PrismaClient();

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUsers = await prisma.user.count({
      where: {
        lastActiveAt: { gte: sevenDaysAgo }
      }
    });

    // Get total tasks
    const totalTasks = await prisma.task.count();
    
    // Get active tasks
    const activeTasks = await prisma.task.count({
      where: { isActive: true }
    });

    // Get completed tasks
    const completedTasks = await prisma.taskCompletion.count();

    // Get total balance across all users
    const usersWithBalance = await prisma.user.aggregate({
      _sum: { balance: true }
    });
    const totalBalance = usersWithBalance._sum.balance || 0;

    // Get total withdrawals
    const totalWithdrawals = await prisma.withdrawal.count();

    // Get pending withdrawals
    const pendingWithdrawals = await prisma.withdrawal.count({
      where: { status: 'PENDING' }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalTasks,
        activeTasks,
        completedTasks,
        totalBalance,
        totalWithdrawals,
        pendingWithdrawals
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'حدث خطأ في جلب الإحصائيات'
    }, { status: 500 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
