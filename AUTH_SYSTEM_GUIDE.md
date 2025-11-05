# 🔐 نظام تسجيل الدخول والمصادقة - بوت صدام الولي

## ✨ نظرة عامة

تم إنشاء نظام مصادقة كامل (Authentication System) للـ Mini App مع:
- صفحة تسجيل دخول جميلة
- Context API لإدارة حالة المستخدم
- Protected Routes لحماية الصفحات
- تخزين بيانات المستخدم في LocalStorage
- تكامل كامل مع Telegram Web App

---

## 📱 الصفحات الجديدة

### 1️⃣ صفحة تسجيل الدخول (`/mini-app/login`)

**المميزات:**
- ✅ تسجيل دخول تلقائي عبر Telegram
- ✅ عرض معلومات المستخدم من Telegram
- ✅ التحقق من وجود المستخدم في قاعدة البيانات
- ✅ حفظ بيانات المستخدم في LocalStorage
- ✅ Redirect تلقائي للصفحة الرئيسية بعد النجاح

**كيفية العمل:**
```typescript
1. المستخدم يفتح /mini-app من Telegram
2. يتم تحميل بيانات Telegram Web App
3. عند الضغط على "Login with Telegram"
4. يتم التحقق من API: /api/users?telegramId=xxx
5. إذا كان المستخدم موجود → حفظ في LocalStorage
6. Redirect إلى /mini-app
```

---

### 2️⃣ صفحة الملف الشخصي (`/mini-app/profile`)

**المميزات:**
- 👤 عرض معلومات المستخدم الكاملة
- 📊 إحصائيات المستخدم (Balance, Tasks, Referrals)
- 📅 تاريخ الانضمام
- 🔄 زر Refresh Profile
- ⚙️ رابط إلى Settings
- 🚪 Logout button

---

### 3️⃣ صفحة المحفظة (`/mini-app/wallet`)

**المميزات:**
- 💰 عرض الرصيد الإجمالي
- 📊 Quick Stats (This Week, Withdrawn, Pending)
- 📜 سجل المعاملات (Transactions History)
- ✅ أيقونات مختلفة حسب نوع المعاملة
- 🎨 ألوان مميزة للدخل والمصروفات

**أنواع المعاملات:**
- `TASK_REWARD` - مكافأة مهمة
- `REFERRAL_REWARD` - مكافأة إحالة
- `GAME_REWARD` - مكافأة لعبة
- `WITHDRAWAL` - سحب أموال
- `DAILY_BONUS` - مكافأة يومية

---

### 4️⃣ صفحة المتصدرين (`/mini-app/leaderboard`)

**المميزات:**
- 🏆 عرض Top 3 في تصميم خاص
- 👥 قائمة بجميع المتصدرين
- 🔄 فلترة حسب Balance أو Tasks
- ⭐ تمييز المستخدم الحالي
- 📊 عرض موقعك في الترتيب

---

### 5️⃣ صفحة المكافآت اليومية (`/mini-app/rewards`)

**المميزات:**
- 📅 نظام Daily Streak (7 أيام)
- 🎁 مكافآت متصاعدة (100 → 1000)
- ⏰ Timer للمكافأة القادمة
- ✅ Calendar لعرض الأيام المكتملة
- 🔗 روابط لأقسام أخرى للحصول على مكافآت

**جدول المكافآت:**
```
Day 1: 100 coins
Day 2: 150 coins
Day 3: 200 coins
Day 4: 300 coins
Day 5: 500 coins
Day 6: 750 coins
Day 7: 1,000 coins
```

---

### 6️⃣ صفحة الإعدادات (`/mini-app/settings`)

**المميزات:**
- 👤 Account Information
- 🔔 Notifications Toggle
- 🌐 Language Selection (العربية/English)
- 🌙 Theme Toggle (Dark/Light)
- 🆘 Help Center
- ℹ️ About Section
- 🚪 Logout Button

---

## 🔧 المكونات التقنية

### 1. Auth Context (`lib/auth-context.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  refreshUser: () => Promise<void>;
}
```

**الوظائف:**
- `login()` - حفظ بيانات المستخدم
- `logout()` - حذف البيانات والخروج
- `updateBalance()` - تحديث الرصيد
- `refreshUser()` - تحديث البيانات من API

---

### 2. Protected Route Component (`components/protected-route.tsx`)

يحمي الصفحات من الوصول غير المصرح:

```typescript
<ProtectedRoute>
  <YourPageContent />
</ProtectedRoute>
```

**الوظيفة:**
- ✅ إذا كان المستخدم مسجل دخول → عرض المحتوى
- ❌ إذا لم يكن مسجل → Redirect إلى /mini-app/login

---

## 🔌 APIs الجديدة

### 1. `/api/transactions` (GET)

**Parameters:**
- `userId` (required)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "xxx",
      "type": "TASK_REWARD",
      "amount": 1000,
      "description": "Task completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. `/api/leaderboard` (GET)

**Parameters:**
- `sortBy` (optional: "balance" | "tasks", default: "balance")
- `limit` (optional, default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "xxx",
      "username": "user1",
      "firstName": "John",
      "balance": 50000,
      "tasksCompleted": 25,
      "level": "ADVANCED"
    }
  ]
}
```

