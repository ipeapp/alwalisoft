import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adManager } from '@/lib/ad-manager';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount } = body || {};
    if (!userId || typeof amount !== 'number') {
      return NextResponse.json({ success: false, message: 'userId and amount required' }, { status: 400 });
    }

    // تحقق من الحد اليومي مرة أخرى
    const can = await adManager.canWatchAd(userId, 'REWARDED_VIDEO');
    if (!can) {
      return NextResponse.json({ success: false, message: 'Daily ad limit reached' }, { status: 403 });
    }

    // آلية آمنة: تحديث المستخدم و wallet و إنشاء سجل مكافأة و adWatch داخل معاملة
    await prisma.$transaction(async (tx) => {
      // تحديث user balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      // تحديث أو إنشاء wallet
      await tx.wallet.upsert({
        where: { userId },
        create: {
          userId,
          balance: amount,
          totalEarned: amount,
          totalWithdrawn: 0,
        },
        update: {
          balance: { increment: amount },
          totalEarned: { increment: amount },
        },
      });

      // إضافة سجل في rewardLedger (إن وجد الموديل)
      try {
        await tx.rewardLedger.create({
          data: {
            userId,
            amount,
            type: 'AD_REWARD',
            description: 'Reward for watching ad',
          },
        });
      } catch (e) {
        // لو لم يكن هناك جدول rewardLedger، نتجاهل الخطأ
        console.warn('rewardLedger create skipped', e);
      }

      // تسجيل مشاهدة الإعلان في adWatch
      await tx.adWatch.create({
        data: {
          userId,
          adType: 'REWARDED_VIDEO',
          adUnitId: process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID || undefined,
          reward: amount,
        },
      });
    });

    return NextResponse.json({ success: true, message: 'reward granted' });
  } catch (err) {
    console.error('claim-reward error', err);
    return NextResponse.json({ success: false, message: 'server error' }, { status: 500 });
  }
}
