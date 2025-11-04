# 🚀 Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### 1. Environment Setup

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Redis connection tested
- [ ] Telegram bot token valid
- [ ] JWT secret is strong and unique
- [ ] API secrets are secure

### 2. Database

- [ ] Database schema up to date
- [ ] Migrations run successfully
- [ ] Indexes created for performance
- [ ] Backup system configured
- [ ] Connection pooling configured

### 3. Security

- [ ] All secrets are environment variables
- [ ] HTTPS/SSL enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] 2FA enabled for admins

### 4. Code Quality

- [ ] All tests passing
- [ ] No console.log in production code
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] TypeScript errors resolved
- [ ] Linter checks passed

### 5. Performance

- [ ] Database queries optimized
- [ ] Redis caching implemented
- [ ] Static assets optimized
- [ ] Images compressed
- [ ] Lazy loading configured
- [ ] CDN configured (if applicable)

## Deployment Steps

### Option 1: Docker Compose

```bash
# 1. Pull latest code
git pull origin main

# 2. Build images
docker-compose build

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Verify health
curl http://localhost:3000/api/health
```

### Option 2: Manual Deployment

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
pnpm prisma:generate

# 4. Run migrations
pnpm prisma:migrate

# 5. Build
pnpm build

# 6. Start services with PM2
pm2 start ecosystem.config.js

# 7. Save PM2 config
pm2 save

# 8. Setup PM2 startup
pm2 startup
```

## Post-Deployment

### 1. Verification

- [ ] Web app accessible
- [ ] Bot responding to /start
- [ ] Database queries working
- [ ] Redis caching working
- [ ] Task completion working
- [ ] Referral system working
- [ ] Withdrawal flow working

### 2. Testing

- [ ] Create test user
- [ ] Complete test task
- [ ] Test referral link
- [ ] Play test game
- [ ] View stats
- [ ] Test admin dashboard
- [ ] Test withdrawal (small amount)

### 3. Monitoring

- [ ] Health endpoint responding
- [ ] Logs being written
- [ ] Error tracking configured
- [ ] Metrics being collected
- [ ] Alerts configured
- [ ] Uptime monitoring active

### 4. Documentation

- [ ] Update CHANGELOG.md
- [ ] Document any config changes
- [ ] Update API documentation
- [ ] Notify team of deployment
- [ ] Update user guide (if needed)

## Rollback Plan

If something goes wrong:

```bash
# Docker Compose
docker-compose down
git checkout <previous-commit>
docker-compose up -d

# PM2
pm2 stop all
git checkout <previous-commit>
pnpm install
pnpm build
pm2 restart all
```

## Emergency Contacts

- Technical Lead: [contact]
- DevOps: [contact]
- Database Admin: [contact]
- On-call: [contact]

## Production URLs

- Web App: https://rewards-bot.com
- Admin: https://rewards-bot.com/admin
- API: https://rewards-bot.com/api
- Status: https://status.rewards-bot.com
- Docs: https://docs.rewards-bot.com

## Notes

Add any deployment-specific notes here:

```
Date: 2025-11-04
Version: 1.0.0
Deployed by: [name]
Notes: Initial production deployment
```

---

**Remember:** Always test in staging before production!
