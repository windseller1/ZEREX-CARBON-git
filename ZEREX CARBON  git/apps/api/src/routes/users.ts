import express from 'express'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// Validation schemas
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional(),
  avatar: Joi.string().uri().optional()
})

// Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      wallets: true,
      _count: {
        select: {
          transactions: true,
          carbonCredits: true,
          kycDocuments: true
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
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      wallets: user.wallets,
      stats: user._count
    }
  })
}))

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: value,
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      isVerified: true,
      updatedAt: true
    }
  })

  res.json({
    message: 'Profile updated successfully',
    user
  })
}))

// Get user transactions
router.get('/transactions', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, status } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {
    userId: req.user!.id
  }

  if (type) where.type = type
  if (status) where.status = status

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        carbonCredit: {
          select: {
            id: true,
            projectName: true,
            type: true,
            standard: true
          }
        }
      }
    }),
    prisma.transaction.count({ where })
  ])

  res.json({
    transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

// Get user wallet
router.get('/wallet', asyncHandler(async (req, res) => {
  const wallet = await prisma.wallet.findFirst({
    where: { userId: req.user!.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!wallet) {
    throw createError('Wallet not found', 404)
  }

  res.json({ wallet })
}))

// Add funds to wallet
router.post('/wallet/deposit', asyncHandler(async (req, res) => {
  const { amount, paymentMethod } = req.body

  if (!amount || amount <= 0) {
    throw createError('Invalid amount', 400)
  }

  const wallet = await prisma.wallet.findFirst({
    where: { userId: req.user!.id }
  })

  if (!wallet) {
    throw createError('Wallet not found', 404)
  }

  // In a real application, you would integrate with a payment processor like Stripe
  // For now, we'll simulate a successful deposit
  const result = await prisma.$transaction(async (tx) => {
    // Update wallet balance
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: Number(wallet.balance) + Number(amount)
      }
    })

    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        type: 'DEPOSIT',
        amount: Number(amount),
        price: 1,
        total: Number(amount),
        status: 'COMPLETED',
        currency: wallet.currency,
        description: `Deposit via ${paymentMethod || 'bank transfer'}`,
        userId: req.user!.id,
        walletId: wallet.id
      }
    })

    return { wallet: updatedWallet, transaction }
  })

  res.json({
    message: 'Funds added successfully',
    wallet: result.wallet,
    transaction: result.transaction
  })
}))

// Withdraw funds from wallet
router.post('/wallet/withdraw', asyncHandler(async (req, res) => {
  const { amount, bankAccount } = req.body

  if (!amount || amount <= 0) {
    throw createError('Invalid amount', 400)
  }

  if (!bankAccount) {
    throw createError('Bank account information required', 400)
  }

  const wallet = await prisma.wallet.findFirst({
    where: { userId: req.user!.id }
  })

  if (!wallet) {
    throw createError('Wallet not found', 404)
  }

  if (Number(wallet.balance) < Number(amount)) {
    throw createError('Insufficient balance', 400)
  }

  // In a real application, you would integrate with a payment processor
  const result = await prisma.$transaction(async (tx) => {
    // Update wallet balance
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: Number(wallet.balance) - Number(amount)
      }
    })

    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        type: 'WITHDRAWAL',
        amount: Number(amount),
        price: 1,
        total: Number(amount),
        status: 'PENDING', // In real app, this would be processed
        currency: wallet.currency,
        description: `Withdrawal to ${bankAccount}`,
        userId: req.user!.id,
        walletId: wallet.id
      }
    })

    return { wallet: updatedWallet, transaction }
  })

  res.json({
    message: 'Withdrawal request submitted successfully',
    wallet: result.wallet,
    transaction: result.transaction
  })
}))

// Get user notifications
router.get('/notifications', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {
    userId: req.user!.id
  }

  if (unreadOnly === 'true') {
    where.isRead = false
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where })
  ])

  res.json({
    notifications,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

// Mark notification as read
router.put('/notifications/:id/read', asyncHandler(async (req, res) => {
  const { id } = req.params

  const notification = await prisma.notification.update({
    where: {
      id,
      userId: req.user!.id
    },
    data: {
      isRead: true
    }
  })

  res.json({
    message: 'Notification marked as read',
    notification
  })
}))

// Mark all notifications as read
router.put('/notifications/read-all', asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user!.id,
      isRead: false
    },
    data: {
      isRead: true
    }
  })

  res.json({
    message: 'All notifications marked as read'
  })
}))

export default router
