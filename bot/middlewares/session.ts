import { BotContext } from '../index';
import { Middleware } from 'telegraf';
import { logger } from '../utils/logger';

export const sessionMiddleware: Middleware<BotContext> = async (ctx, next) => {
  const telegramId = ctx.from?.id;
  
  if (!telegramId) {
    return next();
  }

  try {
    // Try to load session from Redis
    const sessionKey = `session:${telegramId}`;
    const sessionData = await ctx.redis.get(sessionKey);

    if (sessionData) {
      ctx.session = JSON.parse(sessionData);
    } else {
      // Check if user exists in database
      const user = await ctx.prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
      });

      if (user) {
        ctx.session = {
          userId: user.id,
          telegramId: Number(user.telegramId),
          language: user.languageCode,
        };

        // Save to Redis
        await ctx.redis.setex(
          sessionKey,
          3600, // 1 hour
          JSON.stringify(ctx.session)
        );
      }
    }

    await next();
  } catch (error) {
    logger.error({ err: error }, 'Session middleware error:');
    await next();
  }
};
