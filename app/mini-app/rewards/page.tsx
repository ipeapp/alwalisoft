'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Gift, Calendar, CheckCircle, 
  Coins, Zap, Star, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

function RewardsContent() {
  const { user, updateBalance } = useAuth();
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastClaim, setLastClaim] = useState<Date | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = async () => {
    try {
      const response = await fetch(`/api/rewards/daily?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDailyStreak(data.data.streak || 0);
          setLastClaim(data.data.lastClaim ? new Date(data.data.lastClaim) : null);
          setCanClaim(data.data.canClaim || false);
        }
      }
    } catch (error) {
      console.error('Error checking daily reward:', error);
    }
  };

  const claimDailyReward = async () => {
    setClaiming(true);
    try {
      const response = await fetch('/api/rewards/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update user balance
          updateBalance(user!.balance + data.data.reward);
          
          // Update UI
          setDailyStreak(data.data.newStreak);
          setLastClaim(new Date());
          setCanClaim(false);

          // Show success
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(`🎉 You earned ${data.data.reward} coins!`);
          }
        }
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
    } finally {
      setClaiming(false);
    }
  };

  const getDailyReward = (day: number) => {
    const rewards = [100, 150, 200, 300, 500, 750, 1000];
    return rewards[Math.min(day, rewards.length) - 1] || 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <Link href="/mini-app">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Daily Rewards</h1>
            <p className="text-sm text-purple-300">المكافآت اليومية</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {/* Daily Reward Card */}
        <Card className="bg-gradient-to-r from-pink-600 to-purple-600 border-0 shadow-2xl mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-pink-200 text-sm mb-1">Daily Streak</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-4xl font-bold">{dailyStreak}</h2>
                  <span className="text-xl">Days</span>
                </div>
              </div>
              <Gift className="w-16 h-16 text-white/20" />
            </div>

            <div className="pt-4 border-t border-white/20">
              {canClaim ? (
                <Button
                  onClick={claimDailyReward}
                  disabled={claiming}
                  className="w-full h-14 bg-white text-purple-600 hover:bg-white/90 text-lg font-bold"
                >
                  {claiming ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-600 mr-2"></div>
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Claim {getDailyReward(dailyStreak + 1)} Coins
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-white/50" />
                  <p className="text-white/70">Come back tomorrow!</p>
                  {lastClaim && (
                    <p className="text-xs text-white/50 mt-1">
                      Last claimed: {lastClaim.toLocaleDateString('ar')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Streak Calendar */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            7-Day Streak Rewards
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isCompleted = day <= dailyStreak;
              const isCurrent = day === dailyStreak + 1 && canClaim;
              const reward = getDailyReward(day);

              return (
                <Card 
                  key={day}
                  className={`${
                    isCompleted 
                      ? 'bg-green-600/20 border-green-500/50' 
                      : isCurrent
                        ? 'bg-yellow-600/20 border-yellow-500/50 animate-pulse'
                        : 'bg-white/5 border-white/10'
                  } backdrop-blur-md relative`}
                >
                  <div className="p-3 text-center">
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400 absolute top-1 right-1" />
                    )}
                    <p className="text-xs text-gray-400 mb-1">Day {day}</p>
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-400" />
                      <p className="text-sm font-bold">{reward}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Other Rewards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">More Rewards</h3>
          
          <div className="space-y-3">
            {/* Achievement Rewards */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">Achievement Rewards</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Complete milestones to earn bonus coins
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs">
                        10 Tasks = 5,000 coins
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs">
                        5 Referrals = 10,000 coins
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Referral Rewards */}
            <Link href="/mini-app/referrals">
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Referral Bonuses</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Invite friends and earn rewards
                      </p>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View Referrals →
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Task Rewards */}
            <Link href="/mini-app/tasks">
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Task Rewards</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Complete tasks to earn instant rewards
                      </p>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View Tasks →
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RewardsPage() {
  return (
    <ProtectedRoute>
      <RewardsContent />
    </ProtectedRoute>
  );
}
