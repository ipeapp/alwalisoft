// API Helper functions for Vercel-compatible API routes
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function createPrismaClient() {
  return new PrismaClient();
}

export async function disconnectPrisma(prisma: PrismaClient) {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error disconnecting Prisma:', error);
  }
}

export function successResponse(data: any, message?: string, status: number = 200) {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
  }, { status });
}

export function errorResponse(error: string, status: number = 400, code?: string) {
  return NextResponse.json({
    success: false,
    error,
    ...(code && { code }),
  }, { status });
}

export async function withPrisma<T>(
  handler: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = new PrismaClient();
  try {
    return await handler(prisma);
  } finally {
    await disconnectPrisma(prisma);
  }
}
