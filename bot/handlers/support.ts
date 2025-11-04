import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';

export async function handleSupport(ctx: BotContext) {
  const isArabic = ctx.session?.language === 'ar';

  try {
    let message = isArabic
      ? `❓ *الدعم والمساعدة*\n\n`
      : `❓ *Support & Help*\n\n`;

    message += isArabic
      ? `نحن هنا لمساعدتك! اختر أحد الخيارات أدناه:\n\n`
      : `We're here to help! Choose one of the options below:\n\n`;

    message += isArabic
      ? `💬 *الأسئلة الشائعة:*\n\n`
      : `💬 *Frequently Asked Questions:*\n\n`;

    message += isArabic
      ? `*س: كيف أكسب العملات؟*\n`
      : `*Q: How do I earn coins?*\n`;
    message += isArabic
      ? `ج: من خلال إكمال المهام، دعوة الأصدقاء، ولعب الألعاب.\n\n`
      : `A: By completing tasks, inviting friends, and playing games.\n\n`;

    message += isArabic
      ? `*س: متى يمكنني السحب؟*\n`
      : `*Q: When can I withdraw?*\n`;
    message += isArabic
      ? `ج: عندما تصل إلى 5,000,000 عملة (5 USDT).\n\n`
      : `A: When you reach 5,000,000 coins (5 USDT).\n\n`;

    message += isArabic
      ? `*س: كم يستغرق معالجة السحب؟*\n`
      : `*Q: How long does withdrawal processing take?*\n`;
    message += isArabic
      ? `ج: عادةً 24-48 ساعة.\n\n`
      : `A: Usually 24-48 hours.\n\n`;

    message += isArabic
      ? `*س: كيف يعمل نظام الإحالات؟*\n`
      : `*Q: How does the referral system work?*\n`;
    message += isArabic
      ? `ج: لديك 3 مستويات - كل مستوى يمنحك مكافأة وعمولة على أرباح المحالين.\n\n`
      : `A: You have 3 levels - each level gives you a reward and commission on referral earnings.\n\n`;

    message += isArabic
      ? `📞 *للتواصل المباشر:*\n`
      : `📞 *For Direct Contact:*\n`;
    message += isArabic
      ? `استخدم الأزرار أدناه للتواصل مع فريق الدعم.`
      : `Use the buttons below to contact our support team.`;

    const keyboard = [
      [
        Markup.button.url(
          isArabic ? '📱 تواصل مع الدعم' : '📱 Contact Support',
          'https://t.me/your_support_username'
        ),
      ],
      [
        Markup.button.url(
          isArabic ? '📢 قناة التحديثات' : '📢 Updates Channel',
          'https://t.me/your_channel'
        ),
      ],
      [
        Markup.button.url(
          isArabic ? '👥 مجموعة المجتمع' : '👥 Community Group',
          'https://t.me/your_group'
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

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error({ err: error }, 'Support handler error:');
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}
