/**
 * Notification Helper Functions
 * وظائف مساعدة لإنشاء الإشعارات
 */

import { prisma } from './prisma';
import { NotificationType } from '@prisma/client';

/**
 * إنشاء إشعار جديد
 */
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}) {
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
    type: 'REWARD_RECEIVED',
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
    type: 'REFERRAL_JOINED',
    title: '🎉 إحالة جديدة!',
    message: `انضم ${referredUsername} عبر رابط الإحالة الخاص بك وحصلت على ${reward.toLocaleString()} عملة.`
  });
}

/**
 * إشعار عند المطالبة بالمكافأة اليومية
 */
export async function notifyDailyRewardClaimed(userId: string, reward: number, streak: number) {
  return createNotification({
    userId,
    type: 'REWARD_RECEIVED',
    title: '🎁 مكافأة يومية!',
    message: `حصلت على ${reward.toLocaleString()} عملة! سلسلتك الحالية: ${streak} أيام.`
  });
}

/**
 * إشعار عند الفوز في لعبة
 */
export async function notifyGameWin(userId: string, gameName: string, reward: number) {
  return createNotification({
    userId,
    type: 'REWARD_RECEIVED',
    title: '🎮 فوز في اللعبة!',
    message: `فزت في ${gameName} وحصلت على ${reward.toLocaleString()} عملة!`
  });
}

/**
 * إشعار عند فتح إنجاز
 */
export async function notifyAchievementUnlocked(userId: string, achievementName: string, reward: number) {
  return createNotification({
    userId,
    type: 'REWARD_RECEIVED',
    title: '🏆 إنجاز جديد!',
    message: `تم فتح إنجاز "${achievementName}"! احصل على ${reward.toLocaleString()} عملة.`
  });
}

/**
 * إشعار عند الموافقة على السحب
 */
export async function notifyWithdrawalApproved(userId: string, amount: number) {
  return createNotification({
    userId,
    type: 'WITHDRAWAL_STATUS',
    title: '✅ تمت الموافقة على السحب',
    message: `تمت الموافقة على طلب السحب بمبلغ ${amount.toLocaleString()} عملة.`
  });
}

/**
 * إشعار عند رفض السحب
 */
export async function notifyWithdrawalRejected(userId: string, amount: number, reason: string) {
  return createNotification({
    userId,
    type: 'WITHDRAWAL_STATUS',
    title: '❌ تم رفض السحب',
    message: `تم رفض طلب السحب بمبلغ ${amount.toLocaleString()} عملة. السبب: ${reason}`
  });
}

/**
 * إشعار عند إضافة مهمة جديدة
 */
export async function notifyNewTask(userId: string, taskName: string, reward: number) {
  return createNotification({
    userId,
    type: 'TASK_AVAILABLE',
    title: '📋 مهمة جديدة!',
    message: `مهمة جديدة متاحة: ${taskName}. المكافأة: ${reward.toLocaleString()} عملة.`
  });
}

/**
 * إشعار نظام عام
 */
export async function notifySystem(userId: string, title: string, message: string) {
  return createNotification({
    userId,
    type: 'SYSTEM_MESSAGE',
    title,
    message
  });
}

/**
 * إشعار عند الترقية لمستوى جديد
 */
export async function notifyLevelUp(userId: string, newLevel: string) {
  return createNotification({
    userId,
    type: 'LEVEL_UP',
    title: '⬆️ ترقية المستوى!',
    message: `تهانينا! تمت ترقيتك إلى مستوى ${newLevel}.`
  });
}
