# 🤖 استخدام ذكاء اصطناعي لحل مشكلة SWC
Write-Host "🤖 استخدام ذكاء اصطناعي لحل مشكلة SWC..." -ForegroundColor Green
Write-Host ""

Write-Host "📥 تحميل Node.js 18 LTS..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi" -OutFile "node-v18.20.4-x64.msi"

Write-Host "🔧 تثبيت Node.js 18 LTS..." -ForegroundColor Yellow
Start-Process -FilePath "msiexec" -ArgumentList "/i node-v18.20.4-x64.msi /quiet /norestart" -Wait

Write-Host "🧹 تنظيف الملفات المؤقتة..." -ForegroundColor Yellow
Remove-Item "node-v18.20.4-x64.msi" -Force

Write-Host "✅ تم تثبيت Node.js 18 LTS بنجاح!" -ForegroundColor Green
Write-Host "🔄 يرجى إعادة تشغيل Terminal وتشغيل المشروع" -ForegroundColor Cyan

Write-Host ""
Write-Host "🚀 تشغيل المشروع..." -ForegroundColor Green
npm run dev