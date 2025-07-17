import Papa from 'papaparse';
import { SuperChatData, ImportData, YouTubeChannelInfo } from '@/types';
import { generateId } from './utils';

export async function parseCSVFile(file: File): Promise<ImportData> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        const data: SuperChatData[] = [];

        results.data.forEach((row: unknown, index: number) => {
          const csvRow = row as Record<string, string>;
          try {
            // Expected CSV columns: contributor, amount, currency, message, timestamp
            const superChat: SuperChatData = {
              id: generateId(),
              contributor: csvRow.contributor || csvRow.name || csvRow.user || 'Anonymous',
              amount: parseFloat(csvRow.amount || csvRow.donation || '0'),
              currency: csvRow.currency || 'USD',
              message: csvRow.message || csvRow.comment || '',
              timestamp: csvRow.timestamp ? new Date(csvRow.timestamp) : new Date(),
              platform: 'manual'
            };

            if (superChat.amount > 0) {
              data.push(superChat);
            } else {
              errors.push(`Row ${index + 1}: Invalid amount`);
            }
          } catch (error) {
            errors.push(`Row ${index + 1}: ${error}`);
          }
        });

        resolve({
          format: 'csv',
          data,
          errors: errors.length > 0 ? errors : undefined
        });
      },
      error: (error) => {
        resolve({
          format: 'csv',
          data: [],
          errors: [error.message]
        });
      }
    });
  });
}

export function parseTextFile(content: string, defaultCurrency: string = 'USD'): ImportData {
  const lines = content.split('\n').filter(line => line.trim());
  const data: SuperChatData[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    try {
      const trimmedLine = line.trim();
      
      // Try to parse different text formats
      // Format 1: "Name donated $50: Message" or "Name donated 50 USD: Message"
      const match1 = trimmedLine.match(/^(.+?)\s+donated\s+([A-Z]{3})?(\d+(?:\.\d{2})?)\s*([A-Z]{3})?\s*:?\s*(.*)$/i);
      if (match1) {
        const currencyBefore = match1[2]?.toUpperCase();
        const amount = parseFloat(match1[3]);
        const currencyAfter = match1[4]?.toUpperCase();
        const currency = currencyBefore || currencyAfter || defaultCurrency;
        
        data.push({
          id: generateId(),
          contributor: match1[1].trim(),
          amount,
          currency,
          message: match1[5].trim(),
          timestamp: new Date(),
          platform: 'manual'
        });
        return;
      }

      // Format 2: "Name: $50 - Message" or "Name: 50 USD - Message"
      const match2 = trimmedLine.match(/^(.+?):\s*([A-Z]{3})?(\d+(?:\.\d{2})?)\s*([A-Z]{3})?\s*-?\s*(.*)$/i);
      if (match2) {
        const currencyBefore = match2[2]?.toUpperCase();
        const amount = parseFloat(match2[3]);
        const currencyAfter = match2[4]?.toUpperCase();
        const currency = currencyBefore || currencyAfter || defaultCurrency;
        
        data.push({
          id: generateId(),
          contributor: match2[1].trim(),
          amount,
          currency,
          message: match2[5].trim(),
          timestamp: new Date(),
          platform: 'manual'
        });
        return;
      }

      // Format 3: "Name Amount Currency" or "Name Amount" (simple format)
      const match3 = trimmedLine.match(/^(.+?)\s+(\d+(?:\.\d{2})?)\s*([A-Z]{3})?$/i);
      if (match3) {
        const currency = match3[3]?.toUpperCase() || defaultCurrency;
        
        data.push({
          id: generateId(),
          contributor: match3[1].trim(),
          amount: parseFloat(match3[2]),
          currency,
          message: '',
          timestamp: new Date(),
          platform: 'manual'
        });
        return;
      }

      // If no format matches, skip this line with an error
      errors.push(`Line ${index + 1}: Could not parse "${line}"`);
    } catch (error) {
      errors.push(`Line ${index + 1}: ${error}`);
    }
  });

  return {
    format: 'text',
    data,
    errors: errors.length > 0 ? errors : undefined
  };
}

export async function exportToCSV(data: SuperChatData[]): Promise<string> {
  const csvData = data.map(item => ({
    contributor: item.contributor,
    amount: item.amount,
    currency: item.currency,
    message: item.message,
    timestamp: item.timestamp.toISOString(),
    platform: item.platform
  }));

  return Papa.unparse(csvData);
}

// Mock YouTube API functions (you'll need to implement actual API calls)
export async function fetchYouTubeChannelInfo(channelId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, return mock data based on the channel ID
  // In production, this would use the YouTube Data API v3
  const mockChannels: Record<string, Omit<YouTubeChannelInfo, 'id'> & { id: string }> = {
    '@markiplier': {
      id: 'UC7_YxT-KID8kRbqZo7MyscQ',
      title: 'Markiplier',
      description: 'Hello everybody, my name is Markiplier and welcome to my channel!',
      thumbnailUrl: '/api/placeholder/120/120',
      subscriberCount: 35800000,
      viewCount: 20100000000,
      videoCount: 5800,
      customUrl: '@markiplier'
    },
    '@mrbeast': {
      id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
      title: 'MrBeast',
      description: 'I want to make the world a better place before I die.',
      thumbnailUrl: '/api/placeholder/120/120',
      subscriberCount: 123000000,
      viewCount: 28500000000,
      videoCount: 741,
      customUrl: '@mrbeast'
    }
  };

  // Check if it's a known mock channel
  const normalizedId = channelId.toLowerCase();
  if (mockChannels[normalizedId]) {
    return mockChannels[normalizedId];
  }

  // Return generic mock data for unknown channels
  return {
    id: channelId,
    title: `Channel ${channelId}`,
    description: `This is a sample channel for ${channelId}. In production, this would fetch real data from YouTube API.`,
    thumbnailUrl: '/api/placeholder/120/120',
    subscriberCount: Math.floor(Math.random() * 1000000) + 10000,
    viewCount: Math.floor(Math.random() * 100000000) + 1000000,
    videoCount: Math.floor(Math.random() * 1000) + 50,
    customUrl: channelId.startsWith('@') ? channelId : `@${channelId}`
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchYouTubeLiveInfo(channelId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This would use the YouTube Live Streaming API
  // For now, return mock data with some variety
  const isLive = Math.random() > 0.3; // 70% chance of being live
  
  if (!isLive) {
    return {
      isLive: false,
      liveViewerCount: 0,
      streamTitle: '',
      streamThumbnail: '',
      streamId: '',
      startTime: undefined
    };
  }

  return {
    isLive: true,
    liveViewerCount: Math.floor(Math.random() * 10000) + 500,
    streamTitle: 'Live Stream - Help Us Reach Our Goal! 🎯',
    streamThumbnail: '/api/placeholder/480/270',
    streamId: `stream-${Date.now()}`,
    startTime: new Date(Date.now() - Math.floor(Math.random() * 7200000)) // Started within last 2 hours
  };
}
