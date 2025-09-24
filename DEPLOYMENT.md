# 🚀 دليل النشر - ZEREX CARBON

## ⚡ النشر السريع (One-Click Deploy)

### 1. انقر على زر "Deploy to Vercel" في README
### 2. أضف GitHub Secrets المطلوبة
### 3. ادفع الكود إلى `main` branch
### 4. تم! 🎉

---

## 🔧 إعداد GitHub Secrets

### الخطوة 1: اذهب إلى GitHub Repository Settings
```
Settings → Secrets and variables → Actions
```

### الخطوة 2: أضف الأسرار التالية

| Secret Name | الوصف | كيفية الحصول عليه | مثال |
|-------------|--------|-------------------|------|
| `DATABASE_URL` | رابط قاعدة البيانات PostgreSQL | إنشاء قاعدة بيانات في Supabase أو Neon | `postgres://user:pass@host:5432/db` |
| `REDIS_URL` | رابط Redis للـ caching | إنشاء Redis في Upstash | `redis://:password@host:6379` |
| `JWT_SECRET` | مفتاح تشفير JWT | `openssl rand -hex 32` | `a1b2c3d4e5f6...` |
| `STRIPE_SECRET_KEY` | مفتاح Stripe للدفع | من Stripe Dashboard | `sk_live_...` |
| `NEXTAUTH_SECRET` | مفتاح NextAuth | نفس JWT_SECRET أو مفتاح منفصل | `x1y2z3a4b5c6...` |
| `NEXTAUTH_URL` | رابط التطبيق | سيتم تعيينه تلقائياً بواسطة Vercel | `https://your-app.vercel.app` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App ID | إنشاء OAuth App في GitHub | `Iv1.1234567890abcdef` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | من نفس OAuth App | `1234567890abcdef...` |
| `VERCEL_TOKEN` | Vercel API Token | من Vercel Dashboard → Settings → Tokens | `vercel_1234567890...` |
| `VERCEL_ORG_ID` | Vercel Organization ID | من Vercel Dashboard | `team_1234567890` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | سيتم إنشاؤه تلقائياً | `prj_1234567890` |

---

## 🗄️ إعداد قاعدة البيانات

### خيار 1: Supabase (مُوصى به)
1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ رابط الاتصال من Settings → Database
4. أضف الرابط كـ `DATABASE_URL` في GitHub Secrets

