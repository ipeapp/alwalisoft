// app/api/ads/claim-reward/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { adManager } from '@/lib/ad-manager';
import type { AdType } from '@/lib/ad-manager';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received claim-reward request:', body); // Debug log
    
    const { userId, amount, adType = 'REWARDED_VIDEO' } = body;
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // If amount is provided, use it. Otherwise calculate based on adType
    let reward: number;
    if (amount !== undefined && amount !== null) {
      reward = Number(amount);
    } else {
      if (!adType) {
        throw new ApiException('Either amount or adType is required', 400, 'MISSING_REWARD_INFO');
      }
      reward = adManager.calculateReward(adType as AdType);
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
    
    console.log('Reward claimed successfully:', { userId, reward }); // Debug log
    
    return NextResponse.json({
      success: true,
      data: {
        reward,
        newBalance: result.balance
      },
      message: 'Ad reward claimed successfully'
    });
    
  } catch (error) {
    console.error('Error in claim-reward:', error);
    return handleApiError(error);
  }
}
