'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Alert } from '@/components/ui/Alert'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'
import { Loading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'commission' | 'refund'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  timestamp: string
  bankAccount?: string
  reference?: string
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  currency: string
  isActive: boolean
  balance: number
}

interface WalletStats {
  totalBalance: number
  availableBalance: number
  pendingAmount: number
  totalEarnings: number
  monthlyEarnings: number
  transactionCount: number
}

export default function AdminWalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [stats, setStats] = useState<WalletStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    currency: 'EUR'
  })
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    bankAccount: '',
    description: ''
  })

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setStats({
        totalBalance: 125000.50,
        availableBalance: 118750.25,
        pendingAmount: 6250.25,
        totalEarnings: 250000.75,
        monthlyEarnings: 15000.30,
        transactionCount: 1247
      })

      setTransactions([
        {
          id: '1',
          type: 'commission',
          amount: 1250.50,
          currency: 'EUR',
          status: 'completed',
          description: 'عمولة من بيع NFT #1234',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'withdrawal',
          amount: 5000.00,
          currency: 'EUR',
          status: 'completed',
          description: 'سحب إلى البنك الأهلي',
          timestamp: '2024-01-14T14:20:00Z',
          bankAccount: '****1234'
        },
        {
          id: '3',
          type: 'deposit',
          amount: 10000.00,
          currency: 'EUR',
          status: 'completed',
          description: 'إيداع من Stripe',
          timestamp: '2024-01-13T09:15:00Z'
        }
      ])

      setBankAccounts([
        {
          id: '1',
          bankName: 'البنك الأهلي السعودي',
          accountNumber: '****1234',
          accountHolder: 'Zyra Carbon Ltd',
          currency: 'EUR',
          isActive: true,
          balance: 50000.00
        },
        {
          id: '2',
          bankName: 'Deutsche Bank',
          accountNumber: '****5678',
          accountHolder: 'Zyra Carbon Ltd',
          currency: 'EUR',
          isActive: true,
          balance: 75000.50
        }
      ])
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBankAccount = async () => {
    try {
      // API call to add bank account
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        ...newBankAccount,
        isActive: true,
        balance: 0
      }
      
      setBankAccounts(prev => [...prev, newAccount])
      setShowAddBankModal(false)
      setNewBankAccount({
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        currency: 'EUR'
      })
    } catch (error) {
      console.error('Error adding bank account:', error)
    }
  }

  const handleWithdraw = async () => {
    try {
      // API call to process withdrawal
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: parseFloat(withdrawData.amount),
        currency: 'EUR',
        status: 'pending',
        description: withdrawData.description,
        timestamp: new Date().toISOString(),
        bankAccount: withdrawData.bankAccount
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      setShowWithdrawModal(false)
      setWithdrawData({
        amount: '',
        bankAccount: '',
        description: ''
      })
    } catch (error) {
      console.error('Error processing withdrawal:', error)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰'
      case 'withdrawal': return '💸'
      case 'commission': return '💼'
      case 'refund': return '↩️'
      default: return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      case 'cancelled': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل'
      case 'pending': return 'قيد المراجعة'
      case 'failed': return 'فشل'
      case 'cancelled': return 'ملغي'
      default: return status
    }
  }

  if (loading) {
    return <Loading size="lg" text="جاري تحميل بيانات المحفظة..." />
  }

  const tabs = [
    {
      id: 'overview',
      name: 'نظرة عامة',
      icon: '📊',
      content: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Text size="sm" color="muted">إجمالي الرصيد</Text>
                    <Heading size="lg" className="mt-1">
                      {stats?.totalBalance.toLocaleString()} EUR
                    </Heading>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Text size="sm" color="muted">الرصيد المتاح</Text>
                    <Heading size="lg" className="mt-1">
                      {stats?.availableBalance.toLocaleString()} EUR
                    </Heading>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Text size="sm" color="muted">المبلغ المعلق</Text>
                    <Heading size="lg" className="mt-1">
                      {stats?.pendingAmount.toLocaleString()} EUR
                    </Heading>
                  </div>
                  <div className="text-2xl">⏳</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Text size="sm" color="muted">إجمالي الأرباح</Text>
                    <Heading size="lg" className="mt-1">
                      {stats?.totalEarnings.toLocaleString()} EUR
                    </Heading>
                  </div>
                  <div className="text-2xl">📈</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Earnings Chart */}
          <Card>
            <CardHeader>
              <Heading size="lg">الأرباح الشهرية</Heading>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text>هذا الشهر</Text>
                  <Text weight="bold">{stats?.monthlyEarnings.toLocaleString()} EUR</Text>
                </div>
                <Progress value={75} />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <Text size="sm">الهدف: 20,000 EUR</Text>
                  <Text size="sm">75%</Text>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'transactions',
      name: 'المعاملات',
      icon: '📋',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Heading size="lg">سجل المعاملات</Heading>
            <Button onClick={() => setShowWithdrawModal(true)}>
              سحب أموال
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>النوع</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{getTransactionIcon(transaction.type)}</span>
                      <Text size="sm">
                        {transaction.type === 'deposit' ? 'إيداع' :
                         transaction.type === 'withdrawal' ? 'سحب' :
                         transaction.type === 'commission' ? 'عمولة' : 'استرداد'}
                      </Text>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text weight="bold">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(transaction.status)}>
                      {getStatusText(transaction.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Text size="sm">{transaction.description}</Text>
                  </TableCell>
                  <TableCell>
                    <Text size="sm">
                      {new Date(transaction.timestamp).toLocaleDateString('ar-SA')}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      تفاصيل
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    },
    {
      id: 'banks',
      name: 'الحسابات البنكية',
      icon: '🏦',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Heading size="lg">الحسابات البنكية</Heading>
            <Button onClick={() => setShowAddBankModal(true)}>
              إضافة حساب بنكي
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Heading size="md">{account.bankName}</Heading>
                      <Text size="sm" color="muted">{account.accountNumber}</Text>
                    </div>
                    <Badge variant={account.isActive ? 'success' : 'secondary'}>
                      {account.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text size="sm">صاحب الحساب:</Text>
                      <Text size="sm" weight="medium">{account.accountHolder}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm">الرصيد:</Text>
                      <Text size="sm" weight="bold">
                        {account.balance.toLocaleString()} {account.currency}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm">العملة:</Text>
                      <Text size="sm">{account.currency}</Text>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {account.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Heading size="2xl">إدارة المحفظة المالية</Heading>
          <Text color="muted" className="mt-2">
            إدارة الأموال والمعاملات المالية للمنصة
          </Text>
        </div>

        <Tabs tabs={tabs} />

        {/* Add Bank Account Modal */}
        <Modal
          isOpen={showAddBankModal}
          onClose={() => setShowAddBankModal(false)}
          title="إضافة حساب بنكي جديد"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="اسم البنك"
              value={newBankAccount.bankName}
              onChange={(e) => setNewBankAccount(prev => ({ ...prev, bankName: e.target.value }))}
              placeholder="أدخل اسم البنك"
            />
            
            <Input
              label="رقم الحساب"
              value={newBankAccount.accountNumber}
              onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="أدخل رقم الحساب"
            />
            
            <Input
              label="صاحب الحساب"
              value={newBankAccount.accountHolder}
              onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountHolder: e.target.value }))}
              placeholder="أدخل اسم صاحب الحساب"
            />
            
            <Select
              label="العملة"
              value={newBankAccount.currency}
              onChange={(e) => setNewBankAccount(prev => ({ ...prev, currency: e.target.value }))}
              options={[
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'GBP', label: 'British Pound (GBP)' }
              ]}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddBankModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleAddBankAccount}>
                إضافة الحساب
              </Button>
            </div>
          </div>
        </Modal>

        {/* Withdraw Modal */}
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          title="سحب أموال"
          size="md"
        >
          <div className="space-y-4">
            <Select
              label="الحساب البنكي"
              value={withdrawData.bankAccount}
              onChange={(e) => setWithdrawData(prev => ({ ...prev, bankAccount: e.target.value }))}
              options={bankAccounts.map(account => ({
                value: account.id,
                label: `${account.bankName} - ${account.accountNumber}`
              }))}
            />
            
            <Input
              label="المبلغ"
              type="number"
              value={withdrawData.amount}
              onChange={(e) => setWithdrawData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="أدخل المبلغ المراد سحبه"
            />
            
            <Input
              label="الوصف"
              value={withdrawData.description}
              onChange={(e) => setWithdrawData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف العملية (اختياري)"
            />

            <Alert variant="info">
              <Text size="sm">
                سيتم معالجة طلب السحب خلال 1-3 أيام عمل. سيتم خصم رسوم معالجة قدرها 2.5% من المبلغ.
              </Text>
            </Alert>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawModal(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleWithdraw}>
                تأكيد السحب
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
