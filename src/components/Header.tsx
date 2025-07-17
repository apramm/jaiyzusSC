'use client';

import { Campaign } from '@/types';
import { Edit3, Trash2, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  campaign: Campaign;
  onCampaignUpdate: (updates: Partial<Campaign>) => void;
  onClearAllDonations: () => void;
  onShowCampaignsManager?: () => void;
  donationCount: number;
}

export default function Header({ campaign, onCampaignUpdate, onClearAllDonations, onShowCampaignsManager, donationCount }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(campaign.title);
  const [editTarget, setEditTarget] = useState(campaign.targetAmount.toString());
  const [editCurrency, setEditCurrency] = useState(campaign.currency);
  const [editEndDate, setEditEndDate] = useState(
    campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : ''
  );

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'SGD', 'NZD', 'CHF'];

  const handleSave = () => {
    onCampaignUpdate({
      title: editTitle,
      targetAmount: parseFloat(editTarget) || campaign.targetAmount,
      currency: editCurrency,
      endDate: editEndDate ? new Date(editEndDate) : undefined
    });
    setIsEditing(false);
  };

  return (
    <header className="py-8 px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent border-b-2 border-blue-500 focus:outline-none w-full placeholder-gray-500"
                placeholder="Campaign Title"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Target:</span>
                <select
                  value={editCurrency}
                  onChange={(e) => setEditCurrency(e.target.value)}
                  className="bg-transparent border-b border-blue-500 focus:outline-none text-sm text-white"
                >
                  {popularCurrencies.map(curr => (
                    <option key={curr} value={curr} className="bg-[#212121] text-white">
                      {curr}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  className="bg-transparent border-b border-blue-500 focus:outline-none text-sm w-24 text-white"
                  placeholder="1000"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">End Date:</span>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="bg-transparent border-b border-blue-500 focus:outline-none text-sm text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(campaign.title);
                    setEditTarget(campaign.targetAmount.toString());
                    setEditCurrency(campaign.currency);
                    setEditEndDate(campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '');
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {campaign.title}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
              <p className="text-lg text-gray-300 mt-2 font-medium">{campaign.description}</p>
              <div className="flex items-center gap-6 mt-4">
                <span className="text-base text-gray-300 font-semibold">
                  Target: {campaign.currency} {campaign.targetAmount.toLocaleString()}
                </span>
                {campaign.endDate && (
                  <span className="text-base text-gray-300 font-semibold">
                    End Date: {campaign.endDate.toLocaleDateString()}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${campaign.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-base text-gray-300 font-semibold">
                    {campaign.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {donationCount > 0 && (
            <button
              onClick={onClearAllDonations}
              className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors text-red-400"
              title={`Clear all ${donationCount} donations`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear All ({donationCount})</span>
            </button>
          )}

          <button
            onClick={onShowCampaignsManager}
            className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors text-blue-400"
            title="Manage Campaigns"
          >
            <FolderOpen className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
