/**
 * سكربت اختبار إكمال المهام
 * يختبر جميع أنواع المهام
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTaskCompletion() {
  console.log('🧪 اختبار شامل لإكمال المهام\n');
  console.log('='.repeat(70));
  
  // 1. جلب مستخدم
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      username: true,
      telegramId: true,
      balance: true
    }
  });
  
  if (!user) {
    console.log('❌ لا يوجد مستخدمين في قاعدة البيانات');
    console.log('   الرجاء إضافة مستخدم أولاً');
    await prisma.$disconnect();
    return;
  }
  
  console.log('\n✅ مستخدم الاختبار:');
  console.log('   Username:', user.username);
  console.log('   UUID:', user.id);
  console.log('   Telegram ID:', user.telegramId);
  console.log('   Balance:', user.balance.toLocaleString());
  
  // 2. جلب المهام
  const tasks = await prisma.task.findMany({
    where: { isActive: true },
    orderBy: { reward: 'asc' }
  });
  
  console.log('\n📋 المهام المتاحة:', tasks.length);
  console.log('='.repeat(70));
  
  // 3. اختبار كل مهمة
  for (const task of tasks) {
    console.log('\n🎯', task.name);
    console.log('   ID:', task.id);
    console.log('   Reward:', task.reward);
    console.log('   Type:', task.verificationData?.type || 'none');
    
    // فحص إذا مكتملة
    const existing = await prisma.taskCompletion.findFirst({
      where: {
        userId: user.id,
        taskId: task.id
      }
    });
    
    if (existing) {
      console.log('   ⚠️ مكتملة مسبقاً في:', existing.completedAt.toISOString());
    } else {
      console.log('   ✅ جاهزة للإكمال');
      
      // تحديد إذا كانت ستكتمل بنجاح أم لا
      const verificationType = task.verificationData?.type;
      let expectedResult = 'unknown';
      
      switch (verificationType) {
        case 'DAILY_LOGIN':
        case 'SOCIAL_SHARE':
        case 'AUTO_COMPLETE':
        case undefined:
        case null:
          expectedResult = '✅ ستكتمل فوراً (تلقائي)';
          break;
        
        case 'REFERRAL_COUNT':
          const minReferrals = task.verificationData.minReferrals;
          const referralCount = await prisma.referral.count({
            where: { referrerId: user.id }
          });
          if (referralCount >= minReferrals) {
            expectedResult = `✅ ستكتمل (لديك ${referralCount} إحالة)`;
          } else {
            expectedResult = `❌ لن تكتمل (لديك ${referralCount}، تحتاج ${minReferrals})`;
          }
          break;
        
        case 'BALANCE_THRESHOLD':
          const minBalance = task.verificationData.minBalance;
          if (user.balance >= minBalance) {
            expectedResult = `✅ ستكتمل (رصيدك ${user.balance.toLocaleString()})`;
          } else {
            expectedResult = `❌ لن تكتمل (رصيدك ${user.balance.toLocaleString()}، تحتاج ${minBalance.toLocaleString()})`;
          }
          break;
        
        case 'TASK_COUNT':
          const minTasks = task.verificationData.minTasks;
          const taskCount = await prisma.taskCompletion.count({
            where: { userId: user.id }
          });
          if (taskCount >= minTasks) {
            expectedResult = `✅ ستكتمل (أكملت ${taskCount} مهمة)`;
          } else {
            expectedResult = `❌ لن تكتمل (أكملت ${taskCount}، تحتاج ${minTasks})`;
          }
          break;
        
        case 'TELEGRAM_CHANNEL':
        case 'TELEGRAM_GROUP':
          expectedResult = '⚠️ تحتاج تحقق من Telegram API';
          break;
        
        default:
          expectedResult = '⚠️ نوع تحقق غير معروف';
      }
      
      console.log('   متوقع:', expectedResult);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ الاختبار اكتمل!');
  console.log('\nللاختبار الفعلي:');
  console.log('1. افتح التطبيق في المتصفح');
  console.log('2. اذهب للمهام');
  console.log('3. اضغط على مهمة تلقائية (مثل "تسجيل الدخول اليومي")');
  console.log('4. اضغط "ابدأ المهمة"');
  console.log('5. يجب أن تكتمل فوراً ✅');
  console.log('\nإذا فشلت:');
  console.log('- افتح Console (F12)');
  console.log('- افحص الأخطاء');
  console.log('- انسخ جميع الرسائل وأرسلها');
  
  await prisma.$disconnect();
}

testTaskCompletion().catch((error) => {
  console.error('❌ خطأ في الاختبار:', error);
  prisma.$disconnect();
});
