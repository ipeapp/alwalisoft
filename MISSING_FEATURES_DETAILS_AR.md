# 🚧 الميزات الناقصة والـ Placeholders - التفاصيل الكاملة

**تاريخ:** 7 نوفمبر 2025  
**النوع:** قائمة شاملة بكل ما ينقص التطبيق

---

## 📊 ملخص تنفيذي

```
✅ مكتمل:        80% (~7,920 سطر)
⚠️ جزئي:         15% (~1,485 سطر)
❌ مفقود/Placeholder: 5% (~495 سطر)

إجمالي الميزات: 52 ميزة
مكتمل:      42 ميزة
جزئي:        7 ميزات
مفقود:       3 ميزات
```

---

## ❌ الميزات المفقودة تماماً (3 ميزات)

### 1. **نظام الإشعارات الحقيقي**

**الملفات المتأثرة:**
- `app/mini-app/notifications/page.tsx` - يستخدم mockNotifications
- `app/api/admin/notifications/send/route.ts` - API موجود لكن لا model

**المشكلة:**
```typescript
// الكود الحالي - يستخدم بيانات وهمية:
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'REWARD',
    title: 'مكافأة يومية جديدة! 🎁',
    message: 'لا تنسَ الحصول على مكافأتك اليومية! +500 عملة في انتظارك.',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/mini-app/rewards'
  },
  // ... المزيد من البيانات الوهمية
];

setNotifications(mockNotifications);
```

**ما ينقص:**

#### A. Prisma Model
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  message   String   @db.Text
  actionUrl String?
  
  isRead    Boolean  @default(false)
  readAt    DateTime?
  
  createdAt DateTime @default(now())
  expiresAt DateTime?
  
  @@index([userId, isRead])
  @@index([userId, createdAt])
}

enum NotificationType {
  TASK
  REWARD
  REFERRAL
  ACHIEVEMENT
  SYSTEM
  GAME
  WITHDRAWAL
  ADMIN
}
```

#### B. API Endpoints
```typescript
// إنشاء:
POST /api/notifications
{
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

// جلب:
GET /api/notifications?userId={userId}&unreadOnly={boolean}

// قراءة:
PATCH /api/notifications/{id}/read

// حذف:
DELETE /api/notifications/{id}

// حذف الكل:
DELETE /api/notifications?userId={userId}&readOnly={boolean}
```

#### C. Real-time System (اختياري)
```typescript
// باستخدام WebSockets أو Telegram Bot
// لإرسال إشعارات فورية

// مثال بسيط - عبر البوت:
bot.telegram.sendMessage(
  userId,
  `🔔 ${notification.title}\n\n${notification.message}`
);
```

**الأولوية:** 🔥 **عالية جداً**  
**الوقت المقدر:** 4-6 ساعات  
**التعقيد:** متوسط

---

### 2. **نظام الإنجازات الكامل**

**الملفات المتأثرة:**
- `app/mini-app/achievements/page.tsx` - البيانات hardcoded

**المشكلة:**
```typescript
// الكود الحالي - إنجازات ثابتة:
const achievements: Achievement[] = [
  {
    id: 'first_steps',
    icon: '🚀',
    name: 'الخطوات الأولى',
    description: 'أكمل مهمتك الأولى',
    reward: 100,
    progress: 0,  // يُحسب في client-side
    target: 1,
    unlocked: false,
    category: 'المهام'
  },
  // ... 13 إنجاز آخر hardcoded
];
```

**ما ينقص:**

#### A. Prisma Models
```prisma
model Achievement {
  id          String   @id @default(uuid())
  
  key         String   @unique // 'first_steps', 'task_master_10', etc.
  icon        String
  name        String
  description String
  reward      Int
  target      Int
  category    AchievementCategory
  
  isActive    Boolean  @default(true)
  priority    Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  userAchievements UserAchievement[]
  
  @@index([category, isActive])
}

model UserAchievement {
  id            String   @id @default(uuid())
  
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  
  progress      Int      @default(0)
  isUnlocked    Boolean  @default(false)
  unlockedAt    DateTime?
  rewardClaimed Boolean  @default(false)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([userId, achievementId])
  @@index([userId, isUnlocked])
}

enum AchievementCategory {
  TASKS
  BALANCE
  REFERRALS
  ACTIVITY
  GAMES
  SOCIAL
}
```

#### B. API Endpoints
```typescript
// جلب جميع الإنجازات مع تقدم المستخدم:
GET /api/achievements?userId={userId}
Response: {
  achievements: [
    {
      id: string;
      key: string;
      name: string;
      description: string;
      reward: number;
      target: number;
      progress: number;
      isUnlocked: boolean;
      unlockedAt?: string;
    }
  ]
}

// المطالبة بمكافأة إنجاز:
POST /api/achievements/{achievementId}/claim
{
  userId: string;
}
```

#### C. Auto-check System
```typescript
// دالة للتحقق التلقائي من الإنجازات:
async function checkAchievements(userId: string, event: string) {
  // event: 'task_completed', 'referral_added', 'balance_increased', etc.
  
  // جلب إحصائيات المستخدم
  const stats = await getUserStats(userId);
  
  // قائمة الإنجازات للتحقق
  const achievementsToCheck = await getAchievementsByEvent(event);
  
  // التحقق وتحديث التقدم
  for (const achievement of achievementsToCheck) {
    const progress = calculateProgress(achievement, stats);
    
    await updateAchievementProgress(userId, achievement.id, progress);
    
    if (progress >= achievement.target) {
      await unlockAchievement(userId, achievement.id);
      await sendNotification(userId, 'achievement_unlocked', achievement);
    }
  }
}

// استدعاءها في كل event مهم:
// - بعد إكمال مهمة
// - بعد إضافة إحالة
// - بعد تحديث الرصيد
// - بعد لعب لعبة
// إلخ.
```

#### D. Seeding Script
```typescript
// إضافة الإنجازات الـ 14 إلى DB:
async function seedAchievements() {
  const achievements = [
    {
      key: 'first_steps',
      icon: '🚀',
      name: 'الخطوات الأولى',
      description: 'أكمل مهمتك الأولى',
      reward: 100,
      target: 1,
      category: 'TASKS'
    },
    // ... 13 إنجاز آخر
  ];
  
  await prisma.achievement.createMany({ data: achievements });
}
```

**الأولوية:** 🔥 **عالية**  
**الوقت المقدر:** 6-8 ساعات  
**التعقيد:** متوسط-عالي

---

### 3. **Game Play Tracking (تتبع اللعب اليومي)**

**الملفات المتأثرة:**
- `app/mini-app/games/page.tsx` - "Plays Today" = 0
- `app/api/games/*` - لا يوجد rate limiting حقيقي

**المشكلة:**
```typescript
// الكود الحالي - hardcoded:
<div>
  <p className="text-gray-400 mb-1">Plays Today</p>
  <p className="font-bold">0 / 3</p>  {/* ❌ دائماً 0 */}
