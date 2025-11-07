#!/bin/bash

echo "🔄 إعادة تشغيل بوت تليجرام..."

# Kill all bot processes
echo "🛑 إيقاف العمليات القديمة..."
pkill -9 -f "bot/index" 2>/dev/null
pkill -9 -f "tsx watch" 2>/dev/null
pkill -9 -f "node.*dist/bot" 2>/dev/null
sleep 2

# Check if database exists
if [ -f "prisma/dev.db" ]; then
    echo "✅ قاعدة البيانات موجودة"
    # Fix database permissions
    chmod 666 prisma/dev.db 2>/dev/null || true
    chmod 777 prisma 2>/dev/null || true
else
    echo "⚠️ قاعدة البيانات غير موجودة"
fi

# Clean old logs
rm -f bot.log bot-error.log 2>/dev/null

# Check if bot is built
if [ ! -d "dist/bot" ]; then
    echo "⚠️ البوت غير مبني، جاري البناء..."
    pnpm build:bot
fi

# Check environment variables
if [ ! -f ".env" ]; then
    echo "❌ ملف .env غير موجود!"
    echo "قم بإنشاء ملف .env مع المتغيرات المطلوبة"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs 2>/dev/null)

# Check required variables
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN غير موجود في .env"
    exit 1
fi

echo "✅ البيئة جاهزة"
echo "🚀 بدء تشغيل البوت..."

# Start bot (production mode with built files)
if [ -f "dist/bot/index.js" ]; then
    nohup node dist/bot/index.js > bot.log 2>&1 &
    BOT_PID=$!
    echo "✅ البوت يعمل (PID: $BOT_PID)"
else
    # Fallback to dev mode
    echo "⚠️ استخدام وضع التطوير..."
    nohup pnpm dev:bot > bot.log 2>&1 &
    BOT_PID=$!
fi

# Wait for bot to start
sleep 3

# Show status
echo ""
echo "📊 حالة البوت:"
if ps -p $BOT_PID > /dev/null 2>&1; then
    echo "  ✅ البوت يعمل (PID: $BOT_PID)"
else
    echo "  ❌ فشل تشغيل البوت"
    echo ""
    echo "📋 آخر سطور من السجل:"
    tail -20 bot.log
    exit 1
fi

echo ""
echo "📋 آخر 15 سطر من السجل:"
tail -15 bot.log

echo ""
echo "✅ تم إعادة تشغيل البوت بنجاح!"
echo ""
echo "💡 أوامر مفيدة:"
echo "  - مشاهدة السجل المباشر: tail -f bot.log"
echo "  - إيقاف البوت: kill $BOT_PID"
echo "  - التحقق من الحالة: ps aux | grep 'bot/index'"
