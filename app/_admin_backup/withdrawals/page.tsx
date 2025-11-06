'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock, Wallet } from 'lucide-react';
import Link from 'next/link';

interface Withdrawal {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: string;
  status: string;
  createdAt: string;
  user: {
    username: string;
    telegramId: string;
  };
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const response = await fetch('/api/withdrawals?limit=50');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWithdrawals(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/withdrawals/${id}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('تم الموافقة على الطلب!');
        loadWithdrawals();
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/withdrawals/${id}/reject`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('تم رفض الطلب');
        loadWithdrawals();
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-400';
      case 'PENDING': return 'text-yellow-400';
      case 'REJECTED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const pendingCount = withdrawals.filter(w => w.status === 'PENDING').length;

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
            <h1 className="text-2xl font-bold">طلبات السحب</h1>
            <p className="text-sm text-purple-300">مراجعة وموافقة السحوبات</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold">{withdrawals.length}</p>
              <p className="text-xs text-gray-400">إجمالي الطلبات</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-gray-400">معلقة</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold">
                {withdrawals.filter(w => w.status === 'COMPLETED').length}
              </p>
              <p className="text-xs text-gray-400">مكتملة</p>
            </div>
          </Card>
        </div>

        {/* Withdrawals List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">جاري التحميل...</p>
          </div>
        ) : withdrawals.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-8 text-center">
              <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">لا توجد طلبات سحب</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <Card key={withdrawal.id} className="bg-white/5 backdrop-blur-md border-white/10">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">@{withdrawal.user.username}</h3>
                        {getStatusIcon(withdrawal.status)}
                        <span className={`text-sm ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>المبلغ: <span className="text-yellow-400 font-bold">{withdrawal.amount.toLocaleString()}</span> عملة</p>
                        <p>الطريقة: {withdrawal.paymentMethod}</p>
                        <p>التفاصيل: {withdrawal.paymentDetails}</p>
                        <p className="text-xs">
                          التاريخ: {new Date(withdrawal.createdAt).toLocaleString('ar')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {withdrawal.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(withdrawal.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        موافقة
                      </Button>
                      <Button
                        onClick={() => handleReject(withdrawal.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        رفض
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
