#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cron = require('node-cron');

console.log('🔧 نظام الصيانة الأسبوعية التلقائية لموقع Zyra Carbon...\n');

// إعدادات الصيانة
const maintenanceConfig = {
  schedule: '0 2 * * 0', // كل يوم أحد الساعة 2:00 صباحاً
  backupPath: './backups',
  logPath: './logs',
  maxBackups: 4, // الاحتفاظ بـ 4 نسخ احتياطية
  autoUpdate: true,
  securityScan: true,
  performanceCheck: true
};

// إنشاء مجلدات الصيانة
function createMaintenanceDirectories() {
  const dirs = [maintenanceConfig.backupPath, maintenanceConfig.logPath];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ تم إنشاء مجلد: ${dir}`);
    }
  });
}

// إنشاء نسخة احتياطية
function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-${timestamp}`;
  const backupPath = path.join(maintenanceConfig.backupPath, backupName);
  
  console.log('📦 إنشاء نسخة احتياطية...');
  
  try {
    // إنشاء مجلد النسخة الاحتياطية
    fs.mkdirSync(backupPath, { recursive: true });
    
    // نسخ الملفات المهمة
    const filesToBackup = [
      'package.json',
      'next.config.js',
      '.babelrc',
      'prisma/schema.prisma',
      '.env.local',
      'src',
      'public'
    ];
    
    filesToBackup.forEach(file => {
      if (fs.existsSync(file)) {
        const destPath = path.join(backupPath, file);
        const destDir = path.dirname(destPath);
        
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        if (fs.statSync(file).isDirectory()) {
          execSync(`xcopy "${file}" "${destPath}" /E /I /H /Y`, { stdio: 'pipe' });
        } else {
          fs.copyFileSync(file, destPath);
        }
      }
    });
    
    console.log(`✅ تم إنشاء النسخة الاحتياطية: ${backupName}`);
    return backupName;
  } catch (error) {
    console.error('❌ خطأ في إنشاء النسخة الاحتياطية:', error.message);
    return null;
  }
}

// تنظيف النسخ الاحتياطية القديمة
function cleanOldBackups() {
  try {
    const backupDir = maintenanceConfig.backupPath;
    if (!fs.existsSync(backupDir)) return;
    
    const backups = fs.readdirSync(backupDir)
      .filter(item => item.startsWith('backup-'))
      .map(item => ({
        name: item,
        path: path.join(backupDir, item),
        time: fs.statSync(path.join(backupDir, item)).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    // حذف النسخ القديمة
    if (backups.length > maintenanceConfig.maxBackups) {
      const toDelete = backups.slice(maintenanceConfig.maxBackups);
      toDelete.forEach(backup => {
        fs.rmSync(backup.path, { recursive: true, force: true });
        console.log(`🗑️ تم حذف النسخة القديمة: ${backup.name}`);
      });
    }
  } catch (error) {
    console.error('❌ خطأ في تنظيف النسخ القديمة:', error.message);
  }
}

// فحص الأمان
function securityScan() {
  console.log('🔒 فحص الأمان...');
  
  try {
    // فحص التبعيات
    execSync('npm audit --audit-level=moderate', { stdio: 'pipe' });
    console.log('✅ فحص التبعيات مكتمل');
    
    // فحص ملفات الحساسة
    const sensitiveFiles = ['.env', '.env.local', 'package-lock.json'];
    sensitiveFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const mode = stats.mode & parseInt('777', 8);
        if (mode > parseInt('600', 8)) {
          console.log(`⚠️ تحذير: ملف ${file} لديه صلاحيات مفتوحة جداً`);
        }
      }
    });
    
    console.log('✅ فحص الأمان مكتمل');
  } catch (error) {
    console.error('❌ خطأ في فحص الأمان:', error.message);
  }
}

// فحص الأداء
function performanceCheck() {
  console.log('⚡ فحص الأداء...');
  
  try {
    // فحص حجم node_modules
    const nodeModulesSize = execSync('du -sh node_modules 2>nul || echo "0"', { encoding: 'utf8' });
    console.log(`📊 حجم node_modules: ${nodeModulesSize.trim()}`);
    
    // فحص ملفات كبيرة
    const largeFiles = execSync('find . -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -nr | head -10 2>nul || echo "لا توجد ملفات كبيرة"', { encoding: 'utf8' });
    console.log('📈 أكبر الملفات:');
    console.log(largeFiles);
    
    console.log('✅ فحص الأداء مكتمل');
  } catch (error) {
    console.error('❌ خطأ في فحص الأداء:', error.message);
  }
}

