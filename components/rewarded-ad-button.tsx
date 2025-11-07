'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Coins } from 'lucide-react';

interface RewardedAdButtonProps {
  userId: string;
  rewardAmount: number;
  buttonText?: string;
  onRewardEarned?: (amount: number) => void;
  className?: string;
}

/**
 * RewardedAdButton Component
 * زر لعرض إعلان فيديو بمكافأة
 */
export function RewardedAdButton({
  userId,
  rewardAmount,
  buttonText = 'شاهد إعلان واربح',
  onRewardEarned,
  className
}: RewardedAdButtonProps) {
  const [loading, setLoading] = useState(false);
  const [canWatch, setCanWatch] = useState(true);
  
  const handleWatchAd = async () => {
    if (!userId || loading || !canWatch) return;
    
    setLoading(true);
    
    try {
      // التحقق من الحد الأقصى
      const checkResponse = await fetch(`/api/ads/check?userId=${userId}&adType=REWARDED_VIDEO`);
      const checkData = await checkResponse.json();
      
      if (!checkData.canWatch) {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert('⚠️ لقد وصلت للحد الأقصى من الإعلانات اليوم');
        }
        setCanWatch(false);
        return;
      }
      
      // في الإنتاج: عرض إعلان AdMob الفعلي هنا
      // للتطوير: محاكاة عرض الإعلان
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // تسجيل المشاهدة والمطالبة بالمكافأة
      const response = await fetch('/api/ads/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          adType: 'REWARDED_VIDEO'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(`✅ تهانينا! ربحت ${data.data.reward.toLocaleString()} عملة`);
        }
        
        if (onRewardEarned) {
          onRewardEarned(data.data.reward);
        }
      } else {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(`❌ ${data.message || 'فشل عرض الإعلان'}`);
        }
      }
    } catch (error) {
      console.error('Error watching ad:', error);
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('❌ حدث خطأ، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleWatchAd}
      disabled={loading || !canWatch}
      className={`${className} ${!canWatch ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          جارٍ التحميل...
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          {buttonText}
          <Coins className="w-4 h-4 ml-2 text-yellow-400" />
          <span className="text-yellow-400 font-bold">+{rewardAmount}</span>
        </>
      )}
    </Button>
  );
}
