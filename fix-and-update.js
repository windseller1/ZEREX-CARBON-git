#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 بدء إصلاح وتحديث مشروع Zyra Carbon...\n');

// 1. إصلاح مشكلة SWC
function fixSWCIssue() {
  console.log('📦 إصلاح مشكلة SWC...');
  
  // إنشاء ملف .babelrc
  const babelrc = {
    "presets": ["next/babel"],
    "plugins": []
  };
  
  fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2));
  console.log('✅ تم إنشاء ملف .babelrc');
  
  // تحديث next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;`;
  
  fs.writeFileSync('next.config.js', nextConfig);
  console.log('✅ تم تحديث next.config.js');
}

// 2. إصلاح مشكلة Prisma مع SQLite
function fixPrismaIssue() {
  console.log('🗄️ إصلاح مشكلة Prisma...');
  
  const schemaPath = 'prisma/schema.prisma';
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // إزالة enums غير مدعومة في SQLite
  schema = schema.replace(/enum Role \{[^}]*\}/g, '');
  schema = schema.replace(/enum NFTStatus \{[^}]*\}/g, '');
  
  // تحديث النماذج لاستخدام strings
  schema = schema.replace(/role\s+Role\s+@default\(USER\)/g, 'role          String   @default("USER")');
  schema = schema.replace(/status\s+NFTStatus\s+@default\(LISTED\)/g, 'status          String    @default("LISTED")');
  
  fs.writeFileSync(schemaPath, schema);
  console.log('✅ تم إصلاح Prisma schema');
}

// 3. إصلاح مشكلة TypeScript
function fixTypeScriptIssue() {
  console.log('📝 إصلاح مشكلة TypeScript...');
  
  const tsconfig = {
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "es6"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": false,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [
        {
          "name": "next"
        }
      ],
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    "include": [
      "next-env.d.ts",
      "**/*.ts",
      "**/*.tsx",
      ".next/types/**/*.ts"
    ],
    "exclude": [
      "node_modules"
    ]
  };
  
  fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
  console.log('✅ تم تحديث tsconfig.json');
}

