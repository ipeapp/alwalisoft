#!/bin/bash

echo "🤖 تشغيل بوت تليجرام باستخدام PM2..."
echo ""

# إنشاء مجلد السجلات
mkdir -p logs

# التحقق من ملف .env
if [ ! -f ".env" ]; then
    echo "❌ ملف .env غير موجود!"
    exit 1
fi

# تحميل متغيرات البيئة
export $(grep -v '^#' .env | xargs 2>/dev/null)

# التحقق من TELEGRAM_BOT_TOKEN
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN غير موجود في .env"
    exit 1
fi

echo "✅ البيئة جاهزة"
echo ""

# التحقق من وجود tsx
if [ ! -f "./node_modules/.bin/tsx" ]; then
    echo "❌ tsx غير مثبت"
    exit 1
fi
echo "✅ tsx موجود"

# إيقاف البوت القديم إذا كان يعمل
echo "🛑 إيقاف البوت القديم..."
pnpm pm2 stop telegram-bot 2>/dev/null || true
pnpm pm2 delete telegram-bot 2>/dev/null || true
pkill -9 -f "bot/index" 2>/dev/null || true
pkill -9 -f "dev:bot" 2>/dev/null || true

sleep 2

# تشغيل البوت باستخدام PM2
echo "🚀 تشغيل البوت باستخدام PM2..."
pnpm pm2 start ecosystem.config.cjs

# انتظار ثانيتين
sleep 2

# عرض حالة البوت
echo ""
echo "📊 حالة البوت:"
pnpm pm2 list

echo ""
echo "📋 آخر 20 سطر من السجل:"
pnpm pm2 logs telegram-bot --lines 20 --nostream

echo ""
echo "✅ البوت يعمل الآن بشكل دائم!"
echo ""
echo "📌 أوامر مفيدة:"
echo "   - عرض الحالة:     pnpm pm2 list"
echo "   - عرض السجلات:    pnpm pm2 logs telegram-bot"
echo "   - إعادة التشغيل:  pnpm pm2 restart telegram-bot"
echo "   - إيقاف البوت:    pnpm pm2 stop telegram-bot"
echo "   - حذف البوت:      pnpm pm2 delete telegram-bot"
echo ""