// تحديث التبعيات
function updateDependencies() {
  if (!maintenanceConfig.autoUpdate) return;
  
  console.log('🔄 تحديث التبعيات...');
  
  try {
    // فحص التحديثات المتاحة
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    const outdatedPackages = JSON.parse(outdated);
    
    if (Object.keys(outdatedPackages).length > 0) {
      console.log('📦 التحديثات المتاحة:');
      Object.keys(outdatedPackages).forEach(pkg => {
        const info = outdatedPackages[pkg];
        console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
      });
      
      // تحديث التبعيات
      execSync('npm update', { stdio: 'inherit' });
      console.log('✅ تم تحديث التبعيات');
    } else {
      console.log('✅ جميع التبعيات محدثة');
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث التبعيات:', error.message);
  }
}

// إصلاح المشاكل الشائعة
function fixCommonIssues() {
  console.log('🔧 إصلاح المشاكل الشائعة...');
  
  try {
    // إصلاح ملف package-lock.json
    if (fs.existsSync('package-lock.json')) {
      const lockContent = fs.readFileSync('package-lock.json', 'utf8');
      if (lockContent.includes('"lockfileVersion": 3')) {
        console.log('⚠️ تحديث package-lock.json...');
        execSync('npm install --package-lock-only', { stdio: 'pipe' });
      }
    }
    
    // إصلاح ملف .env
    if (!fs.existsSync('.env')) {
      console.log('📝 إنشاء ملف .env...');
      const envContent = `# Zyra Carbon Environment Variables
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_ALCHEMY_KEY="your-alchemy-key-here"
NEXT_PUBLIC_IPFS_GATEWAY="https://zyra-carbon.infura-ipfs.io"
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
`;
      fs.writeFileSync('.env', envContent);
    }
    
    // إصلاح قاعدة البيانات
    console.log('🗄️ إصلاح قاعدة البيانات...');
    execSync('npx prisma db push --skip-generate', { stdio: 'pipe' });
    
    console.log('✅ تم إصلاح المشاكل الشائعة');
  } catch (error) {
    console.error('❌ خطأ في إصلاح المشاكل:', error.message);
  }
}

// تسجيل نتائج الصيانة
function logMaintenanceResults(results) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    results,
    status: results.success ? 'success' : 'failed'
  };
  
  const logFile = path.join(maintenanceConfig.logPath, 'maintenance.log');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  
  console.log(`📝 تم تسجيل نتائج الصيانة: ${logFile}`);
}

// الصيانة الرئيسية
function runMaintenance() {
  console.log('🚀 بدء الصيانة الأسبوعية...\n');
  
  const results = {
    success: true,
    backup: null,
    security: false,
    performance: false,
    updates: false,
    fixes: false
  };
  
  try {
    // إنشاء المجلدات
    createMaintenanceDirectories();
    
    // إنشاء نسخة احتياطية
    results.backup = createBackup();
    
    // تنظيف النسخ القديمة
    cleanOldBackups();
    
    // فحص الأمان
    if (maintenanceConfig.securityScan) {
      securityScan();
      results.security = true;
    }
    
    // فحص الأداء
    if (maintenanceConfig.performanceCheck) {
      performanceCheck();
      results.performance = true;
    }
    
    // تحديث التبعيات
    updateDependencies();
    results.updates = true;
    
    // إصلاح المشاكل
    fixCommonIssues();
    results.fixes = true;
    
    console.log('\n✅ تمت الصيانة بنجاح!');
    
  } catch (error) {
    console.error('\n❌ فشلت الصيانة:', error.message);
    results.success = false;
  }
  
  // تسجيل النتائج
  logMaintenanceResults(results);
  
  return results;
}

// جدولة الصيانة التلقائية
function scheduleMaintenance() {
  console.log(`⏰ تم جدولة الصيانة التلقائية: ${maintenanceConfig.schedule}`);
  
  cron.schedule(maintenanceConfig.schedule, () => {
    console.log('\n🔄 بدء الصيانة المجدولة...');
    runMaintenance();
  });
  
  console.log('✅ الصيانة التلقائية نشطة');
}

// تشغيل الصيانة فوراً
if (process.argv.includes('--run-now')) {
  runMaintenance();
} else {
  scheduleMaintenance();
  console.log('\n💡 لتشغيل الصيانة فوراً، استخدم: node weekly-maintenance.js --run-now');
}

module.exports = {
  runMaintenance,
  createBackup,
  securityScan,
  performanceCheck,
  updateDependencies,
  fixCommonIssues
};
