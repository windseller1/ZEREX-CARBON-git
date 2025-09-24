@echo off
echo 🚀 إعداد رفع المشروع على GitHub
echo.

echo 📦 إنشاء ملف .env.local...
echo # Zyra Carbon Environment Variables > .env.local
echo. >> .env.local
echo # Database >> .env.local
echo DATABASE_URL="file:./dev.db" >> .env.local
echo. >> .env.local
echo # Authentication >> .env.local
echo NEXTAUTH_SECRET="zyra-carbon-secret-key-2024" >> .env.local
echo NEXTAUTH_URL="http://localhost:3000" >> .env.local
echo. >> .env.local
echo # Blockchain >> .env.local
echo NEXT_PUBLIC_ALCHEMY_KEY="your-alchemy-key-here" >> .env.local
echo NEXT_PUBLIC_IPFS_GATEWAY="https://zyra-carbon.infura-ipfs.io" >> .env.local
echo. >> .env.local
echo # Payment >> .env.local
echo STRIPE_PUBLIC_KEY="your-stripe-public-key" >> .env.local
echo STRIPE_SECRET_KEY="your-stripe-secret-key" >> .env.local
echo STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret" >> .env.local
echo. >> .env.local
echo # Social Media >> .env.local
echo TELEGRAM_BOT_TOKEN="your-telegram-bot-token" >> .env.local
echo TELEGRAM_CHANNEL_ID="your-telegram-channel-id" >> .env.local
echo TWITTER_API_KEY="your-twitter-api-key" >> .env.local
echo TWITTER_API_SECRET="your-twitter-api-secret" >> .env.local
echo TWITTER_ACCESS_TOKEN="your-twitter-access-token" >> .env.local
echo TWITTER_ACCESS_TOKEN_SECRET="your-twitter-access-token-secret" >> .env.local
echo TWITTER_BEARER_TOKEN="your-twitter-bearer-token" >> .env.local
echo. >> .env.local
echo # Development >> .env.local
echo NODE_ENV="development" >> .env.local

echo ✅ تم إنشاء ملف .env.local

echo.
echo 📋 خطوات رفع المشروع على GitHub:
echo.
echo 1. اذهب إلى https://github.com
echo 2. انقر على "New repository"
echo 3. اسم المستودع: zyra-carbon
echo 4. الوصف: Zyra Carbon - منصة تداول الكربون الأوروبية
echo 5. اختر "Public" أو "Private"
echo 6. لا تضع علامة على "Initialize this repository with a README"
echo 7. انقر على "Create repository"
echo.
echo 8. ثم استخدم الأوامر التالية:
echo    git init
echo    git add .
echo    git commit -m "Initial commit: Zyra Carbon platform"
echo    git remote add origin https://github.com/YOUR_USERNAME/zyra-carbon.git
echo    git push -u origin main
echo.
echo 9. للنشر على Vercel:
echo    npx vercel --prod
echo.
echo 10. للنشر على Netlify:
echo     npx netlify deploy --prod
echo.

echo 📄 تم إنشاء ملف GITHUB_SETUP.md مع التعليمات التفصيلية
echo.

pause
