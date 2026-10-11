import React from 'react';
import { BarChart2, Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface ForecastViewProps {
  isUnlocked: boolean;
  onOpenAuth: () => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  isUnlocked,
  onOpenAuth,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Forecast the next few days.
        </h1>
        <p className="text-gray-600 text-base max-w-2xl">
          {isUnlocked
            ? 'Short-term arrival volume signals and price trajectory modeling based on historical APMC patterns.'
            : 'This intelligence layer is reserved for registered users.'}
        </p>
      </div>

      {!isUnlocked ? (
        /* Guest Locked Screen matching Screenshot 7 */
        <div className="flex items-center justify-center py-12">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <BarChart2 className="w-7 h-7" />
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
        /* Unlocked Registered View */
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">Full Intelligence Active: 3–7 Day Price & Arrival Signals</span>
            </div>
            <span className="font-semibold text-emerald-700">Daily Agmarknet Modeled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Forecast 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Tomato (Nashik / Lasalgaon)</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Bullish ↑
                </span>
              </div>
              <div className="text-3xl font-extrabold text-gray-950">
                ₹2,180 – ₹2,320
              </div>
              <p className="text-xs text-gray-600">
                Arrivals expected to tighten by 14% this Thursday. Bidding likely to strengthen by ₹80–₹140/qtl.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg">
                Recommended Window: Dispatch early morning Thursday.
              </div>
            </div>

            {/* Forecast 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Onion (Lasalgaon / Pimpalgaon)</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Stable ➔
                </span>
              </div>
              <div className="text-3xl font-extrabold text-gray-950">
                ₹2,040 – ₹2,100
              </div>
              <p className="text-xs text-gray-600">
                High incoming supplies from Niphad & Yeola stabilizing prices. Low price volatility anticipated.
              </p>
              <div className="text-[11px] font-semibold text-gray-700 bg-gray-100 p-2.5 rounded-lg">
                Recommended Window: Immediate dispatch viable; minimal holding advantage.
              </div>
            </div>

            {/* Forecast 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Soybean (Vidarbha / Marathwada)</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Moderate Up ↑
                </span>
              </div>
              <div className="text-3xl font-extrabold text-gray-950">
                ₹4,750 – ₹4,890
              </div>
              <p className="text-xs text-gray-600">
                Crush plant procurement demand steady. Oil mill buying supporting firm base at Kalamna & Latur.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg">
                Recommended Window: Strong buyer liquidity on Friday.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
