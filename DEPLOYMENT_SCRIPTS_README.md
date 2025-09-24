# 🚀 ZEREX CARBON - Deployment Scripts

مجموعة شاملة من السكريبتات لرفع المشروع على GitHub ونشره على Vercel تلقائياً.

## 📁 الملفات المتاحة

### 1. `deploy-to-github-vercel.sh` (Linux/macOS/Git Bash)
- سكريبت Bash متوافق مع Linux و macOS و Git Bash على Windows
- يدعم جميع الميزات المطلوبة
- واجهة ملونة وواضحة

### 2. `deploy-to-github-vercel.ps1` (Windows PowerShell)
- سكريبت PowerShell متوافق مع Windows PowerShell و PowerShell Core
- واجهة ملونة ومتقدمة
- معالجة أخطاء محسنة

### 3. `deploy-to-github-vercel.bat` (Windows Command Prompt)
- سكريبت Batch متوافق مع Windows Command Prompt
- بسيط وسهل الاستخدام
- لا يتطلب PowerShell

## 🛠️ المتطلبات

### متطلبات أساسية
- **Git** - لإدارة النسخ
- **Node.js** (v18+) - لتشغيل JavaScript
- **npm** - لإدارة الحزم
- **Vercel CLI** - سيتم تثبيته تلقائياً إذا لم يكن موجوداً

### متطلبات إضافية
- حساب GitHub مع repository فارغ
- حساب Vercel (سيتم طلب تسجيل الدخول)

## 🚀 كيفية الاستخدام

### للـ Linux/macOS/Git Bash
```bash
# جعل السكريبت قابل للتنفيذ
chmod +x deploy-to-github-vercel.sh

# تشغيل السكريبت
./deploy-to-github-vercel.sh
```

### للـ Windows PowerShell
```powershell
# تشغيل السكريبت
.\deploy-to-github-vercel.ps1

# أو مع معاملات مخصصة
.\deploy-to-github-vercel.ps1 -GitHubRepoUrl "https://github.com/username/repo.git" -CommitMessage "Custom message"
```

### للـ Windows Command Prompt
```cmd
# تشغيل السكريبت
deploy-to-github-vercel.bat
```

## ⚙️ المعاملات المتاحة (PowerShell فقط)

| المعامل | الوصف | القيمة الافتراضية |
|---------|--------|-------------------|
| `-GitHubRepoUrl` | رابط GitHub repository | `https://github.com/windseller1/ZEREX-CARBON-git.git` |
| `-CommitMessage` | رسالة الـ commit | `Initial upload to GitHub and Vercel` |
| `-Branch` | اسم الـ branch | `main` |
| `-ProjectName` | اسم المشروع | `ZEREX-CARBON` |

## 🔧 الميزات

### ✅ إدارة Git
- تهيئة repository إذا لم يكن موجوداً
- تكوين المستخدم تلقائياً
- إضافة remote repository
- فحص التغييرات الموجودة
- إضافة جميع الملفات
- عمل commit مع رسالة مخصصة
- رفع الكود إلى GitHub

### ✅ اكتشاف نوع المشروع
- **Next.js** - مشاريع Next.js مع App Router
- **Node.js** - مشاريع Node.js/Express
- **Static** - مشاريع HTML/CSS/JS ثابتة
- **Python** - مشاريع Python
- **Rust** - مشاريع Rust

### ✅ إعداد Vercel
- إنشاء `vercel.json` تلقائياً حسب نوع المشروع
- تكوين builds و routes
- دعم Monorepo
- دعم API routes

### ✅ النشر على Vercel
- فحص Vercel CLI
- تثبيت Vercel CLI إذا لم يكن موجوداً
- نشر المشروع تلقائياً
- استخراج رابط النشر

### ✅ واجهة مستخدم محسنة
- ألوان مميزة للرسائل
- رسائل واضحة ومفصلة
- معالجة أخطاء شاملة
- تأكيدات قبل العمليات الحساسة

## 📋 خطوات التنفيذ

### 1. فحص المتطلبات
- التحقق من وجود Git
- التحقق من وجود Node.js
- التحقق من وجود npm

### 2. إعداد Git
- تهيئة repository
- تكوين المستخدم
- إضافة remote repository

### 3. إدارة الكود
- فحص التغييرات الموجودة
- إضافة جميع الملفات
- عمل commit
- رفع الكود إلى GitHub

### 4. إعداد Vercel
- اكتشاف نوع المشروع
- إنشاء vercel.json
- فحص Vercel CLI

### 5. النشر
- نشر المشروع على Vercel
- عرض روابط النشر
- عرض الخطوات التالية

## 🛡️ الأمان

### حماية البيانات
- لا يتم حفظ كلمات المرور
- استخدام Git credentials المحفوظة
- طلب تسجيل دخول Vercel عند الحاجة

### معالجة الأخطاء
- فحص جميع العمليات
- رسائل خطأ واضحة
- إيقاف التنفيذ عند الفشل

## 🔍 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في Git
```
[ERROR] Git is not installed
```
**الحل**: تثبيت Git من [git-scm.com](https://git-scm.com)

#### 2. خطأ في Node.js
```
[ERROR] Node.js is not installed
```
**الحل**: تثبيت Node.js من [nodejs.org](https://nodejs.org)

#### 3. خطأ في Vercel
```
[ERROR] Vercel deployment failed
```
**الحل**: 
1. تشغيل `vercel login`
2. التأكد من صحة الإعدادات
3. إعادة تشغيل السكريبت

#### 4. خطأ في GitHub
```
[ERROR] Failed to push to GitHub
```
**الحل**:
1. التحقق من صحة رابط Repository
2. التحقق من صلاحيات الوصول
3. إعادة تكوين Git credentials

## 📞 الدعم

### في حالة وجود مشاكل
1. تحقق من المتطلبات
2. اقرأ رسائل الخطأ بعناية
3. تأكد من صحة الإعدادات
4. تواصل معنا عبر:
   - **البريد الإلكتروني**: support@zerex-carbon.com
   - **GitHub Issues**: [إنشاء issue جديد](https://github.com/windseller1/ZEREX-CARBON-git/issues)

## 🎯 النتائج المتوقعة

بعد تشغيل السكريبت بنجاح، ستحصل على:

✅ **مشروع على GitHub** - كودك محفوظ ومتاح للجميع  
✅ **نشر على Vercel** - موقعك يعمل على الإنترنت  
✅ **CI/CD جاهز** - تحديثات تلقائية عند دفع الكود  
✅ **توثيق كامل** - README وملفات إعداد شاملة  

## 🚀 الخطوات التالية

بعد النشر الناجح:

1. **زيارة Vercel Dashboard** - لإعداد متغيرات البيئة
2. **إعداد قاعدة البيانات** - PostgreSQL أو MongoDB
3. **تكوين GitHub Secrets** - للـ CI/CD
4. **اختبار الموقع** - التأكد من عمل جميع الميزات
5. **إضافة نطاق مخصص** - إذا أردت

---

<div align="center">
  <p>🎉 استمتع بنشر مشروعك مع ZEREX CARBON!</p>
  <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
</div>
