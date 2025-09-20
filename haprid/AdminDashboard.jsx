import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Bell, 
  Wallet, 
  CreditCard, 
  Building2, 
  Plus, 
  Settings, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Banknote,
  Link,
  Unlink,
  Eye,
  EyeOff
} from 'lucide-react'

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'معاملة جديدة', message: 'تم إتمام معاملة بقيمة 1,500 ريال', time: '5 دقائق', read: false },
    { id: 2, type: 'warning', title: 'تحديث مطلوب', message: 'يتطلب تحديث إعدادات البنك', time: '15 دقيقة', read: false },
    { id: 3, type: 'info', title: 'مستخدم جديد', message: 'انضم مستخدم جديد للمنصة', time: '30 دقيقة', read: true },
    { id: 4, type: 'error', title: 'خطأ في الاتصال', message: 'فشل الاتصال بالبنك الأهلي', time: '1 ساعة', read: false }
  ])

  const [connectedBanks, setConnectedBanks] = useState([
    { id: 1, name: 'البنك الأهلي السعودي', type: 'الحساب الجاري', balance: '125,000', currency: 'ريال', status: 'متصل', lastSync: '2024-01-15 14:30' },
    { id: 2, name: 'بنك الراجحي', type: 'حساب التوفير', balance: '85,500', currency: 'ريال', status: 'متصل', lastSync: '2024-01-15 14:25' }
  ])

  const [availableBanks] = useState([
    { id: 'ncb', name: 'البنك الأهلي السعودي', logo: '🏦', supported: true },
    { id: 'rajhi', name: 'بنك الراجحي', logo: '🏛️', supported: true },
    { id: 'samba', name: 'بنك سامبا', logo: '🏢', supported: true },
    { id: 'riyad', name: 'بنك الرياض', logo: '🏪', supported: true },
    { id: 'fransi', name: 'البنك السعودي الفرنسي', logo: '🏦', supported: true },
    { id: 'anb', name: 'البنك العربي الوطني', logo: '🏛️', supported: true }
  ])

  const [walletBalance, setWalletBalance] = useState({
    total: '210,500',
    available: '185,300',
    pending: '25,200',
    currency: 'ريال'
  })

  const [showBalance, setShowBalance] = useState(true)
  const [selectedBank, setSelectedBank] = useState('')

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const connectBank = () => {
    if (selectedBank) {
      const bank = availableBanks.find(b => b.id === selectedBank)
      // Simulate bank connection
      alert(`جاري الاتصال بـ ${bank.name}...`)
      setSelectedBank('')
    }
  }

  const disconnectBank = (bankId) => {
    setConnectedBanks(connectedBanks.filter(bank => bank.id !== bankId))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
            <p className="text-gray-600">إدارة المحفظة والتنبيهات والبنوك المتصلة</p>
          </div>
          
          {/* Notifications Bell */}
          <div className="relative">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المحفظة</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? `${walletBalance.total} ${walletBalance.currency}` : '••••••'}
              </div>
              <p className="text-xs text-muted-foreground">+2.5% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الرصيد المتاح</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? `${walletBalance.available} ${walletBalance.currency}` : '••••••'}
              </div>
              <p className="text-xs text-muted-foreground">جاهز للاستخدام</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المعاملات المعلقة</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? `${walletBalance.pending} ${walletBalance.currency}` : '••••••'}
              </div>
              <p className="text-xs text-muted-foreground">قيد المعالجة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">البنوك المتصلة</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedBanks.length}</div>
              <p className="text-xs text-muted-foreground">بنك متصل</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallet">المحفظة</TabsTrigger>
            <TabsTrigger value="banks">البنوك</TabsTrigger>
            <TabsTrigger value="notifications">التنبيهات</TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>إدارة المحفظة</CardTitle>
                    <CardDescription>عرض وإدارة أرصدة المحفظة الرقمية</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Balance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">الرصيد الإجمالي</p>
                        <p className="text-2xl font-bold text-green-700">
                          {showBalance ? `${walletBalance.total} ${walletBalance.currency}` : '••••••'}
                        </p>
                      </div>
                      <Wallet className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">المتاح للسحب</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {showBalance ? `${walletBalance.available} ${walletBalance.currency}` : '••••••'}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600">قيد المعالجة</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {showBalance ? `${walletBalance.pending} ${walletBalance.currency}` : '••••••'}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    إيداع أموال
                  </Button>
                  <Button variant="outline">
                    <Banknote className="h-4 w-4 mr-2" />
                    سحب أموال
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    تحويل أموال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banks Tab */}
          <TabsContent value="banks" className="space-y-6">
            
            {/* Add New Bank */}
            <Card>
              <CardHeader>
                <CardTitle>ربط بنك جديد</CardTitle>
                <CardDescription>اختر البنك الذي تريد ربطه بمحفظتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="bank-select">اختر البنك</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البنك..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBanks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            <div className="flex items-center gap-2">
                              <span>{bank.logo}</span>
                              <span>{bank.name}</span>
                              {!bank.supported && <Badge variant="secondary">قريباً</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={connectBank} disabled={!selectedBank}>
                      <Link className="h-4 w-4 mr-2" />
                      ربط البنك
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Banks */}
            <Card>
              <CardHeader>
                <CardTitle>البنوك المتصلة</CardTitle>
                <CardDescription>إدارة البنوك المربوطة بمحفظتك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedBanks.map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{bank.name}</h3>
                          <p className="text-sm text-gray-600">{bank.type}</p>
                          <p className="text-xs text-gray-500">آخر مزامنة: {bank.lastSync}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {showBalance ? `${bank.balance} ${bank.currency}` : '••••••'}
                          </p>
                          <Badge variant={bank.status === 'متصل' ? 'default' : 'secondary'}>
                            {bank.status}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectBank(bank.id)}
                          >
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>التنبيهات</CardTitle>
                    <CardDescription>إدارة التنبيهات والإشعارات</CardDescription>
                  </div>
                  <Badge variant="secondary">{unreadCount} غير مقروء</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 mr-4">
                            {notification.time}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard

