import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';
import { config } from '../config';

export async function handleReferrals(ctx: BotContext) {
  const callbackQuery = ctx.callbackQuery;
  const data = callbackQuery && 'data' in callbackQuery ? callbackQuery.data : '';
  const isArabic = ctx.session?.language === 'ar';
  const userId = ctx.session?.userId;

  if (!userId) {
    await ctx.answerCbQuery('Please restart the bot with /start');
    return;
  }

  try {
    if (data === 'referrals') {
      await showReferralDashboard(ctx, userId, isArabic);
    } else if (data === 'ref_stats') {
      await showReferralStats(ctx, userId, isArabic);
    } else if (data === 'ref_leaderboard') {
      await showReferralLeaderboard(ctx, isArabic);
    }

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error({ err: error }, 'Referrals handler error:');
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}

async function showReferralDashboard(ctx: BotContext, userId: string, isArabic: boolean) {
  // Get user data
  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: {
      referralCode: true,
      referralCount: true,
    },
  });

  if (!user) {
    await ctx.reply('User not found');
    return;
  }

  // Get referral tree data
  const referralTree = await ctx.prisma.referralTree.findUnique({
    where: { userId },
  });

  const level1Count = referralTree?.level1Count || 0;
  const level2Count = referralTree?.level2Count || 0;
  const level3Count = referralTree?.level3Count || 0;
  const level1Earnings = referralTree?.level1Earnings || BigInt(0);
  const level2Earnings = referralTree?.level2Earnings || BigInt(0);
  const level3Earnings = referralTree?.level3Earnings || BigInt(0);
  const totalEarnings = referralTree?.totalReferralEarnings || BigInt(0);

  const botUsername = config.telegramBotUsername;
  const referralLink = `https://t.me/${botUsername}?start=${user.referralCode}`;

  let message = isArabic
    ? `👥 *نظام الإحالات*\n\n`
    : `👥 *Referral System*\n\n`;

  message += isArabic
    ? `🔗 *رابط الإحالة الخاص بك:*\n\`${referralLink}\`\n\n`
    : `🔗 *Your Referral Link:*\n\`${referralLink}\`\n\n`;

  message += isArabic
    ? `📊 *الإحصائيات:*\n`
    : `📊 *Statistics:*\n`;
  message += isArabic
    ? `└ إجمالي الإحالات: ${user.referralCount}\n`
    : `└ Total Referrals: ${user.referralCount}\n`;
  message += isArabic
    ? `└ إجمالي الأرباح: ${totalEarnings.toString()} عملة\n\n`
    : `└ Total Earnings: ${totalEarnings.toString()} coins\n\n`;

  message += isArabic
    ? `💰 *نظام المكافآت متعدد المستويات:*\n\n`
    : `💰 *Multi-Level Rewards:*\n\n`;

  message += isArabic
    ? `📍 *المستوى 1* (مباشر)\n`
    : `📍 *Level 1* (Direct)\n`;
  message += isArabic
    ? `└ المكافأة: ${config.referralLevel1Reward} عملة + ${config.referralLevel1Commission * 100}% عمولة\n`
    : `└ Reward: ${config.referralLevel1Reward} coins + ${config.referralLevel1Commission * 100}% commission\n`;
  message += isArabic
    ? `└ الإحالات: ${level1Count}\n`
    : `└ Referrals: ${level1Count}\n`;
  message += isArabic
    ? `└ الأرباح: ${level1Earnings.toString()} عملة\n\n`
    : `└ Earnings: ${level1Earnings.toString()} coins\n\n`;

  message += isArabic
    ? `📍 *المستوى 2*\n`
    : `📍 *Level 2*\n`;
  message += isArabic
    ? `└ المكافأة: ${config.referralLevel2Reward} عملة + ${config.referralLevel2Commission * 100}% عمولة\n`
    : `└ Reward: ${config.referralLevel2Reward} coins + ${config.referralLevel2Commission * 100}% commission\n`;
  message += isArabic
    ? `└ الإحالات: ${level2Count}\n`
    : `└ Referrals: ${level2Count}\n`;
  message += isArabic
    ? `└ الأرباح: ${level2Earnings.toString()} عملة\n\n`
    : `└ Earnings: ${level2Earnings.toString()} coins\n\n`;

  message += isArabic
    ? `📍 *المستوى 3*\n`
    : `📍 *Level 3*\n`;
  message += isArabic
    ? `└ المكافأة: ${config.referralLevel3Reward} عملة + ${config.referralLevel3Commission * 100}% عمولة\n`
    : `└ Reward: ${config.referralLevel3Reward} coins + ${config.referralLevel3Commission * 100}% commission\n`;
  message += isArabic
    ? `└ الإحالات: ${level3Count}\n`
    : `└ Referrals: ${level3Count}\n`;
  message += isArabic
    ? `└ الأرباح: ${level3Earnings.toString()} عملة`
    : `└ Earnings: ${level3Earnings.toString()} coins`;

  const keyboard = [
    [
      Markup.button.callback(
        isArabic ? '📊 تفاصيل الإحالات' : '📊 Referral Details',
        'ref_stats'
      ),
    ],
    [
      Markup.button.callback(
        isArabic ? '🏆 المتصدرين' : '🏆 Leaderboard',
        'ref_leaderboard'
      ),
    ],
    [
      Markup.button.callback(
        isArabic ? '📤 مشاركة الرابط' : '📤 Share Link',
        'ref_share'
      ),
    ],
    [
      Markup.button.callback(
        isArabic ? '🔙 القائمة الرئيسية' : '🔙 Main Menu',
        'back_to_menu'
      ),
    ],
  ];

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function showReferralStats(ctx: BotContext, userId: string, isArabic: boolean) {
  // Get detailed referral data
  const referrals = await ctx.prisma.referral.findMany({
    where: { referrerId: userId },
    include: {
      referred: {
        select: {
          username: true,
          firstName: true,
          tasksCompleted: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  if (referrals.length === 0) {
    await ctx.editMessageText(
      isArabic
        ? '😔 ليس لديك إحالات بعد.\n\nابدأ بدعوة أصدقائك للحصول على مكافآت!'
        : '😔 You don\'t have any referrals yet.\n\nStart inviting friends to earn rewards!',
      {
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'referrals')],
          ],
        },
      }
    );
    return;
  }

  let message = isArabic
    ? `📊 *تفاصيل الإحالات*\n\n`
    : `📊 *Referral Details*\n\n`;

  message += isArabic
    ? `إجمالي الإحالات: ${referrals.length}\n\n`
    : `Total Referrals: ${referrals.length}\n\n`;

  // Group by level
  const level1 = referrals.filter(r => r.level === 1);
  const level2 = referrals.filter(r => r.level === 2);
  const level3 = referrals.filter(r => r.level === 3);

  if (level1.length > 0) {
    message += isArabic ? `📍 *المستوى 1:*\n` : `📍 *Level 1:*\n`;
    level1.slice(0, 5).forEach((ref, idx) => {
      const name = ref.referred.firstName || ref.referred.username || 'User';
      const tasks = ref.referred.tasksCompleted;
      message += `${idx + 1}. ${name} - ${tasks} ${isArabic ? 'مهمة' : 'tasks'}\n`;
    });
    if (level1.length > 5) {
      message += isArabic
        ? `... و ${level1.length - 5} آخرين\n`
        : `... and ${level1.length - 5} more\n`;
    }
    message += '\n';
  }

  if (level2.length > 0) {
    message += isArabic ? `📍 *المستوى 2:* ${level2.length}\n\n` : `📍 *Level 2:* ${level2.length}\n\n`;
  }

  if (level3.length > 0) {
    message += isArabic ? `📍 *المستوى 3:* ${level3.length}\n` : `📍 *Level 3:* ${level3.length}\n`;
  }

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'referrals')],
      ],
    },
  });
}

async function showReferralLeaderboard(ctx: BotContext, isArabic: boolean) {
  // Get top referrers
  const topReferrers: any[] = await (ctx.prisma.referralTree as any).findMany({
    orderBy: { level1Count: 'desc' },
    take: 10,
    include: {
      user: {
        select: {
          username: true,
          firstName: true,
        },
      },
    },
  });

  let message = isArabic
    ? `🏆 *المتصدرون في الإحالات*\n\n`
    : `🏆 *Top Referrers*\n\n`;

  topReferrers.forEach((entry, idx) => {
    const user = entry.user as any;
    const name = user?.firstName || user?.username || 'User';
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
    message += `${medal} ${name} - ${entry.level1Count} ${isArabic ? 'إحالة' : 'referrals'}\n`;
  });

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'referrals')],
      ],
    },
  });
}
