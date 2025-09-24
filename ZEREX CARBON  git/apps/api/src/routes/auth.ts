import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const { email, username, firstName, lastName, password, phone } = value

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
    throw createError('User with this email or username already exists', 409)
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      firstName,
      lastName,
      phone,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true
    }
  })

  // Create wallet for user
  await prisma.wallet.create({
    data: {
      userId: user.id,
      balance: 0,
      currency: 'USD'
    }
  })

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.status(201).json({
    message: 'User registered successfully',
    user,
    token
  })
}))

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const { email, password } = value

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      wallets: true
    }
  })

  if (!user) {
    throw createError('Invalid email or password', 401)
  }

  if (!user.isActive) {
    throw createError('Account is deactivated', 401)
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401)
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      wallets: user.wallets
    },
    token
  })
}))

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError('No token provided', 401)
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      wallets: true,
      _count: {
        select: {
          transactions: true,
          carbonCredits: true
        }
      }
    }
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      wallets: user.wallets,
      stats: user._count
    }
  })
}))

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { token } = req.body

  if (!token) {
    throw createError('No token provided', 401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      throw createError('Invalid token', 401)
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      token: newToken
    })
  } catch (error) {
    throw createError('Invalid token', 401)
  }
}))

export default router
