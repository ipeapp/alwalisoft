'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, TrendingUp, Users, Coins, DollarSign, Activity, 
  BarChart3, Zap, Target, Award, Calendar, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface AdminAdStats {
  summary: {
    totalViews: number;
    todayViews: number;
    totalRewards: number;
    activeUsersToday: number;
    avgViewsPerUser: string;
  };
  byType: Array<{
    adType: string;
    views: number;
    totalReward: number;
  }>;
  byPlatform: Array<{
    platform: string;
    views: number;
    totalReward: number;
    estimatedRevenue: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    rewards: number;
  }>;
  topUsers: Array<{
    userId: string;
    name: string;
    views: number;
    totalReward: number;
  }>;
  revenue: {
    byPlatform: Record<string, number>;
    total: number;
    currency: string;
  };
}

export default function AdminAdsPage() {
  const [stats, setStats] = useState<AdminAdStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/ads/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading ad stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  const platformColors: Record<string, string> = {
    ADMOB: 'from-green-500 to-emerald-600',
    UNITY: 'from-purple-500 to-pink-600',
    FACEBOOK: 'from-blue-500 to-indigo-600',
    APPLOVIN: 'from-orange-500 to-red-600',
    TELEGRAM: 'from-cyan-500 to-blue-600'
  };

  const platformIcons: Record<string, string> = {
    ADMOB: '🎯',
    UNITY: '🎮',
    FACEBOOK: '👥',
    APPLOVIN: '📱',
    TELEGRAM: '✈️'
  };
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" />
            📊 Ads Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive advertising statistics and revenue tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadStats}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/ads/events">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              Manage Events
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Play className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.summary.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.summary.todayViews.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">+{stats?.summary.avgViewsPerUser} avg/user</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Coins Paid</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.summary.totalRewards.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">To users</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.summary.activeUsersToday}
              </p>
              <p className="text-xs text-gray-500 mt-1">Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Est. Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${stats?.revenue.total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">USD</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Platform Performance
          </h2>
          <div className="space-y-4">
            {stats?.byPlatform.map((platform) => (
              <div key={platform.platform} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{platformIcons[platform.platform] || '📱'}</span>
                    <div>
                      <p className="font-semibold">{platform.platform}</p>
                      <p className="text-sm text-gray-500">{platform.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${platform.estimatedRevenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {platform.totalReward.toLocaleString()} coins
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${platformColors[platform.platform] || 'from-gray-400 to-gray-500'} transition-all`}
                    style={{ width: `${(platform.views / (stats?.summary.totalViews || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Ad Types Distribution
          </h2>
          <div className="space-y-4">
            {stats?.byType.map((type) => (
              <div key={type.adType} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{type.adType}</p>
                    <p className="text-sm text-gray-500">
                      {type.views.toLocaleString()} views
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      {type.totalReward.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">coins paid</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Last 7 Days Trend
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {stats?.dailyStats.slice(-7).map((day) => {
            const maxViews = Math.max(...(stats?.dailyStats.map(d => d.views) || [1]));
            const height = (day.views / maxViews) * 100;
            return (
              <div key={day.date} className="flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg h-32 flex items-end justify-center relative">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-300"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="absolute top-1 text-xs font-bold text-gray-700">
                    {day.views}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">
                  {day.rewards.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Users */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-600" />
          Top 10 Users
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Views</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Earned</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topUsers.map((user, index) => (
                <tr 
                  key={user.userId} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      {index > 2 && <span className="font-bold text-gray-600">#{index + 1}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.userId.slice(0, 8)}...</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {user.views}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-green-600 font-bold text-lg">
                      {user.totalReward.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">coins</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Revenue Breakdown */}
      <Card className="p-6 mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Estimated Revenue Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats?.revenue.byPlatform || {}).map(([platform, revenue]) => (
            <div key={platform} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{platform}</p>
              <p className="text-2xl font-bold text-green-600">
                ${revenue.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">Total Estimated Revenue</span>
            <span className="text-3xl font-bold text-green-600">
              ${stats?.revenue.total.toFixed(2)} {stats?.revenue.currency}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Based on average eCPM rates. Actual revenue may vary.
          </p>
        </div>
      </Card>
    </div>
  );
}
