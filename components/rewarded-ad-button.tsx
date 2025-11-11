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
        // Simulate ad loading and completion
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        // Claim the reward
        await claimReward(user.id, prep.amount);
        setLoading(false);
        onAdComplete?.(prep.amount);
        return;
      }

      // 3) Production mode with actual ad display
      console.log('Production mode: Attempting to display actual ad');
      
      // For now, we'll simulate in production too since actual ad integration needs more setup
      // In a real implementation, you would show the actual ad here
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await claimReward(user.id, prep.amount);
      setLoading(false);
      onAdComplete?.(prep.amount);

      // TODO: Uncomment and implement actual ad display when ready
      /*
      if (window.google && window.google.ads && window.google.ads.AdMob) {
        // Actual AdMob implementation would go here
        const ad = new window.google.ads.AdMob.RewardedAd({
          adUnitId: prep.adUnitId,
        });
        
        ad.addEventListener('rewarded', (event: any) => {
          claimReward(user.id, prep.amount);
          setLoading(false);
          onAdComplete?.(prep.amount);
        });
        
        ad.addEventListener('adfailedtoload', (event: any) => {
          console.error('Ad failed to load:', event);
          setLoading(false);
          onAdFailed?.('فشل تحميل الإعلان');
        });
        
        await ad.load();
        await ad.show();
      } else {
        throw new Error('AdMob SDK not available');
      }
      */

    } catch (err) {
      console.error('RewardedAdButton error:', err);
      onAdFailed?.('خطأ أثناء محاولة تشغيل الإعلان');
      setLoading(false);
    }
  };

  const claimReward = async (userId: string, amount: number) => {
    try {
      const response = await fetch('/api/ads/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to claim reward');
      }
      
      const result = await response.json();
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
    <Button 
      onClick={handleClick} 
      disabled={loading || !sdkLoaded || disabled} 
      className={className}
    >
      {loading ? 'جاري تحميل الإعلان...' : (children || buttonText)}
    </Button>
  );
}
