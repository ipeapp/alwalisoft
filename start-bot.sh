#!/bin/bash

# Start Bot Script
echo "🤖 Starting Telegram Rewards Bot..."

# Check if dist/bot exists
if [ ! -d "dist/bot" ]; then
    echo "❌ Bot not built. Running build first..."
    pnpm build:bot
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with required variables"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check required variables
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN not set in .env"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env"
    exit 1
fi

echo "✅ Environment variables loaded"
echo "✅ Bot Token: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "✅ Database: $DATABASE_URL"

# Start bot
echo "🚀 Starting bot process..."
node dist/bot/index.js

echo "🛑 Bot stopped"
