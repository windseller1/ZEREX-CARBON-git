import { prisma } from './supabase/prisma'

// مصادر بيانات المناخ المجانية
const CLIMATE_DATA_SOURCES = {
  OPEN_WEATHER: 'https://api.openweathermap.org/data/2.5',
  CARBON_INTERFACE: 'https://api.carboninterface.com/v1',
  EU_ETS: 'https://api.european-ets.com',
  WORLD_BANK: 'https://api.worldbank.org/v2',
  NASA: 'https://api.nasa.gov',
  NOAA: 'https://api.weather.gov'
}

// أنواع بيانات المناخ
export enum ClimateDataType {
  WEATHER = 'weather',
  CARBON_EMISSIONS = 'carbon_emissions',
  AIR_QUALITY = 'air_quality',
  RENEWABLE_ENERGY = 'renewable_energy',
  CARBON_PRICES = 'carbon_prices',
  CLIMATE_INDICATORS = 'climate_indicators'
}

// واجهة بيانات المناخ
export interface ClimateDataPoint {
  id: string
  type: ClimateDataType
  source: string
  timestamp: Date
  location: {
    country: string
    region: string
    latitude: number
    longitude: number
  }
  data: {
    temperature?: number
    humidity?: number
    airQuality?: number
    co2Levels?: number
    renewableEnergy?: number
    carbonCredits?: number
    pricePerTon?: number
    [key: string]: any
  }
  verified: boolean
  createdAt: Date
}

// جامع بيانات المناخ
export class ClimateDataCollector {
  private apiKeys: { [key: string]: string } = {}

  constructor() {
    this.apiKeys = {
      openWeather: process.env.OPEN_WEATHER_API_KEY || '',
      carbonInterface: process.env.CARBON_INTERFACE_API_KEY || '',
      euEts: process.env.EU_ETS_API_KEY || '',
      worldBank: process.env.WORLD_BANK_API_KEY || '',
      nasa: process.env.NASA_API_KEY || '',
      noaa: process.env.NOAA_API_KEY || ''
    }
  }

  // جمع بيانات الطقس
  async collectWeatherData(location: { lat: number; lon: number; country: string; region: string }): Promise<ClimateDataPoint | null> {
    try {
      const response = await fetch(
        `${CLIMATE_DATA_SOURCES.OPEN_WEATHER}/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKeys.openWeather}&units=metric`
      )

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      const climateData: ClimateDataPoint = {
        id: `weather_${Date.now()}_${location.lat}_${location.lon}`,
        type: ClimateDataType.WEATHER,
        source: 'Open Weather Map',
        timestamp: new Date(),
        location: {
          country: location.country,
          region: location.region,
          latitude: location.lat,
          longitude: location.lon
        },
        data: {
          temperature: data.main?.temp || 0,
          humidity: data.main?.humidity || 0,
          airQuality: data.main?.pressure || 0,
          co2Levels: 0,
          renewableEnergy: 0,
          carbonCredits: 0,
          pricePerTon: 0
        },
        verified: true,
        createdAt: new Date()
      }

      return climateData
    } catch (error) {
      console.error('Error collecting weather data:', error)
      return null
    }
  }

