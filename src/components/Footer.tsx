import React from 'react';
import { Sprout } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1329] text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Prima<span className="text-emerald-400">AgriIntel</span>
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Smarter markets. Better returns. Stronger farmers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Demo environment · market data clearly labeled</span>
            </div>
            <span>© 2026 Prima-AgriIntel</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            Designed for Indian farmers & APMC markets. Calculated net revenue accounts for road distance, vehicle capacity, and freight costs.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300">Agmarknet Standards</span>
            <span className="hover:text-gray-300">e-NAM Integrated</span>
            <span className="hover:text-gray-300">AI-Assisted Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
