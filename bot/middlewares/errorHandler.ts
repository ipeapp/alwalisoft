import { BotContext } from '../index';
import { Middleware } from 'telegraf';
import { logger } from '../utils/logger';

export const errorHandler: Middleware<BotContext> = async (ctx, next) => {
  try {
    await next();
  } catch (error: any) {
    logger.error({
      error: error.message,
      stack: error.stack,
      update: ctx.update,
    }, 'Bot error');

    try {
      await ctx.reply(
        '❌ An error occurred while processing your request. Please try again.',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }],
              [{ text: '❓ Contact Support', callback_data: 'support' }],
            ],
          },
        }
      );
    } catch (replyError: any) {
      logger.error({ err: replyError }, 'Failed to send error message');
    }
  }
};
