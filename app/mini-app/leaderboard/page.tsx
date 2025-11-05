'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Trophy, Medal, Crown, TrendingUp, 
  User, Coins, Target, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

interface LeaderboardUser {
  id: string;
  username: string;
  firstName: string;
  balance: number;
  tasksCompleted: number;
  level: string;
  rank?: number;
}

function LeaderboardContent() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'balance' | 'tasks'>('balance');

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?sortBy=${filter}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-gray-400 font-bold">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'from-yellow-600 to-orange-600';
    if (rank === 2) return 'from-gray-400 to-gray-600';
    if (rank === 3) return 'from-orange-600 to-red-600';
    return 'from-purple-600/50 to-blue-600/50';
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
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-sm text-purple-300">لوحة المتصدرين</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setFilter('balance')}
            className={`flex-1 ${
              filter === 'balance'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-white/10'
            }`}
          >
            <Coins className="w-4 h-4 mr-2" />
            By Balance
          </Button>
          <Button
            onClick={() => setFilter('tasks')}
            className={`flex-1 ${
              filter === 'tasks'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-white/10'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            By Tasks
          </Button>
        </div>

        {/* Top 3 */}
        {!loading && leaderboard.length >= 3 && (
          <div className="mb-6">
            <div className="flex items-end justify-center gap-2 mb-6">
              {/* 2nd Place */}
              <Card className="bg-gradient-to-b from-gray-400 to-gray-600 border-0 flex-1 pb-4">
                <div className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold truncate">{leaderboard[1]?.firstName}</p>
                  <p className="text-2xl font-bold mt-2">
                    {filter === 'balance' 
                      ? leaderboard[1]?.balance.toLocaleString()
                      : leaderboard[1]?.tasksCompleted}
                  </p>
                  <p className="text-xs text-white/70">2nd Place</p>
                </div>
              </Card>

              {/* 1st Place */}
              <Card className="bg-gradient-to-b from-yellow-500 to-orange-600 border-0 flex-1 pb-8">
                <div className="p-4 text-center">
                  <Crown className="w-10 h-10 mx-auto mb-2 text-white animate-pulse" />
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <p className="font-bold truncate">{leaderboard[0]?.firstName}</p>
                  <p className="text-3xl font-bold mt-2">
                    {filter === 'balance'
                      ? leaderboard[0]?.balance.toLocaleString()
                      : leaderboard[0]?.tasksCompleted}
                  </p>
                  <p className="text-xs text-white/70">Champion 🏆</p>
                </div>
              </Card>

              {/* 3rd Place */}
              <Card className="bg-gradient-to-b from-orange-600 to-red-700 border-0 flex-1 pb-4">
                <div className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold truncate">{leaderboard[2]?.firstName}</p>
                  <p className="text-2xl font-bold mt-2">
                    {filter === 'balance'
                      ? leaderboard[2]?.balance.toLocaleString()
                      : leaderboard[2]?.tasksCompleted}
                  </p>
                  <p className="text-xs text-white/70">3rd Place</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Rest of Leaderboard */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            All Rankings
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <div className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">No rankings yet</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((item, index) => {
                const isCurrentUser = item.id === user?.id;
                const rank = index + 1;

                return (
                  <Card 
                    key={item.id}
                    className={`${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-500/50' 
                        : 'bg-white/5 border-white/10'
                    } backdrop-blur-md`}
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        {getRankIcon(rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold truncate">
                            {item.firstName}
                          </p>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 bg-purple-500 rounded-full text-xs">You</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">@{item.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300">
                            {item.level}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {filter === 'balance' ? (
                            <Coins className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Target className="w-4 h-4 text-green-400" />
                          )}
                          <p className="text-xl font-bold">
                            {filter === 'balance'
                              ? item.balance.toLocaleString()
                              : item.tasksCompleted}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {filter === 'balance' ? 'coins' : 'tasks'}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Your Position */}
        {user && !loading && (
          <Card className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 border-0">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-200 mb-1">Your Position</p>
                  <p className="text-2xl font-bold">
                    #{leaderboard.findIndex(u => u.id === user.id) + 1 || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-200 mb-1">Your Score</p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <p className="text-2xl font-bold">
                      {filter === 'balance' 
                        ? user.balance.toLocaleString()
                        : '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardContent />
    </ProtectedRoute>
  );
}
