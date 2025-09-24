import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// Get all transactions (admin only)
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, status, userId } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {}

  if (type) where.type = type
  if (status) where.status = status
  if (userId) where.userId = userId

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
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

// Get transaction by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      carbonCredit: {
        select: {
          id: true,
          projectName: true,
          type: true,
          standard: true,
          vintage: true,
          country: true
        }
      }
    }
  })

  if (!transaction) {
    throw createError('Transaction not found', 404)
  }

  // Check if user can view this transaction
  if (req.user!.role !== 'ADMIN' && transaction.userId !== req.user!.id) {
    throw createError('Access denied', 403)
  }

  res.json({ transaction })
}))

// Update transaction status (admin only)
router.put('/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'].includes(status)) {
    throw createError('Invalid status', 400)
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id }
  })

  if (!transaction) {
    throw createError('Transaction not found', 404)
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      carbonCredit: {
        select: {
          id: true,
          projectName: true,
          type: true,
          standard: true
        }
      }
    }
  })

  // Create notification for user
  await prisma.notification.create({
    data: {
      userId: transaction.userId,
      type: 'TRANSACTION',
      title: 'Transaction Status Updated',
      message: `Your transaction has been ${status.toLowerCase()}`,
      metadata: {
        transactionId: id,
        status
      }
    }
  })

  res.json({
    message: 'Transaction status updated successfully',
    transaction: updatedTransaction
  })
}))

// Get transaction statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query

  let dateFilter: any = {}
  const now = new Date()

  switch (period) {
    case '7d':
      dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      dateFilter.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      dateFilter.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      dateFilter.gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
  }

  const where = {
    createdAt: dateFilter
  }

  const [
    totalTransactions,
    totalVolume,
    completedTransactions,
    pendingTransactions,
    failedTransactions,
    transactionTypes,
    dailyStats
  ] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.aggregate({
      _sum: { total: true },
      where: { ...where, status: 'COMPLETED' }
    }),
    prisma.transaction.count({ where: { ...where, status: 'COMPLETED' } }),
    prisma.transaction.count({ where: { ...where, status: 'PENDING' } }),
    prisma.transaction.count({ where: { ...where, status: 'FAILED' } }),
    prisma.transaction.groupBy({
      by: ['type'],
      _count: { type: true },
      _sum: { total: true },
      where
    }),
    prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(total) as volume
      FROM transactions 
      WHERE created_at >= ${dateFilter.gte || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `
  ])

  res.json({
    period,
    totalTransactions,
    totalVolume: totalVolume._sum.total || 0,
    completedTransactions,
    pendingTransactions,
    failedTransactions,
    successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0,
    transactionTypes,
    dailyStats
  })
}))

// Get transaction analytics
router.get('/analytics/trends', asyncHandler(async (req, res) => {
  const { type, period = '30d' } = req.query

  let dateFilter: any = {}
  const now = new Date()

  switch (period) {
    case '7d':
      dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      dateFilter.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      dateFilter.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      dateFilter.gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
  }

  const where: any = {
    createdAt: dateFilter
  }

  if (type) {
    where.type = type
  }

  const trends = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as transaction_count,
      SUM(total) as total_volume,
      AVG(price) as average_price,
      SUM(amount) as total_amount
    FROM transactions 
    WHERE created_at >= ${dateFilter.gte || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
    ${type ? `AND type = '${type}'` : ''}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `

  res.json({
    period,
    type: type || 'all',
    trends
  })
}))

export default router
