#!/bin/bash

# Script to setup Telegram Bot as a systemd service
# This ensures the bot starts automatically and restarts on failure

echo "🔧 Setting up Telegram Bot Service..."

# Copy service file to systemd directory
sudo cp /workspace/telegram-bot.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable telegram-bot.service

# Start the service
sudo systemctl start telegram-bot.service

# Show status
sudo systemctl status telegram-bot.service --no-pager

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Bot service installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Useful commands:"
echo "   sudo systemctl status telegram-bot   # Check status"
echo "   sudo systemctl restart telegram-bot  # Restart bot"
echo "   sudo systemctl stop telegram-bot     # Stop bot"
echo "   sudo systemctl start telegram-bot    # Start bot"
echo "   sudo journalctl -u telegram-bot -f   # View logs"
echo ""