// 4. إصلاح مشكلة package.json
function fixPackageJson() {
  console.log('📦 إصلاح package.json...');
  
  const packageJson = {
    "name": "zyra-carbon",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "db:push": "prisma db push",
      "db:studio": "prisma studio",
      "db:generate": "prisma generate",
      "fix": "node fix-and-update.js"
    },
    "dependencies": {
      "@hookform/resolvers": "^3.3.2",
      "@prisma/client": "^5.14.0",
      "@supabase/supabase-js": "^2.43.0",
      "bcryptjs": "^2.4.3",
      "ethers": "^6.13.0",
      "jose": "^5.4.0",
      "jsonwebtoken": "^9.0.2",
      "next": "14.2.3",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "react": "^18",
      "react-dom": "^18",
      "react-hook-form": "^7.51.5",
      "react-hot-toast": "^2.4.1",
      "stripe": "^15.10.0",
      "zod": "^3.23.8",
      "axios": "^1.6.0",
      "date-fns": "^2.30.0",
      "recharts": "^2.8.0",
      "framer-motion": "^10.16.0",
      "lucide-react": "^0.294.0",
      "class-variance-authority": "^0.7.0",
      "cmdk": "^0.2.0",
      "vaul": "^0.7.0",
      "sonner": "^1.2.0",
      "embla-carousel-react": "^8.0.0",
      "react-day-picker": "^8.9.0",
      "react-resizable-panels": "^0.0.55",
      "react-window": "^1.8.8",
      "react-window-infinite-loader": "^1.0.0",
      "react-intersection-observer": "^9.5.0",
      "react-use": "^17.4.0"
    },
    "devDependencies": {
      "@types/bcryptjs": "^2.4.6",
      "@types/jsonwebtoken": "^9.0.5",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "@types/react-window": "^1.8.8",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "prisma": "^5.14.0",
      "tailwindcss": "^3.4.3",
      "typescript": "^5",
      "@babel/core": "^7.23.0",
      "@babel/preset-env": "^7.23.0",
      "@babel/preset-react": "^7.22.0",
      "@babel/preset-typescript": "^7.23.0"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ تم تحديث package.json');
}

// 5. إصلاح مشكلة .env
function fixEnvFile() {
  console.log('🔐 إصلاح ملف .env...');
  
  const envContent = `# قاعدة البيانات
DATABASE_URL="file:./dev.db"

# المصادقة
NEXTAUTH_SECRET="your-secret-key-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key-32-characters-long"

# Supabase (اختياري)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Ethereum
NEXT_PUBLIC_ALCHEMY_KEY="your-alchemy-key"
NEXT_PUBLIC_IPFS_GATEWAY="https://ipfs.io/ipfs/"

# APIs الخارجية
OPEN_WEATHER_API_KEY="your-openweather-api-key"
CARBON_INTERFACE_API_KEY="your-carbon-interface-api-key"
EU_ETS_API_KEY="your-eu-ets-api-key"
WORLD_BANK_API_KEY="your-world-bank-api-key"
NASA_API_KEY="your-nasa-api-key"
NOAA_API_KEY="your-noaa-api-key"
VERRA_API_KEY="your-verra-api-key"
GOLD_STANDARD_API_KEY="your-gold-standard-api-key"

# PayPal (اختياري)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# إعدادات الأمان
ENCRYPTION_KEY="your-encryption-key-32-characters"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# إعدادات التطبيق
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Zyra Carbon"`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ تم إنشاء ملف .env');
}

// 6. إصلاح مشكلة Tailwind CSS
function fixTailwindCSS() {
  console.log('🎨 إصلاح Tailwind CSS...');
  
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}`;
  
  fs.writeFileSync('tailwind.config.js', tailwindConfig);
  console.log('✅ تم تحديث tailwind.config.js');
}

// 7. إصلاح مشكلة PostCSS
function fixPostCSS() {
  console.log('🔧 إصلاح PostCSS...');
  
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  
  fs.writeFileSync('postcss.config.js', postcssConfig);
  console.log('✅ تم تحديث postcss.config.js');
}

// 8. إصلاح مشكلة Prisma Client
function fixPrismaClient() {
  console.log('🗄️ إصلاح Prisma Client...');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ تم إصلاح Prisma Client');
  } catch (error) {
    console.log('⚠️ تحذير: فشل في إصلاح Prisma Client');
  }
}

// 9. إصلاح مشكلة قاعدة البيانات
function fixDatabase() {
  console.log('🗄️ إصلاح قاعدة البيانات...');
  
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ تم إصلاح قاعدة البيانات');
  } catch (error) {
    console.log('⚠️ تحذير: فشل في إصلاح قاعدة البيانات');
  }
}

// 10. إصلاح مشكلة التبعيات
function fixDependencies() {
  console.log('📦 إصلاح التبعيات...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ تم إصلاح التبعيات');
  } catch (error) {
    console.log('⚠️ تحذير: فشل في إصلاح التبعيات');
  }
}

// 11. إنشاء ملف تشغيل
function createStartScript() {
  console.log('🚀 إنشاء ملف التشغيل...');
  
  const startScript = `@echo off
echo 🔧 بدء تشغيل مشروع Zyra Carbon...
echo.

echo 📦 تثبيت التبعيات...
call npm install

echo 🗄️ إعداد قاعدة البيانات...
call npx prisma generate
call npx prisma db push

echo 🚀 تشغيل المشروع...
call npm run dev

pause`;
  
  fs.writeFileSync('start.bat', startScript);
  console.log('✅ تم إنشاء ملف start.bat');
}

// 12. إنشاء ملف تشغيل PowerShell
function createStartScriptPS() {
  console.log('🚀 إنشاء ملف التشغيل PowerShell...');
  
  const startScriptPS = `# بدء تشغيل مشروع Zyra Carbon
Write-Host "🔧 بدء تشغيل مشروع Zyra Carbon..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 تثبيت التبعيات..." -ForegroundColor Yellow
npm install

Write-Host "🗄️ إعداد قاعدة البيانات..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push

Write-Host "🚀 تشغيل المشروع..." -ForegroundColor Green
npm run dev`;
  
  fs.writeFileSync('start.ps1', startScriptPS);
  console.log('✅ تم إنشاء ملف start.ps1');
}

// 13. إنشاء ملف README محدث
function createUpdatedREADME() {
  console.log('📖 إنشاء README محدث...');
  
  const readme = `# Zyra Carbon - Carbon-NFT Marketplace

منصة تداول رصيد الكربون كـ NFTs في سوق شفاف وآمن مع إدارة متقدمة للمخاطر والتحليل الاقتصادي

## 🚀 التشغيل السريع

### Windows
\`\`\`bash
# تشغيل الملف التلقائي
start.bat

# أو تشغيل PowerShell
start.ps1
\`\`\`

### Linux/Mac
\`\`\`bash
# تشغيل الملف التلقائي
chmod +x start.sh
./start.sh
\`\`\`

## 🔧 إصلاح المشاكل

إذا واجهت أي مشاكل، قم بتشغيل:

\`\`\`bash
node fix-and-update.js
\`\`\`

## 📋 المتطلبات

- Node.js 18+
- npm أو yarn
- SQLite (مدمج)

## 🎯 الميزات

- 🏪 سوق NFT متقدم
- 🎨 إنشاء NFT سهل
- 👤 لوحة تحكم شاملة
- 🔐 نظام أمان متقدم
- 💰 نظام دفع متكامل
- 🌱 رصيد كربون موثق
- 🏦 إدارة محفظة الإدمن
- 🔗 تكامل مع المنصات الخارجية
- 📊 إدارة المخاطر
- 💹 التحليل الاقتصادي
- 🌍 جمع بيانات المناخ

## 🛠️ التطوير

\`\`\`bash
# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
npx prisma db push

# تشغيل المشروع
npm run dev
\`\`\`

## 📞 الدعم

إذا واجهت أي مشاكل، يرجى فتح issue في GitHub أو التواصل معنا.

---

**Zyra Carbon** - مستقبل تداول رصيد الكربون 🚀`;

  fs.writeFileSync('README.md', readme);
  console.log('✅ تم إنشاء README محدث');
}

// تشغيل جميع الإصلاحات
async function runAllFixes() {
  try {
    fixSWCIssue();
    fixPrismaIssue();
    fixTypeScriptIssue();
    fixPackageJson();
    fixEnvFile();
    fixTailwindCSS();
    fixPostCSS();
    createStartScript();
    createStartScriptPS();
    createUpdatedREADME();
    
    console.log('\n🎉 تم إصلاح جميع المشاكل بنجاح!');
    console.log('\n📋 الخطوات التالية:');
    console.log('1. قم بتشغيل: npm install');
    console.log('2. قم بتشغيل: npx prisma db push');
    console.log('3. قم بتشغيل: npm run dev');
    console.log('\nأو استخدم ملف start.bat للتشغيل التلقائي');
    
  } catch (error) {
    console.error('❌ حدث خطأ أثناء الإصلاح:', error.message);
  }
}

// تشغيل الإصلاحات
runAllFixes();
