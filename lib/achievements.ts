import { prisma } from './prisma';

/**
 * تحديث تقدم المستخدم في إنجاز معين
 */
export async function updateAchievementProgress(
  userId: string,
  achievementKey: string,
  progress: number
) {
  try {
    // جلب الإنجاز
    const achievement = await prisma.achievement.findUnique({
      where: { key: achievementKey }
    });
    
    if (!achievement) {
      return null;
    }
    
    // جلب أو إنشاء UserAchievement
    const userAch = await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id
        }
      },
      update: {
        progress: Math.min(progress, achievement.target)
      },
      create: {
        userId,
        achievementId: achievement.id,
        progress: Math.min(progress, achievement.target)
      }
    });
    
    // إذا وصل للهدف ولم يُفتح بعد
    if (progress >= achievement.target && !userAch.isUnlocked) {
      await prisma.userAchievement.update({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        },
        data: {
          isUnlocked: true,
          unlockedAt: new Date()
        }
      });
      
      return { unlocked: true, achievement };
    }
    
    return { unlocked: false, achievement };
    
  } catch (error) {
    console.error('Error updating achievement progress:', error);
    return null;
  }
}

/**
 * التحقق من جميع الإنجازات للمستخدم
 */
export async function checkAchievements(userId: string) {
  try {
    // جلب إحصائيات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        statistics: true
      }
    });
    
    if (!user) return;
    
    const stats = user.statistics;
    
    // التحقق من إنجازات المهام
    if (user.tasksCompleted >= 1) {
      await updateAchievementProgress(userId, 'first_steps', user.tasksCompleted);
    }
    if (user.tasksCompleted >= 10) {
      await updateAchievementProgress(userId, 'task_master_10', user.tasksCompleted);
    }
    if (user.tasksCompleted >= 50) {
      await updateAchievementProgress(userId, 'task_master_50', user.tasksCompleted);
    }
    
    // التحقق من إنجازات الرصيد
    if (user.balance >= 1000) {
      await updateAchievementProgress(userId, 'rich_1k', user.balance);
    }
    if (user.balance >= 10000) {
      await updateAchievementProgress(userId, 'rich_10k', user.balance);
    }
    if (user.balance >= 100000) {
      await updateAchievementProgress(userId, 'rich_100k', user.balance);
    }
    
    // التحقق من إنجازات الإحالات
    if (user.referralCount >= 5) {
      await updateAchievementProgress(userId, 'referrer_5', user.referralCount);
    }
    if (user.referralCount >= 20) {
      await updateAchievementProgress(userId, 'referrer_20', user.referralCount);
    }
    if (user.referralCount >= 100) {
      await updateAchievementProgress(userId, 'referrer_100', user.referralCount);
    }
    
    // التحقق من إنجازات النشاط (Streak)
    if (stats) {
      if (stats.currentStreak >= 7) {
        await updateAchievementProgress(userId, 'streak_7', stats.currentStreak);
      }
      if (stats.currentStreak >= 30) {
        await updateAchievementProgress(userId, 'streak_30', stats.currentStreak);
      }
      
      // التحقق من إنجازات الألعاب
      if (stats.gamesPlayed >= 10) {
        await updateAchievementProgress(userId, 'gamer', stats.gamesPlayed);
      }
    }
    
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

/**
 * التحقق من إنجاز معين للمستخدم
 */
export async function checkSpecificAchievement(
  userId: string,
  achievementKey: string,
  currentValue: number
) {
  const result = await updateAchievementProgress(userId, achievementKey, currentValue);
  return result?.unlocked || false;
}
