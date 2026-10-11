import React from 'react';
import { BarChart3, Route, Sparkles, ArrowRight } from 'lucide-react';

interface FeatureCardsSectionProps {
  onNavigate: (tab: any) => void;
}

export const FeatureCardsSection: React.FC<FeatureCardsSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-gray-50/70 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 block">
              A clearer route to better returns
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Know your options before you sell.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Prima-AgriIntel brings prices, distance, and cost assumptions into one calm view so you can make the next decision with confidence.
            </p>
          </div>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">See the full market</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Compare markets beyond the one closest to your farm, with freshness labels on every price.
              </p>
            </div>
            <button
              onClick={() => onNavigate('mandi-prices')}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer pt-2"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Count every rupee</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Estimate road distance, loading, and transport costs before a long trip eats into your margin.
              </p>
            </div>
            <button
              onClick={() => onNavigate('transport')}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer pt-2"
            >
              <span>Calculate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Choose with context</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rank possible mandis by estimated net return — not just the highest headline price.
              </p>
            </div>
            <button
              onClick={() => onNavigate('mandi-prices')}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer pt-2"
            >
              <span>Compare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
