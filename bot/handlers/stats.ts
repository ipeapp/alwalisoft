import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';

export async function handleStats(ctx: BotContext) {
  const isArabic = ctx.session?.language === 'ar';
  const userId = ctx.session?.userId;

  if (!userId) {
    await ctx.answerCbQuery('Please restart the bot with /start');
    return;
  }

  try {
    // Get user data
    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        level: true,
        tasksCompleted: true,
        referralCount: true,
        createdAt: true,
      },
    });

    if (!user) {
      await ctx.answerCbQuery('User not found');
      return;
    }

    // Get statistics
    const stats = await ctx.prisma.userStatistics.findUnique({
      where: { userId },
    });

    // Get referral tree
    const referralTree = await ctx.prisma.referralTree.findUnique({
      where: { userId },
    });

    // Get withdrawals
    const withdrawals = await ctx.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
      take: 5,
    });

    const totalWithdrawals = withdrawals
      .filter(w => w.status === 'COMPLETED')
      .reduce((sum, w) => sum + Number(w.amount), 0);

    let message = isArabic
      ? `📊 *إحصائياتك*\n\n`
      : `📊 *Your Statistics*\n\n`;

    message += isArabic
      ? `💰 *الرصيد الحالي:* ${user.balance.toString()} عملة\n`
      : `💰 *Current Balance:* ${user.balance.toString()} coins\n`;
    message += isArabic
      ? `⭐ *المستوى:* ${getLevelText(user.level, isArabic)}\n\n`
      : `⭐ *Level:* ${getLevelText(user.level, isArabic)}\n\n`;

    message += isArabic
      ? `📈 *الأرباح:*\n`
      : `📈 *Earnings:*\n`;
    message += isArabic
      ? `└ اليوم: ${stats?.dailyEarnings.toString() || '0'} عملة\n`
      : `└ Today: ${stats?.dailyEarnings.toString() || '0'} coins\n`;
    message += isArabic
      ? `└ هذا الأسبوع: ${stats?.weeklyEarnings.toString() || '0'} عملة\n`
      : `└ This Week: ${stats?.weeklyEarnings.toString() || '0'} coins\n`;
    message += isArabic
      ? `└ هذا الشهر: ${stats?.monthlyEarnings.toString() || '0'} عملة\n`
      : `└ This Month: ${stats?.monthlyEarnings.toString() || '0'} coins\n`;
    message += isArabic
      ? `└ الإجمالي: ${stats?.totalEarnings.toString() || '0'} عملة\n\n`
      : `└ Total: ${stats?.totalEarnings.toString() || '0'} coins\n\n`;

    message += isArabic
      ? `📋 *المهام:*\n`
      : `📋 *Tasks:*\n`;
    message += isArabic
      ? `└ المكتملة: ${user.tasksCompleted}\n`
      : `└ Completed: ${user.tasksCompleted}\n`;
    message += isArabic
      ? `└ السلسلة الحالية: ${stats?.currentStreak || 0} يوم\n`
      : `└ Current Streak: ${stats?.currentStreak || 0} days\n`;
    message += isArabic
      ? `└ أطول سلسلة: ${stats?.longestStreak || 0} يوم\n\n`
      : `└ Longest Streak: ${stats?.longestStreak || 0} days\n\n`;

    message += isArabic
      ? `👥 *الإحالات:*\n`
      : `👥 *Referrals:*\n`;
    message += isArabic
      ? `└ الإجمالي: ${user.referralCount}\n`
      : `└ Total: ${user.referralCount}\n`;
    message += isArabic
      ? `└ المستوى 1: ${referralTree?.level1Count || 0}\n`
      : `└ Level 1: ${referralTree?.level1Count || 0}\n`;
    message += isArabic
      ? `└ المستوى 2: ${referralTree?.level2Count || 0}\n`
      : `└ Level 2: ${referralTree?.level2Count || 0}\n`;
    message += isArabic
      ? `└ المستوى 3: ${referralTree?.level3Count || 0}\n`
      : `└ Level 3: ${referralTree?.level3Count || 0}\n`;
    message += isArabic
      ? `└ الأرباح: ${referralTree?.totalReferralEarnings.toString() || '0'} عملة\n\n`
      : `└ Earnings: ${referralTree?.totalReferralEarnings.toString() || '0'} coins\n\n`;

    message += isArabic
      ? `💳 *السحوبات:*\n`
      : `💳 *Withdrawals:*\n`;
    message += isArabic
      ? `└ الإجمالي: ${totalWithdrawals} عملة\n`
      : `└ Total: ${totalWithdrawals} coins\n`;
    message += isArabic
      ? `└ العدد: ${withdrawals.filter(w => w.status === 'COMPLETED').length}\n\n`
      : `└ Count: ${withdrawals.filter(w => w.status === 'COMPLETED').length}\n\n`;

    const memberSince = new Date(user.createdAt).toLocaleDateString(
      isArabic ? 'ar' : 'en',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );

    message += isArabic
      ? `📅 *عضو منذ:* ${memberSince}`
      : `📅 *Member Since:* ${memberSince}`;

    const keyboard = [
      [
        Markup.button.callback(isArabic ? '📋 المهام' : '📋 Tasks', 'tasks'),
        Markup.button.callback(isArabic ? '👥 الإحالات' : '👥 Referrals', 'referrals'),
      ],
      [
        Markup.button.callback(isArabic ? '💳 السحب' : '💳 Withdraw', 'withdraw'),
      ],
      [
        Markup.button.callback(isArabic ? '🔙 القائمة الرئيسية' : '🔙 Main Menu', 'back_to_menu'),
      ],
    ];

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard },
    });

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error({ err: error }, 'Stats handler error:');
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}

function getLevelText(level: string, isArabic: boolean): string {
  const levels: Record<string, { en: string; ar: string }> = {
    BEGINNER: { en: 'Beginner', ar: 'مبتدئ' },
    PROFESSIONAL: { en: 'Professional', ar: 'محترف' },
    EXPERT: { en: 'Expert', ar: 'خبير' },
    VIP: { en: 'VIP', ar: 'VIP' },
  };

  return isArabic ? levels[level]?.ar || level : levels[level]?.en || level;
}
