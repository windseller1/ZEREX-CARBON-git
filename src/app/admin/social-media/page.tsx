'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from '@/components/ui/loader2';
import { Send } from '@/components/ui/send';
import { BarChart3 } from '@/components/ui/bar-chart3';
import { Users } from '@/components/ui/users';
import { Heart } from '@/components/ui/heart';
import { MessageCircle } from '@/components/ui/message-circle';
import { Share2 } from '@/components/ui/share2';
import { Eye } from '@/components/ui/eye';

interface SocialStats {
  platform: 'telegram' | 'twitter';
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  shares: number;
  likes: number;
  comments: number;
}

export default function SocialMediaPage() {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<SocialStats[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // تحميل الإحصائيات
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/social/telegram');
      const telegramData = await response.json();
      
      const twitterResponse = await fetch('/api/social/twitter');
      const twitterData = await twitterResponse.json();

      const allStats: SocialStats[] = [];
      if (telegramData.stats) allStats.push(telegramData.stats);
      if (twitterData.stats) allStats.push(twitterData.stats);
      
      setStats(allStats);
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'يرجى إدخال المحتوى' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/social/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, media }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'تم إرسال الرسالة بنجاح' });
        setContent('');
        setMedia([]);
        loadStats();
      } else {
        setMessage({ type: 'error', text: result.error || 'خطأ في إرسال الرسالة' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'خطأ في إرسال الرسالة' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTweet = async () => {
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'يرجى إدخال المحتوى' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/social/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, media }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'تم إرسال التغريدة بنجاح' });
        setContent('');
        setMedia([]);
        loadStats();
      } else {
        setMessage({ type: 'error', text: result.error || 'خطأ في إرسال التغريدة' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'خطأ في إرسال التغريدة' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendToAll = async () => {
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'يرجى إدخال المحتوى' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const [telegramResponse, twitterResponse] = await Promise.all([
        fetch('/api/social/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, media }),
        }),
        fetch('/api/social/twitter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, media }),
        }),
      ]);

      const telegramResult = await telegramResponse.json();
      const twitterResult = await twitterResponse.json();

      const successCount = [telegramResult.success, twitterResult.success].filter(Boolean).length;
      
      if (successCount > 0) {
        setMessage({ type: 'success', text: `تم إرسال الرسالة إلى ${successCount} منصة بنجاح` });
        setContent('');
        setMedia([]);
        loadStats();
      } else {
        setMessage({ type: 'error', text: 'فشل في إرسال الرسالة إلى جميع المنصات' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'خطأ في إرسال الرسالة' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة وسائل التواصل الاجتماعي</h1>
        <p className="text-gray-600 mt-2">إدارة المحتوى والإحصائيات لجميع منصات التواصل الاجتماعي</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* إحصائيات المنصات */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                إحصائيات المنصات
              </CardTitle>
              <CardDescription>نظرة عامة على أداء جميع المنصات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{stat.platform}</h3>
                    <Badge variant="secondary">
                      {stat.platform === 'telegram' ? 'التلغرام' : 'تويتر'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{stat.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>{stat.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <span>{stat.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-purple-500" />
                      <span>{stat.shares.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* إنشاء المحتوى */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء المحتوى</CardTitle>
              <CardDescription>إنشاء وإرسال المحتوى إلى منصات التواصل الاجتماعي</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compose">إنشاء</TabsTrigger>
                  <TabsTrigger value="telegram">التلغرام</TabsTrigger>
                  <TabsTrigger value="twitter">تويتر</TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المحتوى
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="اكتب محتوى الرسالة هنا..."
                      rows={4}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {content.length}/280 حرف
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوسائط (اختياري)
                    </label>
                    <Input
                      type="url"
                      placeholder="رابط الصورة أو الفيديو"
                      value={media[0] || ''}
                      onChange={(e) => setMedia([e.target.value])}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={sendToAll}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      إرسال للجميع
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="telegram" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رسالة التلغرام
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="اكتب رسالة التلغرام هنا..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    إرسال إلى التلغرام
                  </Button>
                </TabsContent>

                <TabsContent value="twitter" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التغريدة
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="اكتب التغريدة هنا..."
                      rows={4}
                      className="w-full"
                      maxLength={280}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {content.length}/280 حرف
                    </p>
                  </div>

                  <Button
                    onClick={sendTweet}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    إرسال إلى تويتر
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
