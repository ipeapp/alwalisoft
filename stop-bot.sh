#!/bin/bash

# Stop all bot processes

echo "🛑 Stopping Telegram Bot..."

# Stop PM2 process
pm2 delete telegram-bot 2>/dev/null || true

# Kill any remaining processes
pkill -9 -f "bot/index" 2>/dev/null || true
pkill -9 -f "tsx watch bot" 2>/dev/null || true

echo "✅ Bot stopped successfully!"
