# 🤖 مراقبة البوت - Bot Monitoring Guide

## 🔍 كيف تتحقق من حالة البوت

### 1️⃣ التحقق من العمليات Running Processes

```bash
ps aux | grep "bot/index" | grep -v grep
```

**يجب أن ترى 3 processes:**
```
sh -c tsx watch bot/index.ts
node .../tsx/dist/cli.mjs watch bot/index.ts
node --require .../bot/index.ts
```

**إذا رأيت أقل من 3:**
```
❌ البوت متوقف أو لم يبدأ بشكل صحيح
```

---

### 2️⃣ فحص السجلات Logs

```bash
tail -50 bot.log
```

**ابحث عن:**

**✅ علامات نجاح:**
```
[INFO]: Starting Telegram Rewards Bot...
[INFO]: Connected to PostgreSQL via Prisma
[INFO]: Bot started successfully!
prisma:query SELECT ... (database queries)
```

**❌ علامات مشاكل:**
```
[ERROR]: ...
attempt to write a readonly database
ECONNREFUSED (Telegram API)
Cannot find module
```

---

### 3️⃣ التحقق من قاعدة البيانات

```bash
ls -la prisma/dev.db
```

**يجب أن تكون:**
```
-rw-rw-rw- (permissions 666)
```

**إذا كانت:**
```
-rw-r--r-- (permissions 644) ❌
```

**الحل:**
```bash
chmod 666 prisma/dev.db
chmod 777 prisma
```

---

## 🔧 أوامر الصيانة

### إعادة تشغيل البوت

```bash
bash restart-bot.sh
```

أو يدوياً:

```bash
# إيقاف البوت
pkill -9 -f "bot/index"

# إصلاح الصلاحيات
chmod 666 prisma/dev.db

# بدء البوت
rm -f bot.log
nohup pnpm dev:bot > bot.log 2>&1 &

# التحقق
sleep 5
tail -20 bot.log
```

---

### مشاهدة السجلات مباشرة

```bash
tail -f bot.log
```

اضغط `Ctrl+C` للخروج

---

### إيقاف البوت

```bash
pkill -9 -f "bot/index"
```

---

### تنظيف العمليات المعلقة

```bash
pkill -9 -f "bot/index"
pkill -9 -f "tsx watch"
```

---

## ⚠️ المشاكل الشائعة وحلولها

### المشكلة 1: Database Readonly

**الأعراض:**
```
[ERROR]: attempt to write a readonly database
```

**الحل:**
```bash
chmod 666 prisma/dev.db
chmod 777 prisma
bash restart-bot.sh
```

---

### المشكلة 2: البوت لا يستجيب

**الأعراض:**
```
- لا يرد على /start
- لا توجد logs جديدة
```

**الحل:**
```bash
# تحقق من العمليات
ps aux | grep "bot/index" | grep -v grep

# إذا كان يعمل لكن لا يستجيب
pkill -9 -f "bot/index"
bash restart-bot.sh

# تحقق من logs
tail -50 bot.log
```

---

### المشكلة 3: ECONNREFUSED to Telegram

**الأعراض:**
```
[ERROR]: ECONNREFUSED api.telegram.org:443
```

**الأسباب:**
```
1. مشكلة في الاتصال بالإنترنت
2. Telegram API محظور مؤقتاً
3. Bot Token خاطئ
```

**الحل:**
```bash
# اختبر الاتصال
curl https://api.telegram.org

# تحقق من Token
cat .env | grep TELEGRAM_BOT_TOKEN

# أعد المحاولة
bash restart-bot.sh
```

---

### المشكلة 4: Multiple Instances

**الأعراض:**
```
ps aux | grep "bot/index" | wc -l
# يعطي 6 أو 9 أو أكثر
```

**المشكلة:**
```
البوت يعمل عدة مرات (duplicate instances)
```

**الحل:**
```bash
# أوقف جميع النسخ
pkill -9 -f "bot/index"
pkill -9 -f "tsx"

# تحقق
ps aux | grep -E "(bot|tsx)" | grep -v grep

# ابدأ نسخة واحدة فقط
bash restart-bot.sh
```

