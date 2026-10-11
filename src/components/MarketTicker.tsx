import React from 'react';
import { TrendingUp } from 'lucide-react';

export const MarketTicker: React.FC<{ onSelectCrop?: (cropId: string) => void }> = () => {
  return (
    <div className="bg-gray-950 text-white border-y border-gray-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-emerald-400 text-[11px]">
              MARKET SNAPSHOT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-200">Tomato</span>
            <span className="font-bold text-white">₹2,140 / quintal</span>
            <span className="inline-flex items-center text-emerald-400 font-semibold text-xs">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              +4.8%
            </span>
          </div>

          <span className="hidden md:inline text-gray-600">|</span>

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-semibold text-gray-200">Onion</span>
            <span className="font-bold text-white">₹2,080 / quintal</span>
            <span className="inline-flex items-center text-emerald-400 font-semibold text-xs">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              +3.5%
            </span>
          </div>

          <span className="hidden lg:inline text-gray-600">|</span>

          <div className="hidden lg:flex items-center gap-2">
            <span className="font-semibold text-gray-200">Soybean</span>
            <span className="font-bold text-white">₹4,720 / quintal</span>
            <span className="inline-flex items-center text-emerald-400 font-semibold text-xs">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              +1.8%
            </span>
          </div>
        </div>

        <div className="text-[11px] font-medium text-gray-400">
          Demo dataset · 18 Mar 2026
        </div>
      </div>
    </div>
  );
};
