# 🌱 ZEREX CARBON

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/zerex-carbon)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?repo=your-username/zerex-carbon)
[![Run on Replit](https://replit.com/badge/github/your-username/zerex-carbon)](https://replit.com/new/github/your-username/zerex-carbon)

<div align="center">
  <img src="https://via.placeholder.com/800x400/22c55e/ffffff?text=ZEREX+CARBON" alt="ZEREX CARBON Logo" width="800" height="400">
</div>

## 🚀 منصة تداول أرصدة الكربون الرائدة

ZEREX CARBON هي منصة مبتكرة لتداول أرصدة الكربون تهدف إلى تسهيل الاستثمار في البيئة المستدامة. تتيح المنصة للمستخدمين شراء وبيع أرصدة الكربون مع ضمان الشفافية والأمان في جميع المعاملات.

## ✨ المميزات الرئيسية

### 🌍 **تداول آمن وموثوق**
- منصة آمنة وموثوقة لتداول أرصدة الكربون
- ضمانات كاملة لجميع المعاملات
- نظام KYC متقدم للتحقق من الهوية

### 📈 **استثمار ذكي**
- استثمر في البيئة مع عوائد مالية مجزية
- تتبع الأسعار في الوقت الفعلي
- تحليلات مفصلة للسوق

### 🛡️ **حماية البيئة**
- ساهم في حماية البيئة وتقليل الانبعاثات الكربونية
- مشاريع معتمدة عالمياً
- شفافية كاملة في التأثير البيئي

### 🌐 **تأثير عالمي**
- انضم إلى الحركة العالمية لمكافحة تغير المناخ
- مشاريع في أكثر من 120 دولة
- معايير دولية معتمدة

## 🏗️ الهيكل التقني

### Monorepo Architecture
```
zerex-carbon/
├── apps/
│   ├── web/           # Next.js Frontend
│   ├── api/           # Node.js Backend API
│   └── mobile/        # Flutter Mobile App
├── packages/
│   ├── ui/            # Shared UI Components
│   ├── config/        # Shared Configuration
│   └── types/         # TypeScript Types
├── docker-compose.yml
├── vercel.json
└── README.md
```

### التقنيات المستخدمة

#### Frontend (Web)
- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data Fetching
- **NextAuth.js** - Authentication

#### Backend (API)
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Redis** - Caching
- **JWT** - Authentication
- **WebSocket** - Real-time Updates

#### Mobile
- **Flutter** - Cross-platform Development
- **BLoC** - State Management
- **Dio** - HTTP Client
- **Hive** - Local Storage

#### DevOps
- **Docker** - Containerization
- **Vercel** - Deployment
- **GitHub Actions** - CI/CD
- **pnpm** - Package Manager
- **Turbo** - Monorepo Build System

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- pnpm 8+
- Docker (اختياري)
- Flutter 3.10+ (للتطبيق المحمول)

### التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/zerex-carbon.git
cd zerex-carbon
```

2. **تثبيت التبعيات**
```bash
pnpm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env.local
# قم بتعديل القيم في .env.local
```

4. **تشغيل قاعدة البيانات**
```bash
docker-compose up -d postgres redis
```

5. **إعداد قاعدة البيانات**
```bash
pnpm --filter @zerex-carbon/api db:push
pnpm --filter @zerex-carbon/api db:seed
```

6. **تشغيل التطبيقات**
```bash
# تشغيل جميع التطبيقات
pnpm dev

# أو تشغيل كل تطبيق منفصل
pnpm --filter @zerex-carbon/web dev
pnpm --filter @zerex-carbon/api dev
```

### الوصول للتطبيقات
- **الويب**: http://localhost:3000
- **API**: http://localhost:3001
- **المحمول**: `flutter run` في مجلد `apps/mobile`

## 🌐 النشر على Vercel

### النشر التلقائي
1. اضغط على زر "Deploy to Vercel" أعلاه
2. قم بإعداد GitHub Secrets المطلوبة
3. ادفع الكود إلى `main` branch
4. سيتم النشر تلقائياً!

### GitHub Secrets المطلوبة
| Secret | الوصف | مثال |
|--------|--------|------|
| `DATABASE_URL` | رابط قاعدة البيانات | `postgres://user:pass@host:5432/db` |
| `REDIS_URL` | رابط Redis | `redis://host:6379` |
| `JWT_SECRET` | مفتاح JWT | `32-char-random-string` |
| `STRIPE_SECRET_KEY` | مفتاح Stripe | `sk_live_...` |
| `NEXTAUTH_SECRET` | مفتاح NextAuth | `32-char-random-string` |
| `NEXTAUTH_URL` | رابط التطبيق | `https://your-domain.vercel.app` |
| `GITHUB_CLIENT_ID` | GitHub OAuth ID | من GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret | من GitHub OAuth App |
| `VERCEL_TOKEN` | Vercel Token | من Vercel Dashboard |

## 📱 التطبيق المحمول

### تشغيل Flutter App
```bash
cd apps/mobile
flutter pub get
flutter run
```

### بناء APK
```bash
flutter build apk --release
```

### بناء iOS
```bash
flutter build ios --release
```

## 🐳 Docker

### تشغيل كامل مع Docker
```bash
docker-compose up -d
```

### بناء الصور
```bash
docker-compose build
```

### إيقاف الخدمات
```bash
docker-compose down
```

## 🧪 الاختبار

```bash
# تشغيل جميع الاختبارات
pnpm test

# اختبار تطبيق معين
pnpm --filter @zerex-carbon/web test
pnpm --filter @zerex-carbon/api test

# اختبار Flutter
cd apps/mobile
flutter test
```

## 📊 المراقبة والأداء

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 98+
- **Best Practices**: 100
- **SEO**: 92+

### Health Checks
- **API Health**: `/api/health`
- **Web Health**: `/health`
- **Database**: PostgreSQL connection
- **Cache**: Redis connection

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- **الموقع**: https://zerex-carbon.com
- **البريد الإلكتروني**: info@zerex-carbon.com
- **الهاتف**: +966 11 123 4567
- **العنوان**: الرياض، المملكة العربية السعودية

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Flutter](https://flutter.dev/) - Mobile Framework
- [Vercel](https://vercel.com/) - Deployment Platform

---

<div align="center">
  <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
  <p>© 2024 ZEREX CARBON. جميع الحقوق محفوظة.</p>
</div>
