# 🛡️ Admin Guide - Telegram Rewards Bot

## Table of Contents

1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [User Management](#user-management)
3. [Task Management](#task-management)
4. [Withdrawal Processing](#withdrawal-processing)
5. [Analytics & Reports](#analytics--reports)
6. [System Configuration](#system-configuration)
7. [Security & Monitoring](#security--monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Admin Dashboard Overview

### Accessing the Dashboard

1. Navigate to: `https://your-domain.com/admin`
2. Login with admin credentials
3. Enable 2FA if not already enabled

### Main Dashboard Sections

```
┌─────────────────────────────────────────────────┐
│              ADMIN DASHBOARD                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  [Overview] [Users] [Tasks] [Withdrawals]       │
│  [Analytics] [Settings] [Logs] [Support]        │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │         Key Metrics (Today)                │  │
│  ├───────────────────────────────────────────┤  │
│  │  • Active Users: 1,234                     │  │
│  │  • Tasks Completed: 5,678                  │  │
│  │  • Coins Distributed: 12,345,000           │  │
│  │  • Pending Withdrawals: 15                 │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## User Management

### User List

**Features:**
- Search users by Telegram ID, username, or email
- Filter by level, status, registration date
- Sort by various metrics
- Bulk actions

### User Details

Click on any user to view:

```
USER PROFILE
├── Basic Info
│   ├── Telegram ID
│   ├── Username
│   ├── Level
│   ├── Status
│   └── Joined Date
│
├── Balance & Stats
│   ├── Current Balance
│   ├── Total Earned
│   ├── Total Withdrawn
│   ├── Tasks Completed
│   └── Referral Count
│
├── Referrals
│   ├── Level 1: 10 users
│   ├── Level 2: 25 users
│   ├── Level 3: 50 users
│   └── Total Earnings: 50,000 coins
│
├── Activity Log
│   ├── Last Login
│   ├── Recent Tasks
│   ├── Recent Transactions
│   └── Game Sessions
│
└── Actions
    ├── Edit User
    ├── Adjust Balance
    ├── Change Level
    ├── Suspend/Ban
    └── View Audit Log
```

### User Actions

#### Adjust Balance

```typescript
// Manually add/subtract coins
POST /api/admin/users/:userId/balance
{
  "amount": 10000,
  "type": "add" | "subtract",
  "reason": "Compensation for issue #123"
}
```

#### Change User Level

```typescript
POST /api/admin/users/:userId/level
{
  "level": "VIP",
  "reason": "Manual upgrade for loyal user"
}
```

#### Suspend User

```typescript
POST /api/admin/users/:userId/suspend
{
  "reason": "Suspicious activity detected",
  "duration": "7d" | "30d" | "permanent"
}
```

---

## Task Management

### Creating a New Task

**Step 1: Basic Information**
```
Task Name: Join Main Channel
Description: Subscribe to our official Telegram channel
Category: Channel Subscription
Type: Daily / Weekly / Special / One-Time
```

**Step 2: Rewards**
```
Base Reward: 5,000 coins
Bonus Reward: 1,000 coins (optional)
Multiplier: 1.0x (can be increased for events)
```

**Step 3: Requirements**
```
Min Level: Beginner
Max Completions: Unlimited | Limited (specify number)
Cooldown: None | Hours | Days
```

**Step 4: Task Details**
```
For Channel/Group Tasks:
├── Channel ID: @your_channel
├── Channel Username: your_channel
└── Verification: Automatic

For Video Tasks:
├── Video URL: https://youtube.com/...
├── Min Watch Time: 30 seconds
└── Verification: Manual

For Special Tasks:
├── Custom Requirements
└── Admin Verification Required
```

**Step 5: Scheduling**
```
Start Date: 2025-11-04 00:00
End Date: 2025-11-30 23:59 (optional)
Priority: 0-100 (higher = shown first)
Featured: Yes/No
```

### Task Templates

Use pre-made templates for common tasks:

**Channel Subscription Template:**
```json
{
  "name": "Join [Channel Name]",
  "category": "CHANNEL_SUBSCRIPTION",
  "reward": 5000,
  "channelUsername": "your_channel",
  "autoVerify": true
}
```

**Video Task Template:**
```json
{
  "name": "Watch Tutorial Video",
  "category": "VIDEO_WATCH",
  "reward": 2000,
  "videoUrl": "https://youtube.com/...",
  "minWatchTime": 30
}
```

### Bulk Task Operations

- Import tasks from CSV
- Export tasks to CSV
- Duplicate existing tasks
- Enable/Disable multiple tasks
- Delete expired tasks

---

## Withdrawal Processing

### Withdrawal Queue

```
┌─────────────────────────────────────────────────┐
│           PENDING WITHDRAWALS (15)               │
├──────┬──────────┬──────────┬─────────┬─────────┤
│ User │ Amount   │ USDT     │ Date    │ Action  │
├──────┼──────────┼──────────┼─────────┼─────────┤
│ @john│5,000,000 │ 5.00     │11/04 9AM│[Review] │
│ @mary│7,500,000 │ 7.50     │11/04 8AM│[Review] │
│ @alex│5,000,000 │ 5.00     │11/03 5PM│[Review] │
└──────┴──────────┴──────────┴─────────┴─────────┘
```

### Processing Steps

#### 1. Review Request

Click **[Review]** to see details:

```
WITHDRAWAL REQUEST #12345

User Information:
├── Username: @john_doe
├── Telegram ID: 123456789
├── Level: Professional
├── Account Age: 45 days
└── Previous Withdrawals: 2 (all successful)

Request Details:
├── Amount: 5,000,000 coins
├── USDT: 5.00
├── Network: TRC20
├── Wallet: TXxxx...xxxxx
├── Requested: 2025-11-04 09:15 AM
└── Status: Pending Review

Verification Checks:
├── Balance Available: ✅ Yes
├── Min Amount Met: ✅ Yes (5 USDT)
├── Fraud Check: ✅ Passed
├── Wallet Valid: ✅ Yes
└── No Recent Withdrawals: ✅ Yes

Actions:
[Approve] [Reject] [Request Info] [Flag for Review]
```

#### 2. Approve Withdrawal

```typescript
POST /api/admin/withdrawals/:id/approve
{
  "notes": "Verified - Processing payment"
}

// System will:
1. Lock user balance
2. Update status to PROCESSING
3. Generate payment order
4. Send notification to user
```

#### 3. Process Payment

**Manual Process:**
1. Copy wallet address
2. Open your USDT wallet (TRC20)
3. Send the exact amount
4. Copy transaction hash
5. Return to dashboard

**Update with TX Hash:**
```typescript
POST /api/admin/withdrawals/:id/complete
{
  "txHash": "0x1234567890abcdef...",
  "notes": "Payment sent successfully"
}

// System will:
1. Update status to COMPLETED
2. Record transaction hash
3. Update user statistics
4. Send confirmation to user
5. Log transaction
```

#### 4. Handle Rejection

```typescript
POST /api/admin/withdrawals/:id/reject
{
  "reason": "Insufficient activity verification",
  "notes": "Please complete more tasks before requesting withdrawal"
}

// System will:
1. Update status to REJECTED
2. Unlock user balance
3. Send notification with reason
4. Log rejection
```

### Withdrawal Reports

Generate reports for:
- Daily withdrawal summary
- Monthly payout totals
- User withdrawal history
- Failed/Rejected withdrawals
- Average processing time

---

## Analytics & Reports

### Real-Time Dashboard

```
TODAY'S METRICS
├── Active Users: 1,234 (↑ 5%)
├── New Registrations: 89 (↑ 12%)
├── Tasks Completed: 5,678 (↑ 8%)
├── Coins Distributed: 12,345,000 (↑ 15%)
├── Withdrawals Processed: 12 ($60 USDT)
└── Revenue: N/A

THIS WEEK
├── Active Users: 5,432
├── Tasks Completed: 23,456
├── Total Earned: 45,678,000 coins
├── Withdrawal Requests: 45
└── Average User Balance: 8,500 coins

THIS MONTH
├── Active Users: 18,234
├── New Users: 2,345
├── Retention Rate: 65%
├── Withdrawal Rate: 12%
└── User Satisfaction: 4.5/5
```

### User Analytics

**Growth Metrics:**
- New users (daily/weekly/monthly)
- Active users (DAU/WAU/MAU)
- Retention rate (1-day, 7-day, 30-day)
- Churn rate
- User lifetime value (LTV)

**Engagement Metrics:**
- Tasks per user
- Session duration
- Feature usage
- Game participation
- Referral activity

### Financial Reports

**Revenue & Costs:**
```
MONTHLY FINANCIAL SUMMARY

Income:
├── Advertising Revenue: $0 (N/A yet)
├── Partnership Earnings: $0
└── Total Income: $0

Costs:
├── Withdrawals Paid: $450
├── Server Costs: $100
├── Other: $50
└── Total Costs: $600

Net: -$600
```

**Coin Economy:**
```
COIN DISTRIBUTION

Minted Coins: 50,000,000
├── Task Rewards: 35,000,000 (70%)
├── Referral Bonuses: 10,000,000 (20%)
├── Game Winnings: 3,000,000 (6%)
└── Admin Grants: 2,000,000 (4%)

Withdrawn Coins: 5,000,000 (10%)
Active Balance: 45,000,000 (90%)

Avg per User: 8,500 coins
Median: 3,200 coins
```

### Export Options

- CSV Export
- Excel Export
- PDF Reports
- API Access
- Scheduled Reports (Email)

---

## System Configuration

### General Settings

```typescript
{
  // Coin Settings
  "coinToUsdtRate": 1000000,
  "minWithdrawal": 5000000,
  
  // Referral Settings
  "level1Reward": 1000,
  "level1Commission": 0.10,
  "level2Reward": 500,
  "level2Commission": 0.05,
  "level3Reward": 250,
  "level3Commission": 0.02,
  
  // Task Settings
  "defaultTaskReward": 5000,
  "maxDailyTasks": 50,
  "taskCooldown": 3600, // seconds
  
  // Game Settings
  "targetHitAttempts": 3,
  "luckyWheelAttempts": 1,
  "quizChallengeAttempts": 2,
  
  // Security
  "maxLoginAttempts": 5,
  "sessionTimeout": 3600,
  "twoFactorRequired": true
}
```

### Notification Templates

Edit notification messages:

**Welcome Message:**
```
🎉 Welcome {{firstName}}!

You have successfully registered in the Rewards Bot 🎁

💰 Your current balance: {{balance}} coins

🎯 Start completing daily tasks and earn more coins!
👥 Invite your friends and get bonus rewards!

📋 Use the menu below to navigate:
```

**Withdrawal Approved:**
```
✅ Withdrawal Approved!

Amount: {{amount}} coins ({{usdt}} USDT)
TX Hash: {{txHash}}
Status: Completed

The payment has been sent to your wallet.
Please allow a few minutes for blockchain confirmation.

Thank you for using our service! 🙏
```

### Feature Toggles

Enable/Disable features:

```typescript
{
  "tasks": true,
  "referrals": true,
  "games": true,
  "cards": false, // Coming soon
  "marketplace": false, // Coming soon
  "tournaments": false, // Coming soon
  "dailyBonus": true,
  "promotions": true
}
```

---

## Security & Monitoring

### Security Dashboard

```
SECURITY OVERVIEW

Threats Detected Today: 3
├── Suspicious Login Attempts: 2 (blocked)
├── Rapid Task Completion: 1 (flagged)
└── Duplicate Accounts: 0

Active Alerts:
├── User #12345 - Multiple IPs detected
└── User #67890 - Abnormal referral pattern

Recent Actions:
├── 2 users suspended
├── 5 tasks verified manually
└── 1 withdrawal flagged for review
```

### Fraud Detection

**Automatic Checks:**
- Multiple accounts from same device
- Rapid task completions
- Unusual referral patterns
- VPN/Proxy usage
- Bot-like behavior

**Manual Review:**
- Flagged users
- High-value withdrawals
- Suspicious activity patterns
- Reported accounts

### Audit Logs

Track all admin actions:

```
AUDIT LOG

[2025-11-04 10:15] Admin @john_admin
└── Action: Approved withdrawal #12345
    └── Amount: 5 USDT
    └── User: @user123

[2025-11-04 10:10] Admin @mary_admin
└── Action: Created new task
    └── Task: "Join VIP Channel"
    └── Reward: 10,000 coins

[2025-11-04 09:45] Admin @john_admin
└── Action: Suspended user
    └── User: @suspicious_user
    └── Reason: "Multiple accounts detected"
```

### Backup & Recovery

**Automated Backups:**
- Database: Daily at 2 AM
- Redis: Every 6 hours
- User data: Real-time replication
- Logs: Weekly archives

**Manual Backup:**
```bash
# Database
pnpm backup:db

# Full system
pnpm backup:full

# Restore
pnpm restore:db --file=backup_20251104.sql
```

---

## Troubleshooting

### Common Issues

#### Issue: User can't verify task completion

**Diagnosis:**
1. Check if user is actually member of channel/group
2. Verify channel/group ID is correct
3. Check bot permissions in channel/group
4. Review task verification settings

**Solution:**
```typescript
// Manual verification
POST /api/admin/tasks/completions/:id/verify
{
  "verified": true,
  "notes": "Manually verified by admin"
}
```

---

#### Issue: Withdrawal stuck in processing

**Diagnosis:**
1. Check payment was actually sent
2. Verify transaction hash
3. Check network status (TRC20)
4. Review user balance

**Solution:**
```typescript
// Update status manually
POST /api/admin/withdrawals/:id/update
{
  "status": "COMPLETED",
  "txHash": "0x...",
  "notes": "Payment confirmed on blockchain"
}
```

---

#### Issue: High server load

**Diagnosis:**
1. Check active users count
2. Review slow queries
3. Check Redis memory usage
4. Review job queue

**Solution:**
```bash
# Scale Redis
docker-compose up -d --scale redis=2

# Clear old sessions
redis-cli FLUSHDB

# Optimize database
pnpm prisma:optimize

# Restart services
pm2 restart all
```

---

### Emergency Procedures

#### 1. Bot is Down

```bash
# Check bot status
pm2 status telegram-bot

# View logs
pm2 logs telegram-bot --lines 100

# Restart bot
pm2 restart telegram-bot

# If still down, check:
- Telegram API status
- Database connection
- Redis connection
- Server resources
```

#### 2. Database Issues

```bash
# Check connections
SELECT count(*) FROM pg_stat_activity;

# Kill hanging queries
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle in transaction';

# Backup before any major changes
pg_dump dbname > backup_emergency.sql
```

#### 3. Mass Fraud Detection

1. Suspend affected accounts
2. Review patterns
3. Update fraud detection rules
4. Communicate with community
5. Restore legitimate accounts

---

## Best Practices

### Daily Tasks

- [ ] Review pending withdrawals
- [ ] Check for flagged users
- [ ] Monitor system health
- [ ] Review support tickets
- [ ] Check analytics dashboard

### Weekly Tasks

- [ ] Generate weekly report
- [ ] Review and approve new tasks
- [ ] Update promotions
- [ ] Backup verification
- [ ] Security audit

### Monthly Tasks

- [ ] Financial review
- [ ] User satisfaction survey
- [ ] System performance analysis
- [ ] Feature planning
- [ ] Team meeting

---

## Support Contacts

### Technical Issues

- 📧 Email: tech@rewards-bot.com
- 💬 Slack: #admin-support
- 📱 Emergency: +1-xxx-xxx-xxxx

### Financial/Withdrawal Issues

- 📧 Email: finance@rewards-bot.com
- 💬 Telegram: @finance_support

### General Inquiries

- 📧 Email: admin@rewards-bot.com
- 📚 Docs: https://docs.rewards-bot.com/admin

---

**Last Updated:** 2025-11-04  
**Version:** 1.0

© 2025 Rewards Bot. All rights reserved.
