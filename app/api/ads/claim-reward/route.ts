import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { adManager } from '@/lib/ad-manager';
import type { AdType } from '@/lib/ad-manager';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ads/claim-reward
 * المطالبة بمكافأة الإعلان
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, adType } = body;
    
    if (!userId || !adType) {
      throw new ApiException('User ID and Ad Type are required', 400, 'MISSING_FIELDS');
    }
    
    // التحقق من إمكانية المشاهدة
    const canWatch = await adManager.canWatchAd(userId, adType as AdType);
    
    if (!canWatch) {
      throw new ApiException('Daily ad limit reached', 429, 'RATE_LIMIT');
    }
    
    // جلب المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // حساب المكافأة
    const reward = adManager.calculateReward(adType as AdType);
    
    // Transaction
    const result = await prisma.$transaction(async (tx) => {
      // تسجيل مشاهدة الإعلان
      await tx.adWatch.create({
        data: {
          userId,
          adType: adType as AdType,
          adUnitId: adManager.getAdUnitId(adType as AdType),
          reward,
          completed: true
        }
      });
      
      // تحديث رصيد المستخدم
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: reward }
        }
      });
      
      // إنشاء سجل في RewardLedger
      await tx.rewardLedger.create({
        data: {
          userId,
          type: 'AD_REWARD',
          amount: reward,
          description: `Rewarded ${adType} ad watched`,
          balanceBefore: user.balance,
          balanceAfter: updatedUser.balance
        }
      });
      
      return updatedUser;
    });
    
    return NextResponse.json({
      success: true,
      data: {
        reward,
        newBalance: result.balance
      },
      message: 'Ad reward claimed successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
