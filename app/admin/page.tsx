'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Target, Coins, TrendingUp, Plus, Settings,
  Bell, CheckCircle, XCircle, Clock, Eye, Send, DollarSign,
  Activity, Award, Zap, PlayCircle, Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeTasks: 0,
    totalBalance: 0,
    pendingWithdrawals: 0,
    todayTasks: 0,
    todayRevenue: 0,
    todaySignups: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/admin/stats?_t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            totalUsers: data.data.totalUsers || 0,
            activeUsers: data.data.activeUsers || 0,
            activeTasks: data.data.activeTasks || 0,
            totalBalance: data.data.totalBalance || 0,
            pendingWithdrawals: data.data.pendingWithdrawals || 0,
            todayTasks: data.data.todayTasks || 0,
            todayRevenue: data.data.todayRevenue || 0,
            todaySignups: data.data.todaySignups || 0
          });
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-medium">إجمالي المستخدمين</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">
                +{stats.todaySignups} اليوم
              </p>
            </div>
          </Card>

          {/* Active Tasks */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-medium">المهام النشطة</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeTasks}</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">
                {stats.todayTasks} مُكتملة اليوم
              </p>
            </div>
          </Card>

          {/* Total Balance */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-medium">إجمالي الأرصدة</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBalance.toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">في النظام</p>
            </div>
          </Card>

          {/* Pending Withdrawals */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <Bell className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-medium">طلبات السحب المعلقة</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingWithdrawals}</p>
              <p className="text-red-600 dark:text-red-400 text-xs mt-2 font-medium">تحتاج مراجعة</p>
            </div>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-0 shadow-lg text-white">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm">المستخدمون النشطون</p>
                  <p className="text-3xl font-bold">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg text-white">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-purple-100 text-sm">إنجازات اليوم</p>
                  <p className="text-3xl font-bold">{stats.todayTasks}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-0 shadow-lg text-white">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-pink-100 text-sm">الإيرادات اليوم</p>
                  <p className="text-3xl font-bold">${stats.todayRevenue}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured: Ads System */}
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 border-0 shadow-xl mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
                  🆕 جديد!
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <PlayCircle className="w-8 h-8" />
                  نظام الإعلانات الكامل
                </h2>
                <p className="text-purple-100 text-lg mb-4">
                  إحصائيات شاملة + Anti-Cheat System + أحداث خاصة
                </p>
                <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Trust Score Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Revenue Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Special Events</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/admin/ads">
                  <Button className="bg-white hover:bg-gray-100 text-purple-600 font-bold shadow-lg">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    الإحصائيات
                  </Button>
                </Link>
                <Link href="/admin/ads/events">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Calendar className="w-5 h-5 mr-2" />
                    الأحداث الخاصة
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">الوصول السريع</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                <div className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">المستخدمون</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stats.totalUsers} مستخدم</p>
                </div>
              </Card>
            </Link>

            <Link href="/admin/tasks">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                <div className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">المهام</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stats.activeTasks} نشطة</p>
                </div>
              </Card>
            </Link>

            <Link href="/admin/withdrawals">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                <div className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">السحوبات</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stats.pendingWithdrawals} معلق</p>
                </div>
              </Card>
            </Link>

            <Link href="/admin/ads">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                <div className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">الإعلانات</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">الإحصائيات</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <TrendingUp className="w-5 h-5 text-green-500" />
                النشاط الأخير
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">تسجيل مستخدم جديد</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">منذ دقيقتين</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">إكمال مهمة</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">منذ 5 دقائق</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">طلب سحب جديد</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">منذ 10 دقائق</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Zap className="w-5 h-5 text-purple-500" />
                إجراءات سريعة
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/tasks/create">
                  <Button className="w-full h-24 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex-col text-white shadow-lg">
                    <Plus className="w-6 h-6 mb-2" />
                    <span>مهمة جديدة</span>
                  </Button>
                </Link>
                
                <Link href="/admin/notifications">
                  <Button className="w-full h-24 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex-col text-white shadow-lg">
                    <Bell className="w-6 h-6 mb-2" />
                    <span>إشعار عام</span>
                  </Button>
                </Link>
                
                <Link href="/admin/users">
                  <Button className="w-full h-24 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-col text-white shadow-lg">
                    <Users className="w-6 h-6 mb-2" />
                    <span>المستخدمون</span>
                  </Button>
                </Link>
                
                <Link href="/admin/withdrawals">
                  <Button className="w-full h-24 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-col text-white shadow-lg">
                    <Eye className="w-6 h-6 mb-2" />
                    <span>المراجعات</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
