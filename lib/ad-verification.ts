/**
 * Ad Verification & Anti-Cheat System
 * نظام التحقق من مشاهدة الإعلانات ومنع التلاعب
 */

import { PrismaClient } from '@prisma/client';

interface AdVerificationResult {
  valid: boolean;
  reason?: string;
  confidence: number; // 0-100
  flags: string[];
}

interface UserAdHistory {
  userId: string;
  recentAds: Date[];
  suspiciousActivity: boolean;
  trustScore: number; // 0-100
}

/**
 * Ad Verification Service
 */
export class AdVerificationService {
  private prisma: PrismaClient;
  
  // معايير الكشف عن التلاعب
  private readonly MAX_ADS_PER_MINUTE = 2;
  private readonly MIN_AD_DURATION = 15000; // 15 ثانية
  private readonly MAX_DAILY_ADS = 10;
  private readonly SUSPICIOUS_PATTERN_THRESHOLD = 5;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * التحقق من صحة مشاهدة الإعلان
   */
  async verifyAdWatch(
    userId: string,
    adData: {
      startTime: number;
      endTime: number;
      adType: string;
      platform: string;
      clientFingerprint?: string;
      ipAddress?: string;
    }
  ): Promise<AdVerificationResult> {
    const flags: string[] = [];
    let confidence = 100;

    // 1. التحقق من المدة الزمنية
    const duration = adData.endTime - adData.startTime;
    if (duration < this.MIN_AD_DURATION) {
      flags.push('TOO_SHORT');
      confidence -= 40;
    }

    // 2. التحقق من معدل المشاهدة
    const recentAds = await this.getRecentAds(userId, 60000); // آخر دقيقة
    if (recentAds.length >= this.MAX_ADS_PER_MINUTE) {
      flags.push('TOO_FAST');
      confidence -= 30;
    }

    // 3. التحقق من الحد اليومي
    const todayAds = await this.getTodayAds(userId);
    if (todayAds.length >= this.MAX_DAILY_ADS) {
      flags.push('DAILY_LIMIT_EXCEEDED');
      confidence -= 50;
    }

    // 4. تحليل الأنماط المشبوهة
    const suspiciousPatterns = await this.detectSuspiciousPatterns(userId);
    if (suspiciousPatterns) {
      flags.push('SUSPICIOUS_PATTERN');
      confidence -= 25;
    }

    // 5. التحقق من Fingerprint (إذا متوفر)
    if (adData.clientFingerprint) {
      const fingerprintValid = await this.verifyFingerprint(
        userId,
        adData.clientFingerprint
      );
      if (!fingerprintValid) {
        flags.push('FINGERPRINT_MISMATCH');
        confidence -= 20;
      }
    }

    // 6. التحقق من IP
    if (adData.ipAddress) {
      const ipSuspicious = await this.checkIPReputation(adData.ipAddress);
      if (ipSuspicious) {
        flags.push('SUSPICIOUS_IP');
        confidence -= 15;
      }
    }

    // 7. Trust Score للمستخدم
    const trustScore = await this.getUserTrustScore(userId);
    if (trustScore < 50) {
      flags.push('LOW_TRUST_SCORE');
      confidence -= 10;
    }

    // القرار النهائي
    const valid = confidence >= 60; // يحتاج 60% على الأقل

    // تسجيل النتيجة
    await this.logVerification(userId, {
      valid,
      confidence,
      flags,
      adData
    });

    return {
      valid,
      reason: valid ? undefined : flags.join(', '),
      confidence,
      flags
    };
  }

  /**
   * الحصول على الإعلانات الأخيرة
   */
  private async getRecentAds(userId: string, timeWindow: number): Promise<any[]> {
    const since = new Date(Date.now() - timeWindow);
    
    return await this.prisma.adWatch.findMany({
      where: {
        userId,
        watchedAt: {
          gte: since
        }
      },
      orderBy: {
        watchedAt: 'desc'
      }
    });
  }

