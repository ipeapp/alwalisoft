# 🔐 الدخول إلى لوحة تحكم الأدمن

## 🎯 كيفية الوصول:

### الطريقة 1: عبر الرابط المباشر

```
https://alwalisoft-omega.vercel.app/admin
```

أو محلياً:
```
http://localhost:3000/admin
```

---

### الطريقة 2: إضافة زر في التطبيق (للأدمن فقط)

يمكنك إضافة زر مخفي في صفحة Profile للأدمن:

```typescript
// في app/mini-app/profile/page.tsx
// أضف هذا في الأعلى:

const ADMIN_TELEGRAM_IDS = ['7154440358']; // ضع telegram ID الخاص بك

// ثم أضف هذا الزر في الصفحة:

{ADMIN_TELEGRAM_IDS.includes(user?.telegramId || '') && (
  <Link href="/admin">
    <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
      <Settings className="w-4 h-4 mr-2" />
      🔐 لوحة تحكم الأدمن
    </Button>
  </Link>
)}
```

---

## 📊 ماذا تحتوي لوحة الأدمن؟

### 1️⃣ الإحصائيات الرئيسية:

```
✅ إجمالي المستخدمين
✅ المهام النشطة
✅ إجمالي الأرصدة في النظام
✅ طلبات السحب المعلقة
```

---

### 2️⃣ الأقسام:

#### 📌 نظرة عامة (Overview)
- النشاط الأخير
- إجراءات سريعة
- إحصائيات مباشرة

#### 📌 إدارة المهام (Tasks)
- عرض جميع المهام
- إضافة مهمة جديدة
- تعديل/حذف المهام
- تفعيل/تعطيل المهام

#### 📌 المستخدمون (Users)
- قائمة جميع المستخدمين
- البحث والتصفية
- عرض تفاصيل المستخدم
- تعديل الأرصدة

#### 📌 الإشعارات (Notifications)
- إرسال إشعار لجميع المستخدمين
- إرسال إشعار لمستخدم محدد
- سجل الإشعارات المرسلة

---

## 🛠️ API Endpoints المتوفرة:

### 1️⃣ الإحصائيات:
```
GET /api/admin/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 4,
    "activeUsers": 2,
    "totalTasks": 10,
    "activeTasks": 5,
    "completedTasks": 25,
    "totalBalance": 42228,
    "totalWithdrawals": 0,
    "pendingWithdrawals": 0
  }
}
```

---

### 2️⃣ إنشاء مهمة جديدة:
```
POST /api/admin/tasks/create
```

**Body:**
```json
{
  "name": "متابعة قناة تليجرام",
  "description": "تابع قناتنا على تليجرام واحصل على المكافأة",
  "reward": 5000,
  "difficulty": "EASY",
  "category": "SOCIAL_MEDIA",
  "requirements": {
    "channelUrl": "https://t.me/your_channel",
    "verificationMethod": "manual"
  },
  "isActive": true
}
```

---

### 3️⃣ تفعيل/تعطيل مهمة:
```
PATCH /api/admin/tasks/[id]/toggle
```

---

### 4️⃣ إرسال إشعار:
```
POST /api/admin/notifications/send
```

**Body:**
```json
{
  "title": "مهمة جديدة!",
  "message": "مهمة جديدة متاحة الآن، احصل على 5000 نقطة!",
  "targetUsers": "all" // أو array من telegram IDs
}
```

---

## 🔒 الحماية والأمان:

### ⚠️ الحالية (بدون حماية):

حالياً، لوحة الأدمن **ليست محمية**. أي شخص يمكنه الوصول إليها عبر الرابط.

### ✅ الحماية الموصى بها:

#### الطريقة 1: Middleware Protection

إنشاء ملف `/middleware.ts` أو تعديل الموجود:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TELEGRAM_IDS = ['7154440358']; // ضع IDs الأدمن

export function middleware(request: NextRequest) {
  // حماية صفحات الأدمن
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // تحقق من session/cookie
    const telegramId = request.cookies.get('telegram_id')?.value;
    
    if (!telegramId || !ADMIN_TELEGRAM_IDS.includes(telegramId)) {
      return NextResponse.redirect(new URL('/mini-app', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

#### الطريقة 2: Component-Level Protection

إنشاء `/components/admin-route.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const ADMIN_TELEGRAM_IDS = ['7154440358'];

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !ADMIN_TELEGRAM_IDS.includes(user.telegramId))) {
      router.push('/mini-app');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || !ADMIN_TELEGRAM_IDS.includes(user.telegramId)) {
    return null;
  }

  return <>{children}</>;
}
```

ثم استخدامه في `/app/admin/page.tsx`:

```typescript
import { AdminRoute } from '@/components/admin-route';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      {/* محتوى لوحة الأدمن */}
    </AdminRoute>
  );
}
```

---

#### الطريقة 3: API Protection

حماية API endpoints:

```typescript
// في أي API route للأدمن
const ADMIN_TELEGRAM_IDS = ['7154440358'];

export async function GET(req: NextRequest) {
  // تحقق من الهوية
  const telegramId = req.headers.get('x-telegram-id');
  
  if (!telegramId || !ADMIN_TELEGRAM_IDS.includes(telegramId)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized'
    }, { status: 401 });
  }
  
  // باقي الكود...
}
```

---

## 📝 خطوات الحماية الموصى بها:

### 1️⃣ قصيرة المدى (للتطوير):

```typescript
// app/admin/page.tsx - في بداية الملف
'use client';

const ADMIN_PASSWORD = 'your_secure_password_123';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-white/5 p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 bg-white/10 rounded mb-4 w-full"
            placeholder="Enter password"
          />
          <button
            onClick={() => {
              if (password === ADMIN_PASSWORD) {
                setAuthenticated(true);
              } else {
                alert('Wrong password!');
              }
            }}
            className="bg-purple-600 px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // باقي محتوى لوحة الأدمن
}
```

---

### 2️⃣ طويلة المدى (للإنتاج):

- استخدام NextAuth.js
- JWT tokens
- Session management
- Role-based access control (RBAC)
- IP whitelisting

---

## 🎯 التوصيات:

### للتطوير الحالي:
```
✅ استخدم password بسيط في الكود
✅ تحقق من telegram_id من localStorage
✅ أضف زر مخفي في Profile للأدمن
```

### للإنتاج:
```
🔒 استخدم NextAuth.js
🔒 JWT authentication
🔒 Rate limiting
🔒 Audit logging
```

---

## 🚀 البدء السريع:

### 1. افتح لوحة الأدمن:

```
https://alwalisoft-omega.vercel.app/admin
```

### 2. تحقق من الإحصائيات

### 3. ابدأ إضافة المهام

---

**ملاحظة:** حالياً لوحة الأدمن غير محمية. يُنصح بإضافة حماية قبل النشر للإنتاج!

---

**آخر تحديث:** 6 نوفمبر 2025  
**الحالة:** ✅ لوحة الأدمن جاهزة  
**الحماية:** ⚠️ غير محمية (تحتاج إضافة)
