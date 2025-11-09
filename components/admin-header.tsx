'use client';

import { Button } from '@/components/ui/button';
import { Bell, Menu, Settings, LogOut, User } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  onMenuClick: () => void;
  pendingCount?: number;
}

export function AdminHeader({ onMenuClick, pendingCount = 0 }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left: Menu button + Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              لوحة تحكم الأدمن
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              إدارة شاملة للنظام
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link href="/admin/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Settings */}
          <Link href="/admin/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>

          {/* Profile/Logout */}
          <div className="hidden sm:flex items-center gap-2 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">مدير النظام</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
