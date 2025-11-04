#!/bin/bash

# 🚀 Telegram Rewards Bot - دليل التشغيل اليدوي
# ===============================================

echo "🎉 مرحباً بك في نظام Telegram Rewards Bot"
echo "=========================================="
echo ""

# الألوان
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# فحص ملف .env
echo "📋 الخطوة 1: فحص ملف .env"
if [ ! -f .env ]; then
    echo -e "${RED}❌ ملف .env غير موجود!${NC}"
    echo "قم بإنشائه أولاً: cp .env.example .env"
    exit 1
fi

# فحص Bot Token
if grep -q "YOUR_BOT_TOKEN_HERE" .env; then
    echo -e "${YELLOW}⚠️  يجب عليك إضافة Bot Token في ملف .env${NC}"
    echo ""
    echo "كيف تحصل على Bot Token:"
    echo "1. افتح @BotFather في تيليجرام"
    echo "2. أرسل /newbot"
    echo "3. اتبع التعليمات"
    echo "4. انسخ Token وضعه في ملف .env"
    echo ""
    read -p "هل أضفت Bot Token؟ (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✅ ملف .env موجود${NC}"
echo ""

# الخطوة 2: فحص PostgreSQL
echo "📋 الخطوة 2: تشغيل PostgreSQL"
if docker ps | grep -q postgres; then
    echo -e "${GREEN}✅ PostgreSQL يعمل بالفعل${NC}"
else
    echo "🚀 تشغيل PostgreSQL..."
    docker run -d \
      --name postgres \
      -e POSTGRES_USER=rewards_user \
      -e POSTGRES_PASSWORD=rewards_password \
      -e POSTGRES_DB=telegram_rewards_bot \
      -p 5432:5432 \
      postgres:16-alpine
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL يعمل الآن${NC}"
        echo "⏳ انتظار 5 ثواني لبدء PostgreSQL..."
        sleep 5
    else
        echo -e "${RED}❌ فشل تشغيل PostgreSQL${NC}"
        exit 1
    fi
fi
echo ""

# الخطوة 3: فحص Redis
echo "📋 الخطوة 3: تشغيل Redis"
if docker ps | grep -q redis; then
    echo -e "${GREEN}✅ Redis يعمل بالفعل${NC}"
else
    echo "🚀 تشغيل Redis..."
    docker run -d \
      --name redis \
      -p 6379:6379 \
      redis:7-alpine
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Redis يعمل الآن${NC}"
    else
        echo -e "${RED}❌ فشل تشغيل Redis${NC}"
        exit 1
    fi
fi
echo ""

# الخطوة 4: تطبيق Database Schema
echo "📋 الخطوة 4: تطبيق Database Schema"
echo "🔄 تطبيق Prisma schema..."
pnpm prisma:push --skip-generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema تم تطبيقه${NC}"
else
    echo -e "${YELLOW}⚠️  تحذير: قد يكون Schema مطبق مسبقاً${NC}"
fi
echo ""

# الخطوة 5: تشغيل المشروع
echo "📋 الخطوة 5: تشغيل المشروع"
echo ""
echo "اختر طريقة التشغيل:"
echo "1) تشغيل Bot فقط (للإنتاج)"
echo "2) تشغيل Web فقط"
echo "3) تشغيل Bot + Web معاً (التطوير)"
echo "4) تشغيل Bot + Web (الإنتاج)"
echo ""
read -p "اختيارك (1-4): " choice

case $choice in
    1)
        echo "🤖 تشغيل Bot..."
        pnpm start:bot
        ;;
    2)
        echo "🌐 تشغيل Web..."
        pnpm start
        ;;
    3)
        echo "🚀 تشغيل Bot + Web (التطوير)..."
        pnpm dev:all
        ;;
    4)
        echo "🚀 تشغيل Bot + Web (الإنتاج)..."
        echo "استخدم PM2 للإنتاج:"
        echo "pm2 start ecosystem.config.js"
        pnpm start:all
        ;;
    *)
        echo -e "${RED}❌ اختيار غير صحيح${NC}"
        exit 1
        ;;
esac
