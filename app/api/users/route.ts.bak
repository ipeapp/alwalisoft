import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { nanoid } from 'nanoid';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const telegramId = searchParams.get('telegramId');

    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          statistics: true,
          wallet: true,
        },
      });

      if (!user) {
        return errorResponse('User not found', 404);
      }

      return successResponse(user);
    }

    if (telegramId) {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        include: {
          statistics: true,
          wallet: true,
        },
      });

      if (!user) {
        return errorResponse('User not found', 404);
      }

      return successResponse(user);
    }

    // Get all users with pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          statistics: true,
        },
      }),
      prisma.user.count(),
    ]);

    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { telegramId, username, firstName, lastName, languageCode, referralCode } = await request.json();

    // Validate required fields
    if (!telegramId) {
      return errorResponse('Telegram ID is required');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (existingUser) {
      return errorResponse('User already exists', 409);
    }

    // Find referrer if referral code provided
    let referrerId: string | undefined;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Create user with all related records
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          telegramId: BigInt(telegramId),
          username: username || `user_${telegramId}`,
          firstName,
          lastName,
          languageCode: languageCode || 'en',
          referralCode: `ref_${nanoid(10)}`,
          referredById: referrerId,
          balance: referrerId ? BigInt(2000) : BigInt(2000),
        },
      });

      // Create statistics
      await tx.userStatistics.create({
        data: {
          userId: newUser.id,
        },
      });

      // Create wallet
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          balance: newUser.balance,
        },
      });

      // Create settings
      await tx.userSettings.create({
        data: {
          userId: newUser.id,
          language: languageCode || 'en',
        },
      });

      // Process referral rewards if applicable
      if (referrerId) {
        // Level 1 referral
        const level1Reward = BigInt(5000);
        
        await tx.user.update({
          where: { id: referrerId },
          data: {
            balance: { increment: level1Reward },
            referralCount: { increment: 1 },
          },
        });

        await tx.referral.create({
          data: {
            referrerId,
            referredId: newUser.id,
            level: 1,
            commission: level1Reward,
          },
        });

        await tx.referralTree.upsert({
          where: { userId: referrerId },
          create: {
            userId: referrerId,
            level1Count: 1,
            level1Earnings: level1Reward,
            totalReferralEarnings: level1Reward,
          },
          update: {
            level1Count: { increment: 1 },
            level1Earnings: { increment: level1Reward },
            totalReferralEarnings: { increment: level1Reward },
          },
        });
      }

      return newUser;
    });

    return successResponse(user, 'User created successfully');
  } catch (error) {
    console.error('POST /api/users error:', error);
    return errorResponse('Internal server error', 500);
  }
}
