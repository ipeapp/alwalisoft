'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

interface Props {
  rewardAmount?: number;
  buttonText?: string;
  className?: string;
}

export function RewardedAdButton({ rewardAmount, buttonText = 'شاهد إعلان واربح', className = '' }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Load Ad SDK only in production and when ad unit exists
    const isProd = process.env.NODE_ENV === 'production';
    const adUnit = process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID;
    if (isProd && adUnit && typeof window !== 'undefined') {
      loadAdMobScript().catch(() => setSdkLoaded(false));
    } else {
      // Test/dev mode: mark as loaded (we simulate)
      setSdkLoaded(true);
    }
  }, []);

  const loadAdMobScript = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).adsbygoogle) {
        setSdkLoaded(true);
        return resolve();
      }
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        setSdkLoaded(true);
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load AdMob script');
        setSdkLoaded(false);
        reject(new Error('AdMob script load error'));
      };
      document.head.appendChild(script);
    });
  };

  const handleClick = async () => {
    if (!user) {
      alert('قم بتسجيل الدخول لمشاهدة الإعلان');
      return;
    }
    setLoading(true);

    try {
      // 1) اطلب من السيرفر بيانات إذا كان مسموحًا بالمشاهدة والمقدار
      const prep = await fetch('/api/ads/prepare-rewarded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      }).then((r) => r.json());

      if (!prep?.success) {
        alert(prep?.message || 'غير مسموح حالياً بمشاهدة الإعلان');
        setLoading(false);
        return;
      }

      // 2) في حال البيئة التطويرية: نحاكي العرض
      const isDev = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID;
      if (isDev) {
        // محاكاة: ننتظر 3 ثواني ثم نمنح المكافأة
        await new Promise((r) => setTimeout(r, 3000));
        await claimReward(user.id, prep.amount);
        setLoading(false);
        alert(`تم منحك ${prep.amount} عملة (وضع التطوير)`);
        return;
      }

      // 3) Production: هنا تضع منطق عرض الإعلان باستخدام الشبكة التي اخترتها.
      // بعد أن تتأكد أن المستخدم شاهد الإعلان (EARNED_REWARD)، نفعل endpoint claim:
      // ==> عند حصول EARNED_REWARD يجب استدعاء claimReward(user.id, prep.amount)
      alert('تم بدء عرض الإعلان — سيتم منح المكافأة عند انتهاء المشاهدة (Production).');
    } catch (err) {
      console.error('RewardedAdButton error', err);
      alert('خطأ أثناء محاولة تشغيل الإعلان.');
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (userId: string, amount: number) => {
    try {
      await fetch('/api/ads/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
    } catch (e) {
      console.error('claimReward failed', e);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading || !sdkLoaded} className={className}>
      {loading ? 'جاري التحميل...' : buttonText}
    </Button>
  );
}
