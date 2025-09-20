import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './supabase/prisma'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>

export async function registerUser(data: RegisterData) {
  const { email, username, password } = data

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  })

  if (existingUser) {
    throw new Error('User with this email or username already exists')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    }
  })

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  }
}

export async function loginUser(data: LoginData) {
  const { email, password } = data

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Create session
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.session.create({
    data: {
      refreshToken: token,
      userId: user.id,
      expiresAt,
    }
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function logoutUser(token: string) {
  await prisma.session.deleteMany({
    where: { refreshToken: token }
  })
}
