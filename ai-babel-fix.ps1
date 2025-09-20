# 🤖 استخدام ذكاء اصطناعي لحل مشكلة SWC مع Babel
Write-Host "🤖 استخدام ذكاء اصطناعي لحل مشكلة SWC مع Babel..." -ForegroundColor Green
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
npm run dev