# 🚀 تعليمات النشر | Deployment Instructions

## ✅ الحالة الحالية

**جميع التغييرات تم commit-ها في Branch:**
```
cursor/build-telegram-task-and-reward-bot-platform-8521
```

**آخر Commits:**
- `a7a1c8a` - Checkpoint before follow-up message
- `475e5fc` - Fix: Convert BigInt to Number for game rewards and balances  
- `3ff3187` - Fix: Resolve BigInt issues and make Redis optional
- `05cd1b3` - Refactor: Switch to SQLite, improve Redis handling

---

## 🐛 المشاكل التي تم إصلاحها

### 1. ✅ Next.js Build Error - FIXED
**Commit:** `3ff3187` & `475e5fc`
**الملفات المعدلة:**
- `lib/redis.ts` - جعل Redis اختياري
- `app/api/health/route.ts` - تحديث health check
- `prisma/schema.prisma` - SQLite بدلاً من PostgreSQL

### 2. ✅ Bot Registration Error - FIXED  
**Commit:** `475e5fc`
**الملفات المعدلة:**
- `bot/handlers/start.ts` - إصلاح BigInt issues
- `bot/handlers/games.ts` - تحويل BigInt إلى Number
- `bot/handlers/tasks.ts` - تحويل BigInt إلى Number
- `bot/index.ts` - إصلاح Redis disconnect

---

## 📋 متطلبات النشر

### Environment Variables المطلوبة:

```env
# Bot Configuration
TELEGRAM_BOT_TOKEN=8497278773:AAHSyGW3pcCGi3axsSXlaYRydLOqpUIcPoI
TELEGRAM_BOT_USERNAME=makeittooeasy_bot

# Database (SQLite للتطوير)
DATABASE_URL=file:./prisma/dev.db

# Redis (اختياري - يمكن تركه فارغ)
REDIS_URL=redis://localhost:6379

# JWT & API
JWT_SECRET=your-secret-here
API_SECRET=your-api-secret-here

# App Settings
NODE_ENV=production
LOG_LEVEL=info
MIN_WITHDRAWAL_AMOUNT=5000000
COIN_TO_USDT_RATE=1000000
```

---

## 🚀 خطوات النشر

### على Railway/Render/Vercel:

#### الخطوة 1: Deploy Next.js Web App

```bash
# Build Command:
pnpm install && pnpm prisma generate && pnpm build

# Start Command:
pnpm start
```

#### الخطوة 2: Deploy Telegram Bot (Separate Service)

```bash
# Build Command:
pnpm install && pnpm prisma generate && pnpm build:bot

# Start Command:
node dist/bot/index.js
```

---

## 🗄️ Database Setup

### للتطوير (SQLite):
```bash
pnpm prisma generate
pnpm prisma:push
```

### للإنتاج (PostgreSQL):

1. **احصل على PostgreSQL database** من:
   - Supabase (مجاني): https://supabase.com
   - Railway (مجاني): https://railway.app
   - Neon (مجاني): https://neon.tech

2. **حدّث `DATABASE_URL`:**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

3. **حدّث `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. **طبّق Schema:**
```bash
pnpm prisma:push
```

---

## 🔴 Redis Setup (اختياري)

### Redis غير مطلوب!
البوت والـ API يعملان بدون Redis. لكن للأداء الأفضل:

1. **احصل على Redis** من:
   - Upstash (مجاني): https://upstash.com
   - Railway (مجاني): https://railway.app

2. **حدّث `REDIS_URL`:**
```env
REDIS_URL=rediss://default:password@host:6379
```

---

## 🧪 اختبار Build محلياً

```bash
# Test Next.js Build
pnpm build
# ✅ Should succeed!

# Test Bot Build  
pnpm build:bot
# ✅ Should succeed!

# Test Both
pnpm dev:all
```

---

## 📝 ملاحظات مهمة للـ Deployment

### 1. استخدم الـ Branch الصحيح:
```
cursor/build-telegram-task-and-reward-bot-platform-8521
```

### 2. تأكد من Environment Variables:
- ✅ `TELEGRAM_BOT_TOKEN` - مطلوب
- ✅ `TELEGRAM_BOT_USERNAME` - مطلوب
- ✅ `DATABASE_URL` - مطلوب
- ⚠️ `REDIS_URL` - اختياري

### 3. Build Commands:
```bash
# Web App:
pnpm install && pnpm prisma generate && pnpm build

# Bot:
pnpm install && pnpm prisma generate && pnpm build:bot
```

### 4. Start Commands:
```bash
# Web App:
pnpm start

# Bot:
node dist/bot/index.js
```

---

## 🐛 استكشاف الأخطاء

### Error: "Failed to collect page data for /api/health"

**الحل:** تأكد من أن `lib/redis.ts` يحتوي على:
```typescript
let redis: Redis | null = null;
// Redis is optional
```

### Error: "An error occurred during registration"

**الحل:** 
1. تأكد من `DATABASE_URL` صحيح
2. تأكد من تطبيق schema: `pnpm prisma:push`
3. تأكد من أن جميع BigInt تم تحويلها إلى Number

### Error: "Command pnpm run build exited with 1"

**الحل:**
1. تأكد من استخدام الـ Branch الصحيح
2. تأكد من Environment Variables
3. جرب Build محلياً: `pnpm build`

---

## ✅ Checklist النهائي

قبل النشر، تأكد من:

- [ ] استخدام Branch: `cursor/build-telegram-task-and-reward-bot-platform-8521`
- [ ] إضافة جميع Environment Variables
- [ ] `TELEGRAM_BOT_TOKEN` موجود
- [ ] `DATABASE_URL` صحيح
- [ ] Build يعمل محلياً: `pnpm build`
- [ ] Bot Build يعمل: `pnpm build:bot`
- [ ] Prisma Client تم توليده: `pnpm prisma generate`

---

## 🎯 الخلاصة

**جميع الإصلاحات موجودة في الـ Commits!**

إذا كان Build لا يزال يفشل:
1. تأكد من استخدام آخر commit: `a7a1c8a`
2. تأكد من Environment Variables
3. جرب Build محلياً للتأكد

---

**📅 آخر تحديث:** 2025-11-04  
**✅ الحالة:** جميع الإصلاحات committed & pushed  
**🚀 Branch:** cursor/build-telegram-task-and-reward-bot-platform-8521  
**🎯 Latest Commit:** a7a1c8a
