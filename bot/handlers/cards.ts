import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';

export async function handleCards(ctx: BotContext) {
  const callbackQuery = ctx.callbackQuery;
  const data = callbackQuery && 'data' in callbackQuery ? callbackQuery.data : '';
  const isArabic = ctx.session?.language === 'ar';

  try {
    if (data === 'cards') {
      await showCardsMenu(ctx, isArabic);
    } else if (data === 'cards_collection') {
      await showCardCollection(ctx, isArabic);
    } else if (data === 'cards_marketplace') {
      await showCardsMarketplace(ctx, isArabic);
    }

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error({ err: error }, 'Cards handler error:');
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}

async function showCardsMenu(ctx: BotContext, isArabic: boolean) {
  let message = isArabic
    ? `🃏 *البطاقات والجواهر*\n\n`
    : `🃏 *Cards & Gems*\n\n`;

  message += isArabic
    ? `اجمع البطاقات النادرة واحصل على مزايا حصرية!\n\n`
    : `Collect rare cards and get exclusive benefits!\n\n`;

  message += isArabic
    ? `💎 *أنواع البطاقات:*\n`
    : `💎 *Card Types:*\n`;
  message += isArabic
    ? `└ عادية: مكافأة +5%\n`
    : `└ Common: +5% bonus\n`;
  message += isArabic
    ? `└ غير عادية: مكافأة +10%\n`
    : `└ Uncommon: +10% bonus\n`;
  message += isArabic
    ? `└ نادرة: مكافأة +15%\n`
    : `└ Rare: +15% bonus\n`;
  message += isArabic
    ? `└ ملحمية: مكافأة +25%\n`
    : `└ Epic: +25% bonus\n`;
  message += isArabic
    ? `└ أسطورية: مكافأة +50%\n\n`
    : `└ Legendary: +50% bonus\n\n`;

  message += isArabic
    ? `💎 *الجواهر:*\n`
    : `💎 *Gems:*\n`;
  message += isArabic
    ? `└ استبدل الجواهر بمكافآت خاصة\n`
    : `└ Exchange gems for special rewards\n`;
  message += isArabic
    ? `└ احصل عليها من إكمال المهام\n`
    : `└ Earn them from completing tasks\n`;
  message += isArabic
    ? `└ استخدمها لشراء البطاقات النادرة`
    : `└ Use them to buy rare cards`;

  const keyboard = [
    [
      Markup.button.callback(isArabic ? '📚 مجموعتي' : '📚 My Collection', 'cards_collection'),
    ],
    [
      Markup.button.callback(isArabic ? '🏪 المتجر' : '🏪 Marketplace', 'cards_marketplace'),
    ],
    [
      Markup.button.callback(isArabic ? '🔙 القائمة الرئيسية' : '🔙 Main Menu', 'back_to_menu'),
    ],
  ];

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function showCardCollection(ctx: BotContext, isArabic: boolean) {
  const userId = ctx.session?.userId;

  if (!userId) {
    await ctx.reply('Please restart the bot with /start');
    return;
  }

  const collection = await ctx.prisma.cardCollection.findMany({
    where: { userId },
    include: { card: true },
  });

  if (collection.length === 0) {
    await ctx.editMessageText(
      isArabic
        ? `📚 *مجموعتي*\n\nليس لديك أي بطاقات بعد.\n\nابدأ بإكمال المهام للحصول على بطاقات!`
        : `📚 *My Collection*\n\nYou don't have any cards yet.\n\nStart completing tasks to get cards!`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'cards')],
          ],
        },
      }
    );
    return;
  }

  let message = isArabic
    ? `📚 *مجموعتي*\n\n`
    : `📚 *My Collection*\n\n`;

  message += isArabic
    ? `إجمالي البطاقات: ${collection.length}\n\n`
    : `Total Cards: ${collection.length}\n\n`;

  collection.forEach((item, idx) => {
    const rarityIcon = getRarityIcon(item.card.rarity);
    message += `${rarityIcon} ${item.card.name} x${item.quantity}\n`;
    message += `   +${item.card.bonusPercentage}% ${isArabic ? 'مكافأة' : 'bonus'}\n\n`;
  });

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'cards')],
      ],
    },
  });
}

async function showCardsMarketplace(ctx: BotContext, isArabic: boolean) {
  await ctx.editMessageText(
    isArabic
      ? `🏪 *المتجر*\n\nقريباً! سيتم إضافة المتجر في التحديث القادم.\n\nستتمكن من:\n• شراء البطاقات النادرة\n• بيع بطاقاتك\n• المزايدة على البطاقات الأسطورية`
      : `🏪 *Marketplace*\n\nComing soon! The marketplace will be added in the next update.\n\nYou will be able to:\n• Buy rare cards\n• Sell your cards\n• Bid on legendary cards`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(isArabic ? '🔙 العودة' : '🔙 Back', 'cards')],
        ],
      },
    }
  );
}

function getRarityIcon(rarity: string): string {
  const icons: Record<string, string> = {
    COMMON: '⚪',
    UNCOMMON: '🟢',
    RARE: '🔵',
    EPIC: '🟣',
    LEGENDARY: '🟡',
  };

  return icons[rarity] || '⚪';
}
