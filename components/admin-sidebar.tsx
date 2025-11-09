'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Target, Clock, PlayCircle, 
  Bell, Calendar, Settings, TrendingUp, Shield,
  ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: 'المستخدمون',
    href: '/admin/users',
    icon: Users,
    badge: null
  },
  {
    title: 'المهام',
    href: '/admin/tasks',
    icon: Target,
    badge: null
  },
  {
    title: 'الإعلانات',
    href: '/admin/ads',
    icon: PlayCircle,
    badge: 'جديد',
    subItems: [
      {
        title: 'الإحصائيات',
        href: '/admin/ads'
      },
      {
        title: 'الأحداث الخاصة',
        href: '/admin/ads/events'
      }
    ]
  },
  {
    title: 'السحوبات',
    href: '/admin/withdrawals',
    icon: Clock,
    badge: null
  },
  {
    title: 'الإشعارات',
    href: '/admin/notifications',
    icon: Bell,
    badge: null
  }
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay للموبايل */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  لوحة الأدمن
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  إدارة كاملة
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const hasSubItems = item.subItems && item.subItems.length > 0;

                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (!hasSubItems && window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`
                        flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {hasSubItems && (
                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                      )}
                    </Link>

                    {/* Sub Items */}
                    {hasSubItems && isActive && (
                      <div className="mr-4 mt-1 space-y-1">
                        {item.subItems!.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => {
                                if (window.innerWidth < 1024) {
                                  onClose();
                                }
                              }}
                              className={`
                                block px-4 py-2 rounded-lg text-sm transition-colors
                                ${isSubActive
                                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                              `}
                            >
                              {subItem.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">الإحصائيات</p>
                  <p className="text-xs opacity-90">محدثة الآن</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