### خيار 2: Neon
1. اذهب إلى [Neon](https://neon.tech)
2. أنشئ قاعدة بيانات جديدة
3. انسخ رابط الاتصال
4. أضف الرابط كـ `DATABASE_URL` في GitHub Secrets

### خيار 3: Railway
1. اذهب إلى [Railway](https://railway.app)
2. أنشئ PostgreSQL service
3. انسخ رابط الاتصال
4. أضف الرابط كـ `DATABASE_URL` في GitHub Secrets

---

## 🔴 إعداد Redis

### خيار 1: Upstash (مُوصى به)
1. اذهب إلى [Upstash](https://upstash.com)
2. أنشئ Redis database
3. انسخ رابط الاتصال
4. أضف الرابط كـ `REDIS_URL` في GitHub Secrets

### خيار 2: Railway
1. اذهب إلى [Railway](https://railway.app)
2. أنشئ Redis service
3. انسخ رابط الاتصال
4. أضف الرابط كـ `REDIS_URL` في GitHub Secrets

---

## 💳 إعداد Stripe

1. اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com)
2. أنشئ حساب أو سجل دخول
3. اذهب إلى Developers → API Keys
4. انسخ Secret Key
5. أضف المفتاح كـ `STRIPE_SECRET_KEY` في GitHub Secrets

---

## 🔐 إعداد GitHub OAuth

1. اذهب إلى GitHub → Settings → Developer settings
2. انقر على "New OAuth App"
3. املأ البيانات:
   - **Application name**: ZEREX CARBON
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
4. انسخ Client ID و Client Secret
5. أضفهما في GitHub Secrets

---

## 🚀 النشر

### النشر التلقائي
1. ادفع الكود إلى `main` branch
2. GitHub Actions ستعمل تلقائياً
3. Vercel سينشر التطبيق
4. ستتلقى رابط التطبيق في PR comments

### النشر اليدوي
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

---

## 📱 تشغيل التطبيق المحمول

### متطلبات Flutter
```bash
# تثبيت Flutter
# اتبع التعليمات من https://flutter.dev/docs/get-started/install

# التحقق من التثبيت
flutter doctor
```

### تشغيل التطبيق
```bash
cd apps/mobile

# تثبيت التبعيات
flutter pub get

# تشغيل على Android
flutter run

# تشغيل على iOS
flutter run -d ios
```

### بناء التطبيق
```bash
# بناء APK
flutter build apk --release

# بناء iOS
flutter build ios --release

# بناء Web
flutter build web
```

---

## 🐳 تشغيل محلي مع Docker

### المتطلبات
- Docker
- Docker Compose

### التشغيل
```bash
# تشغيل جميع الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف الخدمات
docker-compose down
```

### الخدمات المتاحة
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## 🔍 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في قاعدة البيانات
```
Error: connect ECONNREFUSED
```
**الحل**: تأكد من صحة `DATABASE_URL` في GitHub Secrets

#### 2. خطأ في Redis
```
Error: Redis connection failed
```
**الحل**: تأكد من صحة `REDIS_URL` في GitHub Secrets

#### 3. خطأ في JWT
```
Error: jwt malformed
```
**الحل**: تأكد من صحة `JWT_SECRET` في GitHub Secrets

#### 4. خطأ في Vercel
```
Error: Vercel deployment failed
```
**الحل**: تأكد من صحة `VERCEL_TOKEN` في GitHub Secrets

### فحص الحالة
```bash
# فحص API
curl https://your-app.vercel.app/api/health

# فحص Web
curl https://your-app.vercel.app
```

---

## 📊 مراقبة الأداء

### Vercel Analytics
- اذهب إلى Vercel Dashboard
- اختر مشروعك
- انقر على "Analytics"

### GitHub Actions
- اذهب إلى Actions tab في GitHub
- راقب حالة الـ workflows

### Health Checks
- **API**: `https://your-app.vercel.app/api/health`
- **Web**: `https://your-app.vercel.app/health`

---

## 🆘 الدعم

### في حالة وجود مشاكل
1. تحقق من GitHub Issues
2. اقرأ logs في GitHub Actions
3. تحقق من Vercel Function Logs
4. تواصل معنا عبر:
   - **البريد الإلكتروني**: support@zerex-carbon.com
   - **GitHub Issues**: [إنشاء issue جديد](https://github.com/your-username/zerex-carbon/issues)

---

## ✅ قائمة التحقق

- [ ] إضافة جميع GitHub Secrets المطلوبة
- [ ] إعداد قاعدة البيانات PostgreSQL
- [ ] إعداد Redis
- [ ] إعداد Stripe
- [ ] إعداد GitHub OAuth
- [ ] دفع الكود إلى `main` branch
- [ ] التحقق من نجاح النشر
- [ ] اختبار التطبيق
- [ ] إعداد التطبيق المحمول (اختياري)
- [ ] إعداد Docker (اختياري)

---

## 🎉 تهانينا!

لقد نجحت في نشر ZEREX CARBON! 🚀

**رابط التطبيق**: `https://your-app.vercel.app`

**الخطوات التالية**:
1. اختبر جميع المميزات
2. أضف بيانات تجريبية
3. دع المستخدمين يختبرون التطبيق
4. راقب الأداء والاستخدام

---

<div align="center">
  <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
  <p>© 2024 ZEREX CARBON. جميع الحقوق محفوظة.</p>
</div>
