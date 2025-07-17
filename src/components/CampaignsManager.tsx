'use client';

import { Campaign } from '@/types';
import { formatCurrency, calculateProgress, formatDuration } from '@/lib/utils';
import { Plus, Eye, Pause, Play, Trash2, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface CampaignsManagerProps {
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (campaignId: string) => void;
  onCreateCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'lastUpdated' | 'currentAmount'>) => void;
  onUpdateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onClose: () => void;
}

export default function CampaignsManager({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onClose
}: CampaignsManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTarget, setNewTarget] = useState('1000');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [deleteConfirm, setDeleteConfirm] = useState<Campaign | null>(null);

  const handleCreateCampaign = () => {
    if (newTitle.trim() && newTarget && parseFloat(newTarget) > 0) {
      onCreateCampaign({
        title: newTitle.trim(),
        description: newDescription.trim(),
        targetAmount: parseFloat(newTarget),
        currency: newCurrency,
        startDate: new Date(),
        isActive: true
      });
      
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewTarget('1000');
      setNewCurrency('USD');
      setShowCreateForm(false);
    }
  };

  const toggleCampaignStatus = (campaignId: string, isActive: boolean) => {
    onUpdateCampaign(campaignId, { 
      isActive: !isActive,
      lastUpdated: new Date()
    });
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeleteConfirm(campaign);
  };

  const confirmDeleteCampaign = () => {
    if (deleteConfirm) {
      onDeleteCampaign(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          All Campaigns ({campaigns.length})
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
            title="Close Campaigns Manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Create New Campaign</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Campaign title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Target amount"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
                <select
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="JPY">JPY</option>
                  <option value="INR">INR</option>
                  <option value="SGD">SGD</option>
                  <option value="NZD">NZD</option>
                  <option value="CHF">CHF</option>
                  <option value="SEK">SEK</option>
                  <option value="NOK">NOK</option>
                  <option value="DKK">DKK</option>
                  <option value="CNY">CNY</option>
                  <option value="KRW">KRW</option>
                  <option value="MXN">MXN</option>
                  <option value="BRL">BRL</option>
                  <option value="ZAR">ZAR</option>
                </select>
              </div>
            </div>
            <textarea
              placeholder="Campaign description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateCampaign}
                disabled={!newTitle.trim() || !newTarget || parseFloat(newTarget) <= 0}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Create Campaign
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-3">
        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No campaigns yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Create your first campaign to get started
            </p>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);
            const duration = formatDuration(campaign.startDate);
            const isActive = campaign.id === activeCampaignId;

            return (
              <div
                key={campaign.id}
                onClick={() => !isActive && onSelectCampaign(campaign.id)}
                onDoubleClick={() => isActive && onSelectCampaign(campaign.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer transform hover:scale-[1.02] ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {campaign.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${campaign.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      {isActive && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {campaign.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(campaign.currentAmount, campaign.currency)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          of {formatCurrency(campaign.targetAmount, campaign.currency)} ({progress.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                              : 'bg-gradient-to-r from-blue-500 to-green-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Duration: {duration}</span>
                        <span>Created: {campaign.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    {!isActive && (
                      <button
                        onClick={() => onSelectCampaign(campaign.id)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                        title="Select Campaign"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id, campaign.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        campaign.isActive
                          ? 'hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400'
                      }`}
                      title={campaign.isActive ? 'Pause Campaign' : 'Resume Campaign'}
                    >
                      {campaign.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteCampaign(campaign)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDeleteCampaign}
        title="Delete Campaign"
        message={deleteConfirm ? `Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone and will permanently remove all associated data.` : ''}
        confirmText="Delete Campaign"
        cancelText="Keep Campaign"
        type="danger"
      />
    </div>
  );
}
