# 📱 خطة تكامل نظام الإعلانات

## 🎯 الهدف
إضافة نظام إعلانات متكامل لتحقيق الدخل من التطبيق ومكافأة المستخدمين

---

## 📊 أنواع الإعلانات المقترحة

### 1. **Rewarded Video Ads** (الأولوية: عالية)
```
المكافأة: 100-500 عملة لكل مشاهدة
الحد الأقصى: 10 مشاهدات يومياً
المدة: 15-30 ثانية
```

### 2. **Banner Ads** (الأولوية: متوسطة)
```
الموقع: أسفل الشاشة
التحديث: كل 30 ثانية
المكافأة: لا يوجد (عرض دائم)
```

### 3. **Interstitial Ads** (الأولوية: منخفضة)
```
التوقيت: بين المهام أو بعد الألعاب
التكرار: مرة كل 5 دقائق كحد أقصى
المكافأة: 50 عملة اختيارية
```

---

## 🔧 التكامل التقني

### Platform: Google AdMob

### 1. **إعداد AdMob Account**

```bash
# الخطوات:
1. إنشاء حساب في https://admob.google.com
2. إضافة تطبيق جديد
3. الحصول على:
   - App ID: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
   - Ad Unit IDs للأنواع المختلفة

4. إعداد Payment Information
5. ربط حساب Google AdSense
```

### 2. **تثبيت المكتبات المطلوبة**

```json
// package.json
{
  "dependencies": {
    "react-google-publisher-tag": "^2.0.0",
    "@google/ads": "latest",
    "google-adsense": "latest"
  }
}
```

### 3. **إضافة Environment Variables**

```bash
# .env
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
NEXT_PUBLIC_ADMOB_REWARDED_VIDEO_ID=ca-app-pub-XXXXXXXXXXXXXXXX/AAAAAAAAAA
NEXT_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB
NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/CCCCCCCCCC

# For testing (Use test IDs during development)
NEXT_PUBLIC_ADMOB_TEST_MODE=true
```

---

## 💻 التطبيق في الكود

### 1. **إنشاء Ad Manager Component**

```typescript
// lib/ad-manager.ts
export class AdManager {
  private static instance: AdManager;
  private initialized = false;

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  async initialize() {
    if (this.initialized) return;

    // تهيئة AdMob
    if (typeof window !== 'undefined') {
      // تحميل SDK
      this.initialized = true;
    }
  }

  async showRewardedAd(): Promise<{ success: boolean; reward: number }> {
    // عرض إعلان Rewarded
    // إرجاع المكافأة عند الاكتمال
    return { success: true, reward: 200 };
  }

  showBanner(containerId: string) {
    // عرض Banner Ad
  }

  async showInterstitial(): Promise<boolean> {
    // عرض Interstitial Ad
    return true;
  }
}
```

### 2. **إنشاء Rewarded Ad Component**

```tsx
// components/ads/rewarded-ad-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdManager } from '@/lib/ad-manager';

export function RewardedAdButton() {
  const [loading, setLoading] = useState(false);
  const [watchCount, setWatchCount] = useState(0);
  const MAX_DAILY_WATCHES = 10;

  async function handleWatchAd() {
    if (watchCount >= MAX_DAILY_WATCHES) {
      alert('لقد وصلت للحد الأقصى اليومي');
      return;
    }

    setLoading(true);
    
    try {
      const result = await AdManager.getInstance().showRewardedAd();
      
      if (result.success) {
        // إرسال المكافأة للـ API
        const response = await fetch('/api/ads/reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reward: result.reward })
        });

        if (response.ok) {
          setWatchCount(prev => prev + 1);
          alert(`🎉 حصلت على ${result.reward} عملة!`);
        }
      }
    } catch (error) {
      console.error('Ad error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">شاهد إعلان واحصل على مكافأة</h3>
      <p className="text-sm text-gray-600 mb-4">
        المتبقي اليوم: {MAX_DAILY_WATCHES - watchCount} مشاهدات
      </p>
      <Button 
        onClick={handleWatchAd}
        disabled={loading || watchCount >= MAX_DAILY_WATCHES}
      >
        {loading ? 'جاري التحميل...' : '🎬 شاهد إعلان (200 عملة)'}
      </Button>
    </div>
  );
}
```

### 3. **إضافة Banner Ad**

```tsx
// components/ads/banner-ad.tsx
'use client';

import { useEffect } from 'react';
import { AdManager } from '@/lib/ad-manager';

export function BannerAd() {
  useEffect(() => {
    AdManager.getInstance().showBanner('ad-banner');
  }, []);

  return (
    <div 
      id="ad-banner" 
      className="w-full h-[50px] bg-gray-100 flex items-center justify-center"
    >
      <span className="text-xs text-gray-400">إعلان</span>
    </div>
  );
}
```

### 4. **إنشاء API Route للمكافآت**

