@echo off
echo 🔧 بدء تشغيل مشروع Zyra Carbon...
echo.

echo 📦 تثبيت التبعيات...
call npm install

echo 🗄️ إعداد قاعدة البيانات...
call npx prisma generate
call npx prisma db push

echo 🚀 تشغيل المشروع...
call npm run dev

pause