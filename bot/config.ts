import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Telegram Bot
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || '',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // API
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  apiSecret: process.env.API_SECRET || 'your-api-secret',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // App Config
  minWithdrawalAmount: parseInt(process.env.MIN_WITHDRAWAL_AMOUNT || '5000000'),
  coinToUsdtRate: parseInt(process.env.COIN_TO_USDT_RATE || '1000000'), // 1 USDT = 1,000,000 coins
  
  // Referral System
  referralLevel1Reward: parseInt(process.env.REFERRAL_LEVEL1_REWARD || '1000'),
  referralLevel1Commission: parseFloat(process.env.REFERRAL_LEVEL1_COMMISSION || '0.10'), // 10%
  referralLevel2Reward: parseInt(process.env.REFERRAL_LEVEL2_REWARD || '500'),
  referralLevel2Commission: parseFloat(process.env.REFERRAL_LEVEL2_COMMISSION || '0.05'), // 5%
  referralLevel3Reward: parseInt(process.env.REFERRAL_LEVEL3_REWARD || '250'),
  referralLevel3Commission: parseFloat(process.env.REFERRAL_LEVEL3_COMMISSION || '0.02'), // 2%
  referralSignupBonus: parseInt(process.env.REFERRAL_SIGNUP_BONUS || '5000'),
  referredUserSignupBonus: parseInt(process.env.REFERRED_USER_SIGNUP_BONUS || '2000'),
  
  // Rate Limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'), // 1 minute
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '30'), // 30 requests per minute
  
  // Task Verification
  taskVerificationDelay: parseInt(process.env.TASK_VERIFICATION_DELAY || '5000'), // 5 seconds
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'DATABASE_URL',
  'JWT_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
