#!/bin/bash
# Auto-fix database permissions script
# This script ensures the database has correct permissions before starting

echo "🔧 تصليح صلاحيات قاعدة البيانات..."

cd /workspace

# Fix database permissions
chmod 666 prisma/dev.db 2>/dev/null
chmod 777 prisma/ 2>/dev/null

# Check if permissions were set correctly
if [ -w "prisma/dev.db" ]; then
    echo "✅ تم تعيين صلاحيات الكتابة بنجاح"
else
    echo "❌ فشل في تعيين صلاحيات الكتابة"
    exit 1
fi

echo "✅ تم إصلاح الصلاحيات بنجاح!"
