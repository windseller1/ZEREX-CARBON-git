# نظام الصيانة التلقائية لموقع Zyra Carbon
Write-Host "🔧 نظام الصيانة التلقائية لموقع Zyra Carbon" -ForegroundColor Green
Write-Host ""

# إنشاء مجلدات الصيانة
if (!(Test-Path "backups")) { New-Item -ItemType Directory -Path "backups" }
if (!(Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" }

# تشغيل الصيانة الأسبوعية
Write-Host "📦 تشغيل الصيانة الأسبوعية..." -ForegroundColor Yellow
node weekly-maintenance.js --run-now

# تنظيف الملفات المؤقتة
Write-Host "🧹 تنظيف الملفات المؤقتة..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "temp") { Remove-Item -Recurse -Force "temp" }

# تحديث التبعيات
Write-Host "🔄 تحديث التبعيات..." -ForegroundColor Yellow
npm update

# إصلاح المشاكل الشائعة
Write-Host "🔧 إصلاح المشاكل الشائعة..." -ForegroundColor Yellow
if (!(Test-Path ".env")) { Copy-Item ".env.example" ".env" }
if (!(Test-Path "next.config.js")) { 
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
}
if (!(Test-Path ".babelrc")) { 
    $babelrc = @"
{
  "presets": ["next/babel"],
  "plugins": []
}
"@
    $babelrc | Out-File -FilePath ".babelrc" -Encoding UTF8
}

# إصلاح قاعدة البيانات
Write-Host "🗄️ إصلاح قاعدة البيانات..." -ForegroundColor Yellow
npx prisma db push --skip-generate

# تشغيل الاختبارات
Write-Host "🧪 تشغيل الاختبارات..." -ForegroundColor Yellow
npm test

# بناء المشروع
Write-Host "🏗️ بناء المشروع..." -ForegroundColor Yellow
npm run build

Write-Host "✅ تمت الصيانة بنجاح!" -ForegroundColor Green
Write-Host "📊 تم حفظ النتائج في مجلد logs" -ForegroundColor Cyan
Write-Host ""

Read-Host "اضغط Enter للخروج"
