'use client';

import { useState } from 'react';
import { YouTubeChannelInfo, YouTubeLiveInfo } from '@/types';
import { fetchYouTubeChannelInfo, fetchYouTubeLiveInfo } from '@/lib/data-import';
import { formatNumber } from '@/lib/utils';
import { Youtube, Users, Eye, Video, Radio, Settings, ExternalLink, RefreshCw } from 'lucide-react';

interface YouTubeSectionProps {
  channelInfo: YouTubeChannelInfo | null;
  liveInfo: YouTubeLiveInfo | null;
  onChannelInfoUpdate: (info: YouTubeChannelInfo | null) => void;
  onLiveInfoUpdate: (info: YouTubeLiveInfo | null) => void;
}

export default function YouTubeSection({
  channelInfo,
  liveInfo,
  onChannelInfoUpdate,
  onLiveInfoUpdate
}: YouTubeSectionProps) {
  const [channelId, setChannelId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectChannel = async () => {
    if (!channelId.trim()) {
      setError('Please enter a channel ID or handle');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Fetch channel info
      console.log('Fetching channel info for:', channelId.trim());
      const channelData = await fetchYouTubeChannelInfo(channelId.trim());
      console.log('Channel data received:', channelData);
      onChannelInfoUpdate(channelData);

      // Fetch live info
      console.log('Fetching live info for:', channelId.trim());
      const liveData = await fetchYouTubeLiveInfo(channelId.trim());
      console.log('Live data received:', liveData);
      onLiveInfoUpdate(liveData);

      setChannelId('');
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching YouTube data:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to YouTube');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (!channelInfo) return;
    
    setIsLoading(true);
    try {
      const [channelData, liveData] = await Promise.all([
        fetchYouTubeChannelInfo(channelInfo.customUrl || channelInfo.id),
        fetchYouTubeLiveInfo(channelInfo.customUrl || channelInfo.id)
      ]);
      
      onChannelInfoUpdate(channelData);
      onLiveInfoUpdate(liveData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    onChannelInfoUpdate(null);
    onLiveInfoUpdate(null);
    setError('');
  };

  if (!channelInfo) {
    return (
      <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-500" />
          YouTube Integration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Channel ID or Handle
            </label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="@channelhandle or UC..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleConnectChannel}
            disabled={isLoading || !channelId.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <Youtube className="w-4 h-4" />
                Try Demo Mode
              </>
            )}
          </button>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Demo Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Currently using mock data. Try these sample channels:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => setChannelId('@markiplier')}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                @markiplier
              </button>
              <button
                onClick={() => setChannelId('@mrbeast')}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                @mrbeast
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This is demo mode with simulated data. YouTube integration is not implemented.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Channel Info */}
      <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            Channel
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefreshData}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleDisconnect}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-500"
              title="Disconnect Channel"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{channelInfo.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {channelInfo.description}
            </p>
            
            {channelInfo.customUrl && (
              <a
                href={`https://youtube.com/${channelInfo.customUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600 mt-2"
              >
                {channelInfo.customUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-gray-500" />
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formatNumber(channelInfo.subscriberCount)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Subscribers</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-4 h-4 text-gray-500" />
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formatNumber(channelInfo.viewCount)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Video className="w-4 h-4 text-gray-500" />
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formatNumber(channelInfo.videoCount)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Videos</div>
          </div>
        </div>
      </div>

      {/* Live Stream Info */}
      {liveInfo && (
        <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Radio className={`w-5 h-5 ${liveInfo.isLive ? 'text-red-500' : 'text-gray-400'}`} />
            Live Stream
            {liveInfo.isLive && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                LIVE
              </span>
            )}
          </h2>

          {liveInfo.isLive ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {liveInfo.streamTitle}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Started {liveInfo.startTime?.toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    {formatNumber(liveInfo.liveViewerCount || 0)} watching
                  </span>
                </div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Radio className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Not currently live</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
