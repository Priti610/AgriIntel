import React, { useState } from 'react';
import { BestMandiRecommendation } from '../utils/recommendationEngine';
import { AiExplanationResponse } from '../services/geminiService';
import { Sparkles, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight, RefreshCw } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: BestMandiRecommendation;
  aiExplanation: AiExplanationResponse | null;
  isLoadingAi: boolean;
  onRefreshAi: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  aiExplanation,
  isLoadingAi,
  onRefreshAi,
}) => {
  const [activeTab, setActiveTab] = useState<'decision' | 'actionPlan' | 'risks'>('decision');

  if (!recommendation.hasValidRecommendation || !recommendation.bestMandi) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h3 className="font-extrabold text-base">Recommendation Notice</h3>
        </div>
        <p className="text-sm">
          {recommendation.detailedReason}
        </p>
      </div>
    );
  }

  const { bestMandi, runnerUpMandi, netAdvantageAmount, netAdvantagePercentage, isTie } = recommendation;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl border border-emerald-700/60 p-6 sm:p-8 space-y-6">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-emerald-700/50 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 block">
              Prima-AgriIntel Dispatch Optimization
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI-Assisted Best Mandi Recommendation
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {aiExplanation?.rateLimited && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium"
              title={
                aiExplanation.retryAfterSeconds && aiExplanation.retryAfterSeconds > 3600
                  ? 'Daily free-tier quota reached. Deterministic market intelligence engine is actively computing verified dispatch returns.'
                  : `API rate limit cooling down. Reconnecting in ${aiExplanation.retryAfterSeconds || 60}s.`
              }
            >
              <span>
                {aiExplanation.retryAfterSeconds && aiExplanation.retryAfterSeconds > 3600
                  ? 'Daily Quota Safeguard Active'
                  : aiExplanation.retryAfterSeconds && aiExplanation.retryAfterSeconds > 60
                  ? `Cooldown (${Math.ceil(aiExplanation.retryAfterSeconds / 60)}m)`
                  : `Cooldown (${aiExplanation.retryAfterSeconds || 60}s)`}
              </span>
            </span>
          )}

          {aiExplanation?.source === 'gemini-ai' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Gemini AI Grounded</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Math Verified</span>
            </span>
          )}

          <button
            onClick={onRefreshAi}
            disabled={isLoadingAi}
            title="Re-run Analysis"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metric Spotlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left: Recommended Mandi & Net Advantage */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1">
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
              {isTie ? 'Tie Detected (Equal Net Revenue)' : 'Optimal Selling Destination'}
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {bestMandi.mandi.name}
            </h3>
            <div className="text-sm text-emerald-200">
              {bestMandi.mandi.district}, {bestMandi.mandi.state} · {bestMandi.transportResult.roadDistanceKm} km freight route
            </div>
          </div>

          {/* Advantage Pill */}
          {runnerUpMandi && !isTie && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs sm:text-sm font-bold">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>
                +₹{netAdvantageAmount.toLocaleString('en-IN')} net advantage ({netAdvantagePercentage}%) over {runnerUpMandi.mandi.name}
              </span>
            </div>
          )}

          {isTie && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-100 text-xs sm:text-sm font-bold">
              <span>Both top mandis generate equal net returns. Choose by route ease.</span>
            </div>
          )}

          <p className="text-sm text-emerald-100/90 leading-relaxed font-normal pt-1">
            {aiExplanation?.narrativeSummary || recommendation.detailedReason}
          </p>
        </div>

        {/* Right: Revenue & Cost Pillars */}
        <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
          <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest border-b border-white/10 pb-2">
            Estimated Net Revenue
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ₹{bestMandi.estimatedNetRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-200 -mt-1 font-medium">
            (₹{bestMandi.netRevenuePerQuintal} in pocket per quintal)
          </div>

          {/* Breakdown Rows */}
          <div className="pt-2 divide-y divide-white/10 text-xs space-y-1.5">
            <div className="flex justify-between py-1 text-gray-200">
              <span>Modal Selling Rate:</span>
              <span className="font-bold text-white">₹{bestMandi.modalPrice}/qtl</span>
            </div>
            <div className="flex justify-between py-1 text-gray-200">
              <span>Gross Produce Value:</span>
              <span className="font-bold text-white">₹{bestMandi.grossRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-300">
              <span>Estimated Road Freight:</span>
              <span className="font-bold">-₹{bestMandi.transportCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-300">
              <span>Mandi Handling & Cess:</span>
              <span className="font-bold">-₹{bestMandi.handlingCost.toLocaleString('en-IN')}</span>
            </div>
            {bestMandi.spoilageLossAmount > 0 && (
              <div className="flex justify-between py-1 text-amber-300">
                <span>Estimated Transit Spoilage:</span>
                <span className="font-bold">-₹{bestMandi.spoilageLossAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Decision Logic / Action Plan / Risks */}
      <div className="relative z-10 pt-2 border-t border-emerald-700/50">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'decision'
                ? 'bg-white text-emerald-950'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            Price vs Transport Trade-off
          </button>
          <button
            onClick={() => setActiveTab('actionPlan')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'actionPlan'
                ? 'bg-white text-emerald-950'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            Farmer Action Checklist
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'risks'
                ? 'bg-white text-emerald-950'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            Data Limitations & Risks
          </button>
        </div>

        {/* Tab 1: Trade-off */}
        {activeTab === 'decision' && (
          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-700/40 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            <span className="font-bold text-white block mb-1">Empirical Trade-off Analysis:</span>
            {aiExplanation?.keyTradeoff || recommendation.tradeoffAnalysis}
          </div>
        )}

        {/* Tab 2: Action Plan */}
        {activeTab === 'actionPlan' && (
          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-700/40 space-y-2">
            <span className="font-bold text-white text-xs sm:text-sm block">
              Practical Steps Before Dispatch:
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-100">
              {(aiExplanation?.practicalActionAdvice || [
                `Confirm truck freight booking rate with driver before loading.`,
                `Target arrival at ${bestMandi.mandi.name} yard before early morning auction bidding (7:00 AM - 9:00 AM).`,
                `Verify crop moisture and grade sorting to ensure qualifying for top modal bids.`,
              ]).map((advice, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Risks */}
        {activeTab === 'risks' && (
          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-700/40 space-y-2">
            <span className="font-bold text-amber-300 text-xs sm:text-sm block flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Assumptions & Safeguards</span>
            </span>
            <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
              {recommendation.riskAndLimitations.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
              <li>Prices taken from Agmarknet bulletin. Mandi auctions fluctuate dynamically on arrival volume.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
