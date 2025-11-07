import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ApiException } from '@/lib/error-handler';
import { adManager } from '@/lib/ad-manager';
import type { AdType } from '@/lib/ad-manager';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ads/check?userId=xxx&adType=REWARDED_VIDEO
 * التحقق من إمكانية مشاهدة إعلان
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const adType = req.nextUrl.searchParams.get('adType') as AdType;
    
    if (!userId || !adType) {
      throw new ApiException('User ID and Ad Type are required', 400, 'MISSING_FIELDS');
    }
    
    const canWatch = await adManager.canWatchAd(userId, adType);
    const stats = await adManager.getUserAdStats(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        canWatch,
        ...stats
      }
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
