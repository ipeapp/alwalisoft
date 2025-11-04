# 🎉 نظام بوت تيليجرام للمهام والمكافآت - الوثائق الشاملة

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [العمارة التقنية](#العمارة-التقنية)
3. [دليل التثبيت](#دليل-التثبيت)
4. [البنية والمكونات](#البنية-والمكونات)
5. [واجهات API](#واجهات-api)
6. [تدفقات البوت](#تدفقات-البوت)
7. [قاعدة البيانات](#قاعدة-البيانات)
8. [الأمان](#الأمان)
9. [النشر](#النشر)
10. [الاختبارات](#الاختبارات)
11. [الصيانة](#الصيانة)
12. [الأسئلة الشائعة](#الأسئلة-الشائعة)

---

## نظرة عامة

### ما هو هذا النظام؟

نظام متكامل لبوت تيليجرام يتيح للمستخدمين:
- ✅ إكمال مهام يومية وخاصة
- 💰 كسب عملة افتراضية قابلة للتحويل إلى USDT
- 👥 دعوة الأصدقاء والحصول على مكافآت متعددة المستويات (3 مستويات)
- 🎮 لعب ألعاب مصغرة وكسب مكافآت إضافية
- 🃏 جمع بطاقات نادرة والحصول على مزايا حصرية
- 💳 سحب الأرباح عبر USDT (TRC20)
- 📊 تتبع الإحصائيات والأداء

### المميزات الرئيسية

#### 1. نظام المهام المتقدم
- مهام يومية وأسبوعية وخاصة
- تصنيفات متعددة (قنوات، مجموعات، فيديوهات، تفاعل، إلخ)
- نظام تحقق تلقائي من إكمال المهام
- مكافآت متدرجة حسب الصعوبة
- مهام محدودة الوقت (Flash Tasks)

#### 2. نظام الإحالات متعدد المستويات
- **المستوى 1 (مباشر)**: 1,000 عملة + 10% عمولة من أرباح المحال
- **المستوى 2**: 500 عملة + 5% عمولة
- **المستوى 3**: 250 عملة + 2% عمولة
- مكافآت تسجيل فورية للطرفين
- لوحة متصدرين للأفضل في الإحالات

#### 3. الألعاب المصغرة
- **اضرب الهدف**: فرصة ربح حتى 5,000 عملة (3 محاولات يومياً)
- **عجلة الحظ**: جوائز تصل إلى 10,000 عملة (محاولة واحدة يومياً)
- **تحدي الأسئلة**: مسابقات معرفية بمكافآت ضخمة (محاولتان يومياً)
- **بطولات أسبوعية**: منافسات مع جوائز كبرى (قريباً)

#### 4. نظام البطاقات والجواهر
- بطاقات بخمس درجات ندرة (Common → Legendary)
- كل بطاقة تمنح نسبة مكافأة إضافية (5% → 50%)
- جواهر للاستبدال بمكافآت خاصة
- متجر لشراء وبيع البطاقات (Marketplace - قريباً)
- ألبوم تفاعلي لعرض المجموعة

#### 5. نظام المستويات والرتب
- **مبتدئ (Beginner)**: المستوى الأساسي
- **محترف (Professional)**: مزايا إضافية وفرص أفضل
- **خبير (Expert)**: مهام حصرية ومكافآت مضاعفة
- **VIP**: أفضل المزايا، دعم خاص، عروض حصرية

#### 6. نظام السحوبات الآمن
- حد أدنى: 5,000,000 عملة (5 USDT)
- معدل التحويل: 1,000,000 عملة = 1 USDT
- الشبكة: TRC20 (رسوم منخفضة)
- معالجة خلال 24-48 ساعة
- تتبع كامل لحالة السحب

---

## العمارة التقنية

### المكدس التقني (Tech Stack)

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend Layer                       │
├─────────────────────────────────────────────────────────┤
│  • Next.js 16 (App Router)                              │
│  • React 19 + TypeScript                                │
│  • Tailwind CSS v4                                      │
│  • shadcn/ui Components                                 │
│  • Recharts (Analytics)                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
├─────────────────────────────────────────────────────────┤
│  • Telegram Bot (Telegraf)                              │
│  • Node.js + TypeScript                                 │
│  • Next.js API Routes                                   │
│  • Prisma ORM                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Services Layer                        │
├─────────────────────────────────────────────────────────┤
│  • Redis (Caching & Sessions)                           │
│  • BullMQ (Job Queues)                                  │
│  • JWT (Authentication)                                 │
│  • Pino (Logging)                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Persistence Layer                      │
├─────────────────────────────────────────────────────────┤
│  • PostgreSQL (Main Database)                           │
│  • Redis (Cache & Queue Storage)                        │
└─────────────────────────────────────────────────────────┘
```

### تدفق البيانات (Data Flow)

```
User (Telegram)
    │
    ├─> [Telegram Bot] (Telegraf)
    │        │
    │        ├─> Middlewares:
    │        │   ├─ Error Handler
    │        │   ├─ Session Management
    │        │   ├─ Rate Limiting
    │        │   └─ Authentication
    │        │
    │        ├─> Handlers:
    │        │   ├─ Start & Onboarding
    │        │   ├─ Tasks Management
    │        │   ├─ Referrals
    │        │   ├─ Games
    │        │   ├─ Cards & Gems
    │        │   ├─ Statistics
    │        │   ├─ Withdrawals
    │        │   └─ Support & Settings
    │        │
    │        ├─> Services:
    │        │   ├─ Prisma (Database)
    │        │   ├─ Redis (Cache)
    │        │   └─ Logger
    │        │
    │        └─> Database (PostgreSQL)
    │
    └─> [Web Dashboard] (Next.js)
             │
             ├─> API Routes:
             │   ├─ /api/users
             │   ├─ /api/tasks
             │   ├─ /api/rewards
             │   ├─ /api/referrals
             │   └─ /api/withdrawals
             │
             └─> Database (PostgreSQL)
```

---

## دليل التثبيت

### المتطلبات الأساسية

- **Node.js**: v20.x أو أحدث
- **pnpm**: v8.x أو أحدث
- **PostgreSQL**: v16.x أو أحدث
- **Redis**: v7.x أو أحدث
- **Docker** (اختياري): v24.x أو أحدث

### التثبيت السريع

#### 1. استنساخ المشروع

```bash
git clone https://github.com/your-repo/telegram-rewards-bot.git
cd telegram-rewards-bot
```

#### 2. تثبيت المكتبات

```bash
pnpm install
```

#### 3. إعداد ملفات البيئة

```bash
cp .env.example .env
```

قم بتعديل ملف `.env` وأضف المعلومات المطلوبة:

```env
# Telegram Bot Token from @BotFather
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=YourBotUsername

# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/telegram_rewards_bot

# Redis Connection
REDIS_URL=redis://localhost:6379

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_secure_jwt_secret_here

# API Secret
API_SECRET=your_api_secret_here
```

#### 4. إعداد قاعدة البيانات

```bash
# Generate Prisma Client
pnpm prisma:generate

# Push schema to database
pnpm prisma:push

# Or run migrations
pnpm prisma:migrate
```

#### 5. تشغيل المشروع

**طريقة التطوير (Development):**

```bash
# Run web app and bot together
pnpm dev:all

# Or run separately:
pnpm dev      # Web app only
pnpm dev:bot  # Bot only
```

**طريقة الإنتاج (Production):**

```bash
# Build everything
pnpm build

# Start services
pnpm start:all

# Or with Docker Compose
docker-compose up -d
```

### التثبيت باستخدام Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## البنية والمكونات

### هيكل المشروع

```
telegram-rewards-bot/
├── app/                      # Next.js App (Admin Dashboard)
│   ├── api/                  # API Routes
│   │   ├── users/
│   │   ├── tasks/
│   │   ├── rewards/
│   │   ├── referrals/
│   │   └── withdrawals/
│   ├── admin/                # Admin pages
│   ├── user/                 # User portal
│   ├── layout.tsx
│   └── page.tsx
│
├── bot/                      # Telegram Bot
│   ├── handlers/             # Command & Callback Handlers
│   │   ├── start.ts
│   │   ├── tasks.ts
│   │   ├── referrals.ts
│   │   ├── games.ts
│   │   ├── cards.ts
│   │   ├── stats.ts
│   │   ├── withdraw.ts
│   │   ├── support.ts
│   │   └── settings.ts
│   ├── middlewares/          # Bot Middlewares
│   │   ├── session.ts
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── errorHandler.ts
│   ├── services/             # Bot Services
│   │   └── index.ts
│   ├── utils/                # Utilities
│   │   └── logger.ts
│   ├── config.ts             # Bot Configuration
│   └── index.ts              # Bot Entry Point
│
├── prisma/                   # Prisma ORM
│   └── schema.prisma         # Database Schema
│
├── lib/                      # Shared Libraries
│   ├── auth.ts
│   ├── utils.ts
│   └── security-headers.ts
│
├── components/               # React Components
│   ├── ui/                   # shadcn/ui components
│   ├── navigation.tsx
│   └── theme-provider.tsx
│
├── database/                 # Database Scripts
│   └── schema.sql
│
├── public/                   # Static Assets
│
├── docker-compose.yml        # Docker Compose Config
├── Dockerfile.bot            # Bot Dockerfile
├── Dockerfile.web            # Web Dockerfile
├── tsconfig.json             # TypeScript Config (Web)
├── tsconfig.bot.json         # TypeScript Config (Bot)
├── package.json              # Dependencies
└── .env.example              # Environment Variables Template
```

### المكونات الرئيسية

#### 1. Telegram Bot (`bot/`)

**Entry Point** (`bot/index.ts`):
- تهيئة البوت باستخدام Telegraf
- تسجيل Middlewares
- تسجيل Handlers
- معالجة الأخطاء

**Handlers** (`bot/handlers/`):
- `start.ts`: التسجيل والترحيب
- `tasks.ts`: إدارة المهام
- `referrals.ts`: نظام الإحالات
- `games.ts`: الألعاب المصغرة
- `cards.ts`: البطاقات والجواهر
- `stats.ts`: الإحصائيات
- `withdraw.ts`: السحوبات
- `support.ts`: الدعم
- `settings.ts`: الإعدادات

**Middlewares** (`bot/middlewares/`):
- `session.ts`: إدارة الجلسات
- `auth.ts`: المصادقة
- `rateLimit.ts`: تحديد معدل الطلبات
- `errorHandler.ts`: معالجة الأخطاء

#### 2. Web Dashboard (`app/`)

**API Routes**:
- `/api/users`: إدارة المستخدمين
- `/api/tasks`: إدارة المهام
- `/api/rewards`: إدارة المكافآت
- `/api/referrals`: تتبع الإحالات
- `/api/withdrawals`: معالجة السحوبات

**Admin Dashboard**:
- إحصائيات شاملة
- إدارة المستخدمين
- إدارة المهام
- مراجعة السحوبات
- تقارير وتحليلات

#### 3. Database (`prisma/schema.prisma`)

**الجداول الرئيسية**:
- `User`: بيانات المستخدمين
- `Task`: المهام المتاحة
- `TaskCompletion`: سجل إكمال المهام
- `Referral`: نظام الإحالات
- `ReferralTree`: شجرة الإحالات
- `RewardLedger`: سجل المكافآت
- `Withdrawal`: طلبات السحب
- `Card`: البطاقات المتاحة
- `CardCollection`: مجموعات المستخدمين
- `GameSession`: جلسات الألعاب
- `Leaderboard`: لوحة المتصدرين
- `Notification`: الإشعارات
- `AuditLog`: سجل التدقيق

---

## واجهات API

### مصادقة API

جميع API endpoints تتطلب مصادقة باستثناء endpoints العامة.

**Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

### Users API

#### إنشاء مستخدم جديد
```http
POST /api/users
Content-Type: application/json

{
  "telegramId": 123456789,
  "username": "john_doe",
  "referralCode": "ref_abc123"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "telegramId": 123456789,
    "username": "john_doe",
    "balance": 2000,
    "level": "BEGINNER",
    "referralCode": "ref_xyz789",
    "createdAt": "2025-11-04T10:00:00Z"
  }
}
```

#### الحصول على بيانات مستخدم
```http
GET /api/users?id=uuid
GET /api/users?telegramId=123456789

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "telegramId": 123456789,
    "username": "john_doe",
    "balance": 15000,
    "level": "PROFESSIONAL",
    "tasksCompleted": 25,
    "referralCount": 5
  }
}
```

### Tasks API

#### الحصول على المهام المتاحة
```http
GET /api/tasks?category=CHANNEL_SUBSCRIPTION&active=true

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Join Main Channel",
      "description": "Subscribe to our main Telegram channel",
      "category": "CHANNEL_SUBSCRIPTION",
      "reward": 5000,
      "difficulty": "EASY",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

#### إنشاء مهمة جديدة (Admin)
```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <ADMIN_TOKEN>

{
  "name": "Join VIP Channel",
  "description": "Subscribe to VIP channel for exclusive content",
  "category": "CHANNEL_SUBSCRIPTION",
  "reward": 10000,
  "channelUsername": "your_channel",
  "minLevel": "PROFESSIONAL"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Join VIP Channel",
    "reward": 10000,
    "createdAt": "2025-11-04T10:00:00Z"
  }
}
```

### Rewards API

#### إكمال مهمة
```http
POST /api/rewards/complete-task
Content-Type: application/json

{
  "userId": "uuid",
  "taskId": "uuid",
  "rewardAmount": 5000
}

Response 200:
{
  "success": true,
  "data": {
    "rewardAmount": 5000,
    "newBalance": 20000,
    "bonusApplied": false
  }
}
```

### Referrals API

#### الحصول على إحالات المستخدم
```http
GET /api/referrals?userId=uuid&level=1

Response 200:
{
  "success": true,
  "data": {
    "level1": [
      {
        "referredId": "uuid",
        "username": "friend1",
        "joinedAt": "2025-11-01T10:00:00Z",
        "earnings": 1500
      }
    ],
    "level2": [],
    "level3": [],
    "totalEarnings": 15000
  }
}
```

### Withdrawals API

#### طلب سحب
```http
POST /api/withdrawals
Content-Type: application/json

{
  "userId": "uuid",
  "amount": 5000000,
  "walletAddress": "TXxxx...xxx",
  "network": "TRC20"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 5000000,
    "usdtAmount": 5.0,
    "status": "PENDING",
    "requestedAt": "2025-11-04T10:00:00Z"
  }
}
```

#### الحصول على سجل السحوبات
```http
GET /api/withdrawals?userId=uuid

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 5000000,
      "usdtAmount": 5.0,
      "status": "COMPLETED",
      "txHash": "0x...",
      "requestedAt": "2025-11-01T10:00:00Z",
      "completedAt": "2025-11-02T08:30:00Z"
    }
  ]
}
```

---

## تدفقات البوت

### 1. تدفق التسجيل (Onboarding)

```
User sends /start [ref_code]
        │
        ├─> Check if user exists
        │   ├─ Yes: Welcome back + Show menu
        │   └─ No: Create new user
        │          │
        │          ├─> Extract referral code
        │          ├─> Create user record
        │          ├─> Process referral rewards (3 levels)
        │          ├─> Send welcome message
        │          └─> Show verification task
        │
        └─> Create/Update session in Redis
```

### 2. تدفق إكمال المهام

```
User clicks "Tasks"
        │
        ├─> Show task categories
        │
User selects category
        │
        ├─> Fetch tasks in category
        ├─> Check completed tasks
        └─> Show task list
                │
User selects task
        │
        ├─> Show task details
        ├─> Show action button (Join/Watch/etc.)
        │
User clicks "I Completed"
        │
        ├─> Verify completion
        │   ├─ Channel/Group: Check membership via API
        │   ├─ Video: Time-based verification
        │   └─ Other: Mark for admin review
        │
        ├─> Award coins
        ├─> Update user balance
        ├─> Create task completion record
        ├─> Update statistics
        └─> Send success message
```

### 3. تدفق الإحالات

```
User shares referral link
        │
New user clicks link
        │
        ├─> Extract referral code from /start
        │
New user registers
        │
        ├─> Level 1 Processing:
        │   ├─ Award 5,000 coins to referrer
        │   ├─ Award 2,000 coins to new user
        │   ├─ Create referral record
        │   └─ Send notification to referrer
        │
        ├─> Level 2 Processing:
        │   ├─ Find referrer's referrer
        │   ├─ Award 500 coins
        │   └─ Update referral tree
        │
        └─> Level 3 Processing:
            ├─ Find level 2's referrer
            ├─ Award 250 coins
            └─ Update referral tree
```

### 4. تدفق السحب

```
User clicks "Withdraw"
        │
        ├─> Check balance >= 5,000,000 coins
        │   ├─ No: Show error + suggestions
        │   └─ Yes: Continue
        │
        ├─> Show withdrawal info
        │
User clicks "Request Withdrawal"
        │
        ├─> Request wallet address
        │
User sends wallet address
        │
        ├─> Validate address format
        ├─> Calculate USDT amount
        ├─> Create withdrawal request
        ├─> Lock user balance
        ├─> Send confirmation
        │
Admin reviews request
        │
        ├─> Approve:
        │   ├─ Process payment
        │   ├─ Update status to COMPLETED
        │   ├─ Add transaction hash
        │   └─ Notify user
        │
        └─> Reject:
            ├─ Update status to REJECTED
            ├─ Unlock user balance
            └─ Notify user with reason
```

---

## قاعدة البيانات

### مخطط قاعدة البيانات (ERD)

```
┌────────────────┐
│     Users      │
├────────────────┤
│ id (PK)        │◄─┐
│ telegramId     │  │
│ username       │  │
│ balance        │  │
│ level          │  │
│ referralCode   │  │
│ referredById   ├──┘ (self-referential)
│ tasksCompleted │
│ referralCount  │
│ createdAt      │
└────────────────┘
       │ 1
       │
       │ N
┌────────────────┐
│TaskCompletions │
├────────────────┤
│ id (PK)        │
│ userId (FK)    │
│ taskId (FK)    │
│ rewardAmount   │
│ completedAt    │
│ verified       │
└────────────────┘
       │ N
       │
       │ 1
┌────────────────┐
│     Tasks      │
├────────────────┤
│ id (PK)        │
│ name           │
│ category       │
│ reward         │
│ isActive       │
│ expiresAt      │
└────────────────┘

┌────────────────┐
│   Referrals    │
├────────────────┤
│ id (PK)        │
│ referrerId (FK)│──► Users.id
│ referredId (FK)│──► Users.id
│ level          │
│ commission     │
│ createdAt      │
└────────────────┘

┌────────────────┐
│ ReferralTree   │
├────────────────┤
│ id (PK)        │
│ userId (FK)    │──► Users.id
│ level1Count    │
│ level2Count    │
│ level3Count    │
│ level1Earnings │
│ level2Earnings │
│ level3Earnings │
└────────────────┘

┌────────────────┐
│  Withdrawals   │
├────────────────┤
│ id (PK)        │
│ userId (FK)    │──► Users.id
│ amount         │
│ usdtAmount     │
│ walletAddress  │
│ status         │
│ txHash         │
│ requestedAt    │
│ completedAt    │
└────────────────┘
```

### Indexes للأداء

```sql
-- Users
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_status ON users(status);

-- Tasks
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_is_active ON tasks(is_active);
CREATE INDEX idx_tasks_expires_at ON tasks(expires_at);

-- TaskCompletions
CREATE INDEX idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_task_completions_verified ON task_completions(verified);

-- Referrals
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_referrals_level ON referrals(level);

-- Withdrawals
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_requested_at ON withdrawals(requested_at);
```

---

## الأمان

### 1. مصادقة المستخدمين

**Telegram Web App Verification:**
```typescript
// lib/auth.ts
function verifyTelegramWebAppData(initData: string): boolean {
  // Verify data hash using bot token
  const dataCheckString = createDataCheckString(initData);
  const secretKey = createHmac('sha256', 'WebAppData')
    .update(TELEGRAM_BOT_TOKEN)
    .digest();
  const hash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return hash === receivedHash;
}
```

**JWT Tokens:**
- توليد JWT بعد التحقق من Telegram
- انتهاء صلاحية: 7 أيام
- تخزين في httpOnly cookies
- تجديد تلقائي

### 2. حماية من الاحتيال

**كشف الحسابات المتعددة:**
```typescript
// Detection based on:
- Device fingerprinting
- IP address tracking
- Behavioral analysis
- Pattern recognition
```

**Rate Limiting:**
```typescript
// Per user:
- 30 requests per minute
- 1000 requests per hour
- Cooldown periods for sensitive operations
```

**Task Verification:**
```typescript
// Multi-layer verification:
- Telegram API checks (for channels/groups)
- Time-based delays
- Screenshot verification (optional)
- Admin review for suspicious activities
```

### 3. أمان البيانات

**Encryption:**
- Wallet addresses encrypted at rest
- Sensitive data hashed
- SSL/TLS for all communications

**SQL Injection Prevention:**
- Parameterized queries via Prisma ORM
- Input validation and sanitization
- Type-safe operations

**XSS Protection:**
- Content Security Policy headers
- Input sanitization
- Output encoding

### 4. أمان السحوبات

```typescript
// Withdrawal security measures:
- Multi-step verification
- Balance locking during processing
- Transaction logging
- Admin approval required
- Fraud detection algorithms
- Maximum withdrawal limits
- Cooldown periods
```

---

## النشر

### النشر باستخدام Docker Compose

```bash
# 1. Clone repository
git clone https://github.com/your-repo/telegram-rewards-bot.git
cd telegram-rewards-bot

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Build and start
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Run migrations
docker-compose exec web pnpm prisma:migrate

# 6. Create admin user
docker-compose exec web node scripts/create-admin.js
```

### النشر على Railway

```bash
# 1. Install Railway CLI
npm install -g railway

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Add Redis
railway add redis

# 6. Set environment variables
railway variables set TELEGRAM_BOT_TOKEN=your_token
railway variables set JWT_SECRET=your_secret

# 7. Deploy
railway up
```

### النشر على Vercel (Web) + VPS (Bot)

**Vercel (Web App):**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables in Vercel dashboard
```

**VPS (Bot):**
```bash
# 1. SSH to VPS
ssh user@your-vps-ip

# 2. Clone repository
git clone https://github.com/your-repo/telegram-rewards-bot.git
cd telegram-rewards-bot

# 3. Install dependencies
pnpm install

# 4. Build bot
pnpm build:bot

# 5. Setup PM2
pm2 start dist/bot/index.js --name telegram-bot

# 6. Save PM2 config
pm2 save
pm2 startup
```

### النشر على Heroku

```bash
# 1. Create Heroku app
heroku create your-app-name

# 2. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 3. Add Redis
heroku addons:create heroku-redis:hobby-dev

# 4. Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set JWT_SECRET=your_secret

# 5. Deploy
git push heroku main

# 6. Run migrations
heroku run pnpm prisma:migrate
```

---

## الاختبارات

### Unit Tests

```typescript
// Example: Testing referral rewards calculation
describe('Referral Rewards', () => {
  it('should calculate level 1 rewards correctly', () => {
    const reward = calculateLevel1Reward(1000);
    expect(reward).toBe(1100); // 1000 + 10%
  });

  it('should create referral tree correctly', async () => {
    const tree = await createReferralTree(userId);
    expect(tree.level1Count).toBe(0);
    expect(tree.level2Count).toBe(0);
    expect(tree.level3Count).toBe(0);
  });
});
```

### Integration Tests

```typescript
// Example: Testing task completion flow
describe('Task Completion Flow', () => {
  it('should complete task and award coins', async () => {
    const user = await createTestUser();
    const task = await createTestTask();
    
    const result = await completeTask(user.id, task.id);
    
    expect(result.success).toBe(true);
    expect(result.rewardAmount).toBe(task.reward);
    
    const updatedUser = await getUser(user.id);
    expect(updatedUser.balance).toBe(user.balance + task.reward);
  });
});
```

### E2E Tests

```typescript
// Example: Testing bot conversation flow
describe('Bot E2E Tests', () => {
  it('should register new user and show menu', async () => {
    const bot = createTestBot();
    
    // Simulate /start command
    const response = await bot.sendCommand('/start ref_abc123');
    
    expect(response.text).toContain('Welcome');
    expect(response.keyboard).toHaveLength(5);
  });
});
```

### تشغيل الاختبارات

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Run specific test file
pnpm test bot/handlers/start.test.ts
```

---

## الصيانة

### النسخ الاحتياطي

**Database Backup:**
```bash
# Manual backup
pg_dump -U rewards_user telegram_rewards_bot > backup_$(date +%Y%m%d).sql

# Automated daily backups
0 2 * * * pg_dump -U rewards_user telegram_rewards_bot > /backups/backup_$(date +\%Y\%m\%d).sql
```

**Redis Backup:**
```bash
# Redis automatically creates dump.rdb
# Copy to backup location
cp /var/lib/redis/dump.rdb /backups/redis_$(date +%Y%m%d).rdb
```

### المراقبة

**Health Checks:**
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    bot: await checkBot(),
  };
  
  const healthy = Object.values(checks).every(c => c === true);
  
  return Response.json({
    healthy,
    checks,
    timestamp: new Date().toISOString(),
  });
}
```

**Logging:**
```typescript
// Structured logging with Pino
logger.info({ userId, taskId }, 'Task completed');
logger.error({ error, userId }, 'Task completion failed');
```

**Metrics:**
- Active users (daily/weekly/monthly)
- Tasks completed
- Coins distributed
- Withdrawals processed
- Error rates
- Response times

### تحديث النظام

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
pnpm install

# 3. Run migrations
pnpm prisma:migrate

# 4. Build
pnpm build

# 5. Restart services
pm2 restart all

# Or with Docker
docker-compose up -d --build
```

---

## الأسئلة الشائعة

### للمطورين

**Q: كيف أضيف نوع مهمة جديد؟**
```typescript
// 1. Add to Prisma schema
enum TaskCategory {
  // ... existing categories
  NEW_CATEGORY
}

// 2. Add handler in bot/handlers/tasks.ts
// 3. Add verification logic
// 4. Run migration
pnpm prisma:migrate
```

**Q: كيف أغير معدل التحويل للعملات؟**
```env
# Update in .env
COIN_TO_USDT_RATE=1000000  # 1 USDT = 1,000,000 coins
```

**Q: كيف أضيف لغة جديدة؟**
```typescript
// 1. Add translation files in bot/locales/
// 2. Update language detection in middleware
// 3. Add language option in settings
```

### للمستخدمين

**Q: كم أحتاج للسحب؟**

A: الحد الأدنى 5,000,000 عملة (5 USDT).

**Q: متى تتم معالجة السحب؟**

A: خلال 24-48 ساعة من تقديم الطلب.

**Q: كيف يعمل نظام الإحالات؟**

A: لديك 3 مستويات:
- المستوى 1: 1,000 عملة + 10% عمولة
- المستوى 2: 500 عملة + 5% عمولة
- المستوى 3: 250 عملة + 2% عمولة

**Q: هل يمكنني لعب الألعاب عدة مرات؟**

A: نعم، لكن هناك حد للمحاولات اليومية:
- اضرب الهدف: 3 محاولات
- عجلة الحظ: محاولة واحدة
- تحدي الأسئلة: محاولتان

---

## الدعم والتواصل

### للمساعدة التقنية

- 📧 Email: dev@rewards-bot.com
- 💬 Telegram: @support_bot
- 📚 Documentation: https://docs.rewards-bot.com
- 🐛 Issues: https://github.com/your-repo/issues

### للمساهمة

```bash
# 1. Fork repository
# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Commit changes
git commit -m "Add amazing feature"

# 4. Push to branch
git push origin feature/amazing-feature

# 5. Open Pull Request
```

### الترخيص

MIT License - راجع ملف LICENSE للتفاصيل.

---

## خارطة الطريق

### النسخة 1.0 (الحالية)
- ✅ نظام المهام الأساسي
- ✅ الإحالات متعددة المستويات
- ✅ السحوبات عبر USDT
- ✅ الألعاب المصغرة
- ✅ نظام البطاقات الأساسي
- ✅ لوحة التحكم الإدارية

### النسخة 2.0 (قريباً)
- 🔄 Marketplace متقدم للبطاقات
- 🔄 بطولات أسبوعية
- 🔄 نظام Achievement/Badges
- 🔄 تحليلات متقدمة
- 🔄 تكامل مع منصات خارجية
- 🔄 تطبيق موبايل (React Native)

### النسخة 3.0 (مستقبلية)
- 📅 توصيات مهام ذكية (AI)
- 📅 NFT integration
- 📅 DeFi features
- 📅 Multi-language full support
- 📅 Advanced fraud detection
- 📅 Automated market maker

---

**تم بناء هذا النظام بـ ❤️ بواسطة فريق التطوير**

آخر تحديث: 2025-11-04
