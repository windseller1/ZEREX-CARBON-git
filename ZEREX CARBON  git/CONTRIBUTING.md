# دليل المساهمة - ZEREX CARBON

شكراً لك على اهتمامك بالمساهمة في ZEREX CARBON! 🎉

## 📋 جدول المحتويات

- [كيفية المساهمة](#كيفية-المساهمة)
- [إعداد البيئة المحلية](#إعداد-البيئة-المحلية)
- [معايير الكود](#معايير-الكود)
- [عملية إرسال التغييرات](#عملية-إرسال-التغييرات)
- [الإبلاغ عن الأخطاء](#الإبلاغ-عن-الأخطاء)
- [اقتراح ميزات جديدة](#اقتراح-ميزات-جديدة)
- [الترجمة](#الترجمة)

## 🤝 كيفية المساهمة

هناك عدة طرق للمساهمة في ZEREX CARBON:

### 🐛 الإبلاغ عن الأخطاء
- استخدم [GitHub Issues](https://github.com/your-username/zerex-carbon/issues)
- اتبع قالب الإبلاغ عن الأخطاء
- قدم معلومات مفصلة لإعادة إنتاج المشكلة

### ✨ اقتراح ميزات جديدة
- استخدم [GitHub Issues](https://github.com/your-username/zerex-carbon/issues)
- اتبع قالب اقتراح الميزة
- اشرح الفائدة والاستخدام المقصود

### 💻 المساهمة بالكود
- Fork المشروع
- أنشئ branch جديد للميزة
- اتبع معايير الكود
- أرسل Pull Request

### 📚 تحسين التوثيق
- تحسين README
- إضافة أمثلة للكود
- ترجمة التوثيق

### 🌍 الترجمة
- ترجمة الواجهة
- ترجمة التوثيق
- تحسين النصوص العربية

## 🛠️ إعداد البيئة المحلية

### المتطلبات
- Node.js 18+
- pnpm 8+
- Docker (اختياري)
- Flutter 3.10+ (للتطبيق المحمول)

### خطوات الإعداد

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/zerex-carbon.git
cd zerex-carbon
```

2. **تثبيت التبعيات**
```bash
pnpm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env.local
# قم بتعديل القيم في .env.local
```

4. **تشغيل قاعدة البيانات**
```bash
docker-compose up -d postgres redis
```

5. **إعداد قاعدة البيانات**
```bash
pnpm --filter @zerex-carbon/api db:push
pnpm --filter @zerex-carbon/api db:seed
```

6. **تشغيل التطبيقات**
```bash
pnpm dev
```

## 📝 معايير الكود

### TypeScript/JavaScript
- استخدم TypeScript في جميع الملفات الجديدة
- اتبع ESLint rules
- استخدم Prettier للتنسيق
- اكتب تعليقات واضحة باللغة العربية أو الإنجليزية

### React/Next.js
- استخدم Functional Components
- استخدم Hooks بدلاً من Class Components
- استخدم TypeScript interfaces للـ props
- اتبع Next.js best practices

### Flutter/Dart
- اتبع Dart style guide
- استخدم BLoC pattern للـ state management
- اكتب tests للوظائف المهمة
- استخدم meaningful names للمتغيرات

### CSS/Styling
- استخدم Tailwind CSS
- اتبع mobile-first approach
- استخدم CSS variables للألوان
- تأكد من accessibility

### قاعدة البيانات
- استخدم Prisma schema
- اكتب migrations واضحة
- استخدم meaningful names للجداول والأعمدة
- اتبع database best practices

## 🔄 عملية إرسال التغييرات

### 1. إنشاء Branch
```bash
git checkout -b feature/amazing-feature
# أو
git checkout -b fix/bug-description
```

### 2. إجراء التغييرات
- اكتب كود نظيف ومفهوم
- أضف tests إذا لزم الأمر
- حدث التوثيق إذا لزم الأمر

### 3. اختبار التغييرات
```bash
# تشغيل الاختبارات
pnpm test

# فحص الكود
pnpm lint

# فحص الأنواع
pnpm type-check
```

### 4. Commit التغييرات
```bash
git add .
git commit -m "feat: add amazing feature"
```

**معايير Commit Messages:**
- `feat:` للميزات الجديدة
- `fix:` لإصلاح الأخطاء
- `docs:` للتوثيق
- `style:` للتنسيق
- `refactor:` لإعادة هيكلة الكود
- `test:` للاختبارات
- `chore:` للمهام الروتينية

### 5. Push التغييرات
```bash
git push origin feature/amazing-feature
```

### 6. إنشاء Pull Request
- اذهب إلى GitHub repository
- انقر على "New Pull Request"
- املأ الوصف والتفاصيل
- اطلب مراجعة من maintainers

## 🐛 الإبلاغ عن الأخطاء

### قالب الإبلاغ عن الأخطاء
```markdown
## وصف المشكلة
وصف واضح ومختصر للمشكلة.

## خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. انقر على '...'
3. مرر لأسفل إلى '...'
4. شاهد الخطأ

## السلوك المتوقع
وصف واضح ومختصر لما كنت تتوقع حدوثه.

## لقطات الشاشة
إذا أمكن، أضف لقطات شاشة لمساعدتنا في فهم المشكلة.

## معلومات إضافية
- نظام التشغيل: [مثل Windows 10]
- المتصفح: [مثل Chrome 91]
- إصدار التطبيق: [مثل 1.0.0]

## سياق إضافي
أضف أي سياق آخر حول المشكلة هنا.
```

## ✨ اقتراح ميزات جديدة

### قالب اقتراح الميزة
```markdown
## هل اقتراحك متعلق بمشكلة؟
وصف واضح ومختصر للمشكلة. مثال: أنا محبط عندما [...]

## وصف الحل الذي تريده
وصف واضح ومختصر لما تريد أن يحدث.

## وصف البدائل التي فكرت بها
وصف واضح ومختصر لأي حلول أو ميزات بديلة فكرت بها.

## سياق إضافي
أضف أي سياق آخر أو لقطات شاشة حول اقتراح الميزة هنا.
```

## 🌍 الترجمة

### ترجمة الواجهة
- استخدم ملفات JSON للترجمة
- اتبع naming convention واضح
- تأكد من صحة الترجمة العربية
- اختبر الترجمة في الواجهة

### ترجمة التوثيق
- ترجم README و CONTRIBUTING
- استخدم لغة واضحة ومفهومة
- تأكد من صحة المصطلحات التقنية
- اختبر الروابط والمراجع

## 🧪 الاختبار

### كتابة الاختبارات
```typescript
// مثال على اختبار React component
import { render, screen } from '@testing-library/react'
import { CarbonCard } from './CarbonCard'

describe('CarbonCard', () => {
  it('renders carbon credit information', () => {
    const mockCredit = {
      id: '1',
      projectName: 'Test Project',
      price: 50.00,
      amount: 100
    }
    
    render(<CarbonCard credit={mockCredit} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })
})
```

### تشغيل الاختبارات
```bash
# اختبارات الويب
pnpm --filter @zerex-carbon/web test

# اختبارات API
pnpm --filter @zerex-carbon/api test

# اختبارات Flutter
cd apps/mobile
flutter test
```

## 📚 الموارد المفيدة

### الوثائق
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Flutter Documentation](https://flutter.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### الأدوات
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Docker Documentation](https://docs.docker.com)

## 🤔 الأسئلة الشائعة

### كيف أبدأ في المساهمة؟
ابدأ بقراءة هذا الدليل، ثم اختر issue بسيط من [Good First Issues](https://github.com/your-username/zerex-carbon/labels/good%20first%20issue).

### كيف أطلب مساعدة؟
- استخدم [GitHub Discussions](https://github.com/your-username/zerex-carbon/discussions)
- انضم إلى Discord server
- تواصل معنا عبر البريد الإلكتروني

### كيف أتأكد من أن مساهمتي ستُقبل؟
- اتبع معايير الكود
- اكتب tests للكود الجديد
- حدث التوثيق إذا لزم الأمر
- كن صبوراً مع عملية المراجعة

## 📞 التواصل

- **GitHub Issues**: [إنشاء issue جديد](https://github.com/your-username/zerex-carbon/issues)
- **GitHub Discussions**: [مناقشات المجتمع](https://github.com/your-username/zerex-carbon/discussions)
- **البريد الإلكتروني**: contributors@zerex-carbon.com
- **Discord**: [انضم إلى الخادم](https://discord.gg/zerex-carbon)

## 🙏 شكر وتقدير

شكراً لجميع المساهمين الذين يجعلون ZEREX CARBON أفضل! 🎉

---

<div align="center">
  <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
  <p>© 2024 ZEREX CARBON. جميع الحقوق محفوظة.</p>
</div>
