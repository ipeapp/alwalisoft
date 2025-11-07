/**
 * Google AdMob Integration Manager
 * إدارة الإعلانات ومكافآتها
 */

import { prisma } from './prisma';

export type AdType = 'REWARDED_VIDEO' | 'INTERSTITIAL' | 'BANNER';

export interface AdConfig {
  appId: string;
  rewardedVideoId: string;
  interstitialId: string;
  bannerId: string;
}

export interface AdReward {
  type: string;
  amount: number;
}

/**
 * AdManager Class
 * إدارة الإعلانات والمكافآت
 */
class AdManager {
  private config: AdConfig;
  
  constructor() {
    this.config = {
      appId: process.env.NEXT_PUBLIC_ADMOB_APP_ID || '',
      rewardedVideoId: process.env.NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID || '',
      interstitialId: process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || '',
      bannerId: process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || ''
    };
  }
  
  /**
   * الحصول على معرف الإعلان حسب النوع
   */
  getAdUnitId(adType: AdType): string {
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
  
  /**
   * حساب المكافأة بناءً على نوع الإعلان
   */
  calculateReward(adType: AdType): number {
    switch (adType) {
      case 'REWARDED_VIDEO':
        return 500; // 500 عملة لكل إعلان فيديو
      case 'INTERSTITIAL':
        return 100; // 100 عملة للإعلان البيني
      case 'BANNER':
        return 0; // لا مكافأة للبانر
      default:
        return 0;
    }
  }
  
  /**
   * عرض إعلان فيديو بمكافأة
   */
  async showRewardedAd(userId: string): Promise<AdReward | null> {
    try {
      // في الإنتاج، هنا يتم عرض الإعلان الفعلي باستخدام AdMob SDK
      // للتطوير: نعتبر الإعلان تم عرضه بنجاح
      
      const reward = this.calculateReward('REWARDED_VIDEO');
      
      // تسجيل مشاهدة الإعلان
      await this.recordAdView(userId, 'REWARDED_VIDEO', reward);
      
      return {
        type: 'coins',
        amount: reward
      };
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return null;
    }
  }
  
  /**
   * عرض إعلان بيني
   */
  async showInterstitialAd(userId: string): Promise<boolean> {
    try {
      // في الإنتاج، هنا يتم عرض الإعلان الفعلي
      // للتطوير: نعتبر الإعلان تم عرضه
      
      const reward = this.calculateReward('INTERSTITIAL');
      
      // تسجيل مشاهدة الإعلان
      await this.recordAdView(userId, 'INTERSTITIAL', reward);
      
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