</div>
<div>
  <p className="text-gray-400 mb-1">Best Reward</p>
  <p className="font-bold">0</p>       {/* ❌ دائماً 0 */}
</div>
```

**ما ينقص:**

#### A. Prisma Model
```prisma
model GamePlay {
  id        String   @id @default(uuid())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  gameType  GameType
  reward    Int
  score     Int?
  
  playedAt  DateTime @default(now())
  
  @@index([userId, gameType, playedAt])
  @@index([playedAt])
}

enum GameType {
  LUCKY_WHEEL
  TARGET_HIT
  QUIZ
}
```

#### B. API Logic Update
```typescript
// في كل game API:
async function playGame(userId: string, gameType: GameType) {
  // 1. التحقق من عدد المحاولات اليوم
  const today = startOfDay(new Date());
  const playsToday = await prisma.gamePlay.count({
    where: {
      userId,
      gameType,
      playedAt: { gte: today }
    }
  });
  
  // 2. تحديد الحد الأقصى
  const maxPlays = {
    LUCKY_WHEEL: 5,
    TARGET_HIT: 10,
    QUIZ: 10
  }[gameType];
  
  // 3. رفض إذا تجاوز
  if (playsToday >= maxPlays) {
    throw new Error(`لقد استنفدت محاولاتك اليومية (${maxPlays}/${maxPlays})`);
  }
  
  // 4. حساب المكافأة
  const reward = calculateReward(gameType);
  
  // 5. حفظ في DB
  await prisma.$transaction([
    // تحديث رصيد المستخدم
    prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: reward } }
    }),
    
    // إضافة في RewardLedger
    prisma.rewardLedger.create({
      data: {
        userId,
        type: 'GAME_WIN',
        amount: reward,
        description: `Played ${gameType}`,
        // ... balanceBefore, balanceAfter
      }
    }),
    
    // ✅ إضافة في GamePlay (جديد)
    prisma.gamePlay.create({
      data: {
        userId,
        gameType,
        reward,
        score: score // إذا كان متاحاً
      }
    })
  ]);
  
  return { reward, playsLeft: maxPlays - playsToday - 1 };
}
```

#### C. Stats API
```typescript
// جلب إحصائيات اللعب:
GET /api/games/stats?userId={userId}
Response: {
  luckyWheel: {
    playsToday: 2,
    maxPlays: 5,
    bestReward: 10000,
    totalReward: 15000
  },
  targetHit: {
    playsToday: 5,
    maxPlays: 10,
    bestScore: 195,
    avgScore: 150
  },
  quiz: {
    playsToday: 0,
    maxPlays: 10,
    perfectScores: 2,
    avgCorrect: 3.5
  }
}
```

**الأولوية:** 🔥 **عالية**  
**الوقت المقدر:** 3-4 ساعات  
**التعقيد:** متوسط

---

## ⚠️ الميزات الجزئية (7 ميزات)

### 4. **محفظة - إحصائيات ناقصة**

**المشكلة:**
```typescript
// في wallet/page.tsx:
const [stats, setStats] = useState<WalletStats>({
  totalEarned: 0,
  totalWithdrawn: 0,      // ❌ دائماً 0
  pendingWithdrawals: 0,
  thisWeekEarnings: 0     // ❌ دائماً 0
});
```

**الحل:**
```typescript
// حساب totalWithdrawn من Withdrawal model:
const completedWithdrawals = await prisma.withdrawal.aggregate({
  where: {
    userId,
    status: 'COMPLETED'
  },
  _sum: { amount: true }
});

