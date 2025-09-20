# دليل إعداد Zyra Carbon

## المتطلبات الأساسية

- Node.js 18+ 
- PostgreSQL 13+
- npm أو yarn

## خطوات الإعداد

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd zyra-carbon
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env.local` واملأه بالمتغيرات التالية:

```env
# قاعدة البيانات
DATABASE_URL="postgresql://username:password@localhost:5432/zyra_carbon"

# المصادقة
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key-here"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Ethereum
NEXT_PUBLIC_ALCHEMY_KEY="your-alchemy-key"
NEXT_PUBLIC_IPFS_GATEWAY="https://ipfs.io/ipfs/"

# APIs الخارجية
OPEN_WEATHER_API_KEY="your-openweather-api-key"
CARBON_INTERFACE_API_KEY="your-carbon-interface-api-key"
EU_ETS_API_KEY="your-eu-ets-api-key"
WORLD_BANK_API_KEY="your-world-bank-api-key"
NASA_API_KEY="your-nasa-api-key"
NOAA_API_KEY="your-noaa-api-key"
VERRA_API_KEY="your-verra-api-key"
GOLD_STANDARD_API_KEY="your-gold-standard-api-key"

# PayPal (اختياري)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# إعدادات الأمان
ENCRYPTION_KEY="your-encryption-key"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# إعدادات التطبيق
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Zyra Carbon"
```

### 4. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات
npx prisma db push

# توليد Prisma Client
npx prisma generate
```

### 5. تشغيل المشروع
```bash
# وضع التطوير
npm run dev

# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start
```

## الحصول على مفاتيح API

### Open Weather Map
1. اذهب إلى [OpenWeatherMap](https://openweathermap.org/api)
2. سجل حساب جديد
3. احصل على API key

### Carbon Interface
1. اذهب إلى [Carbon Interface](https://www.carboninterface.com/)
2. سجل حساب جديد
3. احصل على API key

### EU ETS
1. اذهب إلى [EU ETS](https://www.eea.europa.eu/data-and-maps/data/co2-emissions-from-passenger-cars)
2. سجل حساب جديد
3. احصل على API key

### World Bank
1. اذهب إلى [World Bank API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
2. سجل حساب جديد
3. احصل على API key

### NASA
1. اذهب إلى [NASA API](https://api.nasa.gov/)
2. سجل حساب جديد
3. احصل على API key

### Verra Registry
1. اذهب إلى [Verra Registry](https://registry.verra.org/)
2. سجل حساب جديد
3. احصل على API key

### Gold Standard
1. اذهب إلى [Gold Standard](https://www.goldstandard.org/)
2. سجل حساب جديد
3. احصل على API key

## استكشاف الأخطاء

### مشاكل قاعدة البيانات
```bash
# إعادة تعيين قاعدة البيانات
npx prisma db push --force-reset

# عرض قاعدة البيانات
npx prisma studio
```

### مشاكل التبعيات
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### مشاكل البناء
```bash
# تنظيف cache
npm run build -- --no-cache
```

## الصفحات المتاحة

- `/` - الصفحة الرئيسية
- `/auth` - تسجيل الدخول وإنشاء الحساب
- `/marketplace` - سوق NFTs
- `/create` - إنشاء NFT جديد
- `/dashboard` - لوحة تحكم المستخدم
- `/admin/wallet` - محفظة الإدمن
- `/admin/integrations` - التكاملات
- `/admin/risk-management` - إدارة المخاطر
- `/admin/economic-analysis` - التحليل الاقتصادي
- `/admin/climate-data` - بيانات المناخ

## الدعم

إذا واجهت أي مشاكل، يرجى:
1. التحقق من ملف `.env.local`
2. التأكد من تشغيل PostgreSQL
3. فتح issue في GitHub
4. التواصل معنا عبر البريد الإلكتروني
