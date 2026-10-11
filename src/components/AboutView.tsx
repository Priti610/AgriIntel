import React from 'react';
import { Sprout, Calculator, ShieldCheck, Database, Scale, ArrowRight } from 'lucide-react';

export const AboutView: React.FC<{ onNavigateToMandi: () => void }> = ({
  onNavigateToMandi,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title matching Screenshot 9 */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          Market clarity for stronger farms.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl font-normal">
          Prima-AgriIntel is a decision-support concept for making the full cost of selling visible.
        </p>
      </div>

      {/* Featured Card matching Screenshot 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50/70 rounded-3xl p-6 sm:p-10 border border-gray-200">
        <div className="lg:col-span-7 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Better decisions start with better context.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We bring mandi prices, transport assumptions, and uncertainty into one readable place.
            The product is designed to keep measured data separate from estimates, so farmers can act with a clear view of what is known.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToMandi}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore Mandi Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden aspect-4/3 bg-linear-to-tr from-emerald-200 via-teal-200 to-emerald-100 border border-emerald-300/40 p-6 flex flex-col justify-between shadow-inner">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-900">
                Core Philosophy
              </span>
              <h3 className="text-lg font-bold text-emerald-950">
                Gross Price ≠ Farmer Income
              </h3>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              Transport freight across 150 km can easily subtract ₹40–₹80 per quintal.
              Prima-AgriIntel solves this dilemma with empirical transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Three Pillar Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-7 rounded-2xl border border-gray-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">The Transparent Formula</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Estimated Net Revenue</strong> = Gross Expected Revenue − Road Freight − Mandi Cess & Weighment − Transit Perishability Loss. No hidden assumptions.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-gray-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Data Integrity & Demo Labels</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Market prices follow official Agmarknet APMC bulletin standards. Whenever simulated demo rates are active, clear badges warn users so demo values are never mistaken for live bids.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-gray-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">AI Guardrail Standard</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Gemini AI is strictly employed to interpret and explain calculated trade-offs in farmer-friendly language. AI never invents road distances or market prices.
          </p>
        </div>
      </div>
    </div>
  );
};
