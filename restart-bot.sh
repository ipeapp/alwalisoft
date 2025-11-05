#!/bin/bash

# Script to restart bot with correct permissions
# Usage: ./restart-bot.sh

echo "🔧 Fixing database permissions..."
cd /workspace
chmod 666 prisma/dev.db
chmod 777 prisma/

echo "🛑 Stopping bot..."
pkill -9 -f "bot/index"
sleep 2

echo "🚀 Starting bot..."
rm -f bot.log
nohup pnpm dev:bot > bot.log 2>&1 &
sleep 5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Bot restarted successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if bot is running
if ps aux | grep -v grep | grep "bot/index" > /dev/null; then
    echo "✅ Bot is running:"
    ps aux | grep -v grep | grep "bot/index" | head -1
    echo ""
    echo "📋 View logs:"
    echo "   tail -f bot.log"
    echo ""
    echo "🧪 Test bot:"
    echo "   Telegram → @makeittooeasy_bot → /start"
else
    echo "❌ Bot failed to start!"
    echo "Check logs: tail -50 bot.log"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
