// تكاملات وسائل التواصل الاجتماعي
export interface SocialPost {
  id: string;
  platform: 'telegram' | 'twitter';
  content: string;
  media?: string[];
  scheduledAt?: Date;
  publishedAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface SocialStats {
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

// تكامل التلغرام
export class TelegramIntegration {
  private botToken: string;
  private channelId: string;

  constructor(botToken: string, channelId: string) {
    this.botToken = botToken;
    this.channelId = channelId;
  }

  // إرسال رسالة إلى القناة
  async sendMessage(content: string, media?: string[]): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      
      const payload = {
        chat_id: this.channelId,
        text: content,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('خطأ في إرسال رسالة التلغرام:', error);
      return false;
    }
  }

  // إرسال صورة مع نص
  async sendPhoto(photo: string, caption: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendPhoto`;
      
      const payload = {
        chat_id: this.channelId,
        photo: photo,
        caption: caption,
        parse_mode: 'HTML'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('خطأ في إرسال صورة التلغرام:', error);
      return false;
    }
  }

  // إرسال فيديو مع نص
  async sendVideo(video: string, caption: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendVideo`;
      
      const payload = {
        chat_id: this.channelId,
        video: video,
        caption: caption,
        parse_mode: 'HTML'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('خطأ في إرسال فيديو التلغرام:', error);
      return false;
    }
  }

  // الحصول على إحصائيات القناة
  async getChannelStats(): Promise<SocialStats | null> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/getChat`;
      
      const payload = {
        chat_id: this.channelId
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.ok) {
        return {
          platform: 'telegram',
          followers: result.result.member_count || 0,
          engagement: 0, // يتطلب API إضافي
          reach: 0,
          impressions: 0,
          clicks: 0,
          shares: 0,
          likes: 0,
          comments: 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في الحصول على إحصائيات التلغرام:', error);
      return null;
    }
  }
}

// تكامل تويتر
export class TwitterIntegration {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;
  private bearerToken: string;

  constructor(
    apiKey: string,
    apiSecret: string,
    accessToken: string,
    accessTokenSecret: string,
    bearerToken: string
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = accessToken;
    this.accessTokenSecret = accessTokenSecret;
    this.bearerToken = bearerToken;
  }

  // إرسال تغريدة
  async sendTweet(content: string, media?: string[]): Promise<boolean> {
    try {
      const url = 'https://api.twitter.com/2/tweets';
      
      const payload = {
        text: content,
        ...(media && media.length > 0 && { media: { media_ids: media } })
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      return result.data ? true : false;
    } catch (error) {
      console.error('خطأ في إرسال تغريدة:', error);
      return false;
    }
  }

  // رفع صورة
  async uploadMedia(imageData: string): Promise<string | null> {
    try {
      const url = 'https://upload.twitter.com/1.1/media/upload.json';
      
      const formData = new FormData();
      formData.append('media', imageData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
        body: formData
      });

      const result = await response.json();
      return result.media_id_string || null;
    } catch (error) {
      console.error('خطأ في رفع صورة تويتر:', error);
      return null;
    }
  }

  // الحصول على إحصائيات الحساب
  async getAccountStats(): Promise<SocialStats | null> {
    try {
      const url = 'https://api.twitter.com/2/users/me?user.fields=public_metrics';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        }
      });

      const result = await response.json();
      
      if (result.data) {
        const metrics = result.data.public_metrics;
        return {
          platform: 'twitter',
          followers: metrics.followers_count || 0,
          engagement: 0, // يتطلب API إضافي
          reach: 0,
          impressions: 0,
          clicks: 0,
          shares: metrics.retweet_count || 0,
          likes: metrics.like_count || 0,
          comments: metrics.reply_count || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في الحصول على إحصائيات تويتر:', error);
      return null;
    }
  }
}

// مدير وسائل التواصل الاجتماعي
export class SocialMediaManager {
  private telegram: TelegramIntegration | null = null;
  private twitter: TwitterIntegration | null = null;

  constructor() {
    // تهيئة التكاملات من متغيرات البيئة
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID) {
      this.telegram = new TelegramIntegration(
        process.env.TELEGRAM_BOT_TOKEN,
        process.env.TELEGRAM_CHANNEL_ID
      );
    }

    if (
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET &&
      process.env.TWITTER_BEARER_TOKEN
    ) {
      this.twitter = new TwitterIntegration(
        process.env.TWITTER_API_KEY,
        process.env.TWITTER_API_SECRET,
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_TOKEN_SECRET,
        process.env.TWITTER_BEARER_TOKEN
      );
    }
  }

  // إرسال رسالة إلى جميع المنصات
  async broadcastMessage(content: string, media?: string[]): Promise<{
    telegram: boolean;
    twitter: boolean;
  }> {
    const results = {
      telegram: false,
      twitter: false
    };

    // إرسال إلى التلغرام
    if (this.telegram) {
      if (media && media.length > 0) {
        results.telegram = await this.telegram.sendPhoto(media[0], content);
      } else {
        results.telegram = await this.telegram.sendMessage(content);
      }
    }

    // إرسال إلى تويتر
    if (this.twitter) {
      let mediaIds: string[] = [];
      if (media && media.length > 0) {
        for (const mediaUrl of media) {
          const mediaId = await this.twitter.uploadMedia(mediaUrl);
          if (mediaId) mediaIds.push(mediaId);
        }
      }
      results.twitter = await this.twitter.sendTweet(content, mediaIds);
    }

    return results;
  }

  // الحصول على إحصائيات جميع المنصات
  async getAllStats(): Promise<SocialStats[]> {
    const stats: SocialStats[] = [];

    if (this.telegram) {
      const telegramStats = await this.telegram.getChannelStats();
      if (telegramStats) stats.push(telegramStats);
    }

    if (this.twitter) {
      const twitterStats = await this.twitter.getAccountStats();
      if (twitterStats) stats.push(twitterStats);
    }

    return stats;
  }

  // إرسال إشعار معاملة جديدة
  async notifyNewTransaction(transaction: {
    id: string;
    amount: number;
    currency: string;
    type: 'buy' | 'sell';
    user: string;
  }): Promise<void> {
    const content = `🔄 معاملة جديدة في Zyra Carbon!

💰 المبلغ: ${transaction.amount} ${transaction.currency}
📊 النوع: ${transaction.type === 'buy' ? 'شراء' : 'بيع'}
👤 المستخدم: ${transaction.user}
🆔 المعرف: ${transaction.id}

#ZyraCarbon #CarbonTrading #Sustainability`;

    await this.broadcastMessage(content);
  }

