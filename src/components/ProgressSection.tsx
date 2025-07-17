'use client';

import { Campaign } from '@/types';
import { formatCurrency, estimateTimeRemaining } from '@/lib/utils';
import { Target, Clock, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ProgressSectionProps {
  campaign: Campaign;
  progress: number;
  duration: string;
  onAddManualDonation: (contributor: string, amount: number, message?: string) => void;
}

export default function ProgressSection({ campaign, progress, duration, onAddManualDonation }: ProgressSectionProps) {
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [contributor, setContributor] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleAddDonation = () => {
    if (contributor && amount && parseFloat(amount) > 0) {
      onAddManualDonation(contributor, parseFloat(amount), message);
      setContributor('');
      setAmount('');
      setMessage('');
      setShowAddDonation(false);
    }
  };

  const remaining = campaign.targetAmount - campaign.currentAmount;
  const eta = estimateTimeRemaining(campaign.currentAmount, campaign.targetAmount, campaign.startDate);

  return (
    <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Progress
        </h2>
        <button
          onClick={() => setShowAddDonation(!showAddDonation)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Donation
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(campaign.currentAmount, campaign.currency)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              After YouTube&apos;s 30% cut
            </div>
          </div>
          <span className="text-lg text-gray-600 dark:text-gray-400">
            of {formatCurrency(campaign.targetAmount, campaign.currency)}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-600 dark:text-gray-400">
            {progress.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(Math.max(0, remaining), campaign.currency)}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {duration}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">ETA</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {eta}
          </span>
        </div>
      </div>

      {/* Add Donation Form */}
      {showAddDonation && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add Manual Donation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Contributor name"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.01"
              min="0"
            />
          </div>
          <input
            type="text"
            placeholder="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddDonation}
              disabled={!contributor || !amount || parseFloat(amount) <= 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Add Donation
            </button>
            <button
              onClick={() => setShowAddDonation(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