---

### 3. `/api/rewards/daily` (GET & POST)

**GET - Check if can claim:**

Parameters: `userId`

Response:
```json
{
  "success": true,
  "data": {
    "canClaim": true,
    "streak": 3,
    "lastClaim": "2024-01-01T00:00:00.000Z"
  }
}
```

**POST - Claim reward:**

Body:
```json
{
  "userId": "xxx"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "reward": 200,
    "newStreak": 4,
    "newBalance": 10200
  }
}
```

---

## 🎯 كيفية الاستخدام

### للمطورين:

#### 1. استخدام Auth Context في أي صفحة:

```typescript
import { useAuth } from '@/lib/auth-context';

function YourPage() {
  const { user, loading, logout, updateBalance } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      <p>Balance: {user?.balance}</p>
    </div>
  );
}
```

#### 2. حماية صفحة جديدة:

```typescript
import { ProtectedRoute } from '@/components/protected-route';

function NewPageContent() {
  return <div>Protected Content</div>;
}

export default function NewPage() {
  return (
    <ProtectedRoute>
      <NewPageContent />
    </ProtectedRoute>
  );
}
```

#### 3. تحديث الرصيد بعد عملية:

```typescript
const { user, updateBalance } = useAuth();

async function earnCoins() {
  // ... API call
  const newBalance = user!.balance + 1000;
  updateBalance(newBalance);
}
```

---

## 📊 Bottom Navigation

تم تحديث Bottom Navigation في الصفحة الرئيسية:

```
[Home] [Tasks] [Wallet] [Rank] [Profile]
```

كل زر يربط إلى صفحته المخصصة.

---

## 🎨 تغييرات التصميم

### اسم التطبيق:
- ✅ تم تغيير الاسم إلى **"بوت صدام الولي"**
- ✅ في جميع الصفحات والملفات
- ✅ في `package.json`, `metadata`, صفحة Login

### الألوان:
- **Purple to Blue Gradient** للخلفيات
- **Yellow** للعملات والمكافآت
- **Green** للإيجابيات (Earnings, Success)
- **Red** للسلبيات (Withdrawals, Logout)

---

## 🔄 تدفق المستخدم (User Flow)

```
1. المستخدم يفتح البوت في Telegram
   ↓
2. يضغط /start
   ↓
3. يضغط زر "🚀 فتح التطبيق"
   ↓
4. يفتح /mini-app/login
   ↓
5. يضغط "Login with Telegram"
   ↓
6. يتم التحقق من API
   ↓
7. حفظ البيانات في LocalStorage
   ↓
8. Redirect إلى /mini-app (Dashboard)
   ↓
9. يمكنه التصفح بحرية في كل الصفحات
```

---

## 🚀 الصفحات المحمية (Protected Pages)

جميع هذه الصفحات تتطلب تسجيل دخول:
- ✅ `/mini-app` (Dashboard)
- ✅ `/mini-app/tasks`
- ✅ `/mini-app/games`
- ✅ `/mini-app/referrals`
- ✅ `/mini-app/rewards`
- ✅ `/mini-app/wallet`
- ✅ `/mini-app/leaderboard`
- ✅ `/mini-app/profile`
- ✅ `/mini-app/settings`

الصفحة الوحيدة المتاحة بدون تسجيل:
- ❌ `/mini-app/login`

---

## 🐛 Troubleshooting

### مشكلة: "User not found"
**الحل:** المستخدم يجب أن يضغط `/start` في البوت أولاً لإنشاء حساب

### مشكلة: يتم تسجيل الخروج تلقائياً
**الحل:** تحقق من صلاحية LocalStorage، أو حدّث البيانات

### مشكلة: Infinite redirect loop
**الحل:** تأكد من أن صفحة `/mini-app/login` غير محمية بـ `ProtectedRoute`

---

## 📦 الملفات المُنشأة

```
✅ app/mini-app/login/page.tsx           (صفحة Login)
✅ app/mini-app/profile/page.tsx         (صفحة Profile)
✅ app/mini-app/wallet/page.tsx          (صفحة Wallet)
✅ app/mini-app/leaderboard/page.tsx     (صفحة Leaderboard)
✅ app/mini-app/rewards/page.tsx         (صفحة Rewards)
✅ app/mini-app/settings/page.tsx        (صفحة Settings)
✅ lib/auth-context.tsx                  (Auth Context)
✅ components/protected-route.tsx        (Protected Route)
✅ app/api/transactions/route.ts         (Transactions API)
✅ app/api/leaderboard/route.ts          (Leaderboard API)
✅ app/api/rewards/daily/route.ts        (Daily Rewards API)
```

---

## 🎉 الخلاصة

الآن لديك:
- ✅ نظام مصادقة كامل
- ✅ 9 صفحات جاهزة للاستخدام
- ✅ 3 APIs جديدة
- ✅ Bottom Navigation محدّث
- ✅ Protected Routes لجميع الصفحات
- ✅ تصميم جميل ومتجاوب
- ✅ اسم التطبيق "بوت صدام الولي"

**🚀 جاهز للـ Deploy!**

---

تم التطوير بـ ❤️