  // إرسال إشعار NFT جديد
  async notifyNewNFT(nft: {
    id: string;
    name: string;
    price: number;
    currency: string;
    image: string;
  }): Promise<void> {
    const content = `🎨 NFT جديد في Zyra Carbon!

🖼️ الاسم: ${nft.name}
💰 السعر: ${nft.price} ${nft.currency}
🆔 المعرف: ${nft.id}

#ZyraCarbon #NFT #CarbonCredits #Sustainability`;

    await this.broadcastMessage(content, [nft.image]);
  }

  // إرسال تحديثات السوق
  async notifyMarketUpdate(update: {
    price: number;
    currency: string;
    change: number;
    changePercent: number;
  }): Promise<void> {
    const emoji = update.change >= 0 ? '📈' : '📉';
    const content = `${emoji} تحديث سوق الكربون!

💰 السعر الحالي: ${update.price} ${update.currency}
📊 التغيير: ${update.change >= 0 ? '+' : ''}${update.change} (${update.changePercent >= 0 ? '+' : ''}${update.changePercent}%)

#ZyraCarbon #CarbonMarket #Sustainability`;

    await this.broadcastMessage(content);
  }
}

// إنشاء مثيل مدير وسائل التواصل الاجتماعي
export const socialMediaManager = new SocialMediaManager();
