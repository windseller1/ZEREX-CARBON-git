@echo off
echo 🔧 إصلاح مشكلة SWC مع Node.js v24.8.0...
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

pause