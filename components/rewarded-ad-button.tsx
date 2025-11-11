'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

interface Props {
  rewardAmount?: number;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  onAdComplete?: (reward: number) => void;
  onAdFailed?: (error: string) => void;
  children?: React.ReactNode;
}

export function RewardedAdButton({ 
  rewardAmount, 
  buttonText = 'شاهد إعلان واربح', 
  className = '',
  disabled = false,
  onAdComplete,
  onAdFailed,
  children
}: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [showAdSimulation, setShowAdSimulation] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Load Ad SDK only in production and when ad unit exists
    const isProd = process.env.NODE_ENV === 'production';
    const adUnit = process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID;
    
    if (isProd && adUnit && typeof window !== 'undefined') {
      loadAdMobScript().then(() => {
        console.log('AdMob SDK loaded successfully');
      }).catch((error) => {
        console.error('Failed to load AdMob SDK:', error);
        setSdkLoaded(false);
      });
    } else {
      // Test/dev mode: mark as loaded (we simulate)
      console.log('Development mode - using simulated ads');
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

  const simulateAdWithUI = async (userId: string, amount: number): Promise<number> => {
    setShowAdSimulation(true);
    setCountdown(3);
    
    // عد تنازلي مرئي
    for (let i = 3; i > 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(i - 1);
    }
    
    await claimReward(userId, amount);
    setShowAdSimulation(false);
    return amount;
  };

  const handleClick = async () => {
    if (!user) {
      onAdFailed?.('قم بتسجيل الدخول لمشاهدة الإعلان');
      return;
    }

    if (disabled) {
      onAdFailed?.('لقد وصلت إلى الحد الأقصى اليومي للإعلانات');
      return;
    }

    setLoading(true);

    try {
      // 1) Check if user can watch ad and get reward details
      const prep = await fetch('/api/ads/prepare-rewarded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      }).then((r) => r.json());

      if (!prep?.success) {
        onAdFailed?.(prep?.message || 'غير مسموح حالياً بمشاهدة الإعلان');
        setLoading(false);
        return;
      }

      // 2) Development/Simulation mode
      const isDev = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID;
      if (isDev) {
        console.log('Development mode: Simulating ad view');
        const reward = await simulateAdWithUI(user.id, prep.amount);
        setLoading(false);
        onAdComplete?.(reward);
        return;
      }

      // 3) حاول استخدام إعلانات Telegram أولاً
      // استخدام any لتجنب أخطاء TypeScript
      const telegramWebApp = (window as any).Telegram?.WebApp;
      if (telegramWebApp && typeof telegramWebApp.showAd === 'function') {
        try {
          console.log('Attempting to show Telegram ad');
          
          // عرض إعلان Telegram
          telegramWebApp.showAd({
            ad_type: 'rewarded_video',
            onAdReceived: () => {
              console.log('Telegram ad received successfully');
            },
            onAdClosed: (receivedReward: boolean) => {
              console.log('Telegram ad closed, reward received:', receivedReward);
              if (receivedReward) {
                claimReward(user.id, prep.amount);
                onAdComplete?.(prep.amount);
              } else {
                onAdFailed?.('لم تكمل مشاهدة الإعلان');
              }
              setLoading(false);
            }
          });
          
          return; // الخروج لأن Telegram سيتعامل مع الباقي
          
        } catch (telegramError) {
          console.error('Telegram ad error, falling back to simulation:', telegramError);
          // استخدم المحاكاة كحل بديل
          const reward = await simulateAdWithUI(user.id, prep.amount);
          setLoading(false);
          onAdComplete?.(reward);
        }
      } else {
        // إذا لم يكن Telegram متاحاً، استخدم المحاكاة
        console.log('Telegram not available, using simulation');
        const reward = await simulateAdWithUI(user.id, prep.amount);
        setLoading(false);
        onAdComplete?.(reward);
      }

    } catch (err) {
      console.error('RewardedAdButton error:', err);
      onAdFailed?.('خطأ أثناء محاولة تشغيل الإعلان');
      setLoading(false);
      setShowAdSimulation(false);
    }
  };

  const claimReward = async (userId: string, amount: number) => {
    try {
      console.log('Claiming reward:', { userId, amount });
      
      const response = await fetch('/api/ads/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('Failed to claim reward');
      }
      
      const result = await response.json();
      console.log('Claim result:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to claim reward');
      }
      
      return result;
    } catch (error) {
      console.error('claimReward failed:', error);
      throw error;
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        
        className={className}
      >
        {loading ? 'جاري تحميل الإعلان...' : (children || buttonText)}
      </Button>

      {/* نافذة محاكاة الإعلان */}
      {showAdSimulation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
            <div className="text-2xl font-bold mb-4 text-green-600">جاري عرض الإعلان</div>
            <div className="text-lg mb-6 text-gray-700">
              سيتم منحك {rewardAmount || 500} عملة خلال: 
              <span className="font-bold text-xl mx-2">{countdown}</span> 
              ثانية
            </div>
            
            {/* شريط التقدم */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="h-4 bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-sm text-gray-500">
              الرجاء عدم إغلاق هذه النافذة
            </div>
            
            {/* زر إلغاء (اختياري) */}
            <button
              onClick={() => {
                setShowAdSimulation(false);
                setLoading(false);
                onAdFailed?.('تم إلغاء مشاهدة الإعلان');
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </>
  );
}
