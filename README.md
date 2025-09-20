# 🌱 Zyra Carbon - منصة تداول الكربون الأوروبية

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 📋 نظرة عامة

Zyra Carbon هي منصة مبتكرة لتداول الكربون في السوق الأوروبي، تجمع بين التكنولوجيا المتقدمة والاستدامة البيئية. تتيح المنصة للمستخدمين تداول رصيد الكربون، إنشاء NFTs للكربون، وإدارة محافظهم المالية بطريقة آمنة ومستدامة.

## ✨ الميزات الرئيسية

### 🏪 السوق
- تداول رصيد الكربون في السوق الأوروبي
- إنشاء وبيع NFTs للكربون
- نظام مزاد ذكي للأسعار
- دعم العملات المشفرة والدفع التقليدي

### 👤 إدارة المستخدمين
- نظام تسجيل دخول آمن
- محافظ مالية متقدمة
- تتبع المعاملات والاستثمارات
- إشعارات فورية

### 🔧 الإدارة
- محفظة إدارية شاملة
- ربط البنوك والدفع الآمن
- إدارة المخاطر والتحليل الاقتصادي
- جمع بيانات المناخ التلقائي
- التكامل مع المنصات الخارجية

### 🔒 الأمان
- تشفير متقدم للمعاملات
- نظام مصادقة متعدد الطبقات
- حماية من التهكير
- تسجيل شامل للأنشطة

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14.2.3** - إطار React متقدم
- **TypeScript** - أمان الأنواع
- **Tailwind CSS** - تصميم متجاوب
- **Framer Motion** - الرسوم المتحركة

### Backend
- **Prisma** - إدارة قاعدة البيانات
- **PostgreSQL/SQLite** - قاعدة البيانات
- **Next.js API Routes** - واجهات برمجة التطبيقات

### Blockchain
- **Ethereum** - شبكة البلوك تشين
- **Ethers.js** - تفاعل مع الشبكة
- **IPFS** - تخزين لامركزي

### الدفع
- **Stripe** - الدفع التقليدي
- **Ethereum** - العملات المشفرة

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+ 
- npm 8+
- Git

### التثبيت
```bash
# استنساخ المشروع
git clone https://github.com/YOUR_USERNAME/zyra-carbon.git
cd zyra-carbon

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local

# إعداد قاعدة البيانات
npx prisma db push

# تشغيل المشروع
npm run dev
```

### متغيرات البيئة
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_ALCHEMY_KEY="your-alchemy-key"
NEXT_PUBLIC_IPFS_GATEWAY="https://zyra-carbon.infura-ipfs.io"
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

## 📊 الصفحات المتاحة

### للمستخدمين
- **/** - الصفحة الرئيسية
- **/auth** - تسجيل الدخول/التسجيل
- **/marketplace** - سوق الكربون
- **/create** - إنشاء NFT جديد
- **/dashboard** - لوحة التحكم

### للإدارة
- **/admin/wallet** - إدارة المحفظة
- **/admin/integrations** - التكاملات الخارجية
- **/admin/risk-management** - إدارة المخاطر
- **/admin/economic-analysis** - التحليل الاقتصادي
- **/admin/climate-data** - بيانات المناخ
- **/admin/social-media** - وسائل التواصل الاجتماعي

## 🔧 الصيانة

### الصيانة التلقائية
```bash
# تشغيل الصيانة الأسبوعية
npm run maintenance

# تشغيل الصيانة فوراً
npm run backup
```

### النسخ الاحتياطية
- يتم إنشاء نسخة احتياطية أسبوعياً تلقائياً
- يتم الاحتفاظ بـ 4 نسخ احتياطية
- يمكن الوصول للنسخ في مجلد `./backups`

## 🚀 النشر

### Vercel
```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel --prod
```

### Netlify
```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# نشر المشروع
netlify deploy --prod
```

### Docker
```bash
# بناء الصورة
docker build -t zyra-carbon .

# تشغيل الحاوية
docker run -p 3000:3000 zyra-carbon
```

## 📈 الأداء

### التحسينات
- تحميل تدريجي للمكونات
- ضغط الصور والملفات
- تخزين مؤقت ذكي
- تحسين قاعدة البيانات

### المراقبة
- تسجيل شامل للأخطاء
- مراقبة الأداء
- تنبيهات فورية

## 🔒 الأمان

### الحماية
- تشفير كامل للمعاملات
- مصادقة متعددة العوامل
- حماية من CSRF و XSS
- تسجيل شامل للأنشطة

### الامتثال
- متوافق مع GDPR
- معايير الأمان الأوروبية
- شهادات SSL/TLS

## 💰 التحليل المالي

### التكاليف
- **التكاليف الأولية**: €80,000
- **التكاليف الشهرية**: €9,600

### الإيرادات المتوقعة
- **السنة الأولى**: €340,800
- **السنة الثانية**: €1,620,000
- **السنة الثالثة**: €4,500,000

### عائد الاستثمار
- **السنة الأولى**: 326%
- **السنة الثانية**: 1,925%
- **السنة الثالثة**: 5,525%

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) قبل البدء.

### إرشادات المساهمة
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت [رخصة MIT](LICENSE).

## 📞 الدعم

- **البريد الإلكتروني**: support@zyra-carbon.com
- **التلغرام**: @ZyraCarbon
- **تويتر**: @ZyraCarbon
- **الموقع**: https://zyra-carbon.com

## 🎯 الطريق المستقبلي

### الميزات القادمة
- [ ] تطبيق الهاتف المحمول
- [ ] دعم المزيد من العملات المشفرة
- [ ] تحليلات متقدمة
- [ ] تكامل مع المزيد من المنصات

### الأهداف
- أن نصبح المنصة الرائدة لتداول الكربون في أوروبا
- تحقيق تأثير إيجابي على البيئة
- توفير تجربة مستخدم استثنائية

---

**تم تطويره بـ ❤️ من قبل فريق Zyra Carbon**