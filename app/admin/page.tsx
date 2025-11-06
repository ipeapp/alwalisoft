'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Target, Coins, TrendingUp, Plus, Settings,
  Bell, CheckCircle, XCircle, Clock, Eye, Send
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    totalBalance: 0,
    pendingWithdrawals: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/admin/stats?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      console.log('📊 Loading admin stats...');
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Admin stats:', data);
        
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Settings className="w-8 h-8 text-purple-400" />
                لوحة تحكم الأدمن
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                إدارة المستخدمين والمهام والإشعارات
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white">
                <Bell className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-12 h-12 text-blue-200" />
                <TrendingUp className="w-6 h-6 text-blue-200" />
              </div>
              <h3 className="text-blue-200 text-sm mb-1">إجمالي المستخدمين</h3>
              <p className="text-4xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-2">+12% من الشهر الماضي</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-800 border-0 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-12 h-12 text-green-200" />
                <CheckCircle className="w-6 h-6 text-green-200" />
              </div>
              <h3 className="text-green-200 text-sm mb-1">المهام النشطة</h3>
              <p className="text-4xl font-bold">{stats.activeTasks}</p>
              <p className="text-green-200 text-xs mt-2">متاحة للمستخدمين</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 border-0 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Coins className="w-12 h-12 text-yellow-200" />
                <TrendingUp className="w-6 h-6 text-yellow-200" />
              </div>
              <h3 className="text-yellow-200 text-sm mb-1">إجمالي الأرصدة</h3>
              <p className="text-4xl font-bold">{stats.totalBalance.toLocaleString()}</p>
              <p className="text-yellow-200 text-xs mt-2">في النظام</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-800 border-0 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-12 h-12 text-red-200" />
                <Bell className="w-6 h-6 text-red-200" />
              </div>
              <h3 className="text-red-200 text-sm mb-1">طلبات السحب المعلقة</h3>
              <p className="text-4xl font-bold">{stats.pendingWithdrawals}</p>
              <p className="text-red-200 text-xs mt-2">تحتاج مراجعة</p>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Link href="/admin/users">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 hover:scale-105 transition-transform cursor-pointer">
              <div className="p-6 text-center">
                <Users className="w-10 h-10 mx-auto mb-3 text-blue-200" />
                <h3 className="font-bold text-lg">المستخدمون</h3>
                <p className="text-sm text-blue-200 mt-1">{stats.totalUsers} مستخدم</p>
              </div>
            </Card>
          </Link>

          <Link href="/admin/tasks">
            <Card className="bg-gradient-to-br from-green-600 to-green-800 border-0 hover:scale-105 transition-transform cursor-pointer">
              <div className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto mb-3 text-green-200" />
                <h3 className="font-bold text-lg">المهام</h3>
                <p className="text-sm text-green-200 mt-1">{stats.activeTasks} مهمة نشطة</p>
              </div>
            </Card>
          </Link>

          <Link href="/admin/withdrawals">
            <Card className="bg-gradient-to-br from-red-600 to-red-800 border-0 hover:scale-105 transition-transform cursor-pointer">
              <div className="p-6 text-center">
                <Clock className="w-10 h-10 mx-auto mb-3 text-red-200" />
                <h3 className="font-bold text-lg">طلبات السحب</h3>
                <p className="text-sm text-red-200 mt-1">{stats.pendingWithdrawals} معلق</p>
              </div>
            </Card>
          </Link>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 hover:scale-105 transition-transform cursor-pointer">
            <div className="p-6 text-center">
              <Bell className="w-10 h-10 mx-auto mb-3 text-purple-200" />
              <h3 className="font-bold text-lg">الإشعارات</h3>
              <p className="text-sm text-purple-200 mt-1">إرسال</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  النشاط الأخير
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-bold">تسجيل مستخدم جديد</p>
                      <p className="text-xs text-gray-400">منذ دقيقتين</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-bold">إكمال مهمة</p>
                      <p className="text-xs text-gray-400">منذ 5 دقائق</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-bold">طلب سحب جديد</p>
                      <p className="text-xs text-gray-400">منذ 10 دقائق</p>
                    </div>
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  إجراءات سريعة
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full h-20 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-col">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-sm">مهمة جديدة</span>
                  </Button>
                  <Button className="w-full h-20 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-col">
                    <Bell className="w-6 h-6 mb-1" />
                    <span className="text-sm">إشعار عام</span>
                  </Button>
                  <Button className="w-full h-20 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-col">
                    <Users className="w-6 h-6 mb-1" />
                    <span className="text-sm">المستخدمون</span>
                  </Button>
                  <Button className="w-full h-20 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 flex-col">
                    <Settings className="w-6 h-6 mb-1" />
                    <span className="text-sm">الإعدادات</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
      </div>
    </div>
  );
}
