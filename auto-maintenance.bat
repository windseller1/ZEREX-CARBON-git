@echo off
echo 🔧 نظام الصيانة التلقائية لموقع Zyra Carbon
echo.

REM إنشاء مجلدات الصيانة
if not exist "backups" mkdir backups
if not exist "logs" mkdir logs

REM تشغيل الصيانة الأسبوعية
echo 📦 تشغيل الصيانة الأسبوعية...
node weekly-maintenance.js --run-now

REM تنظيف الملفات المؤقتة
echo 🧹 تنظيف الملفات المؤقتة...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist ".next" rmdir /s /q ".next"
if exist "temp" rmdir /s /q "temp"

REM تحديث التبعيات
echo 🔄 تحديث التبعيات...
npm update

REM إصلاح المشاكل الشائعة
echo 🔧 إصلاح المشاكل الشائعة...
if not exist ".env" copy ".env.example" ".env"
if not exist "next.config.js" echo const nextConfig = { reactStrictMode: true, swcMinify: false }; module.exports = nextConfig; > next.config.js
if not exist ".babelrc" echo {"presets": ["next/babel"]} > .babelrc

REM إصلاح قاعدة البيانات
echo 🗄️ إصلاح قاعدة البيانات...
npx prisma db push --skip-generate

REM تشغيل الاختبارات
echo 🧪 تشغيل الاختبارات...
npm test

REM بناء المشروع
echo 🏗️ بناء المشروع...
npm run build

echo ✅ تمت الصيانة بنجاح!
echo 📊 تم حفظ النتائج في مجلد logs
echo.

pause
