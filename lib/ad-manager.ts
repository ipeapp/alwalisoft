/**
 * Google AdMob Integration Manager - محسّن
 * قراءة المتغيرات من env، إدارة حدود المشاهدة اليومية، حساب المكافآت،
 * وتسجيل المشاهدات عبر prisma.
 */
import { prisma } from './prisma';

export type AdType = 'REWARDED_VIDEO' | 'INTERSTITIAL' | 'BANNER';

export interface AdConfig {
  appId: string;
  rewardedVideoId: string;
  interstitialId: string;
  bannerId: string;
  useTestAds: boolean;
  dailyLimit: number;
  rewardAmount: number;
}

export interface AdReward {
  success: boolean;
  type: AdType;
  amount: number;
  adUnitId?: string;
  message?: string;
}

class AdManager {
  private config: AdConfig;
  private initialized = false;

  constructor() {
    this.config = {
      appId: process.env.NEXT_PUBLIC_ADMOB_APP_ID || '',
      rewardedVideoId: process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID || '',
      interstitialId: process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || '',
      bannerId: process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || '',
      useTestAds: (process.env.NEXT_PUBLIC_USE_TEST_ADS === 'true') || false,
      dailyLimit: Number(process.env.NEXT_PUBLIC_AD_DAILY_LIMIT || 10),
      rewardAmount: Number(process.env.NEXT_PUBLIC_AD_REWARD_AMOUNT || 500),
    };
  }

  getAdUnitId(adType: AdType) {
    switch (adType) {
      case 'REWARDED_VIDEO':
        return this.config.rewardedVideoId;
      case 'INTERSTITIAL':
        return this.config.interstitialId;
      case 'BANNER':
        return this.config.bannerId;
      default:
        return '';
    }
  }

  calculateReward(adType: AdType) {
    // بسيط: يمكن توسيعه ليعتمد على المستوى/حالة المستخدم
    if (adType === 'REWARDED_VIDEO') return this.config.rewardAmount;
    return 0;
  }

  async canWatchAd(userId: string, adType: AdType) {
    // حساب عدد المشاهدات اليوم للمستخدم ونقارن بالحد اليومي
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const count = await prisma.adWatch.count({
      where: {
        userId,
        adType,
        createdAt: { gte: startOfDay },
      },
    });
    return count < this.config.dailyLimit;
  }

  async recordAdView(userId: string, adType: AdType, adUnitId?: string, reward = 0) {
    // يسجل مشاهدة الإعلان وكمية المكافأة (إن وجدت)
    try {
      await prisma.adWatch.create({
        data: {
          userId,
          adType,
          adUnitId: adUnitId || this.getAdUnitId(adType),
          reward,
        },
      });
    } catch (err) {
      console.error('[AdManager] recordAdView error:', err);
      // لا نكسر الطلب الرئيسي إذا فشل التسجيل
    }
  }

  /**
   * دالة تُستدعى من الـ API قبل إظهار الإعلان أو من العميل للحصول على معلومات:
   * - تتحقق من إمكانية المشاهدة
   * - ترجع معرف الوحدة الإعلانية وكمية المكافأة المتوقعة
   */
  async prepareRewardedForUser(userId: string): Promise<AdReward> {
    if (!this.config.rewardedVideoId) {
      return { success: false, type: 'REWARDED_VIDEO', amount: 0, message: 'Rewarded Ad unit not configured' };
    }
    const allowed = await this.canWatchAd(userId, 'REWARDED_VIDEO');
    if (!allowed) {
      return { success: false, type: 'REWARDED_VIDEO', amount: 0, message: 'Daily ad limit reached' };
    }
    const amount = this.calculateReward('REWARDED_VIDEO');
    return { success: true, type: 'REWARDED_VIDEO', amount, adUnitId: this.getAdUnitId('REWARDED_VIDEO') };
  }
}

export const adManager = new AdManager();
export default adManager;      await this.recordAdView(userId, 'INTERSTITIAL', reward);
      
      return true;
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }
  
  /**
   * تسجيل مشاهدة إعلان في قاعدة البيانات
   */
  async recordAdView(
    userId: string,
    adType: AdType,
    reward?: number
  ): Promise<void> {
    try {
      await prisma.adWatch.create({
        data: {
          userId,
          adType,
          adUnitId: this.getAdUnitId(adType),
          reward: reward || 0,
          completed: true
        }
      });
    } catch (error) {
      console.error('Error recording ad view:', error);
    }
  }
  
  /**
   * الحصول على إحصائيات الإعلانات للمستخدم
   */
  async getUserAdStats(userId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // عدد الإعلانات اليوم
      const todayCount = await prisma.adWatch.count({
        where: {
          userId,
          watchedAt: { gte: today }
        }
      });
      
      // إجمالي المشاهدات
      const totalCount = await prisma.adWatch.count({
        where: { userId }
      });
      
      // إجمالي المكافآت
      const totalRewards = await prisma.adWatch.aggregate({
        where: { userId },
        _sum: { reward: true }
      });
      
      return {
        todayCount,
        totalCount,
        totalRewards: totalRewards._sum.reward || 0
      };
    } catch (error) {
      console.error('Error getting user ad stats:', error);
      return {
        todayCount: 0,
        totalCount: 0,
        totalRewards: 0
      };
    }
  }
  
  /**
   * التحقق من الحد الأقصى للإعلانات اليومية
   */
  async canWatchAd(userId: string, adType: AdType): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCount = await prisma.adWatch.count({
        where: {
          userId,
          adType,
          watchedAt: { gte: today }
        }
      });
      
      // الحدود اليومية
      const limits: Record<AdType, number> = {
        REWARDED_VIDEO: 10,  // 10 فيديوهات في اليوم
        INTERSTITIAL: 20,    // 20 إعلان بيني في اليوم
        BANNER: 999999       // لا حد للبانر
      };
      
      return todayCount < limits[adType];
    } catch (error) {
      console.error('Error checking ad limit:', error);
      return false;
    }
  }
  
  /**
   * تحديث إحصائيات الإيرادات (للأدمن)
   */
  async updateAdRevenue(
    date: Date,
    adType: AdType,
    impressions: number,
    clicks: number,
    revenue: number
  ): Promise<void> {
    try {
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      
      const eCPM = impressions > 0 ? (revenue / impressions) * 1000 : 0;
      
      await prisma.adRevenue.upsert({
        where: {
          date_adType: {
            date: dateOnly,
            adType
          }
        },
        update: {
          impressions: { increment: impressions },
          clicks: { increment: clicks },
          revenue: { increment: revenue },
          eCPM
        },
        create: {
          date: dateOnly,
          adType,
          impressions,
          clicks,
          revenue,
          eCPM
        }
      });
    } catch (error) {
      console.error('Error updating ad revenue:', error);
    }
  }
}

// Singleton instance
export const adManager = new AdManager();
