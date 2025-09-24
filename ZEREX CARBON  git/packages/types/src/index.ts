// User Types
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

// Wallet Types
export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

// Carbon Credit Types
export interface CarbonCredit {
  id: string
  projectId: string
  projectName: string
  description?: string
  amount: number
  price: number
  status: CreditStatus
  type: CreditType
  standard: string
  vintage: number
  country: string
  region?: string
  methodology?: string
  co2Reduction: number
  ownerId?: string
  owner?: User
  createdAt: string
  updatedAt: string
}

export enum CreditStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RETIRED = 'RETIRED',
  PENDING = 'PENDING'
}

export enum CreditType {
  FORESTRY = 'FORESTRY',
  RENEWABLE_ENERGY = 'RENEWABLE_ENERGY',
  ENERGY_EFFICIENCY = 'ENERGY_EFFICIENCY',
  WASTE_MANAGEMENT = 'WASTE_MANAGEMENT',
  TRANSPORTATION = 'TRANSPORTATION',
  AGRICULTURE = 'AGRICULTURE'
}

// Transaction Types
export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  price: number
  total: number
  status: TransactionStatus
  currency: string
  description?: string
  reference?: string
  metadata?: any
  userId: string
  walletId: string
  carbonCreditId?: string
  user?: User
  wallet?: Wallet
  carbonCredit?: CarbonCredit
  createdAt: string
  updatedAt: string
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// Market Types
export interface MarketPrice {
  id: string
  price: number
  change: number
  volume: number
  timestamp: string
}

export interface MarketStats {
  totalCredits: number
  availableCredits: number
  totalVolume: number
  averagePrice: number
  priceChange: number
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  metadata?: any
  createdAt: string
}

export enum NotificationType {
  TRANSACTION = 'TRANSACTION',
  PRICE_ALERT = 'PRICE_ALERT',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING'
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  firstName: string
  lastName: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Filter Types
export interface CarbonCreditFilters {
  page?: number
  limit?: number
  type?: CreditType
  country?: string
  minPrice?: number
  maxPrice?: number
  standard?: string
  vintage?: number
}

export interface TransactionFilters {
  page?: number
  limit?: number
  type?: TransactionType
  status?: TransactionStatus
  userId?: string
}

// Chart Data Types
export interface ChartDataPoint {
  x: number | string
  y: number
  label?: string
}

export interface PriceChartData {
  prices: ChartDataPoint[]
  volume: ChartDataPoint[]
  change: number
  period: string
}

// Alert Types
export interface PriceAlert {
  id: string
  userId: string
  type: AlertType
  targetPrice: number
  isActive: boolean
  createdAt: string
}

export enum AlertType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  VOLUME_ABOVE = 'VOLUME_ABOVE'
}

// KYC Types
export interface KycDocument {
  id: string
  userId: string
  type: DocumentType
  status: DocumentStatus
  documentUrl: string
  metadata?: any
  reviewedAt?: string
  reviewedBy?: string
  createdAt: string
  updatedAt: string
}

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  UTILITY_BILL = 'UTILITY_BILL',
  BANK_STATEMENT = 'BANK_STATEMENT'
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
