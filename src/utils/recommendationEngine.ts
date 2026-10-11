import { MandiEconomics } from './revenueCalculator';

export interface BestMandiRecommendation {
  hasValidRecommendation: boolean;
  isTie: boolean;
  tiedMandis?: MandiEconomics[];
  bestMandi: MandiEconomics | null;
  runnerUpMandi: MandiEconomics | null;
  netAdvantageAmount: number;
  netAdvantagePercentage: number;
  priceDifferencePerQuintal: number;
  transportDifferenceAmount: number;
  headlineExplanation: string;
  detailedReason: string;
  tradeoffAnalysis: string;
  riskAndLimitations: string[];
  dataFreshnessSummary: string;
}

/**
 * Generates transparent recommendation and comparative analytics between mandis.
 */
export function generateRecommendation(economicsList: MandiEconomics[]): BestMandiRecommendation {
  const eligible = economicsList.filter((item) => item.hasPriceData && item.estimatedNetRevenue > 0);

  if (eligible.length === 0) {
    return {
      hasValidRecommendation: false,
      isTie: false,
      bestMandi: null,
      runnerUpMandi: null,
      netAdvantageAmount: 0,
      netAdvantagePercentage: 0,
      priceDifferencePerQuintal: 0,
      transportDifferenceAmount: 0,
      headlineExplanation: 'No reliable market price data available',
      detailedReason: 'None of the selected mandis have active reported prices for this crop. Therefore, an empirical net revenue recommendation cannot be reliably ranked.',
      tradeoffAnalysis: 'Please select alternative mandis with recent Agmarknet bulletins or check back when today’s auction records are published.',
      riskAndLimitations: ['Missing price records prevent objective cost-benefit analysis.'],
      dataFreshnessSummary: 'No active data reported.',
    };
  }

  // Sort by net revenue descending
  const sorted = [...eligible].sort((a, b) => b.estimatedNetRevenue - a.estimatedNetRevenue);
  const best = sorted[0];

  // Check for ties (exact or within ₹50)
  const ties = sorted.filter((item) => Math.abs(item.estimatedNetRevenue - best.estimatedNetRevenue) <= 50);
  if (ties.length > 1) {
    return {
      hasValidRecommendation: true,
      isTie: true,
      tiedMandis: ties,
      bestMandi: best,
      runnerUpMandi: ties[1],
      netAdvantageAmount: 0,
      netAdvantagePercentage: 0,
      priceDifferencePerQuintal: Math.abs(ties[0].modalPrice - ties[1].modalPrice),
      transportDifferenceAmount: Math.abs(ties[0].transportCost - ties[1].transportCost),
      headlineExplanation: `Tie between ${ties.map((t) => t.mandi.name).join(' and ')}`,
      detailedReason: `Both mandis yield virtually identical estimated net returns (~₹${best.estimatedNetRevenue.toLocaleString('en-IN')}). Choose based on road convenience, payment terms, or trader relationships.`,
      tradeoffAnalysis: `The minor price variance is directly offset by transport differentials.`,
      riskAndLimitations: [
        'Small fluctuations in diesel rates or daily auction bidding will shift the winner.',
        'Consider unloading turnaround time at the respective market yards.',
      ],
      dataFreshnessSummary: `Reported on ${best.priceRecord?.reportDate || 'today'}.`,
    };
  }

  const runnerUp = sorted.length > 1 ? sorted[1] : null;
  const netAdvantage = runnerUp ? best.estimatedNetRevenue - runnerUp.estimatedNetRevenue : 0;
  const netAdvantagePct = runnerUp && runnerUp.estimatedNetRevenue > 0
    ? Number(((netAdvantage / runnerUp.estimatedNetRevenue) * 100).toFixed(1))
    : 0;

  const priceDiffPerQtl = runnerUp ? best.modalPrice - runnerUp.modalPrice : 0;
  const transportDiff = runnerUp ? runnerUp.transportCost - best.transportCost : 0;

  let headlineExplanation = `Recommended: ${best.mandi.name} (${best.mandi.district})`;
  let detailedReason = '';
  let tradeoffAnalysis = '';

  if (runnerUp) {
    const isClose = netAdvantage < 350;
    const isHigherHeadlinePriceAtRunnerUp = runnerUp.modalPrice > best.modalPrice;

    if (isHigherHeadlinePriceAtRunnerUp) {
      tradeoffAnalysis = `Although ${runnerUp.mandi.name} posts a higher headline modal price (₹${runnerUp.modalPrice.toLocaleString('en-IN')} vs ₹${best.modalPrice.toLocaleString('en-IN')}/qtl), ${best.mandi.name} delivers ₹${netAdvantage.toLocaleString('en-IN')} MORE in your pocket because transport is ₹${Math.abs(best.transportCost - runnerUp.transportCost).toLocaleString('en-IN')} cheaper.`;
      detailedReason = `Do not be misled by the headline price alone. The extra travel distance to ${runnerUp.mandi.name} (${runnerUp.transportResult.roadDistanceKm} km vs ${best.transportResult.roadDistanceKm} km) eats up ₹${Math.abs(best.transportCost - runnerUp.transportCost).toLocaleString('en-IN')} in freight charges and transit loss, making ${best.mandi.name} the smarter economic choice.`;
    } else {
      tradeoffAnalysis = `${best.mandi.name} combines a superior modal rate (₹${best.modalPrice.toLocaleString('en-IN')}/qtl) with balanced transport overheads, outperforming ${runnerUp.mandi.name} by ₹${netAdvantage.toLocaleString('en-IN')} (${netAdvantagePct}% gain).`;
      detailedReason = `Based on current modal rates and distance calculations for ${best.quantityQuintals} quintals of ${best.crop.name}, ${best.mandi.name} provides the maximum net revenue after deducting road transit, mandi cess, and spoilage estimates.`;
    }

    if (isClose) {
      detailedReason += ` Note: The margin over ${runnerUp.mandi.name} is modest (₹${netAdvantage.toLocaleString('en-IN')}). Local road conditions or faster auction turnaround could make either market viable.`;
    }
  } else {
    headlineExplanation = `${best.mandi.name} is your primary evaluated market`;
    detailedReason = `With an expected modal price of ₹${best.modalPrice.toLocaleString('en-IN')}/quintal and estimated freight of ₹${best.transportCost.toLocaleString('en-IN')}, this mandi leaves an estimated net revenue of ₹${best.estimatedNetRevenue.toLocaleString('en-IN')}.`;
    tradeoffAnalysis = `Add more mandis from your district or neighboring districts to see side-by-side trade-offs.`;
  }

  const risks: string[] = [
    'Actual mandi auction prices vary daily by grade, moisture content, and arrival volume.',
    'Road distances are calculated via standard freight routes; peak hour delays or toll booths may alter costs.',
    'Verify current APMC market operational status before commencing road dispatch.',
  ];

  if (best.crop.perishable && best.transportResult.roadDistanceKm > 80) {
    risks.unshift(`High perishability risk: Transporting ${best.crop.name} over ${best.transportResult.roadDistanceKm} km could cause transit spoilage if unventilated.`);
  }

  return {
    hasValidRecommendation: true,
    isTie: false,
    bestMandi: best,
    runnerUpMandi: runnerUp,
    netAdvantageAmount: netAdvantage,
    netAdvantagePercentage: netAdvantagePct,
    priceDifferencePerQuintal: priceDiffPerQtl,
    transportDifferenceAmount: transportDiff,
    headlineExplanation,
    detailedReason,
    tradeoffAnalysis,
    riskAndLimitations: risks,
    dataFreshnessSummary: `Price records verified as of ${best.priceRecord?.reportDate || 'current session'}.`,
  };
}
