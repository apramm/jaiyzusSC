'use client';

import { useState, useEffect, useMemo } from 'react';
import { SuperChatData, Campaign, YouTubeChannelInfo, YouTubeLiveInfo, Contributor } from '@/types';
import { generateId, calculateProgress, formatDuration, calculateTotalAfterYouTubeCut } from '@/lib/utils';
import Header from './Header';
import ProgressSection from './ProgressSection';
import LeaderboardSection from './LeaderboardSection';
import ImportSection from './ImportSection';
import YouTubeSection from './YouTubeSection';
import StatsSection from './StatsSection';
import CampaignsManager from './CampaignsManager';
import ConfirmModal from './ConfirmModal';

export default function Dashboard() {
  const [superChats, setSuperChats] = useState<SuperChatData[]>([]);
  const [showCampaignsManager, setShowCampaignsManager] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Force dark mode on component mount
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.add('dark');
    body.classList.add('dark');
    body.style.backgroundColor = '#0f0f0f';
    body.style.color = '#ffffff';
  }, []);

  // Initialize with a default campaign
  useEffect(() => {
    const defaultCampaign: Campaign = {
      id: generateId(),
      title: 'Live Stream Fundraiser',
      description: 'Every donation brings us closer to making a difference!',
      targetAmount: 1000,
      currentAmount: 0,
      currency: 'USD',
      startDate: new Date(),
      isActive: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    setCampaigns([defaultCampaign]);
    setActiveCampaignId(defaultCampaign.id);
  }, []);

  // Memoize active campaign lookup
  const activeCampaign = useMemo(() => {
    return campaigns.find(c => c.id === activeCampaignId) || campaigns[0];
  }, [campaigns, activeCampaignId]);

  const [channelInfo, setChannelInfo] = useState<YouTubeChannelInfo | null>(null);
  const [liveInfo, setLiveInfo] = useState<YouTubeLiveInfo | null>(null);

  // Add some demo data on first load
  useEffect(() => {
    const demoData: SuperChatData[] = [
      {
        id: generateId(),
        contributor: 'Alice Johnson',
        amount: 25,
        currency: 'USD',
        message: 'Great cause! Keep it up! 💖',
        timestamp: new Date(Date.now() - 3600000),
        platform: 'manual'
      },
      {
        id: generateId(),
        contributor: 'Bob Smith',
        amount: 50,
        currency: 'USD',
        message: 'Happy to support this initiative!',
        timestamp: new Date(Date.now() - 7200000),
        platform: 'manual'
      },
      {
        id: generateId(),
        contributor: 'Charlie Davis',
        amount: 15,
        currency: 'USD',
        message: 'Every bit helps! 🎯',
        timestamp: new Date(Date.now() - 1800000),
        platform: 'manual'
      }
    ];
    setSuperChats(demoData);
  }, []);

  // Calculate current amount from superchats and update active campaign
  useEffect(() => {
    if (activeCampaignId) {
      const total = calculateTotalAfterYouTubeCut(superChats);
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === activeCampaignId 
          ? { ...campaign, currentAmount: total, lastUpdated: new Date() }
          : campaign
      ));
    }
  }, [superChats, activeCampaignId]);

  // Calculate contributor statistics
  const contributors = useMemo((): Contributor[] => {
    return superChats.reduce((acc, chat) => {
      const existing = acc.find(c => c.name === chat.contributor);
      if (existing) {
        existing.totalAmount += chat.amount;
        existing.donationCount += 1;
        existing.lastDonation = chat.timestamp > existing.lastDonation ? chat.timestamp : existing.lastDonation;
        existing.averageAmount = existing.totalAmount / existing.donationCount;
      } else {
        acc.push({
          name: chat.contributor,
          totalAmount: chat.amount,
          donationCount: 1,
          lastDonation: chat.timestamp,
          averageAmount: chat.amount
        });
      }
      return acc;
    }, [] as Contributor[]).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [superChats]);

  // Memoize calculations that depend on activeCampaign
  const progress = useMemo(() => {
    return activeCampaign ? calculateProgress(activeCampaign.currentAmount, activeCampaign.targetAmount) : 0;
  }, [activeCampaign]);

  const duration = useMemo(() => {
    return activeCampaign ? formatDuration(activeCampaign.startDate) : '';
  }, [activeCampaign]);

  const handleImportData = (newSuperChats: SuperChatData[]) => {
    setSuperChats(prev => [...prev, ...newSuperChats]);
  };

  const handleCampaignUpdate = (updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === activeCampaignId 
        ? { ...campaign, ...updates, lastUpdated: new Date() }
        : campaign
    ));
  };

  const handleAddManualDonation = (contributor: string, amount: number, message?: string) => {
    if (!activeCampaign) return;
    
    const newSuperChat: SuperChatData = {
      id: generateId(),
      contributor,
      amount,
      currency: activeCampaign.currency,
      message: message || '',
      timestamp: new Date(),
      platform: 'manual'
    };
    setSuperChats(prev => [...prev, newSuperChat]);
  };

  const handleEditDonation = (id: string, updates: Partial<SuperChatData>) => {
    setSuperChats(prev => prev.map(chat => 
      chat.id === id ? { ...chat, ...updates } : chat
    ));
  };

  const handleDeleteDonation = (id: string) => {
    setSuperChats(prev => prev.filter(chat => chat.id !== id));
  };

  const handleClearAllDonations = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAllDonations = () => {
    setSuperChats([]);
    setShowClearConfirm(false);
  };

  // Campaign management functions
  const handleCreateCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'lastUpdated' | 'currentAmount'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: generateId(),
      currentAmount: 0,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setActiveCampaignId(newCampaign.id);
    setSuperChats([]); // Clear donations when switching campaigns
  };

  const handleSelectCampaign = (campaignId: string) => {
    setActiveCampaignId(campaignId);
    setSuperChats([]); // Clear donations when switching campaigns
    setShowCampaignsManager(false);
  };

  const handleUpdateCampaign = (campaignId: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, ...updates, lastUpdated: new Date() }
        : campaign
    ));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    
    // If deleting active campaign, check if there are remaining campaigns
    if (campaignId === activeCampaignId) {
      const remainingCampaigns = campaigns.filter(c => c.id !== campaignId);
      if (remainingCampaigns.length > 0) {
        setActiveCampaignId(remainingCampaigns[0].id);
        setSuperChats([]);
      } else {
        // If no campaigns left, clear active campaign and stay in campaigns manager
        setActiveCampaignId('');
        setSuperChats([]);
        setShowCampaignsManager(true);
      }
    }
  };

  // Early return if no active campaign - show campaigns manager instead of loading
  if (!activeCampaign || campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">YouTube SuperChat Tracker</h1>
            </div>
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-white mb-4">Welcome!</h2>
              <p className="text-gray-400 mb-6">Create your first campaign to get started tracking donations.</p>
            </div>
          </div>
          <CampaignsManager
            campaigns={campaigns}
            activeCampaignId={activeCampaignId}
            onCreateCampaign={handleCreateCampaign}
            onSelectCampaign={handleSelectCampaign}
            onUpdateCampaign={handleUpdateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onClose={() => {}} // No close button when no campaigns exist
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header
          campaign={activeCampaign}
          onCampaignUpdate={handleCampaignUpdate}
          onClearAllDonations={handleClearAllDonations}
          onShowCampaignsManager={() => setShowCampaignsManager(true)}
          donationCount={superChats.length}
        />

        {showCampaignsManager ? (
          <CampaignsManager
            campaigns={campaigns}
            activeCampaignId={activeCampaignId}
            onCreateCampaign={handleCreateCampaign}
            onSelectCampaign={handleSelectCampaign}
            onUpdateCampaign={handleUpdateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onClose={() => setShowCampaignsManager(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Progress Section */}
              <div className="lg:col-span-2 space-y-6">
                <ProgressSection
                  campaign={activeCampaign}
                  progress={progress}
                  duration={duration}
                  onAddManualDonation={handleAddManualDonation}
                />
                
                <StatsSection
                  superChats={superChats}
                  campaign={activeCampaign}
                  contributors={contributors}
                  onEditDonation={handleEditDonation}
                  onDeleteDonation={handleDeleteDonation}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <YouTubeSection
                  channelInfo={channelInfo}
                  liveInfo={liveInfo}
                  onChannelInfoUpdate={setChannelInfo}
                  onLiveInfoUpdate={setLiveInfo}
                />
                
                <LeaderboardSection contributors={contributors} currency={activeCampaign.currency} />
              </div>
            </div>

            <ImportSection onImportData={handleImportData} campaignCurrency={activeCampaign.currency} />
          </>
        )}

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={confirmClearAllDonations}
          title="Clear All Donations"
          message={`Are you sure you want to clear all ${superChats.length} donations? This action cannot be undone and will reset your campaign progress.`}
          confirmText="Clear All"
          cancelText="Keep Donations"
          type="danger"
        />
      </div>
    </div>
  );
}
