import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';
import { config } from '../config';

export async function handleWithdraw(ctx: BotContext) {
  const callbackQuery = ctx.callbackQuery;
  const data = callbackQuery && 'data' in callbackQuery ? callbackQuery.data : '';
  const isArabic = ctx.session?.language === 'ar';
  const userId = ctx.session?.userId;

  if (!userId) {
    await ctx.answerCbQuery('Please restart the bot with /start');
    return;
  }

  try {
    if (data === 'withdraw') {
      await showWithdrawInfo(ctx, userId, isArabic);
    } else if (data === 'withdraw_request') {
      await requestWithdrawal(ctx, userId, isArabic);
    } else if (data === 'withdraw_history') {
      await showWithdrawHistory(ctx, userId, isArabic);
    }

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error({ err: error }, 'Withdraw handler error:');
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}

async function showWithdrawInfo(ctx: BotContext, userId: string, isArabic: boolean) {
  // Get user balance
  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  if (!user) {
    await ctx.reply('User not found');
    return;
  }

  const balance = Number(user.balance);
  const minAmount = config.minWithdrawalAmount;
  const rate = config.coinToUsdtRate;
  const usdtAmount = (balance / rate).toFixed(2);
  const canWithdraw = balance >= minAmount;

  let message = isArabic
    ? `💳 *السحب*\n\n`
    : `💳 *Withdrawal*\n\n`;

  message += isArabic
    ? `💰 *رصيدك الحالي:* ${balance.toLocaleString()} عملة\n`
    : `💰 *Your Balance:* ${balance.toLocaleString()} coins\n`;
  message += isArabic
    ? `💵 *القيمة بالدولار:* ${usdtAmount} USDT\n\n`
    : `💵 *Value in USD:* ${usdtAmount} USDT\n\n`;

  message += isArabic
    ? `📊 *معلومات السحب:*\n`
    : `📊 *Withdrawal Info:*\n`;
  message += isArabic
    ? `└ الحد الأدنى: ${minAmount.toLocaleString()} عملة (5 USDT)\n`
    : `└ Minimum: ${minAmount.toLocaleString()} coins (5 USDT)\n`;
  message += isArabic
    ? `└ سعر التحويل: ${rate.toLocaleString()} عملة = 1 USDT\n`
    : `└ Exchange Rate: ${rate.toLocaleString()} coins = 1 USDT\n`;
  message += isArabic
    ? `└ الشبكة: TRC20 (USDT)\n`
    : `└ Network: TRC20 (USDT)\n`;
  message += isArabic
    ? `└ وقت المعالجة: 24-48 ساعة\n`
    : `└ Processing Time: 24-48 hours\n`;
  message += isArabic
    ? `└ الحالة: ${canWithdraw ? '✅ متاح' : '❌ غير متاح'}\n\n`
    : `└ Status: ${canWithdraw ? '✅ Available' : '❌ Not Available'}\n\n`;

  if (!canWithdraw) {
    const needed = minAmount - balance;
    message += isArabic
      ? `⚠️ تحتاج إلى ${needed.toLocaleString()} عملة إضافية للوصول للحد الأدنى للسحب.\n\n`
      : `⚠️ You need ${needed.toLocaleString()} more coins to reach the minimum withdrawal amount.\n\n`;
  }

  message += isArabic
    ? `ℹ️ *ملاحظات مهمة:*\n`
    : `ℹ️ *Important Notes:*\n`;
  message += isArabic
    ? `• تأكد من صحة عنوان المحفظة\n`
    : `• Make sure your wallet address is correct\n`;
  message += isArabic
    ? `• يتم معالجة الطلبات يدوياً\n`
    : `• Withdrawals are processed manually\n`;
  message += isArabic
    ? `• لا يمكن التراجع عن الطلب بعد الإرسال\n`
    : `• Requests cannot be cancelled after submission\n`;
  message += isArabic
    ? `• تواصل مع الدعم في حالة التأخير`
    : `• Contact support if there are delays`;

  const keyboard = [];

  if (canWithdraw) {
    keyboard.push([
      Markup.button.callback(
        isArabic ? '📤 طلب سحب' : '📤 Request Withdrawal',
        'withdraw_request'
      ),
    ]);
  }

  keyboard.push(
    [
      Markup.button.callback(
        isArabic ? '📜 سجل السحوبات' : '📜 Withdrawal History',
        'withdraw_history'
      ),
    ],
    [
      Markup.button.callback(
        isArabic ? '💰 كسب المزيد' : '💰 Earn More',
        'earn'
      ),
    ],
    [
      Markup.button.callback(
        isArabic ? '🔙 القائمة الرئيسية' : '🔙 Main Menu',
        'back_to_menu'
      ),
    ]
  );

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function requestWithdrawal(ctx: BotContext, userId: string, isArabic: boolean) {
  await ctx.reply(
    isArabic
      ? `📤 *طلب سحب*\n\nالرجاء إرسال عنوان محفظة TRC20 الخاصة بك:`
      : `📤 *Withdrawal Request*\n\nPlease send your TRC20 wallet address:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        force_reply: true,
      },
    }
  );

  // Here you would typically set up a conversation state to handle the wallet address input
  // This requires additional state management logic
}

async function showWithdrawHistory(ctx: BotContext, userId: string, isArabic: boolean) {
  const withdrawals = await ctx.prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { requestedAt: 'desc' },
    take: 10,
  });

  if (withdrawals.length === 0) {
    await ctx.editMessageText(
      isArabic
        ? '📜 *سجل السحوبات*\n\nليس لديك أي سحوبات بعد.'
        : '📜 *Withdrawal History*\n\nYou don\'t have any withdrawals yet.',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'withdraw')],
          ],
        },
      }
    );
    return;
  }

  let message = isArabic
    ? `📜 *سجل السحوبات*\n\n`
    : `📜 *Withdrawal History*\n\n`;

  withdrawals.forEach((w, idx) => {
    const status = getStatusText(w.status, isArabic);
    const date = new Date(w.requestedAt).toLocaleDateString(
      isArabic ? 'ar' : 'en',
      { month: 'short', day: 'numeric' }
    );
    
    message += `${idx + 1}. ${date} - ${w.usdtAmount} USDT\n`;
    message += `   ${status}\n\n`;
  });

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'withdraw')],
      ],
    },
  });
}

function getStatusText(status: string, isArabic: boolean): string {
  const statuses: Record<string, { en: string; ar: string }> = {
    PENDING: { en: '⏳ Pending', ar: '⏳ قيد الانتظار' },
    PROCESSING: { en: '⚙️ Processing', ar: '⚙️ قيد المعالجة' },
    COMPLETED: { en: '✅ Completed', ar: '✅ مكتمل' },
    FAILED: { en: '❌ Failed', ar: '❌ فشل' },
    REJECTED: { en: '🚫 Rejected', ar: '🚫 مرفوض' },
    CANCELLED: { en: '❎ Cancelled', ar: '❎ ملغى' },
  };

  return isArabic ? statuses[status]?.ar || status : statuses[status]?.en || status;
}
