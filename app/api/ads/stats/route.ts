import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { adManager } from '@/lib/ad-manager';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ads/stats?userId=xxx
 * جلب إحصائيات الإعلانات للمستخدم
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      throw new ApiException('User ID is required', 400, 'MISSING_USER_ID');
    }
    
    const stats = await adManager.getUserAdStats(userId);
    
    return NextResponse.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
