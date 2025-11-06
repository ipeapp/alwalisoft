'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Target, Coins, TrendingUp, Plus, Settings,
  Bell, CheckCircle, XCircle, Clock, Eye
} from 'lucide-react';

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
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('overview')}
            className={`${activeTab === 'overview' ? 'bg-purple-600' : 'bg-white/10'} hover:bg-purple-700`}
          >
            <Eye className="w-4 h-4 mr-2" />
            نظرة عامة
          </Button>
          <Button
            onClick={() => setActiveTab('tasks')}
            className={`${activeTab === 'tasks' ? 'bg-purple-600' : 'bg-white/10'} hover:bg-purple-700`}
          >
            <Target className="w-4 h-4 mr-2" />
            إدارة المهام
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            className={`${activeTab === 'users' ? 'bg-purple-600' : 'bg-white/10'} hover:bg-purple-700`}
          >
            <Users className="w-4 h-4 mr-2" />
            المستخدمون
          </Button>
          <Button
            onClick={() => setActiveTab('notifications')}
            className={`${activeTab === 'notifications' ? 'bg-purple-600' : 'bg-white/10'} hover:bg-purple-700`}
          >
            <Bell className="w-4 h-4 mr-2" />
            الإشعارات
          </Button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
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
        )}

        {activeTab === 'tasks' && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">إدارة المهام</h3>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة مهمة جديدة
                </Button>
              </div>
              <p className="text-gray-400 text-center py-12">
                قريباً: واجهة إدارة المهام الكاملة
              </p>
            </div>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">إدارة المستخدمين</h3>
              <p className="text-gray-400 text-center py-12">
                قريباً: قائمة المستخدمين والإحصائيات
              </p>
            </div>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">إرسال إشعار</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Bell className="w-4 h-4 mr-2" />
                  إرسال إلى الجميع
                </Button>
              </div>
              <p className="text-gray-400 text-center py-12">
                قريباً: نظام الإشعارات الجماعية
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
