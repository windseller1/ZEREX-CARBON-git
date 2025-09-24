import express from 'express'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// Validation schemas
const createCreditSchema = Joi.object({
  projectId: Joi.string().required(),
  projectName: Joi.string().required(),
  description: Joi.string().optional(),
  amount: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  type: Joi.string().valid('FORESTRY', 'RENEWABLE_ENERGY', 'ENERGY_EFFICIENCY', 'WASTE_MANAGEMENT', 'TRANSPORTATION', 'AGRICULTURE').required(),
  standard: Joi.string().required(),
  vintage: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
  country: Joi.string().required(),
  region: Joi.string().optional(),
  methodology: Joi.string().optional(),
  co2Reduction: Joi.number().positive().required()
})

const buyCreditSchema = Joi.object({
  creditId: Joi.string().required(),
  amount: Joi.number().positive().required()
})

// Get all available carbon credits
router.get('/credits', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    type, 
    country, 
    minPrice, 
    maxPrice,
    standard,
    vintage
  } = req.query

  const skip = (Number(page) - 1) * Number(limit)
  
  const where: any = {
    status: 'AVAILABLE'
  }

  if (type) where.type = type
  if (country) where.country = country
  if (standard) where.standard = standard
  if (vintage) where.vintage = Number(vintage)
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = Number(minPrice)
    if (maxPrice) where.price.lte = Number(maxPrice)
  }

  const [credits, total] = await Promise.all([
    prisma.carbonCredit.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    }),
    prisma.carbonCredit.count({ where })
  ])

  res.json({
    credits,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

// Get carbon credit by ID
router.get('/credits/:id', asyncHandler(async (req, res) => {
  const { id } = req.params

  const credit = await prisma.carbonCredit.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true
        }
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })

  if (!credit) {
    throw createError('Carbon credit not found', 404)
  }

  res.json({ credit })
}))

// Create new carbon credit (for project owners)
router.post('/credits', asyncHandler(async (req, res) => {
  const { error, value } = createCreditSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const credit = await prisma.carbonCredit.create({
    data: {
      ...value,
      ownerId: req.user!.id
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true
        }
      }
    }
  })

  res.status(201).json({
    message: 'Carbon credit created successfully',
    credit
  })
}))

// Buy carbon credit
router.post('/buy', asyncHandler(async (req, res) => {
  const { error, value } = buyCreditSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const { creditId, amount } = value

  // Get carbon credit
  const credit = await prisma.carbonCredit.findUnique({
    where: { id: creditId }
  })

  if (!credit) {
    throw createError('Carbon credit not found', 404)
  }

  if (credit.status !== 'AVAILABLE') {
    throw createError('Carbon credit is not available for purchase', 400)
  }

  if (credit.amount < amount) {
    throw createError('Insufficient carbon credits available', 400)
  }

  // Get user wallet
  const wallet = await prisma.wallet.findFirst({
    where: { userId: req.user!.id }
  })

  if (!wallet) {
    throw createError('Wallet not found', 404)
  }

  const totalCost = Number(credit.price) * amount

  if (Number(wallet.balance) < totalCost) {
    throw createError('Insufficient wallet balance', 400)
  }

  // Start transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update wallet balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: Number(wallet.balance) - totalCost
      }
    })

    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        type: 'BUY',
        amount,
        price: Number(credit.price),
        total: totalCost,
        status: 'COMPLETED',
        userId: req.user!.id,
        walletId: wallet.id,
        carbonCreditId: credit.id,
        description: `Purchased ${amount} carbon credits from ${credit.projectName}`
      }
    })

    // Update carbon credit
    if (credit.amount === amount) {
      // Full purchase - mark as sold
      await tx.carbonCredit.update({
        where: { id: credit.id },
        data: {
          status: 'SOLD',
          ownerId: req.user!.id
        }
      })
    } else {
      // Partial purchase - create new credit for remaining amount
      await tx.carbonCredit.update({
        where: { id: credit.id },
        data: {
          amount: Number(credit.amount) - amount
        }
      })

      // Create new credit for purchased amount
      await tx.carbonCredit.create({
        data: {
          projectId: credit.projectId,
          projectName: credit.projectName,
          description: credit.description,
          amount,
          price: Number(credit.price),
          status: 'SOLD',
          type: credit.type,
          standard: credit.standard,
          vintage: credit.vintage,
          country: credit.country,
          region: credit.region,
          methodology: credit.methodology,
          co2Reduction: Number(credit.co2Reduction) * (amount / Number(credit.amount)),
          ownerId: req.user!.id
        }
      })
    }

    return transaction
  })

  res.json({
    message: 'Carbon credit purchased successfully',
    transaction: result
  })
}))

// Get user's carbon credits
router.get('/my-credits', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {
    ownerId: req.user!.id
  }

  if (status) {
    where.status = status
  }

  const [credits, total] = await Promise.all([
    prisma.carbonCredit.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.carbonCredit.count({ where })
  ])

  res.json({
    credits,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

// Get carbon credit statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await prisma.$transaction([
    prisma.carbonCredit.count({
      where: { status: 'AVAILABLE' }
    }),
    prisma.carbonCredit.count({
      where: { status: 'SOLD' }
    }),
    prisma.carbonCredit.aggregate({
      _sum: {
        amount: true,
        co2Reduction: true
      },
      where: { status: 'AVAILABLE' }
    }),
    prisma.carbonCredit.aggregate({
      _avg: {
        price: true
      },
      where: { status: 'AVAILABLE' }
    })
  ])

  res.json({
    availableCredits: stats[0],
    soldCredits: stats[1],
    totalAvailableAmount: stats[2]._sum.amount || 0,
    totalCo2Reduction: stats[2]._sum.co2Reduction || 0,
    averagePrice: stats[3]._avg.price || 0
  })
}))

export default router
