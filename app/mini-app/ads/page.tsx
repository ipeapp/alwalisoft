'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, TrendingUp, Coins, Clock, Trophy, ArrowLeft, CheckCircle2, 
  Flame, Zap, Star, Gift, TrendingDown, Award, Target, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

interface AdStats {
  todayCount: number;
  totalCount: number;
  totalRewards: number;
  remainingToday: number;
  dailyLimit: number;
  streak?: number;
  multiplier?: number;
  platformStats?: Array<{
    platform: string;
    count: number;
    totalReward: number;
  }>;
}

interface SpecialEvent {
  active: boolean;
  name: string;
  multiplier: number;
  endsAt?: Date;
}

function AdsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdStats | null>(null);
  const [watching, setWatching] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('AUTO');
  const [specialEvent, setSpecialEvent] = useState<SpecialEvent | null>(null);
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);

  useEffect(() => {
    loadStats();
    checkSpecialEvents();
  }, [user]);

  const loadStats = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/ads/stats?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading ad stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSpecialEvents = async () => {
    try {
      const response = await fetch('/api/ads/events');
      const data = await response.json();
      
      if (data.success && data.data?.active) {
        setSpecialEvent(data.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const watchAd = async () => {
    if (!user?.id || watching) return;
    
    setWatching(true);
    
    try {
      console.log('🎬 Starting ad...', { platform: selectedPlatform });
      
      // في الإنتاج، هنا يتم عرض الإعلان الفعلي من المنصة المختارة
      // للتطوير: نحاكي مشاهدة إعلان (3 ثوان)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // إرسال طلب لتسجيل المشاهدة وإضافة المكافأة
      const response = await fetch('/api/ads/watch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          adType: 'REWARDED_VIDEO',
          platform: selectedPlatform === 'AUTO' ? undefined : selectedPlatform
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const reward = data.data.reward || 500;
        const platform = data.data.platform || 'AdMob';
        const bonus = data.data.bonus || 0;
        const streak = data.data.streak || 0;
        
        let message = `✅ تم بنجاح!\n🪙 حصلت على ${reward.toLocaleString()} عملة`;
        
        if (bonus > 0) {
          message += `\n🎁 مكافأة إضافية: ${bonus.toLocaleString()}`;
        }
        
        if (streak > 0) {
          message += `\n🔥 سلسلة: ${streak} أيام متتالية!`;
        }
        
        message += `\n📱 المنصة: ${platform}`;
        
        if (typeof window !== 'undefined') {
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(message);
          } else {
            alert(message);
          }
        }
        
        // إعادة تحميل الإحصائيات
        loadStats();
      } else {
        const errorMsg = data.error || 'فشل في تسجيل المشاهدة';
        
        if (typeof window !== 'undefined') {
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(`❌ ${errorMsg}`);
          } else {
            alert(`❌ ${errorMsg}`);
          }
        }
      }
    } catch (error) {
      console.error('Error watching ad:', error);
      alert('❌ حدث خطأ. حاول مرة أخرى.');
    } finally {
      setWatching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  const remainingToday = stats ? stats.dailyLimit - stats.todayCount : 0;
  const canWatch = remainingToday > 0;
  const currentMultiplier = specialEvent?.multiplier || stats?.multiplier || 1;
  const baseReward = 500;
  const totalReward = Math.floor(baseReward * currentMultiplier);
  const streak = stats?.streak || 0;

  const platforms = [
    { id: 'AUTO', name: 'تلقائي (أفضل)', icon: '🤖', color: 'from-blue-600 to-purple-600' },
    { id: 'ADMOB', name: 'Google AdMob', icon: '🎯', color: 'from-green-600 to-blue-600' },
    { id: 'UNITY', name: 'Unity Ads', icon: '🎮', color: 'from-purple-600 to-pink-600' },
    { id: 'FACEBOOK', name: 'Facebook', icon: '👥', color: 'from-blue-600 to-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-black/30 backdrop-blur-lg border-b border-white/10 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/mini-app">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Play className="w-7 h-7" />
                الإعلانات
              </h1>
              <p className="text-purple-300 text-sm">شاهد واحصل على عملات</p>
            </div>
            {streak > 0 && (
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-full px-3 py-1 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold">{streak}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Special Event Banner */}
        {specialEvent?.active && (
          <Card className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-md border-yellow-500/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="p-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-full">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {specialEvent.name}
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                  </h3>
                  <p className="text-yellow-100 text-sm">
                    مكافأة مضاعفة {specialEvent.multiplier}× لفترة محدودة!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-md border-yellow-500/30 overflow-hidden">
          <div className="p-6 text-center">
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center relative">
              <Coins className="w-10 h-10 text-white" />
              {currentMultiplier > 1 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {currentMultiplier}×
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              اربح {totalReward.toLocaleString()} عملة
            </h2>
            <p className="text-yellow-100">
              لكل إعلان فيديو تشاهده!
              {currentMultiplier > 1 && (
                <span className="block text-sm mt-1">
                  (مكافأة مضاعفة {currentMultiplier}× نشطة!)
                </span>
              )}
            </p>
          </div>
        </Card>

        {/* Streak & Achievements */}
        {streak > 0 && (
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border-orange-500/30 p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-full">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">سلسلة نشطة! 🔥</h3>
                <p className="text-sm text-gray-300">
                  {streak} يوم متتالي من المشاهدة
                </p>
                <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
                    style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  استمر لـ 7 أيام للحصول على مكافأة خاصة!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4 text-center hover:bg-white/10 transition-all">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.todayCount || 0}</p>
            <p className="text-xs text-gray-400">اليوم</p>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4 text-center hover:bg-white/10 transition-all">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalCount || 0}</p>
            <p className="text-xs text-gray-400">المجموع</p>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4 text-center hover:bg-white/10 transition-all">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalRewards.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-400">عملة</p>
          </Card>
        </div>

        {/* Platform Selector */}
        {canWatch && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4">
            <button
              onClick={() => setShowPlatformSelector(!showPlatformSelector)}
              className="w-full flex items-center justify-between text-right"
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-bold">اختر المنصة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {platforms.find(p => p.id === selectedPlatform)?.name || 'تلقائي'}
                </span>
                <div className={`transition-transform ${showPlatformSelector ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </div>
            </button>
            
            {showPlatformSelector && (
              <div className="mt-4 space-y-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setShowPlatformSelector(false);
                    }}
                    className={`w-full p-3 rounded-lg transition-all ${
                      selectedPlatform === platform.id
                        ? `bg-gradient-to-r ${platform.color} text-white`
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="font-medium">{platform.name}</span>
                      {selectedPlatform === platform.id && (
                        <CheckCircle2 className="w-5 h-5 mr-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Watch Ad Button */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 p-6">
          {canWatch ? (
            <>
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                  <Play className="w-12 h-12 text-white ml-1" />
                  {currentMultiplier > 1 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                      +{Math.floor((currentMultiplier - 1) * 100)}%
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">جاهز للمشاهدة؟</h3>
                <p className="text-gray-300 text-sm mb-1">
                  متبقي اليوم: <span className="text-yellow-400 font-bold">{remainingToday}</span> إعلان
                </p>
                <p className="text-gray-400 text-xs">
                  الحد الأقصى: {stats?.dailyLimit} إعلان يومياً
                </p>
              </div>

              <Button
                onClick={watchAd}
                disabled={watching}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {watching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    جارٍ تحميل الإعلان...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2 ml-1" />
                    شاهد الإعلان الآن
                    {currentMultiplier > 1 && (
                      <span className="mr-2 bg-yellow-500/30 px-2 py-1 rounded text-sm">
                        {currentMultiplier}× مكافأة
                      </span>
                    )}
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="bg-green-500/20 border-2 border-green-500 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-400">أحسنت!</h3>
              <p className="text-gray-300 mb-1">
                شاهدت <span className="text-yellow-400 font-bold">{stats?.todayCount}</span> إعلانات اليوم
              </p>
              <p className="text-gray-400 text-sm">
                عد غداً لمشاهدة المزيد والحصول على عملات!
              </p>
              {streak > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 rounded-full px-4 py-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">سلسلة {streak} يوم نشطة!</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Platform Stats */}
        {stats?.platformStats && stats.platformStats.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              إحصائيات المنصات
            </h4>
            <div className="space-y-2">
              {stats.platformStats.map((platformStat) => (
                <div key={platformStat.platform} className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm">{platformStat.platform}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{platformStat.totalReward.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{platformStat.count} إعلانات</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-blue-500/10 backdrop-blur-md border-blue-500/30 p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              كيف تربح عملات؟
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• شاهد إعلان فيديو كامل (30 ثانية)</li>
              <li>• احصل على {totalReward.toLocaleString()} عملة فوراً</li>
              <li>• يمكنك مشاهدة {stats?.dailyLimit} إعلانات يومياً</li>
              {currentMultiplier > 1 && (
                <li className="text-yellow-400">• 🎉 مكافأة مضاعفة {currentMultiplier}× نشطة الآن!</li>
              )}
            </ul>
          </Card>

          <Card className="bg-purple-500/10 backdrop-blur-md border-purple-500/30 p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              مكافآت إضافية
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• سلسلة 3 أيام: +50 عملة لكل إعلان</li>
              <li>• سلسلة 7 أيام: +100 عملة لكل إعلان</li>
              <li>• سلسلة 30 يوم: مكافأة خاصة 10,000 عملة!</li>
              <li>• أحداث خاصة: مضاعفة المكافآت 2×-5×</li>
            </ul>
          </Card>

          <Card className="bg-green-500/10 backdrop-blur-md border-green-500/30 p-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-green-400" />
              استخدم العملات
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• اسحب رصيدك كاش حقيقي</li>
              <li>• افتح صناديق المكافآت</li>
              <li>• تنافس في لوحة المتصدرين</li>
              <li>• اشترِ ميزات حصرية</li>
            </ul>
          </Card>
        </div>

        {/* Daily Progress */}
        {stats && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4">
            <h4 className="font-bold mb-3">تقدم اليوم</h4>
            <div className="relative">
              <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
                  style={{ width: `${(stats.todayCount / stats.dailyLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">
                {stats.todayCount} / {stats.dailyLimit} إعلانات
              </p>
            </div>
            
            {/* Next Milestone */}
            {remainingToday > 0 && (
              <div className="mt-3 p-3 bg-purple-500/10 rounded-lg">
                <p className="text-sm text-center">
                  <Target className="w-4 h-4 inline mr-1" />
                  شاهد {remainingToday} إعلانات أخرى لإكمال الحد اليومي!
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AdsPage() {
  return (
    <ProtectedRoute>
      <AdsContent />
    </ProtectedRoute>
  );
}
