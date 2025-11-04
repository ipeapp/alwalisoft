import { BotContext } from '../index';
import { Markup } from 'telegraf';
import { logger } from '../utils/logger';

export async function handleSettings(ctx: BotContext) {
  const callbackQuery = ctx.callbackQuery;
  const data = callbackQuery && 'data' in callbackQuery ? callbackQuery.data : '';
  const isArabic = ctx.session?.language === 'ar';
  const userId = ctx.session?.userId;

  if (!userId) {
    await ctx.answerCbQuery('Please restart the bot with /start');
    return;
  }

  try {
    if (data === 'settings') {
      await showSettings(ctx, userId, isArabic);
    } else if (data === 'settings_language') {
      await toggleLanguage(ctx, userId, isArabic);
    } else if (data === 'settings_notifications') {
      await toggleNotifications(ctx, userId, isArabic);
    }

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error('Settings handler error:', error);
    await ctx.answerCbQuery('An error occurred. Please try again.');
  }
}

async function showSettings(ctx: BotContext, userId: string, isArabic: boolean) {
  const settings = await ctx.prisma.userSettings.findUnique({
    where: { userId },
  });

  const notificationsEnabled = settings?.notificationsEnabled ?? true;
  const currentLanguage = isArabic ? 'العربية' : 'English';

  let message = isArabic
    ? `⚙️ *الإعدادات*\n\n`
    : `⚙️ *Settings*\n\n`;

  message += isArabic
    ? `📊 *الإعدادات الحالية:*\n\n`
    : `📊 *Current Settings:*\n\n`;

  message += isArabic
    ? `🌐 *اللغة:* ${currentLanguage}\n`
    : `🌐 *Language:* ${currentLanguage}\n`;
  message += isArabic
    ? `🔔 *الإشعارات:* ${notificationsEnabled ? 'مفعلة ✅' : 'معطلة ❌'}\n`
    : `🔔 *Notifications:* ${notificationsEnabled ? 'Enabled ✅' : 'Disabled ❌'}\n`;

  const keyboard = [
    [
      Markup.button.callback(
        isArabic ? '🌐 تغيير اللغة' : '🌐 Change Language',
        'settings_language'
      ),
    ],
    [
      Markup.button.callback(
        isArabic
          ? `🔔 ${notificationsEnabled ? 'تعطيل' : 'تفعيل'} الإشعارات`
          : `🔔 ${notificationsEnabled ? 'Disable' : 'Enable'} Notifications`,
        'settings_notifications'
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

async function toggleLanguage(ctx: BotContext, userId: string, isArabic: boolean) {
  const newLanguage = isArabic ? 'en' : 'ar';

  // Update user language
  await ctx.prisma.user.update({
    where: { id: userId },
    data: { languageCode: newLanguage },
  });

  // Update settings
  await ctx.prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      language: newLanguage,
    },
    update: {
      language: newLanguage,
    },
  });

  // Update session
  if (ctx.session) {
    ctx.session.language = newLanguage;
    const sessionKey = `session:${ctx.from?.id}`;
    await ctx.redis.setex(
      sessionKey,
      3600,
      JSON.stringify(ctx.session)
    );
  }

  await ctx.reply(
    newLanguage === 'ar'
      ? `✅ تم تغيير اللغة إلى العربية`
      : `✅ Language changed to English`,
    {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(newLanguage === 'ar' ? 'الإعدادات ⚙️' : '⚙️ Settings', 'settings')],
        ],
      },
    }
  );
}

async function toggleNotifications(ctx: BotContext, userId: string, isArabic: boolean) {
  const settings = await ctx.prisma.userSettings.findUnique({
    where: { userId },
  });

  const currentStatus = settings?.notificationsEnabled ?? true;
  const newStatus = !currentStatus;

  await ctx.prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      notificationsEnabled: newStatus,
    },
    update: {
      notificationsEnabled: newStatus,
    },
  });

  await ctx.reply(
    isArabic
      ? `✅ تم ${newStatus ? 'تفعيل' : 'تعطيل'} الإشعارات`
      : `✅ Notifications ${newStatus ? 'enabled' : 'disabled'}`,
    {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(isArabic ? 'الإعدادات ⚙️' : '⚙️ Settings', 'settings')],
        ],
      },
    }
  );
}