// حساب thisWeekEarnings من RewardLedger:
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const weekEarnings = await prisma.rewardLedger.aggregate({
  where: {
    userId,
    createdAt: { gte: oneWeekAgo }
  },
  _sum: { amount: true }
});

setStats({
  totalEarned: user.balance,
  totalWithdrawn: completedWithdrawals._sum.amount || 0,
  pendingWithdrawals: pendingCount,
  thisWeekEarnings: weekEarnings._sum.amount || 0
});
```

**الأولوية:** 🟡 **متوسطة**  
**الوقت:** 1-2 ساعة  
**التعقيد:** بسيط

---

### 5. **محفظة - نافذة السحب**

**المشكلة:**
```typescript
// في wallet/page.tsx:
const [showWithdrawModal, setShowWithdrawModal] = useState(false);

// لكن لا يوجد Modal component!
<Button onClick={() => setShowWithdrawModal(true)}>
  <Send className="w-5 h-5 mr-2" />
  سحب
</Button>
```

**الحل:**
```typescript
// إضافة Modal component:
{showWithdrawModal && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
    <Card className="w-full max-w-md">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">طلب سحب</h3>
        
        <div className="space-y-4">
          {/* المبلغ */}
          <div>
            <label>المبلغ</label>
            <input 
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min={10000}
              max={user.balance}
            />
            <p className="text-xs text-gray-400">
              الحد الأدنى: 10,000 | المتاح: {user.balance.toLocaleString()}
            </p>
          </div>
          
          {/* طريقة الدفع */}
          <div>
            <label>طريقة الدفع</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="USDT_TRC20">USDT (TRC20)</option>
              <option value="USDT_ERC20">USDT (ERC20)</option>
              <option value="PAYPAL">PayPal</option>
              <option value="BANK">تحويل بنكي</option>
            </select>
          </div>
          
          {/* العنوان/الحساب */}
          <div>
            <label>عنوان المحفظة / رقم الحساب</label>
            <input 
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          
          {/* الأزرار */}
          <div className="flex gap-3">
            <Button onClick={handleWithdraw} className="flex-1">
              تأكيد السحب
            </Button>
            <Button onClick={() => setShowWithdrawModal(false)} variant="ghost">
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
)}

// دالة الإرسال:
const handleWithdraw = async () => {
  try {
    const response = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        amount: withdrawAmount,
        method: paymentMethod,
        walletAddress
      })
    });
    
    if (response.ok) {
      // نجح - إعادة تحميل
      setShowWithdrawModal(false);
      loadWalletData();
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('✅ تم إرسال طلب السحب بنجاح!');
      }
    }
  } catch (error) {
    // معالجة الخطأ
  }
};
```

**الأولوية:** 🟡 **متوسطة**  
**الوقت:** 2-3 ساعات  
**التعقيد:** بسيط-متوسط

---

### 6. **الإعدادات - حفظ التفضيلات**

**المشكلة:**
```typescript
// في settings/page.tsx:
const [notifications, setNotifications] = useState(true);
const [sound, setSound] = useState(true);
const [darkMode, setDarkMode] = useState(true);
const [language, setLanguage] = useState('ar');

