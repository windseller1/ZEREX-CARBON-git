# 🚀 إعداد رفع المشروع على GitHub

## 📋 خطوات رفع المشروع على GitHub:

### **1. إنشاء مستودع جديد على GitHub:**
1. اذهب إلى https://github.com
2. انقر على "New repository"
3. اسم المستودع: `zyra-carbon`
4. الوصف: `Zyra Carbon - منصة تداول الكربون الأوروبية`
5. اختر "Public" أو "Private"
6. لا تضع علامة على "Initialize this repository with a README"
7. انقر على "Create repository"

### **2. رفع المشروع:**
```bash
# تهيئة Git
git init

# إضافة الملفات
git add .

# إنشاء commit أولي
git commit -m "Initial commit: Zyra Carbon platform"

# إضافة remote origin
git remote add origin https://github.com/YOUR_USERNAME/zyra-carbon.git

# رفع المشروع
git push -u origin main
```

### **3. إعداد متغيرات البيئة على Vercel:**
1. اذهب إلى https://vercel.com
2. اربط حساب GitHub
3. استورد مشروع `zyra-carbon`
4. أضف متغيرات البيئة التالية:

```
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=zyra-carbon-secret-key-2024
NEXTAUTH_URL=https://zyra-carbon.vercel.app
NEXT_PUBLIC_ALCHEMY_KEY=your-alchemy-key-here
NEXT_PUBLIC_IPFS_GATEWAY=https://zyra-carbon.infura-ipfs.io
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### **4. إعداد متغيرات البيئة على Netlify:**
1. اذهب إلى https://netlify.com
2. اربط حساب GitHub
3. استورد مشروع `zyra-carbon`
4. أضف متغيرات البيئة نفسها

### **5. إعداد GitHub Actions:**
المشروع يحتوي على ملف `.github/workflows/ci-cd.yml` جاهز للاستخدام.

## 📁 الملفات المهمة:

### **ملفات التكوين:**
- `package.json` - تبعيات المشروع
- `next.config.js` - إعدادات Next.js
- `tailwind.config.js` - إعدادات Tailwind CSS
- `tsconfig.json` - إعدادات TypeScript
- `prisma/schema.prisma` - مخطط قاعدة البيانات

### **ملفات النشر:**
- `Dockerfile` - صورة Docker
- `docker-compose.yml` - تكوين Docker
- `vercel.json` - إعداد Vercel
- `netlify.toml` - إعداد Netlify

### **ملفات الصيانة:**
- `weekly-maintenance.js` - الصيانة الأسبوعية
- `auto-maintenance.bat` - صيانة Windows
- `auto-maintenance.ps1` - صيانة PowerShell

## 🔧 إعداد المشروع محلياً:

### **1. تثبيت التبعيات:**
```bash
npm install
```

### **2. إعداد قاعدة البيانات:**
```bash
npx prisma db push
```

### **3. تشغيل المشروع:**
```bash
npm run dev
```

## 🌐 النشر:

### **Vercel (مستحسن):**
```bash
npx vercel --prod
```

### **Netlify:**
```bash
npx netlify deploy --prod
```

### **Docker:**
```bash
docker build -t zyra-carbon .
docker run -p 3000:3000 zyra-carbon
```

## 📊 الميزات:

- ✅ نظام تداول الكربون
- ✅ إنشاء وبيع NFTs
- ✅ نظام مصادقة آمن
- ✅ إدارة محافظ مالية
- ✅ تكامل وسائل التواصل الاجتماعي
- ✅ جمع بيانات المناخ التلقائي
- ✅ إدارة المخاطر والتحليل الاقتصادي
- ✅ صيانة تلقائية
- ✅ نشر على عدة منصات

## 🎯 الرابط النهائي:
بعد النشر، سيكون المشروع متاح على:
- **Vercel**: https://zyra-carbon.vercel.app
- **Netlify**: https://zyra-carbon.netlify.app
- **GitHub**: https://github.com/YOUR_USERNAME/zyra-carbon

---

**تم إعداد المشروع للرفع على GitHub! 🎉**
