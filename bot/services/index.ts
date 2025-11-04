import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface Services {
  prisma: PrismaClient;
  redis: Redis;
}

let prisma: PrismaClient;
let redis: Redis;

export async function initializeServices(): Promise<Services> {
  // Initialize Prisma
  if (!prisma) {
    prisma = new PrismaClient({
      log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    });

    await prisma.$connect();
    logger.info('Connected to PostgreSQL via Prisma');
  }

  // Initialize Redis
  if (!redis) {
    redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        logger.error({ err: err }, 'Redis reconnect on error:');
        return true;
      },
    });

    redis.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redis.on('error', (err) => {
      logger.error({ err: err }, 'Redis error:');
    });
  }

  return { prisma, redis };
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error('Prisma not initialized. Call initializeServices first.');
  }
  return prisma;
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error('Redis not initialized. Call initializeServices first.');
  }
  return redis;
}
