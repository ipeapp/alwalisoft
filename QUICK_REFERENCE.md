# ⚡ مرجع سريع - Telegram Rewards Bot

## 🎯 ما هو هذا المشروع؟

نظام **كامل ومتكامل** لبوت تيليجرام يتيح للمستخدمين:
- ✅ إكمال مهام وكسب عملات
- ✅ دعوة أصدقاء والحصول على عمولات (3 مستويات)
- ✅ لعب ألعاب مصغرة
- ✅ جمع بطاقات نادرة
- ✅ سحب الأرباح كـ USDT

---

## 🚀 التشغيل السريع (60 ثانية)

### إذا كان لديك Docker:

```bash
# 1. Clone
git clone <repo>
cd telegram-rewards-bot

# 2. إعداد .env
cp .env.example .env
# عدل TELEGRAM_BOT_TOKEN في .env

# 3. تشغيل
docker-compose up -d

# ✅ جاهز! افتح http://localhost:3000
```

### بدون Docker:

```bash
# 1. تثبيت
pnpm install

# 2. إعداد
cp .env.example .env
# عدل .env

# 3. قاعدة البيانات
pnpm prisma:push

# 4. تشغيل
pnpm dev:all

# ✅ جاهز!
```

---

## 📁 أهم الملفات

| الملف | الوصف |
|------|-------|
| `bot/` | كود Telegram Bot الكامل |
| `app/` | Next.js Web Dashboard |
| `prisma/schema.prisma` | قاعدة البيانات (26 جدول) |
| `docker-compose.yml` | تشغيل كل الخدمات |
| `.env.example` | المتغيرات المطلوبة |

---

## 🎨 المميزات الجاهزة

### ✅ Telegram Bot
- 10 handlers كاملة
- دعم العربية والإنجليزية
- نظام session عبر Redis
- Rate limiting
- Error handling

### ✅ قاعدة البيانات
- 26 جدول شامل
- Prisma ORM
- Indexes للأداء
- علاقات كاملة

### ✅ الوظائف
- مهام (6 أنواع)
- إحالات (3 مستويات)
- ألعاب (Target Hit, Lucky Wheel)
- بطاقات (5 مستويات ندرة)
- سحوبات USDT
- إحصائيات شاملة

### ✅ الأمان
- JWT Authentication
- Rate Limiting
- Fraud Detection
- Audit Logs
- Input Validation

### ✅ Infrastructure
- Docker Compose
- PM2 Config
- Redis
- BullMQ
- Logging (Pino)

---

## 📚 الوثائق

| الملف | المحتوى |
|------|---------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | دليل البدء الشامل |
| [COMPLETE_DOCUMENTATION.md](./COMPLETE_DOCUMENTATION.md) | وثائق تقنية كاملة |
| [USER_GUIDE_AR.md](./USER_GUIDE_AR.md) | دليل المستخدم |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | دليل الإدارة |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | ملخص المشروع |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | قائمة تحقق النشر |

---

## 🔧 أوامر أساسية

```bash
# تطوير
pnpm dev:all          # تشغيل كل شيء
pnpm dev              # Web فقط
pnpm dev:bot          # Bot فقط

# قاعدة البيانات
pnpm prisma:push      # تطبيق schema
pnpm prisma:studio    # فتح UI
pnpm prisma:generate  # توليد client

# إنتاج
pnpm build           # بناء كل شيء
pnpm start:all       # تشغيل production

# Docker
docker-compose up -d              # تشغيل
docker-compose logs -f            # عرض logs
docker-compose down               # إيقاف
```

---

## 🎯 كيف تبدأ؟

### 1. للمطورين الجدد:

```
📖 اقرأ: GETTING_STARTED.md
🚀 شغل: docker-compose up -d
🎮 جرب: افتح البوت في تيليجرام
```

### 2. للمطورين المتقدمين:

```
📖 اقرأ: COMPLETE_DOCUMENTATION.md
🔧 طور: راجع bot/ و app/
🧪 اختبر: pnpm test
```

### 3. للإداريين:

```
📖 اقرأ: ADMIN_GUIDE.md
🛡️ راقب: افتح http://localhost:3000/admin
📊 تحليل: راجع Analytics dashboard
```

---

## 💡 نصائح سريعة

### حل المشاكل الشائعة:

**البوت لا يستجيب؟**
```bash
# تحقق من logs
docker-compose logs bot
# أو
pnpm dev:bot
```

**Database error؟**
```bash
# أعد تطبيق schema
pnpm prisma:push
```

**Port مشغول؟**
```bash
# استخدم port مختلف
PORT=3001 pnpm dev
```

---

## 📊 إحصائيات المشروع

```
📁 Files: 100+
📄 Code Lines: 4,200+
🗄️ DB Tables: 26
🔧 API Endpoints: 20+
🤖 Bot Handlers: 10
📚 Docs: 7 comprehensive guides
⏱️ Setup Time: < 10 minutes
✅ Production Ready: Yes
```

---

## 🎓 التعلم والتطوير

### مسار التعلم الموصى به:

```
1️⃣ فهم البنية (ARCHITECTURE.md)
    ↓
2️⃣ تشغيل المشروع (GETTING_STARTED.md)
    ↓
3️⃣ فهم Bot Handlers (bot/handlers/)
    ↓
4️⃣ فهم قاعدة البيانات (prisma/schema.prisma)
    ↓
5️⃣ التخصيص والتطوير
```

### مصادر إضافية:

- 📚 [Prisma Docs](https://www.prisma.io/docs)
- 🤖 [Telegraf Guide](https://telegraf.js.org/)
- ⚛️ [Next.js Docs](https://nextjs.org/docs)
- 🐳 [Docker Docs](https://docs.docker.com/)

---

## 🤝 المساهمة

```bash
# 1. Fork المشروع
# 2. أنشئ branch جديد
git checkout -b feature/my-feature

# 3. اعمل تغييراتك
# 4. Commit
git commit -m "Add my feature"

# 5. Push
git push origin feature/my-feature

# 6. افتح Pull Request
```

---

## 📞 الدعم

### الحصول على مساعدة:

- 📧 **Email**: support@rewards-bot.com
- 💬 **Telegram**: @support_username
- 🐛 **Issues**: GitHub Issues
- 📚 **Docs**: جميع الملفات في المشروع

### الانضمام للمجتمع:

- 📢 **Updates**: @updates_channel
- 👥 **Community**: @community_group

---

## ✨ ما يميز هذا المشروع؟

✅ **شامل ومتكامل** - كل شيء موجود  
✅ **موثق بالكامل** - 7 أدلة شاملة  
✅ **جاهز للإنتاج** - Docker + PM2  
✅ **آمن** - أمان متعدد الطبقات  
✅ **قابل للتوسع** - معمارية نظيفة  
✅ **متعدد اللغات** - عربي + إنجليزي  

---

## 🎉 ابدأ الآن!

```bash
# نسخة واحدة تشغل كل شيء:
git clone <repo> && cd telegram-rewards-bot && \
cp .env.example .env && \
docker-compose up -d

# ✅ جاهز في دقيقة واحدة!
```

---

**🚀 حظاً موفقاً في مشروعك!**

**آخر تحديث:** 2025-11-04  
**الإصدار:** 1.0.0  
**الحالة:** ✅ جاهز للإنتاج