// لكن لا تُحفظ في DB!
// كل مرة تُعيد الصفحة، ترجع للقيم الافتراضية
```

**الحل:**

#### A. Prisma Model
```prisma
model UserSettings {
  id        String   @id @default(uuid())
  
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Notifications
  enableNotifications     Boolean @default(true)
  enableEmailNotifications Boolean @default(false)
  enablePushNotifications Boolean @default(true)
  
  // Preferences
  language   String   @default("ar")
  theme      String   @default("dark")
  soundEnabled Boolean @default(true)
  
  // Privacy
  showProfile     Boolean @default(true)
  showStats       Boolean @default(true)
  showOnLeaderboard Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### B. API Endpoints
```typescript
GET /api/users/settings?userId={userId}
PATCH /api/users/settings
{
  userId: string;
  settings: Partial<UserSettings>;
}
```

#### C. Frontend Update
```typescript
useEffect(() => {
  loadSettings();
}, [user]);

const loadSettings = async () => {
  const response = await fetch(`/api/users/settings?userId=${user.id}`);
  const data = await response.json();
  
  if (data.success) {
    setNotifications(data.settings.enableNotifications);
    setSound(data.settings.soundEnabled);
    setDarkMode(data.settings.theme === 'dark');
    setLanguage(data.settings.language);
  }
};

const updateSetting = async (key: string, value: any) => {
  await fetch('/api/users/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      settings: { [key]: value }
    })
  });
};
```

**الأولوية:** 🟢 **منخفضة-متوسطة**  
**الوقت:** 2-3 ساعات  
**التعقيد:** بسيط-متوسط

---

### 7-10. **ميزات أخرى جزئية:**

7. **Task Verification** (⚠️ لا يوجد verification حقيقي)
8. **Rate Limiting للألعاب** (⚠️ يعتمد على client-side فقط)
9. **Admin - إرسال إشعارات** (⚠️ API موجود لكن لا model)
10. **Help - دردشة مباشرة** (❌ "قريباً")

---

## 📋 جدول الأولويات

### 🔥 **أولوية عالية جداً (يجب تنفيذها الآن):**

| # | الميزة | الحالة | الوقت | الملفات |
|---|--------|--------|-------|---------|
| 1 | نظام الإشعارات | ❌ مفقود | 4-6h | Notification model + APIs |
| 2 | نظام الإنجازات | ❌ جزئي | 6-8h | Achievement models + auto-check |
| 3 | Game Play Tracking | ❌ مفقود | 3-4h | GamePlay model + stats API |

**مجموع الوقت:** 13-18 ساعة  
**ستكمل:** 95% من التطبيق

---

### 🟡 **أولوية متوسطة (الأسبوع القادم):**

| # | الميزة | الوقت |
|---|--------|-------|
| 4 | محفظة - إحصائيات ناقصة | 1-2h |
| 5 | محفظة - نافذة السحب | 2-3h |
| 6 | الإعدادات - حفظ | 2-3h |
| 7 | Task Verification | 4-6h |

**مجموع الوقت:** 9-14 ساعة  
**ستكمل:** 98% من التطبيق

---

### 🟢 **أولوية منخفضة (لاحقاً):**

| # | الميزة | الوقت |
|---|--------|-------|
| 8 | دردشة مباشرة | 6-10h |
| 9 | Offline Mode | 4-6h |
| 10 | Testing Suite | 10-15h |

---

## 📊 الخلاصة

```
الوضع الحالي:
✅ 42 ميزة كاملة (80%)
⚠️ 7 ميزات جزئية (15%)
❌ 3 ميزات مفقودة (5%)

للوصول إلى 95%:
🔥 تنفيذ 3 ميزات (13-18 ساعة)

للوصول إلى 98%:
🔥 تنفيذ 3 ميزات (13-18h)
🟡 + تنفيذ 4 ميزات (9-14h)
المجموع: 22-32 ساعة عمل

للوصول إلى 100%:
+ 3 ميزات منخفضة الأولوية (20-31h)
```

---

**التوصية:** 
ابدأ بالـ **3 ميزات ذات الأولوية العالية جداً** أولاً. ستُكمل 95% من التطبيق في 2-3 أيام عمل.

**الملف التالي:** `ADS_INTEGRATION_COMPLETE_GUIDE_AR.md` - دليل ربط الإعلانات