  // جمع بيانات انبعاثات الكربون
  async collectCarbonEmissionsData(country: string = 'DE'): Promise<ClimateDataPoint | null> {
    try {
      const response = await fetch(`${CLIMATE_DATA_SOURCES.CARBON_INTERFACE}/carbon_intensity`, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.carbonInterface}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Carbon Interface API error: ${response.status}`)
      }

      const data = await response.json()

      const climateData: ClimateDataPoint = {
        id: `carbon_${Date.now()}_${country}`,
        type: ClimateDataType.CARBON_EMISSIONS,
        source: 'Carbon Interface',
        timestamp: new Date(),
        location: {
          country: country,
          region: 'Europe',
          latitude: 0,
          longitude: 0
        },
        data: {
          temperature: 0,
          humidity: 0,
          airQuality: 0,
          co2Levels: data.carbon_intensity || 0,
          renewableEnergy: 0,
          carbonCredits: 0,
          pricePerTon: 0
        },
        verified: true,
        createdAt: new Date()
      }

      return climateData
    } catch (error) {
      console.error('Error collecting carbon emissions data:', error)
      return null
    }
  }

  // جمع أسعار الكربون
  async collectCarbonPrices(): Promise<ClimateDataPoint | null> {
    try {
      const response = await fetch(`${CLIMATE_DATA_SOURCES.EU_ETS}/prices`, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.euEts}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`EU ETS API error: ${response.status}`)
      }

      const data = await response.json()

      const climateData: ClimateDataPoint = {
        id: `carbon_prices_${Date.now()}`,
        type: ClimateDataType.CARBON_PRICES,
        source: 'EU ETS',
        timestamp: new Date(),
        location: {
          country: 'EU',
          region: 'Europe',
          latitude: 0,
          longitude: 0
        },
        data: {
          temperature: 0,
          humidity: 0,
          airQuality: 0,
          co2Levels: 0,
          renewableEnergy: 0,
          carbonCredits: 0,
          pricePerTon: data.price || 0
        },
        verified: true,
        createdAt: new Date()
      }

      return climateData
    } catch (error) {
      console.error('Error collecting carbon prices:', error)
      return null
    }
  }

  // جمع بيانات الطاقة المتجددة
  async collectRenewableEnergyData(country: string = 'DE'): Promise<ClimateDataPoint | null> {
    try {
      const response = await fetch(`${CLIMATE_DATA_SOURCES.WORLD_BANK}/country/${country}/indicator/EG.USE.ELEC.RNEW.ZS?format=json&date=2023:2024`)

      if (!response.ok) {
        throw new Error(`World Bank API error: ${response.status}`)
      }

      const data = await response.json()

      const climateData: ClimateDataPoint = {
        id: `renewable_${Date.now()}_${country}`,
        type: ClimateDataType.RENEWABLE_ENERGY,
        source: 'World Bank',
        timestamp: new Date(),
        location: {
          country: country,
          region: 'Europe',
          latitude: 0,
          longitude: 0
        },
        data: {
          temperature: 0,
          humidity: 0,
          airQuality: 0,
          co2Levels: 0,
          renewableEnergy: data[1]?.[0]?.value || 0,
          carbonCredits: 0,
          pricePerTon: 0
        },
        verified: true,
        createdAt: new Date()
      }

      return climateData
    } catch (error) {
      console.error('Error collecting renewable energy data:', error)
      return null
    }
  }

  // جمع بيانات جودة الهواء
  async collectAirQualityData(location: { lat: number; lon: number; country: string; region: string }): Promise<ClimateDataPoint | null> {
    try {
      const response = await fetch(
        `${CLIMATE_DATA_SOURCES.OPEN_WEATHER}/air_pollution?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKeys.openWeather}`
      )

      if (!response.ok) {
        throw new Error(`Air Quality API error: ${response.status}`)
      }

      const data = await response.json()

      const climateData: ClimateDataPoint = {
        id: `air_quality_${Date.now()}_${location.lat}_${location.lon}`,
        type: ClimateDataType.AIR_QUALITY,
        source: 'Open Weather Map',
        timestamp: new Date(),
        location: {
          country: location.country,
          region: location.region,
          latitude: location.lat,
          longitude: location.lon
        },
        data: {
          temperature: 0,
          humidity: 0,
          airQuality: data.list?.[0]?.main?.aqi || 0,
          co2Levels: 0,
          renewableEnergy: 0,
          carbonCredits: 0,
          pricePerTon: 0
        },
        verified: true,
        createdAt: new Date()
      }

      return climateData
    } catch (error) {
      console.error('Error collecting air quality data:', error)
      return null
    }
  }

  // جمع جميع البيانات
  async collectAllData(): Promise<ClimateDataPoint[]> {
    const allData: ClimateDataPoint[] = []

    // مواقع أوروبية رئيسية
    const europeanLocations = [
      { lat: 52.5200, lon: 13.4050, country: 'DE', region: 'Berlin' },
      { lat: 48.8566, lon: 2.3522, country: 'FR', region: 'Paris' },
      { lat: 51.5074, lon: -0.1278, country: 'GB', region: 'London' },
      { lat: 41.9028, lon: 12.4964, country: 'IT', region: 'Rome' },
      { lat: 40.4168, lon: -3.7038, country: 'ES', region: 'Madrid' },
      { lat: 52.3676, lon: 4.9041, country: 'NL', region: 'Amsterdam' },
      { lat: 55.7558, lon: 37.6176, country: 'RU', region: 'Moscow' },
      { lat: 59.9311, lon: 10.7579, country: 'NO', region: 'Oslo' }
    ]

    // جمع بيانات الطقس
    for (const location of europeanLocations) {
      const weatherData = await this.collectWeatherData(location)
      if (weatherData) allData.push(weatherData)

      const airQualityData = await this.collectAirQualityData(location)
      if (airQualityData) allData.push(airQualityData)
    }

    // جمع بيانات انبعاثات الكربون
    const carbonData = await this.collectCarbonEmissionsData('DE')
    if (carbonData) allData.push(carbonData)

    // جمع أسعار الكربون
    const carbonPrices = await this.collectCarbonPrices()
    if (carbonPrices) allData.push(carbonPrices)

    // جمع بيانات الطاقة المتجددة
    const renewableData = await this.collectRenewableEnergyData('DE')
    if (renewableData) allData.push(renewableData)

    return allData
  }

  // حفظ البيانات في قاعدة البيانات
  async saveClimateData(data: ClimateDataPoint): Promise<boolean> {
    try {
      await prisma.climateData.create({
        data: {
          source: data.source,
          timestamp: data.timestamp,
          co2Levels: data.data.co2Levels || 0,
          temperature: data.data.temperature || 0,
          humidity: data.data.humidity || 0,
          airQuality: data.data.airQuality || 0,
          renewableEnergy: data.data.renewableEnergy || 0,
          carbonCredits: data.data.carbonCredits || 0,
          pricePerTon: data.data.pricePerTon || 0,
          country: data.location.country,
          region: data.location.region,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          verified: data.verified
        }
      })

      return true
    } catch (error) {
      console.error('Error saving climate data:', error)
      return false
    }
  }

  // حفظ جميع البيانات
  async saveAllData(dataPoints: ClimateDataPoint[]): Promise<{ saved: number; failed: number }> {
    let saved = 0
    let failed = 0

    for (const dataPoint of dataPoints) {
      const success = await this.saveClimateData(dataPoint)
      if (success) {
        saved++
      } else {
        failed++
      }
    }

    return { saved, failed }
  }

  // تشغيل جمع البيانات التلقائي
  async runAutomaticCollection(): Promise<void> {
    try {
      console.log('Starting automatic climate data collection...')
      
      const allData = await this.collectAllData()
      const result = await this.saveAllData(allData)
      
      console.log(`Climate data collection completed. Saved: ${result.saved}, Failed: ${result.failed}`)
    } catch (error) {
      console.error('Error in automatic collection:', error)
    }
  }

  // الحصول على البيانات المحفوظة
  async getStoredData(limit: number = 100): Promise<ClimateDataPoint[]> {
    try {
      const data = await prisma.climateData.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      return data.map(item => ({
        id: item.id,
        type: ClimateDataType.WEATHER, // يمكن تحسين هذا
        source: item.source,
        timestamp: item.timestamp,
        location: {
          country: item.country,
          region: item.region,
          latitude: item.latitude,
          longitude: item.longitude
        },
        data: {
          temperature: item.temperature,
          humidity: item.humidity,
          airQuality: item.airQuality,
          co2Levels: item.co2Levels,
          renewableEnergy: item.renewableEnergy,
          carbonCredits: item.carbonCredits,
          pricePerTon: item.pricePerTon
        },
        verified: item.verified,
        createdAt: item.createdAt
      }))
    } catch (error) {
      console.error('Error getting stored data:', error)
      return []
    }
  }

  // تحليل البيانات
  async analyzeData(): Promise<{
    totalDataPoints: number
    averageTemperature: number
    averageCO2Levels: number
    averageAirQuality: number
    averageRenewableEnergy: number
    averageCarbonPrice: number
    dataByCountry: { [key: string]: number }
    dataBySource: { [key: string]: number }
  }> {
    try {
      const data = await prisma.climateData.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // آخر 30 يوم
          }
        }
      })

      const totalDataPoints = data.length
      const averageTemperature = data.reduce((sum, item) => sum + item.temperature, 0) / totalDataPoints
      const averageCO2Levels = data.reduce((sum, item) => sum + item.co2Levels, 0) / totalDataPoints
      const averageAirQuality = data.reduce((sum, item) => sum + item.airQuality, 0) / totalDataPoints
      const averageRenewableEnergy = data.reduce((sum, item) => sum + item.renewableEnergy, 0) / totalDataPoints
      const averageCarbonPrice = data.reduce((sum, item) => sum + item.pricePerTon, 0) / totalDataPoints

      const dataByCountry: { [key: string]: number } = {}
      const dataBySource: { [key: string]: number } = {}

      data.forEach(item => {
        dataByCountry[item.country] = (dataByCountry[item.country] || 0) + 1
        dataBySource[item.source] = (dataBySource[item.source] || 0) + 1
      })

      return {
        totalDataPoints,
        averageTemperature: Math.round(averageTemperature * 100) / 100,
        averageCO2Levels: Math.round(averageCO2Levels * 100) / 100,
        averageAirQuality: Math.round(averageAirQuality * 100) / 100,
        averageRenewableEnergy: Math.round(averageRenewableEnergy * 100) / 100,
        averageCarbonPrice: Math.round(averageCarbonPrice * 100) / 100,
        dataByCountry,
        dataBySource
      }
    } catch (error) {
      console.error('Error analyzing data:', error)
      return {
        totalDataPoints: 0,
        averageTemperature: 0,
        averageCO2Levels: 0,
        averageAirQuality: 0,
        averageRenewableEnergy: 0,
        averageCarbonPrice: 0,
        dataByCountry: {},
        dataBySource: {}
      }
    }
  }
}

// إنشاء مثيل من جامع البيانات
export const climateDataCollector = new ClimateDataCollector()

// تشغيل جمع البيانات كل ساعة
if (typeof window === 'undefined') {
  setInterval(() => {
    climateDataCollector.runAutomaticCollection()
  }, 60 * 60 * 1000) // كل ساعة
}
