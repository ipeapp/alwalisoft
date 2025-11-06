#!/bin/bash

# Production Bot Startup Script with PM2
# This ensures the bot runs continuously and restarts automatically

echo "🚀 Starting Telegram Bot in Production Mode..."
echo ""

# Stop any existing bot processes
echo "🛑 Stopping existing bot processes..."
pkill -9 -f "bot/index" 2>/dev/null || true
pm2 delete telegram-bot 2>/dev/null || true

# Fix database permissions
echo "🔧 Fixing database permissions..."
chmod 666 prisma/dev.db 2>/dev/null || true
chmod 777 prisma/ 2>/dev/null || true

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    pnpm add -g pm2
fi

# Start bot with PM2
echo "🚀 Starting bot with PM2..."
pm2 start pnpm --name "telegram-bot" -- dev:bot

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

# Show status
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Bot started with PM2!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

pm2 status

echo ""
echo "📋 Useful PM2 commands:"
echo "   pm2 status           # Check bot status"
echo "   pm2 logs telegram-bot    # View logs"
echo "   pm2 restart telegram-bot # Restart bot"
echo "   pm2 stop telegram-bot    # Stop bot"
echo "   pm2 delete telegram-bot  # Remove bot from PM2"
echo "   pm2 monit            # Monitor bot (CPU, memory)"
echo ""
