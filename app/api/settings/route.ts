import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiException } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

/**
 * GET /api/settings?userId=xxx
 * جلب إعدادات المستخدم
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });
    
    return NextResponse.json({
      success: true,
      data: settings || {
        notificationsEnabled: true,
        soundEnabled: true,
        darkMode: true,
        language: 'ar'
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/settings
 * حفظ/تحديث إعدادات المستخدم
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, notificationsEnabled, soundEnabled, darkMode, language } = body;
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    // التحقق من المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new ApiException('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // تحديث أو إنشاء الإعدادات
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        notificationsEnabled: notificationsEnabled ?? true,
        soundEnabled: soundEnabled ?? true,
        darkMode: darkMode ?? true,
        language: language || 'ar'
      },
      create: {
        userId,
        notificationsEnabled: notificationsEnabled ?? true,
        soundEnabled: soundEnabled ?? true,
        darkMode: darkMode ?? true,
        language: language || 'ar'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings saved successfully'
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
