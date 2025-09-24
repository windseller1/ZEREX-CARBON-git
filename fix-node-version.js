#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 إصلاح مشكلة إصدار Node.js...\n');

// فحص إصدار Node.js الحالي
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

console.log(`📊 إصدار Node.js الحالي: ${nodeVersion}`);

if (majorVersion > 20) {
  console.log('⚠️ تحذير: إصدار Node.js الحالي غير متوافق مع Next.js 14.2.3');
  console.log('💡 يُنصح بتثبيت Node.js 18 أو 20');
  
  // إنشاء ملف إصلاح مؤقت
  const fixScript = `@echo off
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

pause`;

  fs.writeFileSync('install-node18.bat', fixScript);
  console.log('✅ تم إنشاء ملف install-node18.bat');
  console.log('💡 قم بتشغيل install-node18.bat كمدير لحل المشكلة');
  
} else {
  console.log('✅ إصدار Node.js متوافق مع Next.js');
}

// إنشاء ملف إصلاح بديل
const alternativeFix = `@echo off
echo 🔧 إصلاح مشكلة SWC مع Node.js ${nodeVersion}...
echo.

echo 📦 تثبيت Babel dependencies...
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

echo 🔧 تحديث next.config.js...
echo const nextConfig = {
echo   reactStrictMode: true,
echo   swcMinify: false,
echo   compiler: {
echo     removeConsole: false,
echo   },
echo   images: {
echo     domains: ['localhost', 'zyra-carbon.infura-ipfs.io'],
echo   },
echo   env: {
echo     NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
echo     NEXT_PUBLIC_IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
echo   },
echo   webpack: (config, { isServer }) => {
echo     if (!isServer) {
echo       config.resolve.fallback = {
echo         ...config.resolve.fallback,
echo         fs: false,
echo         net: false,
echo         tls: false,
echo       };
echo     }
echo     return config;
echo   },
echo   async headers() {
echo     return [
echo       {
echo         source: '/(.*)',
echo         headers: [
echo           { key: 'X-Frame-Options', value: 'DENY' },
echo           { key: 'X-Content-Type-Options', value: 'nosniff' },
echo           { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
echo         ],
echo       },
echo     ];
echo   },
echo };
echo.
echo module.exports = nextConfig; > next.config.js

echo 🔧 تحديث .babelrc...
echo {
echo   "presets": ["next/babel"],
echo   "plugins": []
echo } > .babelrc

echo 🚀 تشغيل المشروع...
npm run dev

pause`;

fs.writeFileSync('fix-swc-issue.bat', alternativeFix);
console.log('✅ تم إنشاء ملف fix-swc-issue.bat كحل بديل');

// إنشاء ملف PowerShell
const powershellFix = `# إصلاح مشكلة SWC مع Node.js ${nodeVersion}
Write-Host "🔧 إصلاح مشكلة SWC مع Node.js ${nodeVersion}..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 تثبيت Babel dependencies..." -ForegroundColor Yellow
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

Write-Host "🔧 تحديث next.config.js..." -ForegroundColor Yellow
$nextConfig = @"
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  images: {
    domains: ['localhost', 'zyra-carbon.infura-ipfs.io'],
  },
  env: {
    NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    NEXT_PUBLIC_IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
"@
$nextConfig | Out-File -FilePath "next.config.js" -Encoding UTF8

Write-Host "🔧 تحديث .babelrc..." -ForegroundColor Yellow
$babelrc = @"
{
  "presets": ["next/babel"],
  "plugins": []
}
"@
$babelrc | Out-File -FilePath ".babelrc" -Encoding UTF8

Write-Host "🚀 تشغيل المشروع..." -ForegroundColor Green
npm run dev`;

fs.writeFileSync('fix-swc-issue.ps1', powershellFix);
console.log('✅ تم إنشاء ملف fix-swc-issue.ps1');

console.log('\n🎉 تم إنشاء ملفات الإصلاح!');
console.log('\n📋 الحلول المتاحة:');
console.log('1. install-node18.bat - تثبيت Node.js 18 (الأفضل)');
console.log('2. fix-swc-issue.bat - إصلاح مشكلة SWC مع Node.js الحالي');
console.log('3. fix-swc-issue.ps1 - إصلاح مشكلة SWC مع PowerShell');