---

### المشكلة 5: Redis Connection Error

**الأعراض:**
```
[ioredis] Unhandled error event: AggregateError [ECONNREFUSED]
```

**هل هذه مشكلة؟**
```
❌ لا! Redis اختياري
✅ البوت يعمل بدونه
```

**الرسالة التالية:**
```
[WARN]: ⚠️ Redis not available - bot will work without caching
```

**لا تقلق** - البوت يعمل بشكل طبيعي.

---

## 📊 مراقبة الأداء

### عدد المستخدمين

```bash
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM users;"
```

### آخر نشاط

```bash
sqlite3 prisma/dev.db "SELECT first_name, last_active_at FROM users ORDER BY last_active_at DESC LIMIT 10;"
```

### الأرصدة

```bash
sqlite3 prisma/dev.db "SELECT first_name, balance FROM users ORDER BY balance DESC LIMIT 10;"
```

---

## 🔔 إشعارات المشاكل

### اختبار يدوي سريع

```bash
# 1. البوت يعمل؟
ps aux | grep "bot/index" | grep -v grep | wc -l
# يجب أن يكون >= 3

# 2. آخر log؟
tail -5 bot.log | grep -E "(ERROR|WARN|INFO)"

# 3. Database قابلة للكتابة؟
ls -la prisma/dev.db | grep "rw-rw-rw"
```

---

## 🛠️ أدوات مساعدة

### السكريبت الكامل للمراقبة

```bash
#!/bin/bash
# check-bot-health.sh

echo "🔍 Bot Health Check"
echo "===================="

# Check processes
PROC_COUNT=$(ps aux | grep "bot/index" | grep -v grep | wc -l)
if [ $PROC_COUNT -ge 3 ]; then
  echo "✅ Bot is running ($PROC_COUNT processes)"
else
  echo "❌ Bot is NOT running properly ($PROC_COUNT processes)"
fi

# Check database permissions
DB_PERM=$(ls -la prisma/dev.db | awk '{print $1}')
if [[ $DB_PERM == *"rw-rw-rw"* ]]; then
  echo "✅ Database permissions OK"
else
  echo "❌ Database permissions need fixing"
  echo "   Run: chmod 666 prisma/dev.db"
fi

# Check logs for errors
ERROR_COUNT=$(tail -50 bot.log 2>/dev/null | grep -i error | wc -l)
if [ $ERROR_COUNT -gt 0 ]; then
  echo "⚠️  Found $ERROR_COUNT errors in logs"
  echo "   Last error:"
  tail -50 bot.log | grep -i error | tail -1
else
  echo "✅ No recent errors in logs"
fi

# Check last activity
LAST_LOG=$(tail -1 bot.log 2>/dev/null)
echo ""
echo "📋 Last log entry:"
echo "   $LAST_LOG"

echo ""
echo "===================="
```

**استخدمه:**
```bash
chmod +x check-bot-health.sh
bash check-bot-health.sh
```

---

## 📞 إذا احتجت مساعدة

### اجمع هذه المعلومات:

```bash
# 1. عدد العمليات
ps aux | grep "bot/index" | grep -v grep | wc -l

# 2. آخر 50 سطر من الـ log
tail -50 bot.log

# 3. صلاحيات قاعدة البيانات
ls -la prisma/dev.db

# 4. المتغيرات البيئية (بدون Tokens!)
cat .env | grep -v TOKEN | grep -v SECRET
```

---

## ✅ الخلاصة

**للتشغيل السريع:**
```bash
bash restart-bot.sh
```

**للمراقبة:**
```bash
tail -f bot.log
```

**للتحقق:**
```bash
ps aux | grep "bot/index" | grep -v grep
```

**إذا توقف البوت:**
```bash
1. bash restart-bot.sh
2. tail -20 bot.log
3. إذا ظهرت مشاكل، راجع هذا الدليل
```

---

**البوت يجب أن يعمل دائماً! 🚀**

**إذا توقف بشكل متكرر، راجع الأسباب في هذا الدليل.**
