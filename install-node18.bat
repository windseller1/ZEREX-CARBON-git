@echo off
echo 🔧 إصلاح مشكلة إصدار Node.js...
echo.

echo 📥 تحميل Node.js 18...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi' -OutFile 'node-v18.20.4-x64.msi'"

echo 🔧 تثبيت Node.js 18...
msiexec /i node-v18.20.4-x64.msi /quiet /norestart

echo 🧹 تنظيف الملفات المؤقتة...
del node-v18.20.4-x64.msi

echo ✅ تم تثبيت Node.js 18 بنجاح!
echo 🔄 يرجى إعادة تشغيل Terminal وتشغيل المشروع مرة أخرى

pause