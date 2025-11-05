// API Helper functions for Vercel-compatible API routes
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function createPrismaClient() {
  return new PrismaClient();
}

export async function disconnectPrisma(prisma: PrismaClient) {
  await prisma.$disconnect();
}

export function successResponse(data: any, message?: string, status: number = 200) {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
  }, { status });
}

export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json({
    success: false,
    error,
  }, { status });
}
