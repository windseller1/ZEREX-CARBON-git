import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './supabase/prisma'

// إعدادات الأمان
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  JWT_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 دقيقة
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REQUIREMENTS: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  RATE_LIMITS: {
    login: { requests: 5, window: 15 * 60 * 1000 }, // 5 محاولات في 15 دقيقة
    api: { requests: 100, window: 60 * 1000 }, // 100 طلب في الدقيقة
    passwordReset: { requests: 3, window: 60 * 60 * 1000 } // 3 طلبات في الساعة
  }
}

// تشفير البيانات الحساسة
export function encryptData(data: string, key: string = SECURITY_CONFIG.JWT_SECRET): string {
  const cipher = crypto.createCipher('aes-256-cbc', key)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// فك تشفير البيانات
export function decryptData(encryptedData: string, key: string = SECURITY_CONFIG.JWT_SECRET): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// إنشاء هاش آمن للبيانات
export function createSecureHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// التحقق من قوة كلمة المرور
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const config = SECURITY_CONFIG.PASSWORD_REQUIREMENTS

  if (password.length < config.minLength) {
    errors.push(`كلمة المرور يجب أن تكون ${config.minLength} أحرف على الأقل`)
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل')
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل')
  }

  if (config.requireNumbers && !/\d/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
  }

  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// إنشاء كلمة مرور قوية
export function generateStrongPassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
  let password = ''
  
  // التأكد من وجود كل نوع من الأحرف
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*()'[Math.floor(Math.random() * 10)]
  
  // إكمال باقي الأحرف
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // خلط الأحرف
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// تشفير كلمة المرور
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// التحقق من كلمة المرور
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// إنشاء JWT token
export function createJWTToken(payload: any): string {
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: SECURITY_CONFIG.JWT_EXPIRES_IN,
    issuer: 'zyra-carbon',
    audience: 'zyra-carbon-users'
  })
}

// التحقق من JWT token
export function verifyJWTToken(token: string): any {
  try {
    return jwt.verify(token, SECURITY_CONFIG.JWT_SECRET, {
      issuer: 'zyra-carbon',
      audience: 'zyra-carbon-users'
    })
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// إنشاء refresh token
export function createRefreshToken(userId: string): string {
  const payload = {
    userId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000)
  }
  
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: SECURITY_CONFIG.REFRESH_TOKEN_EXPIRES_IN
  })
}

// إدارة محاولات تسجيل الدخول
export async function trackLoginAttempt(email: string, success: boolean): Promise<{
  isLocked: boolean
  remainingAttempts: number
  lockoutTime?: number
}> {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return { isLocked: false, remainingAttempts: 0 }
  }

  const now = new Date()
  const lockoutTime = new Date(user.updatedAt.getTime() + SECURITY_CONFIG.LOCKOUT_TIME)
  
  // التحقق من حالة القفل
  if (user.twoFactorEnabled && now < lockoutTime) {
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutTime: lockoutTime.getTime()
    }
  }

  if (success) {
    // إعادة تعيين عداد المحاولات عند النجاح
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false }
    })
    
    return { isLocked: false, remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS }
  } else {
    // زيادة عداد المحاولات الفاشلة
    const failedAttempts = (user.twoFactorEnabled ? 1 : 0) + 1
    
    if (failedAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      // قفل الحساب
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true }
      })
      
      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutTime: lockoutTime.getTime()
      }
    }
    
    return {
      isLocked: false,
      remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - failedAttempts
    }
  }
}

// إنشاء رمز التحقق
export function generateVerificationCode(length: number = 6): string {
  const digits = '0123456789'
  let code = ''
  
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * 10)]
  }
  
  return code
}

// إنشاء رمز استعادة كلمة المرور
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// التحقق من صحة الرمز
export function validateVerificationCode(code: string, storedCode: string): boolean {
  return code === storedCode
}

// إنشاء CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// التحقق من CSRF token
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken
}

// تنظيف البيانات من الهجمات
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // إزالة JavaScript
    .replace(/<[^>]*>/g, '') // إزالة HTML tags
    .replace(/[<>'"]/g, '') // إزالة الأحرف الخطيرة
    .trim()
}

// التحقق من صحة البريد الإلكتروني
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// إنشاء session آمن
export async function createSecureSession(userId: string, ipAddress: string, userAgent: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة
  
  await prisma.session.create({
    data: {
      id: sessionId,
      refreshToken: sessionId,
      userId,
      expiresAt,
      ipAddress,
      userAgent
    }
  })
  
  return sessionId
}

// التحقق من صحة الجلسة
export async function validateSession(sessionId: string, ipAddress: string): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  })
  
  if (!session || session.expiresAt < new Date()) {
    return false
  }
  
  // التحقق من عنوان IP (اختياري)
  if (session.ipAddress && session.ipAddress !== ipAddress) {
    return false
  }
  
  return true
}

// حذف الجلسة
export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId }
  })
}

// تنظيف الجلسات المنتهية الصلاحية
export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}

// تسجيل محاولات الأمان
export async function logSecurityEvent(
  eventType: string,
  userId: string | null,
  ipAddress: string,
  userAgent: string,
  details: any = {}
): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        eventType,
        userId,
        ipAddress,
        userAgent,
        details: JSON.stringify(details),
        timestamp: new Date()
      }
    })
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

// فحص الأمان الشامل
export async function performSecurityAudit(): Promise<{
  score: number
  issues: string[]
  recommendations: string[]
}> {
  const issues: string[] = []
  const recommendations: string[] = []
  
  try {
    // فحص كلمات المرور الضعيفة
    const weakPasswords = await prisma.user.findMany({
      where: {
        passwordHash: {
          not: null
        }
      }
    })
    
    for (const user of weakPasswords) {
      // هنا يمكن إضافة فحص أكثر تعقيداً لكلمات المرور
      if (user.passwordHash.length < 60) {
        issues.push(`كلمة مرور ضعيفة للمستخدم ${user.email}`)
        recommendations.push('تحديث كلمة المرور للمستخدم')
      }
    }
    
    // فحص الجلسات المنتهية الصلاحية
    const expiredSessions = await prisma.session.count({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    
    if (expiredSessions > 0) {
      issues.push(`${expiredSessions} جلسة منتهية الصلاحية`)
      recommendations.push('تنظيف الجلسات المنتهية الصلاحية')
    }
    
    // فحص محاولات تسجيل الدخول الفاشلة
    const recentFailedAttempts = await prisma.securityLog.count({
      where: {
        eventType: 'LOGIN_FAILED',
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // آخر 24 ساعة
        }
      }
    })
    
    if (recentFailedAttempts > 100) {
      issues.push(`${recentFailedAttempts} محاولة تسجيل دخول فاشلة في آخر 24 ساعة`)
      recommendations.push('مراجعة إعدادات الأمان')
    }
    
    // حساب نقاط الأمان
    const totalIssues = issues.length
    const score = Math.max(0, 100 - (totalIssues * 10))
    
    return {
      score,
      issues,
      recommendations
    }
  } catch (error) {
    console.error('Error performing security audit:', error)
    return {
      score: 0,
      issues: ['خطأ في فحص الأمان'],
      recommendations: ['مراجعة إعدادات قاعدة البيانات']
    }
  }
}
