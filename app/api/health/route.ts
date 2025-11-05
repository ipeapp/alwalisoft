import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const checks = {
      status: 'ok',
      database: false,
      redis: false,
      timestamp: new Date().toISOString(),
    };

    // Check database
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
      await prisma.$disconnect();
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Check Redis (optional)
    try {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        connectTimeout: 1000,
        lazyConnect: true,
      });
      
      await redis.connect();
      await redis.ping();
      checks.redis = true;
      await redis.disconnect();
    } catch (error) {
      console.error('Redis health check failed (optional):', error);
    }

    const healthy = checks.database; // Redis is optional

    if (healthy) {
      return NextResponse.json({
        success: true,
        data: checks,
        message: 'All systems operational'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: 'System health check failed'
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Health check failed'
    }, { status: 500 });
  }
}
