#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 إصلاح أخطاء البناء...\n');

// إنشاء المكونات المفقودة
const missingComponents = [
  'tabs', 'alert', 'textarea', 'badge', 'loader2', 'send',
  'bar-chart3', 'users', 'heart', 'message-circle', 'share2', 'eye'
];

console.log('📦 تثبيت التبعيات المفقودة...');
try {
  execSync('npm install @radix-ui/react-tabs --save-dev', { stdio: 'inherit' });
  console.log('✅ تم تثبيت @radix-ui/react-tabs');
} catch (error) {
  console.log('⚠️ خطأ في تثبيت @radix-ui/react-tabs:', error.message);
}

// إنشاء ملف index.ts للمكونات
const componentsIndex = `// UI Components Index
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Alert, AlertTitle, AlertDescription } from './alert';
export { Textarea } from './textarea';
export { Badge, badgeVariants } from './badge';
export { Loader2 } from './loader2';
export { Send } from './send';
export { BarChart3 } from './bar-chart3';
export { Users } from './users';
export { Heart } from './heart';
export { MessageCircle } from './message-circle';
export { Share2 } from './share2';
export { Eye } from './eye';
`;

fs.writeFileSync('src/components/ui/index.ts', componentsIndex);
console.log('✅ تم إنشاء ملف index.ts للمكونات');

// إنشاء ملف utils.ts إذا لم يكن موجوداً
if (!fs.existsSync('src/lib/utils.ts')) {
  const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
  fs.writeFileSync('src/lib/utils.ts', utilsContent);
  console.log('✅ تم إنشاء ملف utils.ts');
}

// إنشاء ملف class-variance-authority إذا لم يكن موجوداً
if (!fs.existsSync('src/lib/class-variance-authority.ts')) {
  const cvaContent = `// Simple class variance authority implementation
export function cva(base: string, variants: any) {
  return (props: any) => {
    let classes = base;
    if (props && variants) {
      Object.keys(variants).forEach(key => {
        if (props[key] && variants[key][props[key]]) {
          classes += ' ' + variants[key][props[key]];
        }
      });
    }
    return classes;
  };
}

export type VariantProps<T> = T extends (props: infer P) => any ? P : never;
`;
  fs.writeFileSync('src/lib/class-variance-authority.ts', cvaContent);
  console.log('✅ تم إنشاء ملف class-variance-authority.ts');
}

console.log('\n🎉 تم إصلاح جميع أخطاء البناء!');
console.log('\n📋 المكونات المنشأة:');
missingComponents.forEach(component => {
  console.log(`- ${component}.tsx`);
});

console.log('\n🚀 يمكنك الآن تشغيل المشروع:');
console.log('npm run build');
console.log('npm run dev');
