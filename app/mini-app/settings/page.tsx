'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Settings as SettingsIcon, Bell, Globe, 
  Shield, HelpCircle, Info, LogOut, Moon, Sun,
  ChevronRight, User, Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

function SettingsContent() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User className="w-5 h-5 text-purple-400" />,
          label: 'Edit Profile',
          value: user?.username || '',
          action: () => {}
        },
        {
          icon: <Shield className="w-5 h-5 text-blue-400" />,
          label: 'Privacy & Security',
          value: 'Manage',
          action: () => {}
        },
        {
          icon: <Smartphone className="w-5 h-5 text-green-400" />,
          label: 'Telegram ID',
          value: user?.telegramId || '',
          action: null
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell className="w-5 h-5 text-yellow-400" />,
          label: 'Notifications',
          value: notifications ? 'On' : 'Off',
          action: () => setNotifications(!notifications),
          toggle: true
        },
        {
          icon: <Globe className="w-5 h-5 text-cyan-400" />,
          label: 'Language',
          value: language === 'ar' ? 'العربية' : 'English',
          action: () => setLanguage(language === 'ar' ? 'en' : 'ar')
        },
        {
          icon: theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-orange-400" />,
          label: 'Theme',
          value: theme === 'dark' ? 'Dark' : 'Light',
          action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle className="w-5 h-5 text-pink-400" />,
          label: 'Help Center',
          value: '',
          action: () => {}
        },
        {
          icon: <Info className="w-5 h-5 text-gray-400" />,
          label: 'About',
          value: 'v1.0.0',
          action: () => {}
        }
      ]
    }
  ];

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
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-purple-300">الإعدادات</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {/* User Info Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-2xl mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-purple-200 text-sm">@{user?.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {user?.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">
              {section.title}
            </h3>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <div className="divide-y divide-white/10">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={item.action || undefined}
                    disabled={!item.action}
                    className={`w-full p-4 flex items-center gap-4 ${
                      item.action ? 'hover:bg-white/5 active:bg-white/10' : ''
                    } transition-colors`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.label}</p>
                      {item.value && (
                        <p className="text-sm text-gray-400">{item.value}</p>
                      )}
                    </div>

                    {item.action && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}

                    {item.toggle && (
                      <div className={`w-12 h-6 rounded-full ${
                        notifications ? 'bg-green-500' : 'bg-gray-600'
                      } relative transition-colors`}>
                        <div className={`absolute top-1 ${
                          notifications ? 'right-1' : 'left-1'
                        } w-4 h-4 bg-white rounded-full transition-all`}></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card className="bg-red-500/10 border-red-500/30">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center justify-center gap-3 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="font-bold text-red-400">Logout</span>
          </button>
        </Card>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>بوت صدام الولي</p>
          <p className="mt-1">Version 1.0.0</p>
          <p className="mt-2">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
