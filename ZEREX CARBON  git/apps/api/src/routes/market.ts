import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// Get market overview
router.get('/overview', asyncHandler(async (req, res) => {
  const [
    totalCredits,
    availableCredits,
    totalVolume,
    averagePrice,
    priceChange,
    topProjects,
    recentTransactions
  ] = await Promise.all([
    prisma.carbonCredit.count(),
    prisma.carbonCredit.count({ where: { status: 'AVAILABLE' } }),
    prisma.carbonCredit.aggregate({
      _sum: { amount: true },
      where: { status: 'AVAILABLE' }
    }),
    prisma.carbonCredit.aggregate({
      _avg: { price: true },
      where: { status: 'AVAILABLE' }
    }),
    prisma.marketPrice.findFirst({
      orderBy: { timestamp: 'desc' }
    }),
    prisma.carbonCredit.groupBy({
      by: ['projectName', 'type', 'country'],
      _sum: { amount: true },
      _avg: { price: true },
      where: { status: 'AVAILABLE' },
      orderBy: { _sum: { amount: 'desc' } },
      take: 10
    }),
    prisma.transaction.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: {
            username: true,
            firstName: true,
            lastName: true
          }
        },
        carbonCredit: {
          select: {
            projectName: true,
            type: true
          }
        }
      }
    })
  ])

  res.json({
    marketStats: {
      totalCredits,
      availableCredits,
      totalVolume: totalVolume._sum.amount || 0,
      averagePrice: averagePrice._avg.price || 0,
      priceChange: priceChange?.change || 0
    },
    topProjects,
    recentTransactions
  })
}))

// Get market prices history
router.get('/prices', asyncHandler(async (req, res) => {
  const { period = '24h', limit = 100 } = req.query

  let dateFilter: any = {}
  const now = new Date()

  switch (period) {
    case '1h':
      dateFilter.gte = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case '24h':
      dateFilter.gte = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      dateFilter.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      dateFilter.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
  }

  const prices = await prisma.marketPrice.findMany({
    where: {
      timestamp: dateFilter
    },
    orderBy: { timestamp: 'desc' },
    take: Number(limit)
  })

  res.json({
    period,
    prices: prices.reverse() // Return in chronological order
  })
}))

// Get market statistics by type
router.get('/stats/by-type', asyncHandler(async (req, res) => {
  const stats = await prisma.carbonCredit.groupBy({
    by: ['type'],
    _count: { type: true },
    _sum: { 
      amount: true,
      co2Reduction: true
    },
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
    where: { status: 'AVAILABLE' }
  })

  res.json({ stats })
}))

// Get market statistics by country
router.get('/stats/by-country', asyncHandler(async (req, res) => {
  const stats = await prisma.carbonCredit.groupBy({
    by: ['country'],
    _count: { country: true },
    _sum: { 
      amount: true,
      co2Reduction: true
    },
    _avg: { price: true },
    where: { status: 'AVAILABLE' }
  })

  res.json({ stats })
}))

// Get market statistics by standard
router.get('/stats/by-standard', asyncHandler(async (req, res) => {
  const stats = await prisma.carbonCredit.groupBy({
    by: ['standard'],
    _count: { standard: true },
    _sum: { 
      amount: true,
      co2Reduction: true
    },
    _avg: { price: true },
    where: { status: 'AVAILABLE' }
  })

  res.json({ stats })
}))

// Get price alerts (user's alerts)
router.get('/alerts', asyncHandler(async (req, res) => {
  // This would typically be stored in a separate alerts table
  // For now, we'll return a mock response
  res.json({
    alerts: [
      {
        id: '1',
        type: 'PRICE_ABOVE',
        targetPrice: 50.00,
        currentPrice: 45.67,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'PRICE_BELOW',
        targetPrice: 40.00,
        currentPrice: 45.67,
        isActive: true,
        createdAt: new Date()
      }
    ]
  })
}))

// Create price alert
router.post('/alerts', asyncHandler(async (req, res) => {
  const { type, targetPrice, isActive = true } = req.body

  if (!['PRICE_ABOVE', 'PRICE_BELOW', 'VOLUME_ABOVE'].includes(type)) {
    throw createError('Invalid alert type', 400)
  }

  if (!targetPrice || targetPrice <= 0) {
    throw createError('Invalid target price', 400)
  }

  // In a real application, you would store this in a database
  const alert = {
    id: Date.now().toString(),
    userId: req.user!.id,
    type,
    targetPrice,
    isActive,
    createdAt: new Date()
  }

  res.status(201).json({
    message: 'Price alert created successfully',
    alert
  })
}))

// Get market news/updates
router.get('/news', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query

  // In a real application, this would come from a news API or database
  const news = [
    {
      id: '1',
      title: 'Carbon Credit Prices Reach New High',
      summary: 'Global carbon credit prices have reached a new all-time high due to increased demand from corporations.',
      publishedAt: new Date(),
      source: 'Carbon Market News'
    },
    {
      id: '2',
      title: 'New Forest Conservation Project Approved',
      summary: 'A new forest conservation project in Brazil has been approved, adding 100,000 carbon credits to the market.',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      source: 'Environmental News'
    },
    {
      id: '3',
      title: 'EU Carbon Market Reforms Announced',
      summary: 'The European Union has announced new reforms to its carbon market, expected to impact global prices.',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      source: 'EU News'
    }
  ]

  res.json({
    news: news.slice(0, Number(limit))
  })
}))

// Get market trends
router.get('/trends', asyncHandler(async (req, res) => {
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
  }

  const trends = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as transaction_count,
      SUM(total) as total_volume,
      AVG(price) as average_price,
      SUM(amount) as total_credits
    FROM transactions 
    WHERE created_at >= ${dateFilter.gte || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
    AND status = 'COMPLETED'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `

  res.json({
    period,
    trends
  })
}))

export default router
