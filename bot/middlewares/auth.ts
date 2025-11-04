import { BotContext } from '../index';
import { Middleware } from 'telegraf';
import { logger } from '../utils/logger';

// List of commands that don't require authentication
const publicCommands = ['start', 'help'];

export const authMiddleware: Middleware<BotContext> = async (ctx, next) => {
  // Check if this is a command
  if (ctx.message && 'text' in ctx.message) {
    const text = ctx.message.text;
    const isCommand = text.startsWith('/');
    
    if (isCommand) {
      const command = text.split(' ')[0].substring(1);
      
      // Allow public commands
      if (publicCommands.includes(command)) {
        return next();
      }
    }
  }

  // Check if user has a session
  if (!ctx.session) {
    await ctx.reply(
      'Please start the bot first by clicking /start',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 Start Bot', callback_data: 'start' }],
          ],
        },
      }
    );
    return;
  }

  // Check if user is active
  try {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      await ctx.reply(
        'Your account is not active. Please contact support.',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '❓ Contact Support', callback_data: 'support' }],
            ],
          },
        }
      );
      return;
    }

    // Update last active time
    await ctx.prisma.user.update({
      where: { id: ctx.session.userId },
      data: { lastActiveAt: new Date() },
    });

    await next();
  } catch (error) {
    logger.error({ err: error }, 'Auth middleware error:');
    await ctx.reply('An error occurred. Please try again.');
  }
};
