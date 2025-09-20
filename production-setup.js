#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 إعداد مشروع Zyra Carbon للإنتاج...\n');

// إعدادات الإنتاج
const productionConfig = {
  projectName: 'zyra-carbon',
  version: '1.0.0',
  description: 'Zyra Carbon - منصة تداول الكربون الأوروبية',
  author: 'Zyra Carbon Team',
  license: 'MIT',
  repository: 'https://github.com/zyra-carbon/zyra-carbon',
  homepage: 'https://zyra-carbon.com',
  keywords: ['carbon', 'trading', 'europe', 'nft', 'blockchain', 'climate'],
  engines: {
    node: '>=18.0.0',
    npm: '>=8.0.0'
  }
};

// إنشاء ملف package.json للإنتاج
function createProductionPackageJson() {
  console.log('📦 إنشاء package.json للإنتاج...');
  
  const packageJson = {
    name: productionConfig.projectName,
    version: productionConfig.version,
    description: productionConfig.description,
    author: productionConfig.author,
    license: productionConfig.license,
    repository: productionConfig.repository,
    homepage: productionConfig.homepage,
    keywords: productionConfig.keywords,
    engines: productionConfig.engines,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "type-check": "tsc --noEmit",
      "db:push": "prisma db push",
      "db:generate": "prisma generate",
      "db:studio": "prisma studio",
      "maintenance": "node weekly-maintenance.js",
      "backup": "node weekly-maintenance.js --run-now",
      "deploy": "npm run build && npm run start",
      "test": "jest",
      "test:watch": "jest --watch",
      "test:coverage": "jest --coverage"
    },
    dependencies: {
      "next": "^14.2.3",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.0.0",
      "@types/node": "^20.0.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "tailwindcss": "^3.3.0",
      "autoprefixer": "^10.4.0",
      "postcss": "^8.4.0",
      "prisma": "^5.0.0",
      "@prisma/client": "^5.0.0",
      "ethers": "^6.0.0",
      "alchemy-sdk": "^3.0.0",
      "ipfs-http-client": "^60.0.0",
      "stripe": "^14.0.0",
      "bcryptjs": "^2.4.3",
      "jsonwebtoken": "^9.0.0",
      "jose": "^5.0.0",
      "zod": "^3.22.0",
      "axios": "^1.6.0",
      "date-fns": "^2.30.0",
      "recharts": "^2.8.0",
      "framer-motion": "^10.16.0",
      "lucide-react": "^0.294.0",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "cmdk": "^0.2.0",
      "vaul": "^0.9.0",
      "sonner": "^1.2.0",
      "embla-carousel-react": "^8.0.0",
      "react-day-picker": "^8.9.0",
      "react-resizable-panels": "^0.0.55",
      "react-window": "^1.8.8",
      "react-window-infinite-loader": "^1.0.9",
      "react-intersection-observer": "^9.5.0",
      "react-use": "^17.4.0",
      "@hookform/resolvers": "^3.3.0",
      "react-hook-form": "^7.47.0"
    },
    devDependencies: {
      "@types/bcryptjs": "^2.4.0",
      "@types/jsonwebtoken": "^9.0.0",
      "@types/react-window": "^1.8.0",
      "@babel/core": "^7.23.0",
      "@babel/preset-env": "^7.23.0",
      "@babel/preset-react": "^7.22.0",
      "@babel/preset-typescript": "^7.23.0",
      "eslint": "^8.0.0",
      "eslint-config-next": "^14.2.3",
      "jest": "^29.0.0",
      "@testing-library/react": "^13.4.0",
      "@testing-library/jest-dom": "^6.0.0",
      "node-cron": "^3.0.0"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ تم إنشاء package.json للإنتاج');
}

// إنشاء ملف Dockerfile
function createDockerfile() {
  console.log('🐳 إنشاء Dockerfile...');
  
  const dockerfile = `# استخدام Node.js 18 LTS
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production

# نسخ الكود المصدري
COPY . .

# بناء التطبيق
RUN npm run build

# تعيين المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "start"]`;

  fs.writeFileSync('Dockerfile', dockerfile);
  console.log('✅ تم إنشاء Dockerfile');
}

// إنشاء ملف docker-compose.yml
function createDockerCompose() {
  console.log('🐳 إنشاء docker-compose.yml...');
  
  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./dev.db
    volumes:
      - ./data:/app/data
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=zyra_carbon
      - POSTGRES_USER=zyra_user
      - POSTGRES_PASSWORD=zyra_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:`;

  fs.writeFileSync('docker-compose.yml', dockerCompose);
  console.log('✅ تم إنشاء docker-compose.yml');
}

// إنشاء ملف .dockerignore
function createDockerIgnore() {
  console.log('🐳 إنشاء .dockerignore...');
  
  const dockerIgnore = `node_modules
npm-debug.log
.next
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.vercel
.DS_Store
*.log
coverage
.nyc_output
.cache
dist
build`;

  fs.writeFileSync('.dockerignore', dockerIgnore);
  console.log('✅ تم إنشاء .dockerignore');
}

// إنشاء ملف Vercel.json
function createVercelJson() {
  console.log('🚀 إنشاء vercel.json...');
  
  const vercelJson = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/$1"
      }
    ],
    "env": {
      "DATABASE_URL": "@database_url",
      "NEXTAUTH_SECRET": "@nextauth_secret",
      "NEXTAUTH_URL": "@nextauth_url",
      "NEXT_PUBLIC_ALCHEMY_KEY": "@alchemy_key",
      "NEXT_PUBLIC_IPFS_GATEWAY": "@ipfs_gateway",
      "STRIPE_PUBLIC_KEY": "@stripe_public_key",
      "STRIPE_SECRET_KEY": "@stripe_secret_key",
      "STRIPE_WEBHOOK_SECRET": "@stripe_webhook_secret"
    }
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2));
  console.log('✅ تم إنشاء vercel.json');
}

// إنشاء ملف Netlify.toml
function createNetlifyToml() {
  console.log('🌐 إنشاء netlify.toml...');
  
  const netlifyToml = `[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  NODE_ENV = "production"

[context.development.environment]
  NODE_ENV = "development"`;

  fs.writeFileSync('netlify.toml', netlifyToml);
  console.log('✅ تم إنشاء netlify.toml');
}

// إنشاء ملف GitHub Actions
function createGitHubActions() {
  console.log('🔄 إنشاء GitHub Actions...');
  
  const workflowsDir = '.github/workflows';
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }
  
  const ciYml = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: .next/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.ORG_ID }}
        vercel-project-id: \${{ secrets.PROJECT_ID }}
        working-directory: ./
        vercel-args: '--prod'`;

  fs.writeFileSync(path.join(workflowsDir, 'ci-cd.yml'), ciYml);
  console.log('✅ تم إنشاء GitHub Actions');
}

// إنشاء ملف README.md شامل
function createComprehensiveReadme() {
  console.log('📚 إنشاء README.md شامل...');
  
  const readme = `# 🌱 Zyra Carbon - منصة تداول الكربون الأوروبية

## 📋 نظرة عامة

Zyra Carbon هي منصة مبتكرة لتداول الكربون في السوق الأوروبي، تجمع بين التكنولوجيا المتقدمة والاستدامة البيئية. تتيح المنصة للمستخدمين تداول رصيد الكربون، إنشاء NFTs للكربون، وإدارة محافظهم المالية بطريقة آمنة ومستدامة.

## ✨ الميزات الرئيسية

### 🏪 السوق
- تداول رصيد الكربون في السوق الأوروبي
- إنشاء وبيع NFTs للكربون
- نظام مزاد ذكي للأسعار
- دعم العملات المشفرة والدفع التقليدي

### 👤 إدارة المستخدمين
- نظام تسجيل دخول آمن
- محافظ مالية متقدمة
- تتبع المعاملات والاستثمارات
- إشعارات فورية

### 🔧 الإدارة
- محفظة إدارية شاملة
- ربط البنوك والدفع الآمن
- إدارة المخاطر والتحليل الاقتصادي
- جمع بيانات المناخ التلقائي
- التكامل مع المنصات الخارجية

### 🔒 الأمان
- تشفير متقدم للمعاملات
- نظام مصادقة متعدد الطبقات
- حماية من التهكير
- تسجيل شامل للأنشطة

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14.2.3** - إطار React متقدم
- **TypeScript** - أمان الأنواع
- **Tailwind CSS** - تصميم متجاوب
- **Framer Motion** - الرسوم المتحركة

### Backend
- **Prisma** - إدارة قاعدة البيانات
- **PostgreSQL/SQLite** - قاعدة البيانات
- **Next.js API Routes** - واجهات برمجة التطبيقات

### Blockchain
- **Ethereum** - شبكة البلوك تشين
- **Ethers.js** - تفاعل مع الشبكة
- **IPFS** - تخزين لامركزي

### الدفع
- **Stripe** - الدفع التقليدي
- **Ethereum** - العملات المشفرة

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+ 
- npm 8+
- Git

### التثبيت
\`\`\`bash
# استنساخ المشروع
git clone https://github.com/zyra-carbon/zyra-carbon.git
cd zyra-carbon

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local

# إعداد قاعدة البيانات
npx prisma db push

# تشغيل المشروع
npm run dev
\`\`\`

### متغيرات البيئة
\`\`\`env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_ALCHEMY_KEY="your-alchemy-key"
NEXT_PUBLIC_IPFS_GATEWAY="https://zyra-carbon.infura-ipfs.io"
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
\`\`\`

## 📊 الصفحات المتاحة

### للمستخدمين
- **/** - الصفحة الرئيسية
- **/auth** - تسجيل الدخول/التسجيل
- **/marketplace** - سوق الكربون
- **/create** - إنشاء NFT جديد
- **/dashboard** - لوحة التحكم

### للإدارة
- **/admin/wallet** - إدارة المحفظة
- **/admin/integrations** - التكاملات الخارجية
- **/admin/risk-management** - إدارة المخاطر
- **/admin/economic-analysis** - التحليل الاقتصادي
- **/admin/climate-data** - بيانات المناخ

## 🔧 الصيانة

### الصيانة التلقائية
\`\`\`bash
# تشغيل الصيانة الأسبوعية
npm run maintenance

# تشغيل الصيانة فوراً
npm run backup
\`\`\`

### النسخ الاحتياطية
- يتم إنشاء نسخة احتياطية أسبوعياً تلقائياً
- يتم الاحتفاظ بـ 4 نسخ احتياطية
- يمكن الوصول للنسخ في مجلد \`./backups\`

## 🚀 النشر

### Vercel
\`\`\`bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# نشر المشروع
netlify deploy --prod
\`\`\`

### Docker
\`\`\`bash
# بناء الصورة
docker build -t zyra-carbon .

# تشغيل الحاوية
docker run -p 3000:3000 zyra-carbon
\`\`\`

## 📈 الأداء

### التحسينات
- تحميل تدريجي للمكونات
- ضغط الصور والملفات
- تخزين مؤقت ذكي
- تحسين قاعدة البيانات

### المراقبة
- تسجيل شامل للأخطاء
- مراقبة الأداء
- تنبيهات فورية

## 🔒 الأمان

### الحماية
- تشفير كامل للمعاملات
- مصادقة متعددة العوامل
- حماية من CSRF و XSS
- تسجيل شامل للأنشطة

### الامتثال
- متوافق مع GDPR
- معايير الأمان الأوروبية
- شهادات SSL/TLS

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) قبل البدء.

### إرشادات المساهمة
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت [رخصة MIT](LICENSE).

## 📞 الدعم

- **البريد الإلكتروني**: support@zyra-carbon.com
- **التلغرام**: @ZyraCarbon
- **تويتر**: @ZyraCarbon
- **الموقع**: https://zyra-carbon.com

## 🎯 الطريق المستقبلي

### الميزات القادمة
- [ ] تطبيق الهاتف المحمول
- [ ] دعم المزيد من العملات المشفرة
- [ ] تحليلات متقدمة
- [ ] تكامل مع المزيد من المنصات

### الأهداف
- أن نصبح المنصة الرائدة لتداول الكربون في أوروبا
- تحقيق تأثير إيجابي على البيئة
- توفير تجربة مستخدم استثنائية

---

**تم تطويره بـ ❤️ من قبل فريق Zyra Carbon**
`;

  fs.writeFileSync('README.md', readme);
  console.log('✅ تم إنشاء README.md شامل');
}

// إنشاء ملف CONTRIBUTING.md
function createContributingMd() {
  console.log('🤝 إنشاء CONTRIBUTING.md...');
  
  const contributing = `# 🤝 دليل المساهمة في Zyra Carbon

نرحب بمساهماتك في تطوير Zyra Carbon! هذا الدليل سيساعدك على المساهمة بفعالية.

## 🚀 البدء السريع

### 1. إعداد البيئة المحلية
\`\`\`bash
# استنساخ المشروع
git clone https://github.com/zyra-carbon/zyra-carbon.git
cd zyra-carbon

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local

# إعداد قاعدة البيانات
npx prisma db push
\`\`\`

### 2. تشغيل المشروع
\`\`\`bash
npm run dev
\`\`\`

## 📋 أنواع المساهمات

### 🐛 إصلاح الأخطاء
- تحديد المشكلة بوضوح
- إصلاح المشكلة
- إضافة اختبارات للتأكد من عدم تكرار المشكلة

### ✨ إضافة ميزات جديدة
- مناقشة الميزة مع الفريق أولاً
- إنشاء فرع جديد للميزة
- تطوير الميزة مع الاختبارات
- توثيق الميزة

### 📚 تحسين التوثيق
- تحسين README.md
- إضافة أمثلة للكود
- توثيق APIs الجديدة

### 🎨 تحسين التصميم
- تحسين واجهة المستخدم
- إضافة رسوم متحركة
- تحسين تجربة المستخدم

## 🔄 سير العمل

### 1. إنشاء Issue
- وصف المشكلة أو الميزة بوضوح
- إضافة التسميات المناسبة
- تحديد الأولوية

### 2. إنشاء فرع جديد
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

### 3. تطوير الميزة
- اتبع معايير الكود
- أضف اختبارات
- تأكد من عمل جميع الاختبارات

### 4. إنشاء Pull Request
- وصف التغييرات بوضوح
- ربط Issue ذي الصلة
- اطلب مراجعة من الفريق

## 📏 معايير الكود

### TypeScript
- استخدم TypeScript لجميع الملفات الجديدة
- أضف أنواع البيانات المناسبة
- تجنب استخدام \`any\`

### React
- استخدم Functional Components
- استخدم Hooks بدلاً من Class Components
- أضف PropTypes أو TypeScript types

### CSS
- استخدم Tailwind CSS
- اتبع معايير التصميم
- اجعل التصميم متجاوب

### قاعدة البيانات
- استخدم Prisma للاستعلامات
- أضف فهارس للاستعلامات المتكررة
- استخدم المعاملات للعمليات المعقدة

## 🧪 الاختبارات

### أنواع الاختبارات
- **Unit Tests**: اختبار الوحدات الفردية
- **Integration Tests**: اختبار التكامل
- **E2E Tests**: اختبار النهاية للنهاية

### تشغيل الاختبارات
\`\`\`bash
# جميع الاختبارات
npm test

# اختبارات مع التغطية
npm run test:coverage

# اختبارات في وضع المراقبة
npm run test:watch
\`\`\`

## 📝 الالتزامات (Commits)

### تنسيق الالتزامات
\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

### أنواع الالتزامات
- **feat**: ميزة جديدة
- **fix**: إصلاح خطأ
- **docs**: تحديث التوثيق
- **style**: تغييرات في التنسيق
- **refactor**: إعادة هيكلة الكود
- **test**: إضافة أو تعديل الاختبارات
- **chore**: مهام الصيانة

### أمثلة
\`\`\`
feat(auth): add two-factor authentication
fix(api): resolve database connection issue
docs(readme): update installation instructions
\`\`\`

## 🔍 مراجعة الكود

### للمراجعين
- راجع الكود بعناية
- تحقق من معايير الكود
- اختبر التغييرات محلياً
- قدم تعليقات بناءة

### للمطورين
- استجب للتعليقات بسرعة
- أصلح المشاكل المحددة
- اطلب توضيحات إذا لزم الأمر

## 🐛 الإبلاغ عن الأخطاء

### معلومات مطلوبة
- وصف واضح للمشكلة
- خطوات إعادة إنتاج المشكلة
- المتوقع مقابل ما يحدث فعلاً
- لقطات شاشة إن أمكن
- معلومات النظام

### قالب الإبلاغ
\`\`\`markdown
## وصف المشكلة
وصف واضح للمشكلة

## خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. انقر على '...'
3. لاحظ الخطأ

## المتوقع
ما كنت تتوقع حدوثه

## ما يحدث فعلاً
ما يحدث فعلاً

## لقطات الشاشة
إذا أمكن، أضف لقطات شاشة

## معلومات النظام
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
\`\`\`

## 💡 اقتراح الميزات

### معلومات مطلوبة
- وصف واضح للميزة
- سبب الحاجة للميزة
- أمثلة على الاستخدام
- التكامل مع الميزات الموجودة

### قالب الاقتراح
\`\`\`markdown
## وصف الميزة
وصف واضح للميزة المقترحة

## المشكلة التي تحلها
وصف المشكلة التي تحلها هذه الميزة

## الحل المقترح
وصف الحل المقترح

## البدائل
وصف البدائل الأخرى التي تم النظر فيها

## أمثلة على الاستخدام
أمثلة على كيفية استخدام الميزة

## التكامل
كيف تندمج هذه الميزة مع الميزات الموجودة
\`\`\`

## 📞 التواصل

### القنوات
- **GitHub Issues**: للمناقشات التقنية
- **Discord**: للدردشة السريعة
- **Email**: للمسائل الرسمية

### أوقات الاستجابة
- **Issues**: 24-48 ساعة
- **Pull Requests**: 48-72 ساعة
- **Discord**: خلال ساعات العمل

## 🎉 الاعتراف

سنعترف بجميع المساهمات في:
- README.md
- ملف CONTRIBUTORS
- إصدارات GitHub
- الموقع الرسمي

## 📄 الترخيص

بالمساهمة في هذا المشروع، توافق على أن مساهمتك ستكون مرخصة تحت نفس رخصة المشروع.

---

**شكراً لمساهمتك في جعل Zyra Carbon أفضل! 🌱**
`;

  fs.writeFileSync('CONTRIBUTING.md', contributing);
  console.log('✅ تم إنشاء CONTRIBUTING.md');
}

// تشغيل الإعداد
function runProductionSetup() {
  console.log('🚀 بدء إعداد المشروع للإنتاج...\n');
  
  try {
    createProductionPackageJson();
    createDockerfile();
    createDockerCompose();
    createDockerIgnore();
    createVercelJson();
    createNetlifyToml();
    createGitHubActions();
    createComprehensiveReadme();
    createContributingMd();
    
    console.log('\n✅ تم إعداد المشروع للإنتاج بنجاح!');
    console.log('\n📋 الملفات المنشأة:');
    console.log('- package.json (محدث)');
    console.log('- Dockerfile');
    console.log('- docker-compose.yml');
    console.log('- .dockerignore');
    console.log('- vercel.json');
    console.log('- netlify.toml');
    console.log('- .github/workflows/ci-cd.yml');
    console.log('- README.md (شامل)');
    console.log('- CONTRIBUTING.md');
    
    console.log('\n🚀 الخطوات التالية:');
    console.log('1. راجع الملفات المنشأة');
    console.log('2. حدث متغيرات البيئة');
    console.log('3. اختبر المشروع محلياً');
    console.log('4. انشر على المنصة المفضلة');
    
  } catch (error) {
    console.error('❌ خطأ في إعداد المشروع:', error.message);
  }
}

// تشغيل الإعداد
runProductionSetup();

module.exports = {
  runProductionSetup,
  createProductionPackageJson,
  createDockerfile,
  createDockerCompose,
  createVercelJson,
  createNetlifyToml,
  createGitHubActions
};
