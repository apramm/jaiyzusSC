'use client';

import { Contributor } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardSectionProps {
  contributors: Contributor[];
  currency: string;
}

export default function LeaderboardSection({ contributors, currency }: LeaderboardSectionProps) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800 border-yellow-200 dark:border-yellow-700';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900 dark:to-amber-800 border-amber-200 dark:border-amber-700';
      default:
        return 'bg-white dark:bg-[#212121] border-gray-200 dark:border-gray-600';
    }
  };

  if (contributors.length === 0) {
    return (
      <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Contributors
        </h2>
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No contributors yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Start by importing data or adding manual donations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#212121] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top Contributors
      </h2>

      <div className="space-y-3">
        {contributors.slice(0, 10).map((contributor, index) => {
          const position = index + 1;
          return (
            <div
              key={contributor.name}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getPositionColor(position)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getPositionIcon(position)}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      #{position}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {contributor.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contributor.donationCount} donation{contributor.donationCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">
                    {formatCurrency(contributor.totalAmount, currency)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    avg {formatCurrency(contributor.averageAmount, currency)}
                  </div>
                </div>
              </div>
              
              {position <= 3 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last donation: {contributor.lastDonation.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {contributors.length > 10 && (
        <div className="mt-4 text-center">
          <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
            View All {contributors.length} Contributors
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {contributors.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Contributors
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {contributors.reduce((sum, c) => sum + c.donationCount, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Donations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
