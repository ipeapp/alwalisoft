import { PrismaClient, AchievementCategory } from '@prisma/client';

const prisma = new PrismaClient();

const achievements = [
  {
    key: 'first_steps',
    icon: '🚀',
    name: 'الخطوات الأولى',
    description: 'أكمل مهمتك الأولى',
    reward: 100,
    target: 1,
    category: 'TASKS' as AchievementCategory
  },
  {
    key: 'task_master_10',
    icon: '🎯',
    name: 'خبير المهام',
    description: 'أكمل 10 مهام',
    reward: 500,
    target: 10,
    category: 'TASKS' as AchievementCategory
  },
  {
    key: 'task_master_50',
    icon: '⭐',
    name: 'أسطورة المهام',
    description: 'أكمل 50 مهمة',
    reward: 2000,
    target: 50,
    category: 'TASKS' as AchievementCategory
  },
  {
    key: 'rich_1k',
    icon: '💰',
    name: 'صاحب الألف',
    description: 'اجمع 1,000 عملة',
    reward: 200,
    target: 1000,
    category: 'BALANCE' as AchievementCategory
  },
  {
    key: 'rich_10k',
    icon: '💎',
    name: 'الثري',
    description: 'اجمع 10,000 عملة',
    reward: 1000,
    target: 10000,
    category: 'BALANCE' as AchievementCategory
  },
  {
    key: 'rich_100k',
    icon: '👑',
    name: 'الملك',
    description: 'اجمع 100,000 عملة',
    reward: 5000,
    target: 100000,
    category: 'BALANCE' as AchievementCategory
  },
  {
    key: 'referrer_5',
    icon: '🤝',
    name: 'المشارك',
    description: 'ادعُ 5 أصدقاء',
    reward: 500,
    target: 5,
    category: 'REFERRALS' as AchievementCategory
  },
  {
    key: 'referrer_20',
    icon: '🌟',
    name: 'المؤثر',
    description: 'ادعُ 20 صديقاً',
    reward: 2000,
    target: 20,
    category: 'REFERRALS' as AchievementCategory
  },
  {
    key: 'referrer_100',
    icon: '🔥',
    name: 'السفير',
    description: 'ادعُ 100 صديق',
    reward: 10000,
    target: 100,
    category: 'REFERRALS' as AchievementCategory
  },
  {
    key: 'streak_7',
    icon: '📅',
    name: 'الأسبوعي',
    description: 'سلسلة 7 أيام متواصلة',
    reward: 700,
    target: 7,
    category: 'ACTIVITY' as AchievementCategory
  },
  {
    key: 'streak_30',
    icon: '🌙',
    name: 'الشهري',
    description: 'سلسلة 30 يوماً متواصلاً',
    reward: 3000,
    target: 30,
    category: 'ACTIVITY' as AchievementCategory
  },
  {
    key: 'gamer',
    icon: '🎮',
    name: 'اللاعب',
    description: 'العب 10 ألعاب',
    reward: 500,
    target: 10,
    category: 'GAMES' as AchievementCategory
  },
  {
    key: 'quiz_master',
    icon: '🧠',
    name: 'عبقري الأسئلة',
    description: 'احصل على 5/5 في Quiz',
    reward: 1000,
    target: 1,
    category: 'GAMES' as AchievementCategory
  },
  {
    key: 'lucky',
    icon: '🎡',
    name: 'محظوظ',
    description: 'اربح 10,000 من Lucky Wheel',
    reward: 2000,
    target: 1,
    category: 'GAMES' as AchievementCategory
  }
];

async function main() {
  console.log('🌱 بدء ملء الإنجازات...');
  
  for (const achievement of achievements) {
    const result = await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: achievement,
      create: achievement
    });
    console.log(`✅ ${result.name} (${result.key})`);
  }
  
  console.log(`\n🎉 تم ملء ${achievements.length} إنجاز بنجاح!`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
