'use client';

import { SuperChatData, Campaign, Contributor } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Clock, Edit3, Trash2 } from 'lucide-react';
import { useState, useMemo, memo } from 'react';

// Memoized chart component to prevent unnecessary re-renders
const HourlyChart = memo(function HourlyChart({ 
  data, 
  currency 
}: { 
  data: Array<{ hour: number; amount: number; count: number; label: string }>;
  currency: string;
}) {
  const tooltipContentStyle = useMemo(() => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '12px'
  }), []);

  const tooltipFormatter = useMemo(() => (value: number, name: string) => [
    name === 'amount' ? formatCurrency(Number(value), currency) : value,
    name === 'amount' ? 'Total Amount' : 'Donations'
  ], [currency]);

  const labelFormatter = useMemo(() => (label: string) => `Time: ${label}`, []);
  const yAxisTickFormatter = useMemo(() => (value: number) => `$${value}`, []);
  const tickStyle = useMemo(() => ({ fontSize: 12 }), []);
  const tickLineStyle = useMemo(() => ({ stroke: '#6B7280' }), []);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="label" 
            tick={tickStyle}
            tickLine={tickLineStyle}
          />
          <YAxis 
            tick={tickStyle}
            tickLine={tickLineStyle}
            tickFormatter={yAxisTickFormatter}
          />
          <Tooltip 
            formatter={tooltipFormatter}
            labelFormatter={labelFormatter}
            contentStyle={tooltipContentStyle}
          />
          <Bar 
            dataKey="amount" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

interface StatsSectionProps {
  superChats: SuperChatData[];
  campaign: Campaign;
  contributors: Contributor[];
  onEditDonation: (id: string, updates: Partial<SuperChatData>) => void;
  onDeleteDonation: (id: string) => void;
}

export default function StatsSection({ superChats, campaign, contributors, onEditDonation, onDeleteDonation }: StatsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editContributor, setEditContributor] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const handleStartEdit = (chat: SuperChatData) => {
    setEditingId(chat.id);
    setEditAmount(chat.amount.toString());
    setEditContributor(chat.contributor);
    setEditMessage(chat.message);
  };

  const handleSaveEdit = () => {
    if (editingId && editAmount && editContributor) {
      onEditDonation(editingId, {
        amount: parseFloat(editAmount),
        contributor: editContributor,
        message: editMessage
      });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
    setEditContributor('');
    setEditMessage('');
  };

  const handleDelete = (id: string, contributor: string) => {
    if (window.confirm(`Are you sure you want to delete the donation from ${contributor}?`)) {
      onDeleteDonation(id);
    }
  };

  // Calculate hourly donation data for the chart
  const hourlyData = useMemo(() => {
    return superChats.reduce((acc, chat) => {
      const hour = chat.timestamp.getHours();
      const existingHour = acc.find(item => item.hour === hour);
      
      if (existingHour) {
        existingHour.amount += chat.amount;
        existingHour.count += 1;
      } else {
        acc.push({
          hour,
          amount: chat.amount,
          count: 1,
          label: `${hour}:00`
        });
      }
      
      return acc;
    }, [] as Array<{ hour: number; amount: number; count: number; label: string }>)
    .sort((a, b) => a.hour - b.hour);
  }, [superChats]);

  // Calculate total before YouTube's cut
  const totalBeforeYouTubeCut = useMemo(() => {
    return superChats.reduce((sum, chat) => sum + chat.amount, 0);
  }, [superChats]);

  // Find largest donation
  const largestDonation = useMemo(() => {
    return superChats.length > 0 
      ? Math.max(...superChats.map(chat => chat.amount))
      : 0;
  }, [superChats]);

  // Calculate donations in last hour
  const { recentAmount, recentDonations } = useMemo(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = superChats.filter(chat => chat.timestamp > oneHourAgo);
    const amount = recent.reduce((sum, chat) => sum + chat.amount, 0);
    return { recentAmount: amount, recentDonations: recent };
  }, [superChats]);

  if (superChats.length === 0) {
    return (
      <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-500" />
          Analytics
        </h2>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No data to analyze yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Import some donations to see analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <BarChart className="w-5 h-5 text-blue-500" />
        Analytics
      </h2>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Total Raised</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalBeforeYouTubeCut, campaign.currency)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            From all donations
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Largest</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(largestDonation, campaign.currency)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Contributors</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {contributors.length}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Last Hour</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(recentAmount, campaign.currency)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {recentDonations.length} donation{recentDonations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Hourly Chart */}
      {hourlyData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Donations by Hour
          </h3>
          <HourlyChart data={hourlyData} currency={campaign.currency} />
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {superChats
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
            .map((chat) => (
              <div 
                key={chat.id} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#181818] rounded-lg group"
              >
                {editingId === chat.id ? (
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editContributor}
                        onChange={(e) => setEditContributor(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-[#212121] dark:border-gray-600 text-gray-900 dark:text-white"
                        placeholder="Contributor"
                      />
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-[#212121] dark:border-gray-600 text-gray-900 dark:text-white"
                        placeholder="Amount"
                        step="0.01"
                      />
                    </div>
                    <input
                      type="text"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-[#212121] dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="Message"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {chat.contributor}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {chat.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {chat.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {chat.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(chat.amount, campaign.currency)}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(chat)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded"
                          title="Edit donation"
                        >
                          <Edit3 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(chat.id, chat.contributor)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Delete donation"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
