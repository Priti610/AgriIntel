import React from 'react';
import { ArrowRight, Truck, Sparkles, TrendingUp, MapPin, Search } from 'lucide-react';
import { DEMO_PRICES } from '../data/demoPrices';
import { SUPPORTED_LOCATIONS } from '../data/locations';
import { SUPPORTED_CROPS } from '../data/crops';

interface DashboardViewProps {
  onNavigateToMandi: (cropId?: string) => void;
  onNavigateToTransport: () => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToMandi,
  onNavigateToTransport,
  onOpenAuth,
}) => {
  // Find sample price cards
  const priceCards = [
    {
      crop: 'Tomato',
      cropId: 'tomato',
      mandi: 'Azadpur Mandi',
      price: 1980,
      distance: 42,
      trend: '+3.2%',
    },
    {
      crop: 'Tomato',
      cropId: 'tomato',
      mandi: 'Lasalgaon APMC',
      price: 2140,
      distance: 118,
      trend: '+4.8%',
    },
    {
      crop: 'Tomato',
      cropId: 'tomato',
      mandi: 'Pimpalgaon APMC',
      price: 2290,
      distance: 32,
      trend: '+6.2%',
    },
    {
      crop: 'Onion',
      cropId: 'onion',
      mandi: 'Lasalgaon APMC',
      price: 2080,
      distance: 24,
      trend: '+3.5%',
    },
    {
      crop: 'Soybean',
      cropId: 'soybean',
      mandi: 'Nagpur (Kalamna)',
      price: 4780,
      distance: 210,
      trend: '+2.4%',
    },
    {
      crop: 'Gram (Chana)',
      cropId: 'gram',
      mandi: 'Barshi APMC',
      price: 5920,
      distance: 95,
      trend: '+3.8%',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Intro Subtitle */}
      <div>
        <p className="text-gray-500 text-sm sm:text-base font-normal">
          A quick view of today&apos;s demo market signals and your decision tools.
        </p>
      </div>

      {/* Top Section: Banner + Quick Calculator Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Big Green Hero Banner matching Screenshot 4 */}
        <div className="lg:col-span-7 bg-emerald-900 text-white rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 block">
              GUEST VIEW · DEMO DATA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Start with your crop.
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base max-w-md font-normal leading-relaxed">
              Explore current examples, then sign in when you&apos;re ready for deeper intelligence.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onNavigateToMandi()}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-emerald-950 font-bold text-sm rounded-xl shadow-md hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <span>Compare markets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side 2 Stacked Cards matching Screenshot 4 */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          {/* Quick Calculator Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
                  Quick calculator
                </span>
                <Truck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Plan a trip</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Estimate transport costs before comparing net returns.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onNavigateToTransport}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                <span>Open calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Intelligence Card */}
          <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>FULL INTELLIGENCE</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Forecast & dispatch</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Unlock 3–7 day forecasts and personalized market recommendations.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-white border border-gray-300 hover:border-gray-400 text-gray-900 font-bold text-sm rounded-xl cursor-pointer transition-colors"
              >
                <span>Unlock features</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Watch: Today's Price Board matching Screenshot 4 */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 block">
              Market watch
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Today&apos;s price board
            </h2>
          </div>
          <button
            onClick={() => onNavigateToMandi()}
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {priceCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateToMandi(card.cropId)}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                    <span className="text-xs font-semibold text-gray-700">{card.crop}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Demo data
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {card.mandi}
                </h3>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-950 tracking-tight">
                    ₹{card.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-500">
                    per quintal · {card.distance} km away
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
