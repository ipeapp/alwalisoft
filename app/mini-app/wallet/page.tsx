'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Wallet as WalletIcon, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, Coins, Plus
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  status?: string;
}

function WalletContent() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?userId=${user?.id}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransactions(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'TASK_REWARD':
      case 'REFERRAL_REWARD':
      case 'GAME_REWARD':
        return <ArrowDownRight className="w-5 h-5 text-green-400" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      default:
        return <Coins className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TASK_REWARD': 'Task Reward',
      'REFERRAL_REWARD': 'Referral Bonus',
      'GAME_REWARD': 'Game Reward',
      'WITHDRAWAL': 'Withdrawal',
      'DAILY_BONUS': 'Daily Bonus'
    };
    return labels[type] || type;
  };

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
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="text-sm text-purple-300">محفظتك</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 border-0 shadow-2xl mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-yellow-200 text-sm mb-1">Total Balance</p>
                <div className="flex items-center gap-2">
                  <Coins className="w-8 h-8 text-white" />
                  <h2 className="text-4xl font-bold">{user?.balance.toLocaleString()}</h2>
                </div>
              </div>
              <WalletIcon className="w-16 h-16 text-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-0">
                <Plus className="w-4 h-4 mr-2" />
                Earn More
              </Button>
              <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-0">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <ArrowDownRight className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-xl font-bold">0</p>
              <p className="text-xs text-gray-400">This Week</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <ArrowUpRight className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-xl font-bold">0</p>
              <p className="text-xs text-gray-400">Withdrawn</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <div className="p-4 text-center">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold">0</p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
          </Card>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <div className="p-8 text-center">
                <WalletIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-1">Start earning to see your transactions here</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-white/5 backdrop-blur-md border-white/10">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{getTypeLabel(transaction.type)}</p>
                        <p className="text-xs text-gray-400">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.createdAt).toLocaleString('ar')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type.includes('REWARD') || transaction.type.includes('BONUS')
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.type.includes('REWARD') || transaction.type.includes('BONUS') ? '+' : '-'}
                        {transaction.amount.toLocaleString()}
                      </p>
                      {transaction.status && (
                        <div className="flex items-center gap-1 mt-1">
                          {transaction.status === 'COMPLETED' && (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          )}
                          {transaction.status === 'PENDING' && (
                            <Clock className="w-3 h-3 text-yellow-400" />
                          )}
                          {transaction.status === 'REJECTED' && (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className="text-xs text-gray-400">{transaction.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}
