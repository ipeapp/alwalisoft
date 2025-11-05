'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, User, Mail, Calendar, Trophy, 
  Coins, Target, Users, TrendingUp, Edit, LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

function ProfileContent() {
  const { user, logout, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    referrals: 0,
    totalEarnings: 0,
    joinedDate: '',
    rank: 0
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const response = await fetch(`/api/users?telegramId=${user?.telegramId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStats({
            tasksCompleted: data.data.tasksCompleted || 0,
            referrals: data.data.referralCount || 0,
            totalEarnings: data.data.balance || 0,
            joinedDate: new Date(data.data.createdAt).toLocaleDateString('ar'),
            rank: data.data.rank || 0
          });
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(
        'Are you sure you want to logout?',
        (confirmed) => {
          if (confirmed) {
            logout();
          }
        }
      );
    } else {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/mini-app">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-sm text-purple-300">ملفك الشخصي</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-2xl mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-purple-200">@{user?.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{user?.level}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <p className="text-2xl font-bold">{user?.balance.toLocaleString()}</p>
                </div>
                <p className="text-xs text-purple-200">Balance</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-5 h-5 text-green-400" />
                  <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
                </div>
                <p className="text-xs text-purple-200">Tasks</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-5 h-5 text-blue-400" />
                  <p className="text-2xl font-bold">{stats.referrals}</p>
                </div>
                <p className="text-xs text-purple-200">Referrals</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="font-medium">@{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Telegram ID</p>
                  <p className="font-medium">{user?.telegramId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium">{stats.joinedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Referral Code</p>
                  <p className="font-medium">{user?.referralCode}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <h3 className="text-lg font-semibold mb-4 mt-6">Statistics</h3>
          
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Earnings</span>
                  <span className="font-bold text-green-400">{stats.totalEarnings.toLocaleString()} coins</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tasks Completed</span>
                  <span className="font-bold">{stats.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Referrals</span>
                  <span className="font-bold">{stats.referrals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Global Rank</span>
                  <span className="font-bold text-purple-400">#{stats.rank || 'N/A'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3 mt-6">
            <Button
              onClick={() => refreshUser()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              🔄 Refresh Profile
            </Button>
            
            <Link href="/mini-app/settings">
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
