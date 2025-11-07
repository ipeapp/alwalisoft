import { prisma } from './prisma';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

/**
 * إنشاء إشعار جديد
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        data: params.data || null
      }
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * إشعار عند إكمال مهمة
 */
export async function notifyTaskCompleted(userId: string, taskName: string, reward: number) {
  return createNotification({
    userId,
    type: 'TASK_COMPLETE',
    title: '✅ مهمة مكتملة!',
    message: `تم إكمال مهمة "${taskName}" وحصلت على ${reward.toLocaleString()} عملة.`
  });
}

/**
 * إشعار عند إضافة إحالة
 */
export async function notifyReferralAdded(userId: string, referredUsername: string, reward: number) {
  return createNotification({
    userId,
    type: 'REFERRAL_REWARD',
    title: '🤝 صديق جديد انضم!',
    message: `انضم ${referredUsername} باستخدام رابطك. حصلت على ${reward.toLocaleString()} عملة!`
  });
}

/**
 * إشعار عند الحصول على مكافأة يومية
 */
export async function notifyDailyRewardClaimed(userId: string, reward: number, streak: number) {
  return createNotification({
    userId,
    type: 'DAILY_REWARD',
    title: '🎁 مكافأة يومية!',
    message: `حصلت على ${reward.toLocaleString()} عملة! سلسلة أيامك: ${streak} يوم 🔥`
  });
}

/**
 * إشعار عند الفوز في لعبة
 */
export async function notifyGameWin(userId: string, gameName: string, reward: number) {
  return createNotification({
    userId,
    type: 'GAME_REWARD',
    title: '🎮 فوز في اللعبة!',
    message: `فزت بـ ${reward.toLocaleString()} عملة في لعبة ${gameName}!`
  });
}

/**
 * إشعار عند فتح إنجاز
 */
export async function notifyAchievementUnlocked(userId: string, achievementName: string, reward: number) {
  return createNotification({
    userId,
    type: 'ACHIEVEMENT_UNLOCKED',
    title: '🏆 إنجاز جديد!',
    message: `تهانينا! حققت إنجاز "${achievementName}" وحصلت على ${reward.toLocaleString()} عملة.`
  });
}

/**
 * إشعار عند الموافقة على السحب
 */
export async function notifyWithdrawalApproved(userId: string, amount: number, txHash: string) {
  return createNotification({
    userId,
    type: 'WITHDRAWAL_APPROVED',
    title: '✅ تم الموافقة على السحب',
    message: `تم الموافقة على طلب سحب ${amount.toLocaleString()} عملة.\nTransaction: ${txHash}`,
    data: { txHash, amount }
  });
}

/**
 * إشعار عند رفض السحب
 */
export async function notifyWithdrawalRejected(userId: string, amount: number, reason?: string) {
  return createNotification({
    userId,
    type: 'WITHDRAWAL_REJECTED',
    title: '❌ تم رفض السحب',
    message: `تم رفض طلب سحب ${amount.toLocaleString()} عملة.${reason ? `\nالسبب: ${reason}` : ''}`,
    data: { amount, reason }
  });
}

/**
 * إشعار عند إضافة مهمة جديدة
 */
export async function notifyNewTask(userIds: string[], taskName: string, reward: number) {
  const notifications = userIds.map(userId => 
    createNotification({
      userId,
      type: 'NEW_TASK',
      title: '📋 مهمة جديدة متاحة!',
      message: `مهمة جديدة: "${taskName}". المكافأة: ${reward.toLocaleString()} عملة.`
    })
  );
  
  return Promise.all(notifications);
}

/**
 * إشعار نظام (من الأدمن)
 */
export async function notifySystem(userIds: string[], title: string, message: string) {
  const notifications = userIds.map(userId => 
    createNotification({
      userId,
      type: 'SYSTEM_ANNOUNCEMENT',
      title,
      message
    })
  );
  
  return Promise.all(notifications);
}

/**
 * إشعار عند رفع المستوى
 */
export async function notifyLevelUp(userId: string, newLevel: string) {
  return createNotification({
    userId,
    type: 'LEVEL_UP',
    title: '⬆️ ترقية!',
    message: `تهانينا! لقد وصلت إلى مستوى ${newLevel}!`
  });
}
