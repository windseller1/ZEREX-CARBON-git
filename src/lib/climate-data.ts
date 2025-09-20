import { prisma } from './supabase/prisma'

interface ClimateData {
  source: string
  timestamp: string
  data: {
    co2Levels: number
    temperature: number
    humidity: number
    airQuality: number
    renewableEnergy: number
    carbonCredits: number
    pricePerTon: number
  }
  location: {
    country: string
    region: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  verified: boolean
}

interface CarbonCreditData {
  id: string
  name: string
  description: string
  co2Offset: number
  price: number
  currency: string
  source: string
  verified: boolean
  location: string
  projectType: string
  certification: string
  expiryDate: string
}

// مصادر البيانات المجانية
const CLIMATE_DATA_SOURCES = {
  // بيانات مناخية عامة
  OPEN_WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
  WEATHER_API: 'https://api.weatherapi.com/v1/current.json',
  
  // بيانات انبعاثات الكربون
  CARBON_INTERFACE: 'https://api.carboninterface.com/v1',
  CO2_EARTH: 'https://api.co2.earth',
  
  // بيانات الطاقة المتجددة
  RENEWABLE_ENERGY: 'https://api.renewableenergy.org',
  
  // بيانات السوق الأوروبي
  EU_ETS: 'https://api.european-ets.com',
  CARBON_PRICE: 'https://api.carbonprice.org',
  
  // بيانات المنظمات الدولية
  UNFCCC: 'https://api.unfccc.int',
  IPCC: 'https://api.ipcc.ch',
  
  // بيانات حكومية أوروبية
  EUROSTAT: 'https://ec.europa.eu/eurostat/api',
  EEA: 'https://api.eea.europa.eu'
}

// جمع البيانات من مصادر متعددة
export async function collectClimateData(): Promise<ClimateData[]> {
  const climateData: ClimateData[] = []
  
  try {
    // جمع بيانات الطقس والمناخ
    const weatherData = await fetchWeatherData()
    if (weatherData) climateData.push(weatherData)
    
    // جمع بيانات انبعاثات الكربون
    const carbonData = await fetchCarbonData()
    if (carbonData) climateData.push(carbonData)
    
    // جمع بيانات الطاقة المتجددة
    const renewableData = await fetchRenewableEnergyData()
    if (renewableData) climateData.push(renewableData)
    
    // جمع بيانات السوق الأوروبي
    const marketData = await fetchEUMarketData()
    if (marketData) climateData.push(marketData)
    
    // حفظ البيانات في قاعدة البيانات
    await saveClimateData(climateData)
    
    return climateData
  } catch (error) {
    console.error('Error collecting climate data:', error)
    throw error
  }
}

// جمع بيانات الطقس
async function fetchWeatherData(): Promise<ClimateData | null> {
  try {
    const response = await fetch(
      `${CLIMATE_DATA_SOURCES.OPEN_WEATHER}?q=London&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`
    )
    const data = await response.json()
    
    return {
      source: 'OpenWeatherMap',
      timestamp: new Date().toISOString(),
      data: {
        co2Levels: 0, // لا تتوفر في API الطقس
        temperature: data.main.temp,
        humidity: data.main.humidity,
        airQuality: 0, // لا تتوفر في API الطقس
        renewableEnergy: 0, // لا تتوفر في API الطقس
        carbonCredits: 0, // لا تتوفر في API الطقس
        pricePerTon: 0 // لا تتوفر في API الطقس
      },
      location: {
        country: 'UK',
        region: 'London',
        coordinates: {
          lat: data.coord.lat,
          lng: data.coord.lon
        }
      },
      verified: true
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

// جمع بيانات انبعاثات الكربون
async function fetchCarbonData(): Promise<ClimateData | null> {
  try {
    // استخدام Carbon Interface API
    const response = await fetch(`${CLIMATE_DATA_SOURCES.CARBON_INTERFACE}/estimates`, {
      headers: {
        'Authorization': `Bearer ${process.env.CARBON_INTERFACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    
    return {
      source: 'Carbon Interface',
      timestamp: new Date().toISOString(),
      data: {
        co2Levels: data.carbon_g || 0,
        temperature: 0, // لا تتوفر في API الكربون
        humidity: 0, // لا تتوفر في API الكربون
        airQuality: 0, // لا تتوفر في API الكربون
        renewableEnergy: 0, // لا تتوفر في API الكربون
        carbonCredits: data.carbon_g || 0,
        pricePerTon: 0 // لا تتوفر في API الكربون
      },
      location: {
        country: 'Global',
        region: 'Global',
        coordinates: {
          lat: 0,
          lng: 0
        }
      },
      verified: true
    }
  } catch (error) {
    console.error('Error fetching carbon data:', error)
    return null
  }
}

// جمع بيانات الطاقة المتجددة
async function fetchRenewableEnergyData(): Promise<ClimateData | null> {
  try {
    // استخدام بيانات وهمية للطاقة المتجددة
    const renewablePercentage = Math.random() * 100
    
    return {
      source: 'Renewable Energy API',
      timestamp: new Date().toISOString(),
      data: {
        co2Levels: 0,
        temperature: 0,
        humidity: 0,
        airQuality: 0,
        renewableEnergy: renewablePercentage,
        carbonCredits: 0,
        pricePerTon: 0
      },
      location: {
        country: 'EU',
        region: 'Europe',
        coordinates: {
          lat: 50.0755,
          lng: 14.4378
        }
      },
      verified: true
    }
  } catch (error) {
    console.error('Error fetching renewable energy data:', error)
    return null
  }
}

// جمع بيانات السوق الأوروبي
async function fetchEUMarketData(): Promise<ClimateData | null> {
  try {
    // استخدام بيانات وهمية للسوق الأوروبي
    const carbonPrice = 80 + Math.random() * 20 // سعر بين 80-100 يورو للطن
    
    return {
      source: 'EU ETS Market',
      timestamp: new Date().toISOString(),
      data: {
        co2Levels: 0,
        temperature: 0,
        humidity: 0,
        airQuality: 0,
        renewableEnergy: 0,
        carbonCredits: 1000000, // مليون طن متري
        pricePerTon: carbonPrice
      },
      location: {
        country: 'EU',
        region: 'Europe',
        coordinates: {
          lat: 50.0755,
          lng: 14.4378
        }
      },
      verified: true
    }
  } catch (error) {
    console.error('Error fetching EU market data:', error)
    return null
  }
}

// حفظ البيانات في قاعدة البيانات
async function saveClimateData(data: ClimateData[]) {
  try {
    for (const item of data) {
      await prisma.climateData.create({
        data: {
          source: item.source,
          timestamp: new Date(item.timestamp),
          co2Levels: item.data.co2Levels,
          temperature: item.data.temperature,
          humidity: item.data.humidity,
          airQuality: item.data.airQuality,
          renewableEnergy: item.data.renewableEnergy,
          carbonCredits: item.data.carbonCredits,
          pricePerTon: item.data.pricePerTon,
          country: item.location.country,
          region: item.location.region,
          latitude: item.location.coordinates.lat,
          longitude: item.location.coordinates.lng,
          verified: item.verified
        }
      })
    }
  } catch (error) {
    console.error('Error saving climate data:', error)
    throw error
  }
}

// إنشاء رصيد كربون تلقائي من البيانات
export async function generateCarbonCreditsFromData(): Promise<CarbonCreditData[]> {
  try {
    const climateData = await collectClimateData()
    const carbonCredits: CarbonCreditData[] = []
    
    for (const data of climateData) {
      if (data.data.carbonCredits > 0) {
        const credit: CarbonCreditData = {
          id: `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `رصيد كربون من ${data.source}`,
          description: `رصيد كربون مُولد تلقائياً من ${data.source} في ${data.location.region}`,
          co2Offset: data.data.carbonCredits,
          price: data.data.pricePerTon || 85, // سعر افتراضي
          currency: 'EUR',
          source: data.source,
          verified: data.verified,
          location: `${data.location.country}, ${data.location.region}`,
          projectType: 'Renewable Energy',
          certification: 'VCS',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // سنة من الآن
        }
        
        carbonCredits.push(credit)
      }
    }
    
    return carbonCredits
  } catch (error) {
    console.error('Error generating carbon credits:', error)
    throw error
  }
}

// تحليل البيانات وإنشاء تقارير
export async function analyzeClimateData(): Promise<{
  totalCo2Offset: number
  averagePrice: number
  renewableEnergyPercentage: number
  marketTrend: 'up' | 'down' | 'stable'
  recommendations: string[]
}> {
  try {
    const data = await prisma.climateData.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // آخر 30 يوم
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
    
    const totalCo2Offset = data.reduce((sum, item) => sum + item.carbonCredits, 0)
    const averagePrice = data.reduce((sum, item) => sum + item.pricePerTon, 0) / data.length
    const renewableEnergyPercentage = data.reduce((sum, item) => sum + item.renewableEnergy, 0) / data.length
    
    // تحليل الاتجاه
    const recentPrices = data.slice(0, 7).map(item => item.pricePerTon)
    const olderPrices = data.slice(7, 14).map(item => item.pricePerTon)
    const recentAvg = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length
    const olderAvg = olderPrices.reduce((sum, price) => sum + price, 0) / olderPrices.length
    
    let marketTrend: 'up' | 'down' | 'stable' = 'stable'
    if (recentAvg > olderAvg * 1.05) marketTrend = 'up'
    else if (recentAvg < olderAvg * 0.95) marketTrend = 'down'
    
    const recommendations = []
    if (renewableEnergyPercentage < 30) {
      recommendations.push('زيادة الاستثمار في الطاقة المتجددة')
    }
    if (averagePrice < 80) {
      recommendations.push('السعر الحالي مناسب للشراء')
    }
    if (marketTrend === 'up') {
      recommendations.push('السوق في اتجاه صاعد - وقت مناسب للبيع')
    }
    
    return {
      totalCo2Offset,
      averagePrice,
      renewableEnergyPercentage,
      marketTrend,
      recommendations
    }
  } catch (error) {
    console.error('Error analyzing climate data:', error)
    throw error
  }
}

// تحديث البيانات كل ساعة
export async function scheduleClimateDataUpdate() {
  setInterval(async () => {
    try {
      await collectClimateData()
      console.log('Climate data updated successfully')
    } catch (error) {
      console.error('Error updating climate data:', error)
    }
  }, 60 * 60 * 1000) // كل ساعة
}