  /**
   * الحصول على إعلانات اليوم
   */
  private async getTodayAds(userId: string): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await this.prisma.adWatch.findMany({
      where: {
        userId,
        watchedAt: {
          gte: today
        }
      }
    });
  }

  /**
   * كشف الأنماط المشبوهة
   */
  private async detectSuspiciousPatterns(userId: string): Promise<boolean> {
    const recentAds = await this.getRecentAds(userId, 3600000); // آخر ساعة
    
    if (recentAds.length === 0) return false;

    // 1. فحص التوقيت المتطابق (نفس الثانية)
    const timestamps = recentAds.map(ad => ad.watchedAt.getTime());
    const uniqueTimestamps = new Set(timestamps);
    if (timestamps.length - uniqueTimestamps.size >= 3) {
      return true; // 3 إعلانات أو أكثر في نفس الثانية
    }

    // 2. فحص الفترات المنتظمة بشكل مشبوه
    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    
    // إذا كانت جميع الفترات متطابقة تقريباً
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const deviation = intervals.every(interval => 
      Math.abs(interval - avgInterval) < 1000 // أقل من ثانية فرق
    );
    
    if (deviation && intervals.length >= 5) {
      return true; // نمط آلي
    }

    return false;
  }

  /**
   * التحقق من Device Fingerprint
   */
  private async verifyFingerprint(userId: string, fingerprint: string): Promise<boolean> {
    // تخطي التحقق من fingerprint حالياً (يمكن تفعيله لاحقاً)
    // يحتاج إلى إضافة حقل metadata في User schema
    return true;
  }

  /**
   * فحص سمعة IP
   */
  private async checkIPReputation(ipAddress: string): Promise<boolean> {
    // تخطي فحص IP حالياً (يمكن تفعيله لاحقاً)
    return false;
  }

  /**
   * حساب Trust Score للمستخدم
   */
  private async getUserTrustScore(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        adWatches: {
          orderBy: { watchedAt: 'desc' },
          take: 50
        }
      }
    });

    if (!user) return 0;

    let score = 100;

    // 1. عمر الحساب
    const accountAge = Date.now() - user.createdAt.getTime();
    const daysOld = accountAge / (1000 * 60 * 60 * 24);
    if (daysOld < 1) score -= 20;
    else if (daysOld < 7) score -= 10;

    // 2. نشاط منتظم
    const adWatches = user.adWatches;
    if (adWatches.length < 5) score -= 15;

    // 3. سجل نظيف
    const violations = await this.getViolations(userId);
    score -= violations * 10;

    // 4. Streak
    const streak = await this.getStreak(userId);
    score += Math.min(streak * 2, 20); // حتى +20

    return Math.max(0, Math.min(100, score));
  }

  /**
   * الحصول على المخالفات
   */
  private async getViolations(userId: string): Promise<number> {
    // فحص سجل التحقق من الإعلانات
    const logs = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count
      FROM ad_verification_logs
      WHERE user_id = ${userId}
      AND valid = false
      AND created_at >= NOW() - INTERVAL '7 days'
    `.catch(() => [{ count: 0 }]);

    return logs[0]?.count || 0;
  }

  /**
   * الحصول على Streak
   */
  private async getStreak(userId: string): Promise<number> {
    const stats = await this.prisma.userStatistics.findUnique({
      where: { userId },
      select: { currentStreak: true }
    });

    return stats?.currentStreak || 0;
  }

  /**
   * تسجيل نتيجة التحقق
   */
  private async logVerification(
    userId: string,
    result: {
      valid: boolean;
      confidence: number;
      flags: string[];
      adData: any;
    }
  ): Promise<void> {
    try {
      // تسجيل في جدول منفصل للتحليل
      await this.prisma.$executeRaw`
        INSERT INTO ad_verification_logs 
        (user_id, valid, confidence, flags, metadata, created_at)
        VALUES (
          ${userId},
          ${result.valid},
          ${result.confidence},
          ${JSON.stringify(result.flags)},
          ${JSON.stringify(result.adData)},
          NOW()
        )
      `.catch(() => {
        // الجدول قد لا يكون موجوداً بعد
        console.warn('Ad verification logs table not found');
      });
    } catch (error) {
      console.error('Failed to log verification:', error);
    }
  }

  /**
   * الحصول على IPs المحظورة
   */
  private async getBlockedIPs(): Promise<string[]> {
    // يمكن تخزينها في Redis أو database
    return [];
  }

  /**
   * تنظيف
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Singleton
export const adVerification = new AdVerificationService();
