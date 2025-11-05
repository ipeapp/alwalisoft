# 🚨 تحديث مطلوب على Vercel Environment Variables

## ⚠️ مهم جداً!

البوت الآن يعمل محلياً، لكن **يجب تحديث** الـ Environment Variables على Vercel!

---

## 📝 ما يجب فعله:

### 1. اذهب إلى Vercel Dashboard:

```
https://vercel.com/[your-username]/alwalisoft/settings/environment-variables
```

### 2. أضف Variable جديد:

```
Name:  NEXT_PUBLIC_APP_URL
Value: https://alwalisoft.vercel.app
```

**ملاحظة:** استخدم URL تطبيقك الفعلي على Vercel!

---

## 🔧 الخطوات بالتفصيل:

### Step 1: افتح Vercel Project Settings

1. اذهب إلى: https://vercel.com
2. اختر project: `alwalisoft`
3. اضغط على **Settings**
4. اختر **Environment Variables**

### Step 2: أضف المتغير الجديد

```
┌─────────────────────────────────────────────────┐
│ Environment Variable                            │
├─────────────────────────────────────────────────┤
│ Name:  NEXT_PUBLIC_APP_URL                      │
│ Value: https://alwalisoft.vercel.app            │
│                                                 │
│ Environment:                                    │
│ ☑ Production                                    │
│ ☑ Preview                                       │
│ ☑ Development                                   │
│                                                 │
│ [Save]                                          │
└─────────────────────────────────────────────────┘
```

### Step 3: Redeploy التطبيق

بعد إضافة المتغير، يجب إعادة deploy:

```bash
# في Terminal أو Vercel Dashboard:
# اضغط على "Redeploy" للـ latest deployment
```

أو:

```bash
# من Git:
git commit --allow-empty -m "trigger: Redeploy after env var update"
git push origin main
```

---

## ✅ التحقق من التحديث:

### بعد Redeploy:

1. اذهب إلى Vercel Deployment
2. افتح **Build Logs**
3. تحقق من:
   ```
   Environment variables:
   NEXT_PUBLIC_APP_URL=https://alwalisoft.vercel.app ✅
   ```

---

## 🧪 اختبار البوت:

### بعد تحديث Vercel:

1. افتح Telegram
2. ابحث عن: `@makeittooeasy_bot`
3. اضغط `/start`
4. يجب أن يعمل زر "🚀 فتح التطبيق"

---

## 📊 Environment Variables المطلوبة على Vercel:

```bash
# ضروري للبوت:
NEXT_PUBLIC_APP_URL=https://alwalisoft.vercel.app
NEXT_PUBLIC_BOT_USERNAME=makeittooeasy_bot

# Database (Vercel Postgres أو Supabase):
DATABASE_URL=postgresql://...

# Bot Token (للـ webhook إذا لزم):
TELEGRAM_BOT_TOKEN=8497278773:AAHSyGW3pcCGi3axsSXlaYRydLOqpUIcPoI

# JWT & Security:
JWT_SECRET=your-secret-key
API_SECRET=your-api-secret
```

---

## ⚠️ ملاحظات مهمة:

### 1. **HTTPS فقط:**
Telegram Web Apps تطلب HTTPS فقط! ❌ `http://`

### 2. **استخدم Production URL:**
```bash
✅ https://alwalisoft.vercel.app
✅ https://your-custom-domain.com
❌ http://localhost:3000
❌ http://your-app.com
```

### 3. **.env محلي فقط:**
الملف `.env` في المشروع **لا يُرفع** على Git (في `.gitignore`).  
يجب إضافة Variables يدوياً على Vercel!

---

## 🚀 بعد التحديث:

```
╔════════════════════════════════════════╗
║  ✅ البوت سيعمل على Production!       ║
╚════════════════════════════════════════╝

Local:      ✅ Working
Vercel:     ⏳ بعد تحديث ENV vars
Bot:        ✅ @makeittooeasy_bot
Mini App:   ✅ https://alwalisoft.vercel.app/mini-app
```

---

## 📞 الخطوة التالية:

1. **أضف `NEXT_PUBLIC_APP_URL` على Vercel**
2. **Redeploy التطبيق**
3. **اختبر البوت على Telegram**
4. **يجب أن يعمل بشكل مثالي!** 🎉

---

**⏰ الوقت المتوقع:** 2-3 دقائق  
**الصعوبة:** سهل جداً ✅
