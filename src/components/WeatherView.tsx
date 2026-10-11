import React from 'react';
import { CloudSun, CloudRain, Sun, Wind, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WeatherViewProps {
  isUnlocked: boolean;
  onOpenAuth: () => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  isUnlocked,
  onOpenAuth,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Read the travel weather.
        </h1>
        <p className="text-gray-600 text-base max-w-2xl">
          {isUnlocked
            ? 'En-route dispatch weather, moisture impact on perishables, and transport corridor road safety.'
            : 'This intelligence layer is reserved for registered users.'}
        </p>
      </div>

      {!isUnlocked ? (
        /* Guest Locked Screen matching Screenshot 8 */
        <div className="flex items-center justify-center py-12">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CloudSun className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Unlock the next decision
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Sign in to view personalized recommendations, saved market paths, and detailed intelligence.
              This demo does not fabricate a forecast when historical coverage is insufficient.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Sign in to unlock</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked Weather Cards */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Corridor 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Nashik – Mumbai Highway</span>
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                32°C · Dry & Clear
              </div>
              <p className="text-xs text-gray-600">
                Kasara ghat transit clear. No rain delays expected. Ensure tarpaulin cover for sun protection.
              </p>
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                Transit Risk: Very Low (Safe for all crops)
              </div>
            </div>

            {/* Corridor 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Pune – Solapur Highway</span>
                <Wind className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                35°C · High Heat
              </div>
              <p className="text-xs text-gray-600">
                High ambient temperature during afternoon transit. Recommend early morning (4 AM - 8 AM) transit for vegetables.
              </p>
              <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                Transit Risk: Moderate (Perishables heat stress)
              </div>
            </div>

            {/* Corridor 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Nagpur – Wardha Corridor</span>
                <CloudRain className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                27°C · Light Drizzle
              </div>
              <p className="text-xs text-gray-600">
                Patchy rain reported. Cotton and grain consignments must have waterproof double tarpaulin sheets.
              </p>
              <div className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                Transit Risk: Moisture Protection Essential
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
