#!/bin/bash

echo "🔧 بدء تشغيل مشروع Zyra Carbon..."
echo ""

echo "📦 تثبيت التبعيات..."
npm install

echo "🗄️ إعداد قاعدة البيانات..."
npx prisma generate
npx prisma db push

echo "🚀 تشغيل المشروع..."
npm run dev