```typescript
// app/api/ads/reward/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const { reward } = await request.json();
    const userId = request.headers.get('x-user-id'); // من auth

    if (!userId || !reward) {
      return NextResponse.json(
        { success: false, error: 'Missing data' },
        { status: 400 }
      );
    }

    // التحقق من الحد اليومي
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await prisma.adWatch.count({
      where: {
        userId,
        watchedAt: { gte: today }
      }
    });

    if (todayCount >= 10) {
      return NextResponse.json(
        { success: false, error: 'Daily limit reached' },
        { status: 429 }
      );
    }

    // إضافة المكافأة
    await prisma.$transaction([
      // 1. تحديث رصيد المستخدم
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: reward } }
      }),

      // 2. تسجيل في RewardLedger
      prisma.rewardLedger.create({
        data: {
          userId,
          type: 'AD_WATCH',
          amount: reward,
          description: 'Ad watch reward',
          balanceBefore: 0, // يجب جلبها
          balanceAfter: reward
        }
      }),

      // 3. تسجيل المشاهدة
      prisma.adWatch.create({
        data: {
          userId,
          adType: 'REWARDED_VIDEO',
          reward,
          watchedAt: new Date()
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      reward,
      message: 'Reward added successfully' 
    });

  } catch (error) {
    console.error('Ad reward error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

### 5. **إضافة AdWatch Model في Schema**

```prisma
// prisma/schema.prisma

enum AdType {
  REWARDED_VIDEO
  BANNER
  INTERSTITIAL
}

model AdWatch {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  adType     AdType   @map("ad_type")
  reward     Int      @default(0)
  watchedAt  DateTime @default(now()) @map("watched_at")

  @@index([userId, watchedAt])
  @@map("ad_watches")
}

// إضافة إلى enum RewardType:
enum RewardType {
  // ... existing types
  AD_WATCH
}
```

---

## 📊 تتبع الإيرادات

### 1. **Dashboard للإحصائيات**

```tsx
// app/admin/ads/page.tsx
export default async function AdsAnalytics() {
  const stats = await getAdStats();

  return (
    <div>
      <h1>إحصائيات الإعلانات</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>إجمالي المشاهدات اليوم</CardHeader>
          <CardContent>{stats.todayViews}</CardContent>
        </Card>

        <Card>
          <CardHeader>الإيرادات المتوقعة</CardHeader>
          <CardContent>${stats.estimatedRevenue}</CardContent>
        </Card>

        <Card>
          <CardHeader>معدل التحويل</CardHeader>
          <CardContent>{stats.conversionRate}%</CardContent>
        </Card>
      </div>

      <AdRevenueChart data={stats.dailyRevenue} />
    </div>
  );
}
```

### 2. **حساب الإيرادات**

```typescript
// معادلة حساب الإيرادات التقريبية:

// AdMob RPM (Revenue Per Mille) = $1-$5 لكل 1000 مشاهدة
const ESTIMATED_RPM = 2.5; // متوسط

function calculateEstimatedRevenue(views: number): number {
  return (views / 1000) * ESTIMATED_RPM;
}

// مثال:
// 1000 مشاهدة × $2.5 = $2.50
// 10,000 مشاهدة × $2.5 = $25
```

---

## 🎨 UX/UI للإعلانات

### مواقع عرض الإعلانات:

1. **في صفحة المهام**
   - زر "شاهد إعلان" في الأعلى
   - Banner في الأسفل

2. **في صفحة المكافآت**
   - قسم مخصص "اكسب من الإعلانات"

3. **في صفحة الألعاب**
   - Interstitial بعد كل 3 ألعاب

4. **في Dashboard**
   - Banner دائم في الأسفل

---

## ✅ Checklist للتطبيق

- [ ] إنشاء حساب AdMob
- [ ] الحصول على App ID و Ad Unit IDs
- [ ] إضافة Environment Variables
- [ ] تثبيت المكتبات
- [ ] إنشاء AdManager
- [ ] إنشاء Ad Components
- [ ] إضافة AdWatch model
- [ ] تشغيل Migration
- [ ] إنشاء API Routes
- [ ] إضافة الإعلانات في UI
- [ ] اختبار في Test Mode
- [ ] نشر في Production
- [ ] مراقبة الإيرادات

---

## 💰 التوقعات المالية

### السيناريو المتفائل:
```
- 1,000 مستخدم نشط يومياً
- 50% يشاهدون إعلانات (500 مستخدم)
- 5 مشاهدات لكل مستخدم
= 2,500 مشاهدة يومياً
= ~$6.25 يومياً
= ~$187.5 شهرياً
```

### السيناريو الواقعي:
```
- 500 مستخدم نشط
- 30% يشاهدون (150 مستخدم)
- 3 مشاهدات لكل مستخدم
= 450 مشاهدة يومياً
= ~$1.13 يومياً
= ~$34 شهرياً
```

---

**ملاحظة:** هذه خطة كاملة جاهزة للتطبيق. سأقوم بتنفيذها في الخطوة القادمة.

