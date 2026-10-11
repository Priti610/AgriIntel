import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import farmerImg from '../assets/images/indian_farmer_harvest_1791702301065.jpg';

interface HeroSectionProps {
  onExploreMarkets: () => void;
  onOpenAuth: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMarkets,
  onOpenAuth,
}) => {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading and Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            {/* Guest & Demo status badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Guest access is open · Demo data clearly marked</span>
            </div>

            {/* H1 Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.08]">
              Sell smarter.
              <br />
              <span className="text-emerald-700">Earn better.</span>
              <br />
              Farm stronger.
            </h1>

            {/* Subtitle Description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl font-normal leading-relaxed">
              Prima-AgriIntel helps farmers compare mandi prices, estimate transportation costs, and identify the market that leaves more in your hands after transport.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMarkets}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base rounded-xl shadow-md shadow-emerald-900/10 transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Explore markets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-base rounded-xl shadow-xs transition-all hover:border-gray-400 cursor-pointer"
              >
                <span>Unlock full intelligence</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            {/* Trust claim */}
            <div className="flex items-center gap-2 text-sm text-gray-700 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Built for practical farm decisions, not complicated dashboards</span>
            </div>
          </div>

          {/* Right Column: Visual Hero Photograph with Floating Metric Cards */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-16/11 bg-emerald-900">
                <img
                  src={farmerImg}
                  alt="Indian farmer with harvest in agricultural field"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              </div>

              {/* Floating Card 1: BEST NET RETURN (Bottom Left) */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[210px] sm:max-w-[240px] animate-fade-in">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-gray-500 block mb-1">
                  BEST NET RETURN
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
                  +₹8,420
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">
                  Kolar APMC · demo estimate
                </div>
              </div>

              {/* Floating Card 2: 7-DAY SIGNAL (Top Right) */}
              <div className="absolute -top-4 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-gray-100 max-w-[170px] sm:max-w-[190px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
                    TOMATO · 7 DAY
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {/* Visual bar signals */}
                <div className="flex items-end gap-1.5 h-9 pt-1 mb-1.5">
                  <span className="w-2.5 bg-emerald-200 rounded-xs h-3" />
                  <span className="w-2.5 bg-emerald-300 rounded-xs h-4" />
                  <span className="w-2.5 bg-emerald-300 rounded-xs h-3.5" />
                  <span className="w-2.5 bg-emerald-400 rounded-xs h-6" />
                  <span className="w-2.5 bg-emerald-500 rounded-xs h-5.5" />
                  <span className="w-2.5 bg-emerald-600 rounded-xs h-7.5" />
                  <span className="w-2.5 bg-emerald-700 rounded-xs h-9" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700 block">
                  Trend: +4.8% (Upward)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
