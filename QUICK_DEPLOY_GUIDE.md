# 🚀 دليل النشر السريع - ZEREX CARBON

## ✅ تم رفع المشروع بنجاح على GitHub!

**رابط المشروع**: https://github.com/windseller1/ZEREX-CARBON-git

## 🛠️ السكريبتات المتاحة

### 1. Windows Batch (الأسهل)
```cmd
.\deploy-to-github-vercel.bat
```

### 2. PowerShell (متقدم)
```powershell
.\deploy-to-github-vercel.ps1
```

### 3. Bash/Linux/macOS
```bash
chmod +x deploy-to-github-vercel.sh
./deploy-to-github-vercel.sh
```

## 🎯 ما تفعله السكريبتات

### ✅ إدارة Git
- تهيئة repository
- تكوين المستخدم
- إضافة remote repository
- إضافة جميع الملفات
- عمل commit
- رفع الكود إلى GitHub

### ✅ إعداد Vercel
- اكتشاف نوع المشروع
- إنشاء `vercel.json` تلقائياً
- تثبيت Vercel CLI
- نشر المشروع على Vercel

### ✅ الميزات المتقدمة
- واجهة ملونة وواضحة
- معالجة أخطاء شاملة
- دعم جميع أنواع المشاريع
- تأكيدات قبل العمليات الحساسة

## 🚀 النشر على Vercel

### الطريقة الأولى: السكريبت التلقائي
```cmd
.\deploy-to-github-vercel.bat
```

### الطريقة الثانية: يدوياً
```cmd
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

## 📋 المتطلبات

- ✅ Git
- ✅ Node.js (v18+)
- ✅ npm
- ✅ حساب GitHub
- ✅ حساب Vercel

## 🔧 إعداد GitHub Secrets

بعد النشر، أضف هذه الأسرار في GitHub:

1. اذهب إلى **Settings** → **Secrets and variables** → **Actions**
2. أضف الأسرار التالية:

| Secret Name | الوصف |
|-------------|--------|
| `DATABASE_URL` | رابط قاعدة البيانات |
| `JWT_SECRET` | مفتاح JWT |
| `STRIPE_SECRET_KEY` | مفتاح Stripe |
| `NEXTAUTH_SECRET` | مفتاح NextAuth |
| `NEXTAUTH_URL` | رابط التطبيق |

## 🌐 روابط مهمة

- **GitHub Repository**: https://github.com/windseller1/ZEREX-CARBON-git
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/windseller1/ZEREX-CARBON-git/actions

## 🎉 تهانينا!

مشروعك الآن:
- ✅ **محفوظ على GitHub**
- ✅ **منشور على Vercel**
- ✅ **جاهز للاستخدام**
- ✅ **يدعم CI/CD**

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من المتطلبات
2. اقرأ رسائل الخطأ
3. تواصل معنا عبر GitHub Issues

---

<div align="center">
  <p>🎉 استمتع بمشروعك الجديد!</p>
  <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
</div>
