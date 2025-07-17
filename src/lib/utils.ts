import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

// YouTube takes 30% cut from superchats
export const YOUTUBE_CUT_PERCENTAGE = 30;

export function calculateAfterYouTubeCut(amount: number): number {
  return amount * (1 - YOUTUBE_CUT_PERCENTAGE / 100);
}

export function calculateTotalAfterYouTubeCut(donations: { amount: number }[]): number {
  const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
  return calculateAfterYouTubeCut(total);
}

export function formatDuration(startDate: Date, endDate?: Date): string {
  const end = endDate || new Date();
  const diff = end.getTime() - startDate.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function estimateTimeRemaining(current: number, target: number, startDate: Date): string {
  if (current === 0) return 'Unknown';
  
  const elapsed = Date.now() - startDate.getTime();
  const rate = current / elapsed; // amount per millisecond
  const remaining = target - current;
  
  if (remaining <= 0) return 'Goal reached!';
  
  const timeRemaining = remaining / rate;
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `~${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `~${hours}h remaining`;
  } else {
    return '< 1h remaining';
  }
}
