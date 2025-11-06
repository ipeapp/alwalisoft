#!/bin/bash

echo "🔄 Restarting Telegram Bot..."

# Kill all bot processes
pkill -9 -f "bot/index"
pkill -9 -f "tsx watch"
sleep 2

# Fix database permissions
chmod 666 prisma/dev.db
chmod 777 prisma

# Clean old logs
rm -f bot.log

# Start bot
nohup pnpm dev:bot > bot.log 2>&1 &

# Wait for bot to start
sleep 5

# Show status
echo ""
echo "✅ Bot Status:"
ps aux | grep "bot/index" | grep -v grep | wc -l | xargs -I {} echo "  Running processes: {}"

echo ""
echo "📋 Last 10 log lines:"
tail -10 bot.log

echo ""
echo "✅ Bot restarted successfully!"
