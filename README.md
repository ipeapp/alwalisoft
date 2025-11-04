# 🎁 Telegram Rewards Bot - Complete System

A comprehensive, production-ready platform for managing a Telegram rewards bot with tasks, multi-level referrals, mini-games, cards system, and USDT withdrawals.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)](https://www.prisma.io/)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.16-blue)](https://telegraf.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Features

### 🤖 Telegram Bot
- **Complete Task System**: Daily, weekly, and special tasks
- **3-Level Referral System**: Up to 50% commission across 3 levels
- **Mini Games**: Target Hit, Lucky Wheel, Quiz Challenge
- **Cards & Gems**: Collectible cards with bonus multipliers
- **User Levels**: Beginner → Professional → Expert → VIP
- **USDT Withdrawals**: Minimum 5 USDT via TRC20
- **Multi-language**: English & Arabic support
- **Real-time Stats**: Comprehensive user statistics

### 📊 Admin Dashboard
- **User Management**: View, edit, suspend users
- **Task Management**: Create, edit, schedule tasks
- **Withdrawal Processing**: Review and approve withdrawals
- **Analytics & Reports**: Real-time metrics and insights
- **Fraud Detection**: Automatic suspicious activity detection
- **Audit Logs**: Complete activity tracking
- **System Config**: Customize all settings

### 🔐 Security
- **JWT Authentication**: Secure token-based auth
- **2FA Support**: Two-factor authentication for admins
- **Rate Limiting**: Prevent abuse and spam
- **Fraud Detection**: Multi-layer fraud prevention
- **Encrypted Data**: Sensitive data encryption
- **Audit Trail**: Complete action logging

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js 20+
- **Bot Framework**: Telegraf 4.16
- **ORM**: Prisma 6
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Queue**: BullMQ 5
- **Logging**: Pino + Winston

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Process Manager**: PM2
- **Deployment**: Railway / Vercel / VPS
- **Monitoring**: Built-in health checks

## Project Structure

\`\`\`
.
├── app/
│   ├── page.tsx                 # Admin dashboard
│   ├── user/
│   │   └── page.tsx             # User portal
│   ├── api/
│   │   ├── users/               # User management APIs
│   │   ├── tasks/               # Task management APIs
│   │   ├── rewards/             # Reward tracking APIs
│   │   ├── referrals/           # Referral system APIs
│   │   └── withdrawals/         # Withdrawal processing APIs
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Theme and styles
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   └── security-headers.ts      # Security configurations
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── navigation.tsx           # Navigation configuration
├── database/
│   └── schema.sql               # Database schema
└── middleware.ts                # Request middleware
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+ (or npm/yarn)
- PostgreSQL 16+
- Redis 7+
- Telegram Bot Token

### Installation

#### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/telegram-rewards-bot.git
cd telegram-rewards-bot
\`\`\`

#### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

#### 3. Set Up Environment Variables

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your values:

\`\`\`env
# Get from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=YourBotUsername

# Your PostgreSQL connection
DATABASE_URL=postgresql://user:password@localhost:5432/rewards_bot

# Redis connection
REDIS_URL=redis://localhost:6379

# Generate strong secrets
JWT_SECRET=your_secure_jwt_secret
API_SECRET=your_api_secret
\`\`\`

#### 4. Set Up Database

\`\`\`bash
# Generate Prisma Client
pnpm prisma:generate

# Create database tables
pnpm prisma:push

# Or run migrations
pnpm prisma:migrate
\`\`\`

#### 5. Start Development

\`\`\`bash
# Start both web and bot
pnpm dev:all

# Or start separately
pnpm dev      # Web only
pnpm dev:bot  # Bot only
\`\`\`

### 🐳 Docker Quick Start

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Environment Variables

\`\`\`
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_BOT_USERNAME=your_bot_username
\`\`\`

### Database Setup

1. Create a new PostgreSQL database
2. Run the schema file:

\`\`\`bash
psql -U username -d database_name < database/schema.sql
\`\`\`

3. Or run from SQL editor in Supabase/Neon dashboard

### Development

Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the admin dashboard.
Open [http://localhost:3000/user](http://localhost:3000/user) to view the user portal.

## API Documentation

### Users API

**Create User**
\`\`\`
POST /api/users
Content-Type: application/json

{
  "telegramId": 123456789,
  "username": "john_doe",
  "referralCode": "ref_user123" (optional)
}
\`\`\`

**Get User**
\`\`\`
GET /api/users?id=user_123
GET /api/users?telegramId=123456789
\`\`\`

### Tasks API

**Get Tasks**
\`\`\`
GET /api/tasks
GET /api/tasks?category=channel&active=true
\`\`\`

**Create Task** (Admin only)
\`\`\`
POST /api/tasks
Content-Type: application/json

{
  "name": "Join Channel",
  "description": "Subscribe to main channel",
  "category": "channel",
  "reward": 5000
}
\`\`\`

### Rewards API

**Complete Task**
\`\`\`
POST /api/rewards/complete-task
Content-Type: application/json

{
  "userId": "user_123",
  "taskId": "task_1",
  "rewardAmount": 5000
}
\`\`\`

### Referrals API

**Create Referral**
\`\`\`
POST /api/referrals
Content-Type: application/json

{
  "referrerId": "user_123",
  "referredId": "user_456"
}
\`\`\`

**Get Referrals**
\`\`\`
GET /api/referrals?referrerId=user_123
\`\`\`

### Withdrawals API

**Request Withdrawal**
\`\`\`
POST /api/withdrawals
Content-Type: application/json

{
  "userId": "user_123",
  "amount": 5000000,
  "walletAddress": "Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
\`\`\`

**Get Withdrawal History**
\`\`\`
GET /api/withdrawals?userId=user_123
\`\`\`

## Security Features

- Telegram Web App verification
- JWT token authentication
- Request validation and sanitization
- SQL injection prevention
- CORS protection
- Security headers (X-Frame-Options, X-Content-Type-Options)
- Rate limiting ready (implement with middleware)

## Database Schema

### Users Table
- `id`: UUID primary key
- `telegram_id`: Unique Telegram ID
- `username`: User's Telegram username
- `balance`: Current coin balance
- `level`: User level (Beginner, Professional, Expert, VIP)
- `referral_code`: Unique referral code
- `referred_by`: UUID of referrer
- `tasks_completed`: Number of completed tasks
- `referral_count`: Number of successful referrals

### Tasks Table
- `id`: UUID primary key
- `name`: Task name
- `description`: Task description
- `category`: channel, group, video, share, referral
- `reward`: Coins reward amount
- `is_active`: Active status
- `is_bonus`: Bonus task flag
- `expires_at`: Expiration time for bonus tasks

### Task Completions Table
- `user_id`: Reference to users table
- `task_id`: Reference to tasks table
- `reward_amount`: Amount rewarded
- `bonus_multiplier`: Bonus multiplier applied
- `completed_at`: Completion timestamp
- `verified`: Admin verification status

### Referrals Table
- `referrer_id`: Reference to referrer
- `referred_id`: Reference to referred user
- `level`: Referral level (1-3)
- `commission`: Commission amount

### Withdrawal Requests Table
- `user_id`: Reference to users table
- `amount`: Withdrawal amount in coins
- `wallet_address`: USDT wallet address
- `status`: pending, processing, completed, failed
- `tx_hash`: Blockchain transaction hash

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel settings
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

### Docker

Create a Dockerfile for containerization:

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Telegram Bot Integration

The bot server should call these endpoints:

1. **On user start**: `POST /api/users` to create/register user
2. **On task completion**: `POST /api/rewards/complete-task` to award coins
3. **On referral**: `POST /api/referrals` to track referral
4. **On withdrawal request**: `POST /api/withdrawals` to process request

## 📈 Development Roadmap

### Version 1.0 (Current) ✅
- [x] Complete Prisma database schema (26 tables)
- [x] Telegram bot with full functionality
- [x] Admin dashboard
- [x] User portal  
- [x] 3-level referral system
- [x] Mini games (Target Hit, Lucky Wheel)
- [x] Cards & gems system
- [x] USDT withdrawals
- [x] Multi-language support (AR/EN)
- [x] Docker & infrastructure
- [x] Comprehensive documentation

### Version 2.0 (Coming Soon) 🔄
- [ ] Advanced marketplace for cards
- [ ] Weekly tournaments
- [ ] Achievement/Badges system
- [ ] Advanced analytics
- [ ] External platform integrations
- [ ] Mobile app (React Native)

### Version 3.0 (Future) 📅
- [ ] AI-powered task recommendations
- [ ] NFT integration
- [ ] DeFi features
- [ ] Advanced fraud detection
- [ ] Automated market maker

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## 📖 Documentation

- 📚 [Complete Documentation](./COMPLETE_DOCUMENTATION.md) - Full technical documentation (Arabic)
- 🚀 [Getting Started Guide](./GETTING_STARTED.md) - Quick start guide (Arabic)
- 👤 [User Guide](./USER_GUIDE_AR.md) - User manual (Arabic)
- 🛡️ [Admin Guide](./ADMIN_GUIDE.md) - Admin manual (English)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

### Technical Issues
- 📧 Email: support@rewards-bot.com
- 💬 Telegram: @support_username
- 🐛 GitHub Issues: [Link to issues]

### Community
- 📢 Updates Channel: @updates_channel
- 👥 Community Group: @community_group
- 📚 Documentation: https://docs.rewards-bot.com

## 📊 Project Stats

- **Files**: 100+ TypeScript/React files
- **Lines of Code**: 4,200+
- **Database Tables**: 26 comprehensive tables
- **API Endpoints**: 20+ REST endpoints
- **Bot Handlers**: 10 complete handlers
- **Documentation**: 5 comprehensive guides
- **Languages**: English + Arabic support

## 🙏 Acknowledgments

Built with modern technologies and best practices:
- [Next.js](https://nextjs.org/) - The React Framework
- [Telegraf](https://telegraf.js.org/) - Modern Telegram Bot Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Redis](https://redis.io/) - In-memory data store
- [BullMQ](https://docs.bullmq.io/) - Message queue
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
