import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { PrismaClient } from '@prisma/client'

// Import routes
import authRoutes from './routes/auth'
import carbonRoutes from './routes/carbon'
import userRoutes from './routes/users'
import transactionRoutes from './routes/transactions'
import marketRoutes from './routes/market'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const prisma = new PrismaClient()

// WebSocket server for real-time price updates
const wss = new WebSocketServer({ server })

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(limiter)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/carbon', authMiddleware, carbonRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/transactions', authMiddleware, transactionRoutes)
app.use('/api/market', marketRoutes)

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established')
  
  // Send initial carbon price
  const sendPriceUpdate = () => {
    const price = 45.67 + (Math.random() - 0.5) * 2
    ws.send(JSON.stringify({
      type: 'price_update',
      data: {
        price: price.toFixed(2),
        timestamp: new Date().toISOString(),
        change: ((Math.random() - 0.5) * 2).toFixed(2)
      }
    }))
  }
  
  // Send price updates every 5 seconds
  const interval = setInterval(sendPriceUpdate, 5000)
  
  ws.on('close', () => {
    console.log('WebSocket connection closed')
    clearInterval(interval)
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
    clearInterval(interval)
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 ZEREX CARBON API Server running on port ${PORT}`)
  console.log(`📊 WebSocket server running for real-time updates`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

export default app
