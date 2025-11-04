# 🤖 إعداد البوت الخاص بك

## الخطوة 1: احصل على معلومات البوت من @BotFather

### 1.1 افتح @BotFather في تيليجرام

ابحث عن `@BotFather` في تيليجرام أو افتح هذا الرابط:
https://t.me/BotFather

### 1.2 أنشئ بوت جديد

أرسل الأمر:
```
/newbot
```

### 1.3 اتبع الإرشادات

```
1. BotFather سيسألك: "Alright, a new bot. How are we going to call it?"
   أدخل: اسم البوت (مثلاً: My Rewards Bot)

2. ثم سيسألك: "Good. Now let's choose a username for your bot."
   أدخل: username للبوت (يجب أن ينتهي بـ bot)
   مثال: MyRewardsBot أو my_rewards_bot

3. ستحصل على رسالة تحتوي على:
   ✅ Bot Token: مثل 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ✅ Bot Username: مثل @MyRewardsBot
```

---

## الخطوة 2: أضف معلومات البوت للمشروع

### افتح ملف `.env` وعدله

```bash
# افتح الملف
nano .env

# أو استخدم أي محرر نصوص آخر
```

### أضف المعلومات التالية:

```env
# =============================================================================
# TELEGRAM BOT CONFIGURATION
# =============================================================================
# استبدل هذا بالـ Token الذي حصلت عليه من BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# استبدل هذا بـ Username البوت (بدون @)
TELEGRAM_BOT_USERNAME=MyRewardsBot

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
# إذا كنت تستخدم Docker، اترك كما هو
DATABASE_URL=postgresql://rewards_user:rewards_password@postgres:5432/telegram_rewards_bot?schema=public

# إذا كنت تستخدم قاعدة بيانات محلية، استخدم هذا:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/telegram_rewards_bot

# =============================================================================
# REDIS CONFIGURATION
# =============================================================================
# إذا كنت تستخدم Docker، اترك كما هو
REDIS_URL=redis://redis:6379

# إذا كنت تستخدم Redis محلي، استخدم هذا:
# REDIS_URL=redis://localhost:6379

# =============================================================================
# JWT & API CONFIGURATION
# =============================================================================
# أنشئ secret عشوائي قوي (استخدم الأمر أدناه)
JWT_SECRET=your_super_secret_jwt_key_here
API_SECRET=your_api_secret_key_here

# =============================================================================
# APP CONFIGURATION
# =============================================================================
NODE_ENV=development
LOG_LEVEL=info

# Minimum withdrawal amount in coins (5,000,000 = 5 USDT)
MIN_WITHDRAWAL_AMOUNT=5000000

# Coin to USDT exchange rate (1,000,000 coins = 1 USDT)
COIN_TO_USDT_RATE=1000000

# =============================================================================
# REFERRAL SYSTEM CONFIGURATION
# =============================================================================
# Level 1 (Direct referral)
REFERRAL_LEVEL1_REWARD=1000
REFERRAL_LEVEL1_COMMISSION=0.10

# Level 2
REFERRAL_LEVEL2_REWARD=500
REFERRAL_LEVEL2_COMMISSION=0.05

# Level 3
REFERRAL_LEVEL3_REWARD=250
REFERRAL_LEVEL3_COMMISSION=0.02

# Signup bonuses
REFERRAL_SIGNUP_BONUS=5000
REFERRED_USER_SIGNUP_BONUS=2000

# =============================================================================
# RATE LIMITING
# =============================================================================
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=30
```

---

## الخطوة 3: إنشاء JWT Secret قوي

### على Linux/Mac:

```bash
# طريقة 1: باستخدام openssl
openssl rand -base64 32

# طريقة 2: باستخدام Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### على Windows (PowerShell):

```powershell
# باستخدام Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

انسخ الناتج واستبدل `your_super_secret_jwt_key_here` به في ملف `.env`

---

## الخطوة 4: تشغيل المشروع

### باستخدام Docker (الأسهل):

```bash
# تشغيل جميع الخدمات
docker-compose up -d

# عرض logs
docker-compose logs -f bot

# إيقاف
docker-compose down
```

### بدون Docker:

```bash
# 1. تأكد من تشغيل PostgreSQL و Redis
# 2. إنشاء قاعدة البيانات
createdb telegram_rewards_bot

# 3. تطبيق schema
pnpm prisma:push

# 4. تشغيل المشروع
pnpm dev:all
```

---

## الخطوة 5: اختبار البوت

### 1. افتح تيليجرام

### 2. ابحث عن البوت الخاص بك
استخدم username الذي اخترته، مثلاً: `@MyRewardsBot`

### 3. أرسل `/start`

يجب أن ترى رسالة ترحيب مثل:
```
🎉 مرحباً John!

تم تسجيلك بنجاح في بوت المكافآت 🎁

💰 رصيدك الحالي: 2000 عملة

🎯 ابدأ بإكمال المهام اليومية واكسب المزيد من العملات!
👥 قم بدعوة أصدقائك واحصل على مكافآت إضافية!

📋 استخدم القائمة أدناه للتصفح:
```

---

## الخطوة 6: إضافة مهمة تجريبية

### باستخدام Prisma Studio:

```bash
# افتح Prisma Studio
pnpm prisma:studio
```

سيفتح في المتصفح على `http://localhost:5555`

### أو باستخدام API:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Join Main Channel",
    "description": "Subscribe to our official Telegram channel",
    "category": "CHANNEL_SUBSCRIPTION",
    "type": "DAILY",
    "difficulty": "EASY",
    "reward": 5000,
    "channelUsername": "your_channel",
    "channelId": "@your_channel",
    "isActive": true
  }'
```

---

## الخطوة 7: إعداد قناة التحقق (اختياري)

إذا أردت أن يتحقق البوت تلقائياً من انضمام المستخدمين للقنوات:

### 1. أضف البوت كمسؤول في قناتك

1. افتح قناتك
2. اذهب إلى Channel Info → Administrators
3. اضغط "Add Administrator"
4. ابحث عن البوت الخاص بك وأضفه
5. أعطه صلاحية "Add Members" فقط

### 2. احصل على Channel ID

أرسل رسالة في القناة ثم افتح:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

ستجد `"chat":{"id":-1001234567890}` - هذا هو Channel ID

### 3. استخدمه في المهمة

```json
{
  "channelId": "-1001234567890",
  "channelUsername": "your_channel"
}
```

---

## 🎉 مبروك!

البوت جاهز الآن للعمل!

---

## 🆘 حل المشاكل

### البوت لا يستجيب؟

```bash
# تحقق من logs
docker-compose logs bot
# أو
pnpm dev:bot
```

### Database connection error؟

```bash
# تحقق أن PostgreSQL يعمل
docker-compose ps
# أو
pg_isready
```

### Redis connection error؟

```bash
# تحقق أن Redis يعمل
redis-cli ping
# يجب أن يرد: PONG
```

---

## 📞 تحتاج مساعدة؟

راجع الوثائق الكاملة في:
- `GETTING_STARTED.md` - دليل البدء
- `COMPLETE_DOCUMENTATION.md` - الوثائق الشاملة
- `SUCCESS.md` - ملخص سريع

---

**🚀 استمتع ببوتك! 🎊**
