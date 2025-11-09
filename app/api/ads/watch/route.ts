import { NextRequest, NextResponse } from 'next/server';
import { multiPlatformAdManager } from '@/lib/multi-platform-ad-manager';
import { adVerification } from '@/lib/ad-verification';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const body = await request.json();
    const { userId, adType = 'REWARDED_VIDEO', platform, verification } = body;

    console.log('🎬 Ad watch request:', { userId, adType, platform, hasVerification: !!verification });

    if (!userId) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'Missing userId'
      }, { status: 400 });
    }

    // التحقق من المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // التحقق من صحة المشاهدة (Anti-Cheat)
    if (verification) {
      const verificationResult = await adVerification.verifyAdWatch(userId, {
        startTime: verification.startTime,
        endTime: verification.endTime,
        adType,
        platform: platform || 'ADMOB',
        clientFingerprint: verification.clientFingerprint,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
      });

      if (!verificationResult.valid) {
        console.log('❌ Verification failed:', verificationResult);
        await prisma.$disconnect();
        
        return NextResponse.json({
          success: false,
          error: 'VERIFICATION_FAILED',
          message: `فشل التحقق: ${verificationResult.reason}`,
          confidence: verificationResult.confidence,
          flags: verificationResult.flags
        }, { status: 400 });
      }

      console.log('✅ Verification passed:', verificationResult.confidence);
    }

    // التحقق من الحد الأقصى اليومي
    const canWatch = await multiPlatformAdManager.canWatchAd(userId, adType);
    
    if (!canWatch) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'وصلت للحد الأقصى من الإعلانات اليوم',
        message: 'يمكنك مشاهدة المزيد غداً'
      }, { status: 429 });
    }

    // اختيار المنصة
    const selectedPlatform = platform 
      ? multiPlatformAdManager.getPlatform(platform)
      : multiPlatformAdManager.selectBestPlatform(adType);

    if (!selectedPlatform) {
      await prisma.$disconnect();
      return NextResponse.json({
        success: false,
        error: 'No ad platform available'
      }, { status: 503 });
    }

    // حساب المكافأة الأساسية
    const baseReward = multiPlatformAdManager.calculateReward(
      selectedPlatform.platform,
      adType
    );

    // حساب السلسلة (Streak)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayWatch = await prisma.adWatch.findFirst({
      where: {
        userId,
        watchedAt: {
          gte: yesterday,
          lt: today
        }
      }
    });

    // حساب الـ Streak الحالية
    let currentStreak = 0;
    if (yesterdayWatch) {
      const userStats = await prisma.userStatistics.findUnique({
        where: { userId }
      });
      currentStreak = (userStats?.currentStreak || 0) + 1;
    } else {
      currentStreak = 1;
    }

    // حساب مكافأة السلسلة
    let streakBonus = 0;
    if (currentStreak >= 30) {
      streakBonus = 200;
    } else if (currentStreak >= 7) {
      streakBonus = 100;
    } else if (currentStreak >= 3) {
      streakBonus = 50;
    }

    // التحقق من الأحداث الخاصة
    const activeEvent = await prisma.promotion.findFirst({
      where: {
        type: 'MULTIPLIER_EVENT',
        isActive: true,
        startsAt: { lte: new Date() },
        expiresAt: { gte: new Date() }
      }
    });

    let eventMultiplier = 1.0;
    if (activeEvent) {
      eventMultiplier = activeEvent.multiplier;
    }

    // Trust Score يؤثر على المكافأة
    const trustScore = verification ? 
      await adVerification['getUserTrustScore'](userId) : 100;
    
    const trustMultiplier = trustScore >= 80 ? 1.0 : 
                           trustScore >= 60 ? 0.9 : 
                           trustScore >= 40 ? 0.8 : 0.7;

    // المكافأة النهائية
    const finalReward = Math.floor((baseReward + streakBonus) * eventMultiplier * trustMultiplier);
    
    console.log('💰 Reward calculation:', {
      base: baseReward,
      streakBonus,
      eventMultiplier,
      trustScore,
      trustMultiplier,
      final: finalReward,
      streak: currentStreak
    });

    // تسجيل المشاهدة في قاعدة البيانات
    await prisma.$transaction(async (tx) => {
      // 1. تسجيل مشاهدة الإعلان
      const adUnitId = adType === 'REWARDED_VIDEO' 
        ? selectedPlatform.rewardedVideoId
        : adType === 'INTERSTITIAL'
        ? selectedPlatform.interstitialId
        : selectedPlatform.bannerId;

      await tx.adWatch.create({
        data: {
          userId,
          adType,
          platform: selectedPlatform.platform,
          adUnitId: adUnitId || 'unknown',
          reward: finalReward,
          completed: true
        }
      });

      // 2. إضافة المكافأة للمحفظة
      await tx.wallet.upsert({
        where: { userId },
        update: {
          balance: { increment: finalReward }
        },
        create: {
          userId,
          balance: finalReward
        }
      });

      // 3. تحديث الإحصائيات والسلسلة
      await tx.userStatistics.upsert({
        where: { userId },
        update: {
          currentStreak,
          longestStreak: {
            set: Math.max(currentStreak, 0)
          }
        },
        create: {
          userId,
          currentStreak,
          longestStreak: currentStreak
        }
      });

      // 4. إنشاء إشعار
      await tx.notification.create({
        data: {
          userId,
          type: 'REWARD_RECEIVED',
          title: 'مكافأة الإعلان',
          message: `حصلت على ${finalReward.toLocaleString()} عملة من مشاهدة الإعلان!${
            streakBonus > 0 ? ` 🔥 +${streakBonus} مكافأة السلسلة!` : ''
          }${
            eventMultiplier > 1 ? ` 🎉 ×${eventMultiplier} حدث خاص!` : ''
          }${
            trustScore < 80 ? ` ⚠️ درجة الثقة: ${trustScore}%` : ''
          }`,
          data: {
            type: 'ad_reward',
            amount: finalReward,
            adType,
            platform: selectedPlatform.platform,
            streak: currentStreak,
            bonus: streakBonus,
            trustScore
          }
        }
      });
    });

    console.log('✅ Ad watch recorded successfully');

    // الحصول على الرصيد الجديد
    const updatedWallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: {
        reward: finalReward,
        baseReward,
        bonus: streakBonus,
        multiplier: eventMultiplier,
        streak: currentStreak,
        platform: selectedPlatform.platform,
        trustScore,
        newBalance: updatedWallet?.balance || 0,
        message: `حصلت على ${finalReward.toLocaleString()} عملة!`
      }
    });
  } catch (error) {
    console.error('Error recording ad watch:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
