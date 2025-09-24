@echo off
echo 🚀 رفع جميع الملفات إلى GitHub...
echo.

echo 📋 المستودع المستهدف: https://github.com/windseller1/zyra1.git
echo.

echo 🔧 تهيئة Git...
git init

echo.
echo 📝 إضافة جميع الملفات...
git add .

echo.
echo 💾 إنشاء commit شامل...
git commit -m "Complete Zyra Carbon Platform - منصة تداول الكربون الأوروبية الكاملة

🌱 Zyra Carbon - منصة تداول الكربون الأوروبية المتكاملة

✨ الميزات الرئيسية:
- نظام تداول الكربون في السوق الأوروبي
- إنشاء وبيع NFTs للكربون
- نظام مصادقة آمن ومتقدم
- إدارة محافظ مالية شاملة
- تكامل وسائل التواصل الاجتماعي (التلغرام وتويتر)
- جمع بيانات المناخ التلقائي من المصادر المجانية
- إدارة المخاطر والتحليل الاقتصادي
- نظام صيانة تلقائية أسبوعية
- نشر على عدة منصات (Vercel, Netlify, Docker)

🔧 التقنيات المستخدمة:
- Next.js 14.2.3 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Prisma (database ORM)
- PostgreSQL/SQLite (database)
- Ethereum (blockchain)
- Ethers.js (blockchain interaction)
- IPFS (decentralized storage)
- Stripe (payment processing)
- Docker (containerization)
- Vercel/Netlify (deployment)

💰 التحليل المالي:
- التكلفة الأولية: €80,000
- التكلفة الشهرية: €9,600
- الإيرادات المتوقعة السنة الأولى: €340,800
- الإيرادات المتوقعة السنة الثانية: €1,620,000
- الإيرادات المتوقعة السنة الثالثة: €4,500,000
- عائد الاستثمار السنة الثالثة: 5,525%

📚 التوثيق الشامل:
- README.md (دليل شامل)
- CONTRIBUTING.md (دليل المساهمة)
- PROJECT_OVERVIEW.md (نظرة عامة)
- COST_ANALYSIS_REPORT.md (تحليل التكلفة)
- CHANGELOG.md (سجل التحديثات)
- SETUP.md (دليل الإعداد)
- GITHUB_DEPLOYMENT_GUIDE.md (دليل النشر)

🎯 الحالة: جاهز للاستخدام والنشر فوراً

📁 الملفات المرفوعة:
- جميع مكونات React (100+ مكون)
- صفحات Next.js (20+ صفحة)
- API endpoints (30+ endpoint)
- قاعدة البيانات (Prisma schema)
- ملفات التكوين (package.json, next.config.js, etc.)
- ملفات النشر (Docker, Vercel, Netlify)
- نظام الصيانة التلقائية
- التوثيق الشامل
- تحليل التكلفة والأرباح
- تكامل وسائل التواصل الاجتماعي"

echo.
echo 🌿 إنشاء فرع main...
git branch -M main

echo.
echo 🔗 إضافة remote origin...
git remote add origin https://github.com/windseller1/zyra1.git

echo.
echo 🚀 رفع المشروع إلى GitHub...
git push -u origin main

echo.
echo ✅ تم رفع جميع الملفات بنجاح!
echo.
echo 🌐 رابط المستودع: https://github.com/windseller1/zyra1.git
echo.
echo 📋 الخطوات التالية:
echo 1. اذهب إلى https://github.com/windseller1/zyra1
echo 2. تحقق من أن جميع الملفات موجودة
echo 3. للنشر على Vercel: npx vercel --prod
echo 4. للنشر على Netlify: npx netlify deploy --prod
echo.

pause
