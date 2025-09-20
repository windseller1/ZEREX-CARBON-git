# استخدام Node.js 18 LTS
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
CMD ["npm", "start"]