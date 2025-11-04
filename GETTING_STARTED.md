# 🚀 البدء السريع - Telegram Rewards Bot

## مرحباً! 👋

هذا الدليل سيساعدك على تشغيل البوت في أقل من 10 دقائق.

---

## 📋 المتطلبات

قبل البدء، تأكد من تثبيت:

- ✅ **Node.js** v20 أو أحدث ([تحميل](https://nodejs.org/))
- ✅ **pnpm** ([تثبيت](https://pnpm.io/installation))
- ✅ **PostgreSQL** v16+ ([تحميل](https://www.postgresql.org/download/))
- ✅ **Redis** v7+ ([تحميل](https://redis.io/download))
- ✅ **Telegram Bot Token** (من [@BotFather](https://t.me/BotFather))

### اختياري (للتطوير السريع):

- 🐳 **Docker Desktop** ([تحميل](https://www.docker.com/products/docker-desktop))

---

## 🎯 الطريقة 1: تثبيت عادي (موصى به للتطوير)

### الخطوة 1: استنساخ المشروع

```bash
git clone <your-repo-url>
cd telegram-rewards-bot
```

### الخطوة 2: تثبيت المكتبات

```bash
# تثبيت pnpm إذا لم يكن مثبتاً
npm install -g pnpm

# تثبيت المكتبات
pnpm install
```

### الخطوة 3: إنشاء بوت تيليجرام

1. افتح [@BotFather](https://t.me/BotFather) في تيليجرام
2. أرسل `/newbot`
3. اتبع الإرشادات لإنشاء البوت
4. احفظ الـ Token الذي ستحصل عليه

مثال:
```
Bot Token: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
Bot Username: YourRewardsBot
```

### الخطوة 4: إعداد قاعدة البيانات

#### PostgreSQL:

```bash
# إنشاء قاعدة بيانات جديدة
createdb telegram_rewards_bot

# أو باستخدام psql:
psql -U postgres
CREATE DATABASE telegram_rewards_bot;
\q
```

#### Redis:

```bash
# تشغيل Redis
redis-server

# أو باستخدام homebrew (Mac):
brew services start redis
```

### الخطوة 5: إعداد ملف البيئة

```bash
# نسخ ملف المثال
cp .env.example .env
```

افتح `.env` وعدل المتغيرات:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=YourRewardsBot

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/telegram_rewards_bot

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (أنشئ string عشوائي قوي)
JWT_SECRET=your-super-secret-jwt-key-change-this

# API Secret
API_SECRET=your-api-secret-key
```

**💡 نصيحة:** لإنشاء secrets قوية:
```bash
# على Linux/Mac
openssl rand -base64 32

# أو
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### الخطوة 6: إعداد قاعدة البيانات

```bash
# توليد Prisma Client
pnpm prisma:generate

# إنشاء الجداول
pnpm prisma:push

# (اختياري) فتح Prisma Studio لعرض البيانات
pnpm prisma:studio
```

### الخطوة 7: تشغيل المشروع

```bash
# تشغيل البوت والويب معاً
pnpm dev:all
```

أو بشكل منفصل:

```bash
# Terminal 1: Web App
pnpm dev

# Terminal 2: Bot
pnpm dev:bot
```

### الخطوة 8: اختبار البوت

1. افتح تيليجرام
2. ابحث عن البوت الخاص بك (`@YourRewardsBot`)
3. أرسل `/start`
4. يجب أن ترى رسالة ترحيب! 🎉

### الخطوة 9: افتح Dashboard

افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

---

## 🐳 الطريقة 2: Docker (أسرع للبدء)

### الخطوة 1: تثبيت Docker

قم بتحميل وتثبيت [Docker Desktop](https://www.docker.com/products/docker-desktop)

### الخطوة 2: استنساخ وإعداد

```bash
# Clone
git clone <your-repo-url>
cd telegram-rewards-bot

# إعداد البيئة
cp .env.example .env
# عدل .env بالـ tokens الخاصة بك
```

### الخطوة 3: تشغيل

```bash
# بناء وتشغيل جميع الخدمات
docker-compose up -d

# عرض logs
docker-compose logs -f

# إيقاف
docker-compose down
```

**✅ ذلك كل شيء!** جميع الخدمات (PostgreSQL, Redis, Bot, Web) تعمل الآن.

---

## 🎮 اختبار الميزات

### 1. اختبار المهام

```
1. افتح البوت
2. اضغط "المهام"
3. اختر فئة
4. أكمل مهمة
5. تحقق من رصيدك
```

### 2. اختبار الإحالات

```
1. اضغط "الإحالات"
2. انسخ رابط الإحالة
3. أرسله لصديق (أو افتحه في متصفح مختلف)
4. سجل من خلال الرابط
5. تحقق من الإحالة في حسابك
```

### 3. اختبار الألعاب

```
1. اضغط "الألعاب"
2. اختر "عجلة الحظ"
3. شاهد النتيجة
4. جرب "اضرب الهدف"
```

### 4. اختبار البطاقات

```
1. اضغط "البطاقات"
2. اعرض مجموعتك
3. (سيكون فارغ في البداية - أكمل مهام للحصول على بطاقات)
```

### 5. اختبار الإحصائيات

```
1. اضغط "إحصائياتي"
2. شاهد رصيدك وتقدمك
```

---

## 🛠️ أوامر مفيدة

### تطوير:

```bash
# تشغيل كل شيء
pnpm dev:all

# تشغيل الويب فقط
pnpm dev

# تشغيل البوت فقط
pnpm dev:bot
```

### قاعدة البيانات:

```bash
# إنشاء migration جديد
pnpm prisma:migrate

# تطبيق schema على DB
pnpm prisma:push

# فتح Prisma Studio
pnpm prisma:studio

# إعادة توليد Client
pnpm prisma:generate
```

### إنتاج:

```bash
# بناء
pnpm build

# تشغيل الإنتاج
pnpm start:all
```

### Docker:

```bash
# تشغيل
docker-compose up -d

# إعادة البناء
docker-compose up -d --build

# عرض logs
docker-compose logs -f bot
docker-compose logs -f web

# إيقاف
docker-compose down

# حذف كل شيء
docker-compose down -v
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: البوت لا يستجيب

**الحلول:**
```bash
# 1. تحقق من البوت يعمل
pm2 list
# أو
docker-compose ps

# 2. تحقق من logs
pnpm dev:bot
# أو
docker-compose logs bot

# 3. تحقق من Token
echo $TELEGRAM_BOT_TOKEN
```

### المشكلة: Database connection error

**الحلول:**
```bash
# 1. تحقق أن PostgreSQL يعمل
psql -U postgres -c "SELECT 1"

# 2. تحقق من DATABASE_URL
echo $DATABASE_URL

# 3. أعد تشغيل PostgreSQL
# Linux:
sudo systemctl restart postgresql
# Mac:
brew services restart postgresql
```

### المشكلة: Redis connection error

**الحلول:**
```bash
# 1. تحقق أن Redis يعمل
redis-cli ping
# يجب أن يرد: PONG

# 2. أعد تشغيل Redis
# Linux:
sudo systemctl restart redis
# Mac:
brew services restart redis
```

### المشكلة: Port already in use

**الحلول:**
```bash
# إيجاد العملية على Port 3000
lsof -i :3000

# إنهاء العملية
kill -9 <PID>

# أو استخدم port مختلف
PORT=3001 pnpm dev
```

---

## 📚 الخطوات التالية

### 1. إضافة مهام

```typescript
// في Prisma Studio أو مباشرة في DB:
INSERT INTO tasks (name, description, category, reward) 
VALUES ('Join Main Channel', 'Subscribe to our channel', 'CHANNEL_SUBSCRIPTION', 5000);
```

### 2. إعداد قناة التحقق

```typescript
// في task:
{
  channelId: "@your_channel",
  channelUsername: "your_channel"
}
```

### 3. تخصيص الرسائل

عدل ملفات handlers في `bot/handlers/` لتخصيص الرسائل.

### 4. إضافة مسؤول

```bash
# في console:
node scripts/create-admin.js
```

---

## 🎓 الوثائق الكاملة

لمزيد من المعلومات، راجع:

- 📚 [COMPLETE_DOCUMENTATION.md](./COMPLETE_DOCUMENTATION.md) - وثائق شاملة
- 👤 [USER_GUIDE_AR.md](./USER_GUIDE_AR.md) - دليل المستخدم
- 🛡️ [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - دليل الإدارة
- 🚀 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - نشر الإنتاج

---

## 💬 الحصول على المساعدة

### مشاكل تقنية:
- 📧 البريد الإلكتروني: support@rewards-bot.com
- 💬 Telegram: @support_username
- 🐛 GitHub Issues: [رابط]

### الانضمام للمجتمع:
- 📢 قناة التحديثات: @updates_channel
- 👥 مجموعة المطورين: @dev_group

---

## 🎉 مبروك!

أنت الآن جاهز للبدء في استخدام وتطوير Telegram Rewards Bot!

**نصيحة أخيرة:** ابدأ بالتجربة! أضف مهام، اختبر التدفقات، وخصص حسب احتياجاتك.

**حظاً موفقاً! 🚀**

---

**آخر تحديث:** 2025-11-04  
**الإصدار:** 1.0.0
