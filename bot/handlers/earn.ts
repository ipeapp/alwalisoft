import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';

export async function handleEarn(ctx: BotContext) {
  const isArabic = ctx.session?.language === 'ar';

  try {
    let message = isArabic
      ? `💰 *طرق كسب العملات*\n\n`
      : `💰 *Ways to Earn Coins*\n\n`;

    message += isArabic
      ? `هناك عدة طرق لكسب العملات في بوتنا:\n\n`
      : `There are several ways to earn coins in our bot:\n\n`;

    message += isArabic
      ? `📋 *إكمال المهام*\n`
      : `📋 *Complete Tasks*\n`;
    message += isArabic
      ? `└ مهام القنوات: 5,000 عملة\n`
      : `└ Channel tasks: 5,000 coins\n`;
    message += isArabic
      ? `└ مهام المجموعات: 5,000 عملة\n`
      : `└ Group tasks: 5,000 coins\n`;
    message += isArabic
      ? `└ مهام الفيديو: 1,000-5,000 عملة\n`
      : `└ Video tasks: 1,000-5,000 coins\n`;
    message += isArabic
      ? `└ المهام الخاصة: تصل إلى 20,000 عملة\n\n`
      : `└ Special tasks: up to 20,000 coins\n\n`;

    message += isArabic
      ? `👥 *دعوة الأصدقاء*\n`
      : `👥 *Invite Friends*\n`;
    message += isArabic
      ? `└ المستوى 1: 1,000 عملة + 10% عمولة\n`
      : `└ Level 1: 1,000 coins + 10% commission\n`;
    message += isArabic
      ? `└ المستوى 2: 500 عملة + 5% عمولة\n`
      : `└ Level 2: 500 coins + 5% commission\n`;
    message += isArabic
      ? `└ المستوى 3: 250 عملة + 2% عمولة\n\n`
      : `└ Level 3: 250 coins + 2% commission\n\n`;

    message += isArabic
      ? `🎮 *لعب الألعاب*\n`
      : `🎮 *Play Games*\n`;
    message += isArabic
      ? `└ عجلة الحظ اليومية: تصل إلى 10,000 عملة\n`
      : `└ Daily Lucky Wheel: up to 10,000 coins\n`;
    message += isArabic
      ? `└ اضرب الهدف: تصل إلى 5,000 عملة\n`
      : `└ Target Hit: up to 5,000 coins\n`;
    message += isArabic
      ? `└ تحدي الأسئلة: تصل إلى 15,000 عملة\n\n`
      : `└ Quiz Challenge: up to 15,000 coins\n\n`;

    message += isArabic
      ? `📅 *المكافآت اليومية*\n`
      : `📅 *Daily Bonuses*\n`;
    message += isArabic
      ? `└ تسجيل الدخول اليومي: 500-2,000 عملة\n`
      : `└ Daily login: 500-2,000 coins\n`;
    message += isArabic
      ? `└ سلسلة الإنجازات: مكافآت إضافية\n\n`
      : `└ Streak bonuses: extra rewards\n\n`;

    message += isArabic
      ? `🃏 *بيع البطاقات*\n`
      : `🃏 *Sell Cards*\n`;
    message += isArabic
      ? `└ بطاقات نادرة: قيمة عالية\n`
      : `└ Rare cards: high value\n`;
    message += isArabic
      ? `└ المتجر: بيع وشراء\n\n`
      : `└ Marketplace: buy & sell\n\n`;

    message += isArabic
      ? `⭐ *العروض الخاصة*\n`
      : `⭐ *Special Offers*\n`;
    message += isArabic
      ? `└ عروض فلاش: مكافآت مضاعفة\n`
      : `└ Flash sales: double rewards\n`;
    message += isArabic
      ? `└ عروض العطلات: مكافآت إضافية\n`
      : `└ Holiday events: bonus rewards\n`;

    const keyboard = [
      [
        Markup.button.callback(isArabic ? '📋 المهام' : '📋 Tasks', 'tasks'),
        Markup.button.callback(isArabic ? '👥 الإحالات' : '👥 Referrals', 'referrals'),
      ],
      [
        Markup.button.callback(isArabic ? '🎮 الألعاب' : '🎮 Games', 'games'),
        Markup.button.callback(isArabic ? '🃏 البطاقات' : '🃏 Cards', 'cards'),
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
    logger.error('Earn handler error:', error);
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}
