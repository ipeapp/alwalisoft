// app/api/ads/prepare-rewarded/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adManager } from '@/lib/ad-manager';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    const result = await adManager.prepareRewardedForUser(userId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error preparing rewarded ad:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
