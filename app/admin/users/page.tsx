'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Ban, CheckCircle, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string | null;
  balance: number;
  isBanned: boolean;
  createdAt: string;
  lastActiveAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users?limit=100');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telegramId.includes(searchTerm) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
            <p className="text-sm text-purple-300">عرض وإدارة جميع المستخدمين</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Search Bar */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-6">
          <div className="p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو المعرف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <UsersIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-gray-400">إجمالي المستخدمين</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold">{users.filter(u => !u.isBanned).length}</p>
              <p className="text-xs text-gray-400">نشط</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <Ban className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p className="text-2xl font-bold">{users.filter(u => u.isBanned).length}</p>
              <p className="text-xs text-gray-400">محظور</p>
            </div>
          </Card>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">جاري التحميل...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">
                          {user.firstName || user.username}
                        </h3>
                        {user.isBanned && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                            محظور
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>@{user.username}</p>
                        <p>ID: {user.telegramId}</p>
                        <p>الرصيد: {user.balance.toLocaleString()} عملة</p>
                        <p className="text-xs">
                          آخر نشاط: {new Date(user.lastActiveAt).toLocaleDateString('ar')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={user.isBanned ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {user.isBanned ? 'رفع الحظر' : 'حظر'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredUsers.length === 0 && (
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <div className="p-8 text-center">
                  <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-400">لا توجد نتائج</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
