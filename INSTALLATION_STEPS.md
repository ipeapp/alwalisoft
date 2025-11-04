# 🔧 خطوات التثبيت - Telegram Rewards Bot

## الطريقة 1: Docker (الأسرع - موصى به)

### الخطوات:

```bash
# 1. Clone المشروع
git clone <your-repo-url>
cd telegram-rewards-bot

# 2. إنشاء ملف البيئة
cp .env.example .env

# 3. تعديل .env (أضف Bot Token)
nano .env
# أو استخدم أي محرر نصوص آخر

# 4. تشغيل جميع الخدمات
docker-compose up -d

# 5. تحقق من الحالة
docker-compose ps

# 6. عرض Logs
docker-compose logs -f
```

### ✅ انتهى! جميع الخدمات تعمل الآن:
- PostgreSQL على port 5432
- Redis على port 6379
- Bot يعمل في الخلفية
- Web على http://localhost:3000

---

## الطريقة 2: تثبيت يدوي

### المتطلبات:
- Node.js v20+
- pnpm
- PostgreSQL 16+
- Redis 7+

### الخطوات:

```bash
# 1. Clone
git clone <your-repo-url>
cd telegram-rewards-bot

# 2. تثبيت pnpm
npm install -g pnpm

# 3. تثبيت المكتبات
pnpm install

# 4. إنشاء قاعدة البيانات
createdb telegram_rewards_bot

# 5. تشغيل Redis
redis-server &

# 6. إعداد البيئة
cp .env.example .env
nano .env  # أضف البيانات المطلوبة

# 7. إعداد قاعدة البيانات
pnpm prisma:generate
pnpm prisma:push

# 8. تشغيل المشروع
pnpm dev:all
```

### ✅ انتهى! الخدمات تعمل:
- Bot يعمل
- Web على http://localhost:3000

---

## الطريقة 3: Production مع PM2

```bash
# بعد الخطوات 1-7 من الطريقة 2:

# 8. Build
pnpm build

# 9. تثبيت PM2
npm install -g pm2

# 10. تشغيل بـ PM2
pm2 start ecosystem.config.js

# 11. حفظ الإعدادات
pm2 save

# 12. تشغيل تلقائي عند Restart
pm2 startup
```

---

## التحقق من التثبيت

### اختبار البوت:
1. افتح تيليجرام
2. ابحث عن البوت الخاص بك
3. أرسل `/start`
4. يجب أن ترى رسالة ترحيب

### اختبار Web:
1. افتح المتصفح
2. اذهب إلى http://localhost:3000
3. يجب أن ترى الصفحة الرئيسية

### اختبار Database:
```bash
pnpm prisma:studio
# يفتح UI لعرض البيانات
```

---

## حل المشاكل الشائعة

### المشكلة: "TELEGRAM_BOT_TOKEN is required"

**الحل:**
```bash
# تأكد من وجود Token في .env
echo $TELEGRAM_BOT_TOKEN

# إذا فارغ، أضفه:
echo 'TELEGRAM_BOT_TOKEN=your_token_here' >> .env
```

### المشكلة: "Database connection failed"

**الحل:**
```bash
# تحقق أن PostgreSQL يعمل
psql -U postgres -c "SELECT 1"

# تحقق من DATABASE_URL في .env
echo $DATABASE_URL
```

### المشكلة: "Redis connection failed"

**الحل:**
```bash
# تحقق أن Redis يعمل
redis-cli ping
# يجب أن يرد: PONG

# إذا لم يعمل:
redis-server &
```

---

## الخطوات التالية

بعد التثبيت الناجح:

1. ✅ أضف مهام في Database
2. ✅ اختبر جميع الميزات
3. ✅ خصص الرسائل
4. ✅ راجع [COMPLETE_DOCUMENTATION.md](./COMPLETE_DOCUMENTATION.md)

---

**🎉 مبروك! البوت جاهز للعمل!**
