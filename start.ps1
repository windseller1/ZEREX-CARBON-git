# بدء تشغيل مشروع Zyra Carbon
Write-Host "🔧 بدء تشغيل مشروع Zyra Carbon..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 تثبيت التبعيات..." -ForegroundColor Yellow
npm install

Write-Host "🗄️ إعداد قاعدة البيانات..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push

Write-Host "🚀 تشغيل المشروع..." -ForegroundColor Green
npm run dev