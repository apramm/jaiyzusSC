export interface SuperChatData {
  id: string;
  contributor: string;
  amount: number;
  currency: string;
  message: string;
  timestamp: Date;
  platform: 'youtube' | 'manual';
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  channelId?: string;
  streamId?: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface YouTubeChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  customUrl?: string;
}

export interface YouTubeLiveInfo {
  isLive: boolean;
  liveViewerCount?: number;
  streamTitle?: string;
  streamThumbnail?: string;
  streamId?: string;
  startTime?: Date;
}

export interface Contributor {
  name: string;
  totalAmount: number;
  donationCount: number;
  lastDonation: Date;
  averageAmount: number;
}

export interface ProgressMilestone {
  id: string;
  amount: number;
  title: string;
  description?: string;
  isReached: boolean;
  reachedAt?: Date;
}

export interface AppSettings {
  darkMode: boolean;
  currency: string;
  notifications: boolean;
  soundAlerts: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export type ImportFormat = 'csv' | 'excel' | 'text' | 'youtube-api';

export interface ImportData {
  format: ImportFormat;
  data: SuperChatData[];
  errors?: string[];
}
